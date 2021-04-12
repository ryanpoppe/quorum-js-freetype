function plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_(quorumFont) {
	if (!plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_.initialized_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_) {
		// Static initializer for the class.
		console.log('Static initializer for plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy');

		/*****************************************************
		 * Run main() which initializes FreeType
		 ****************************************************/

		main_return = Module.cwrap('main', 'number')
		console.log("execute: main() with return value = " + main_return());

		// Plug-In loaded = true
		plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_.initialized_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_ = true;
	}

	var color = null;
	this.me_ = quorumFont;

	this.LoadFontNative$quorum_Libraries_System_File = function (file) {
		// NYI
		console.log('LoadFontNative$quorum_Libraries_System_File = function(file)');
	};

	this.LoadFontNative$quorum_text = function (fontName) {
		// NYI
		console.log('LoadFontNative$quorum_text = function(fontName)');
		console.log('fontName = ' + fontName);

		var loadFontNativeC = Module.cwrap('LoadFontC', 'number', ['string']);
		var loadFontNativeResult = loadFontNativeC(fontName);
		if (loadFontNativeResult == 1) {
			// error loading font
			console.log('Error loading font.');
		} else {
			console.log('Font loaded succesfully.');
		}
		console.log("Font size: " + this.me_.GetSize());
		console.log("Font angle: " + this.me_.GetAngle());
		this.SetSizeNative$quorum_integer(this.me_.GetSize());
		if (this.me_.GetAngle() != 0)
			this.SetAngleNative$quorum_number(this.me_.GetAngle());
	};

	this.IsFontAvailable$quorum_text = function (fontName) {
		// NYI
		console.log('IsFontAvailable$quorum_text = function(fontName)');
		return true;
	};

	this.SetSizeNative$quorum_integer = function (size) {
		console.log('SetSizeNative$quorum_integer = function(size)');
		var SetSizeC = Module.cwrap('SetSizeC', null, ['number']);
		SetSizeC(size);
	};

	this.SetAngleNative$quorum_number = function (angle) {
		console.log('SetAngleNative$quorum_number = function(' + angle + ')');
		var SetAngleC = Module.cwrap('SetAngleC', null, ['number']);
		SetAngleC(angle / 180 * Math.PI);
		//SetAngleC(angle);

	};

	this.SetColorNative$quorum_Libraries_Game_Graphics_Color = function (newColor) {
		color = newColor;
		console.log('SetColorNative$quorum_Libraries_Game_Graphics_Color = function(newColor)');
	};

	this.GetColor = function () {
		console.log('GetColor = function()');
		return color;
	};

	this.DisposeNative = function () {
		console.log('DisposeNative = function()');
		var DisposeC = Module.cwrap('DisposeC', null, null);
		DisposeC();
	};

	this.GetGlyphNative$quorum_text = function (character) {
		console.log('GetGlyphNative$quorum_text = function(' + character + ')');
		// Create glyph
		var glyph = new quorum_Libraries_Game_Graphics_Glyph_();

		// Load character into FreeType
		var loadChar = Module.cwrap('loadCharC', 'number', ['string']);
		var loadCharResult = loadChar(character);
		if (loadCharResult == 1) {
			// error loading glyph
			console.log('Error loading glyph.');
		} else {
			console.log('Glyph loaded succesfully.');
		}

		// Create data array for glyph metrics (7 * 4 bytes = 28 bytes)
		var offset = Module._malloc(28);
		console.log(offset);

		// Setup call to getBitmapData from WASM module
		var getBitmapData = Module.cwrap('getBitmapDataC', 'number', ['number']);

		// Pass array pointer to getBitmapData
		getBitmapData(offset);

		// Create array and copy glyph metrics into it
		var bitmapData = [];
		bitmapData[0] = Module.getValue(offset, 'i32'); //glyph->bitmap_left;
		bitmapData[1] = Module.getValue(offset + 4, 'i32'); //glyph->bitmap_top;
		bitmapData[2] = Module.getValue(offset + 8, 'i32'); //glyph->bitmap.rows;
		bitmapData[3] = Module.getValue(offset + 12, 'i32'); //glyph->bitmap.width;
		bitmapData[4] = Module.getValue(offset + 16, 'i32'); //glyph->advance.x;
		bitmapData[5] = Module.getValue(offset + 20, 'i32'); //glyph->advance.y;
		bitmapData[6] = Module.getValue(offset + 24, 'i32'); //glyph->bitmap.pitch;

		console.log(" JS  - Left: " + bitmapData[0] + " Top: " + bitmapData[1] + " Rows: " + bitmapData[2] + " Width: " + bitmapData[3] + " X: " + bitmapData[4] + " Y: " + bitmapData[5] + " Pitch: " + bitmapData[6]);

		// Free allocated memory
		Module._free(offset);

		// Calculate size of byte array for bitmap pixel buffer
		// size = |pitch|*rows
		var size = bitmapData[6];
		if (size < 0)
			size = -size;
		size *= bitmapData[2];

		// Allocate memory on Emscripten heap
		let num_bytes = size;
		let dataPtr = Module._malloc(num_bytes);
		let dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, num_bytes);
		console.log('Allocated memory on heap.');

		// Call WASM function
		console.log('Calling WASM function "getBitmap"...');
		var getBitmap = Module.cwrap('getBitmapC', null, ['number', 'number']);
		getBitmap(dataHeap.byteOffset, num_bytes);

		// Get data from Emscripten heap
		let bitmapBuffer = new Uint8Array(dataHeap.buffer, dataHeap.byteOffset, num_bytes);

		// Output buffer to log
		var i;
		var output = "";
		for (i = 0; i < size; i++) {
			output = output + bitmapBuffer[i].toString(10) + " ";
		}
		//console.log('out_data: ' + bitmapBuffer[0] + ', ' + bitmapBuffer[1] + ', ..., ' + bitmapBuffer[size-1]);
		console.log(output);
		console.log(bitmapBuffer);

		// Free allocated memory
		Module._free(dataHeap.byteOffset);

		if (character != ' ') {
			// Create Alpha pixel map
			var pixmap = new quorum_Libraries_Game_Graphics_PixelMap_();
			var map = pixmap.plugin_;
			var format = new quorum_Libraries_Game_Graphics_Format_();
			format.SetValue$quorum_integer(format.Get_Libraries_Game_Graphics_Format__ALPHA_());
			map.LoadFromFontBitmap(bitmapBuffer, bitmapData[3], bitmapData[2], format);


			console.log("'" + character + "' Pixelmap Width: " + pixmap.GetWidth() + " Expected: " + bitmapData[3]);
			console.log("'" + character + "' Pixelmap Height: " + pixmap.GetHeight() + " Expected: " + bitmapData[2]);
			console.log(map.GetPixels());

			// Create File texture data
			var texData = new quorum_Libraries_Game_Graphics_FileTextureData_();
			texData.InitializeFileTextureData$quorum_Libraries_System_File$quorum_Libraries_Game_Graphics_PixelMap$quorum_Libraries_Game_Graphics_Format$quorum_boolean(null, pixmap, null, false);
			//texData.SetDisposalState(false);

			// Create texture
			var texture = new quorum_Libraries_Game_Graphics_Texture_();
			texture.LoadFromTextureData$quorum_Libraries_Game_Graphics_TextureData(texData);

			// Create color
			var c = new quorum_Libraries_Game_Graphics_Color_();
			c.SetColor$quorum_number$quorum_number$quorum_number$quorum_number(color.GetRed(), color.GetGreen(), color.GetBlue(), color.GetAlpha());
			texture.plugin_.fontColor = c;

			// Create texture region
			var region = new quorum_Libraries_Game_Graphics_TextureRegion_();
			region.LoadTextureRegion$quorum_Libraries_Game_Graphics_Texture(texture);

			glyph.texture = region;
		} else {
			glyph.texture = null;
		}

		//glyph.Set_Libraries_Game_Graphics_Glyph__texture_(plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_.testDrawable);
		glyph.Set_Libraries_Game_Graphics_Glyph__horizontalAdvance_(bitmapData[4] >> 6);
		glyph.Set_Libraries_Game_Graphics_Glyph__verticalAdvance_(bitmapData[5] >> 6);
		glyph.Set_Libraries_Game_Graphics_Glyph__lengthToGlyph_(bitmapData[0]);
		glyph.Set_Libraries_Game_Graphics_Glyph__heightFromBaseLine_(bitmapData[1]);


		return glyph;
	};

	this.GetKerning$quorum_text$quorum_text = function (currentCharacter, nextCharacter) {
		var GetKerningC = Module.cwrap('GetKerningC', 'number', ['string', 'string']);
		return GetKerningC(currentCharacter, nextCharacter);
	};

	this.FinishedLoading = function () {
		return true;
	};

	this.LoadImageSheet$Libraries_Game_Graphics_Fonts_FontImageSheet = function (imageSheet) {
		// NYI
		console.log('LoadImageSheet$Libraries_Game_Graphics_Fonts_FontImageSheet = function(imageSheet)');
	};

	this.LoadImageSheet$quorum_Libraries_Game_Graphics_Fonts_FontImageSheet = function (imageSheet) {
		// NYI
		console.log('LoadImageSheet$quorum_Libraries_Game_Graphics_Fonts_FontImageSheet = function(imageSheet)');
		return false;
	};

	this.SystemGetHeight = function () {
		return this.GetLineHeight();
	};

	this.SystemGetMaximumAscent = function () {
		return this.GetMaximumAscent();
	};

	this.SystemGetMaximumDescent = function () {
		return this.GetMaximumDescent();
	};

	this.SystemGetUnderlinePosition = function () {
		var GetMaximumAscentC = Module.cwrap('GetMaximumAscentC', 'number', null);
		return (GetMaximumAscentC() >> 6);
	};

	this.SystemGetUnderlineThickness = function () {
		var GetUnderlinePositionC = Module.cwrap('GetUnderlinePositionC', 'number', null);
		return (GetUnderlinePositionC() >> 6);
	};

	this.GetLineHeight = function () {
		var GetUnderlineThicknessC = Module.cwrap('GetUnderlineThicknessC', 'number', null);
		return (GetUnderlineThicknessC() >> 6);
	};

	this.GetAvailableFonts = function () {
		// NYI
		console.log('GetAvailableFonts = function()');
		return null;
	};

	this.GetMaximumAscent = function () {
		var GetMaximumAscentC = Module.cwrap('GetMaximumAscentC', 'number', null);
		return (GetMaximumAscentC() >> 6);
	};

	this.GetMaximumDescent = function () {
		var GetMaximumDescentC = Module.cwrap('GetMaximumDescentC', 'number', null);
		return (GetMaximumDescentC() >> 6);
	};

	this.GetLineGap = function () {
		// NYI
		console.log('GetLineGap = function()');
	};
}