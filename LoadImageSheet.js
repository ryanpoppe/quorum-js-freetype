this.LoadImageSheet$quorum_Libraries_Game_Graphics_Fonts_FontImageSheet = function (imageSheet) {
	console.log('LoadImageSheet$quorum_Libraries_Game_Graphics_Fonts_FontImageSheet = function (imageSheet)');

	// Image Sheet Row struct
	// The end of the row is the last image that appears on this row, or
	// 256 if this is the last row.
	// The height is the height of the tallest image in this row.
	class ImageSheetRow {
		constructor(height, endOfRow) {
			this.height = height;
			this.endOfRow = endOfRow;
		}
	}
	// Texture Region Data struct
	class TextureRegionData {
		constructor(x, y, width, height) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}
	}
	var texture = imageSheet.Get_Libraries_Game_Graphics_Fonts_FontImageSheet__imageSheet_();
	table = imageSheet.Get_Libraries_Game_Graphics_Fonts_FontImageSheet__glyphTable_();

	var currentData = [];
	var pixels = [];
	var glyphs = [];
	var regionData = [];
	var rows = []; // Should change to queue since rows.shift() is O(n)

	// How much padding there should be between symbols on the ImageSheet.
	var padding = 1;

	var graphics = plugins_quorum_Libraries_Game_GameStateManager_.nativeGraphics;
	var maxSize = graphics.glGetIntegerv(graphics.gl.MAX_TEXTURE_SIZE);

	var rowHeight = padding;
	var rowWidth = padding;
	var totalHeight = rowHeight;
	var totalWidth = rowWidth;

	// Load the ASCII characters.
	for (var current = 0; current < 256; current++) {
		/* The data parameter will contain the following information after a call to LoadBitmap:
			[0] : The distance from the cursor to the left side of the bitmap.
			[1] : The distance from the cursor to the top side of the bitmap.
			[2] : The number of rows in a bitmap.
			[3] : The number of pixels in each row of the bitmap.
			[4] : The distance to advance the cursor's X coordinate.
			[5] : The distance to advance the cursor's Y coordinate.

			LoadBitmap will also return a bitmap as a ByteBuffer so it can be drawn.
		*/
		//ByteBuffer value = LoadBitmap(currentData, current, faceHandle);
		// Load character into FreeType
		var loadChar = Module.cwrap('loadCharC', 'number', ['string']);
		console.log("Current ASCII: " + String.fromCharCode(current) + ".");
		var loadCharResult = loadChar(String.fromCharCode(current));
		if (loadCharResult == 1) {
			// error loading glyph
			console.log('Error loading glyph.');
		} else {
			console.log('Glyph loaded succesfully.');
		}

		// Create data array for glyph metrics (7 * 4 bytes = 28 bytes)
		var offset = Module._malloc(28);

		// Setup call to getBitmapData from WASM module
		var getBitmapData = Module.cwrap('getBitmapDataC', 'number', ['number']);

		// Pass array pointer to getBitmapData
		getBitmapData(offset);

		// Create array and copy glyph metrics into it
		currentData[0] = Module.getValue(offset, 'i32'); //glyph->bitmap_left;
		currentData[1] = Module.getValue(offset + 4, 'i32'); //glyph->bitmap_top;
		currentData[2] = Module.getValue(offset + 8, 'i32'); //glyph->bitmap.rows;
		currentData[3] = Module.getValue(offset + 12, 'i32'); //glyph->bitmap.width;
		currentData[4] = Module.getValue(offset + 16, 'i32'); //glyph->advance.x;
		currentData[5] = Module.getValue(offset + 20, 'i32'); //glyph->advance.y;
		currentData[6] = Module.getValue(offset + 24, 'i32'); //glyph->bitmap.pitch;

		// Free allocated memory
		Module._free(offset);

		// Calculate size of byte array for bitmap pixel buffer
		// size = |pitch|*rows
		var size = currentData[6];
		if (size < 0)
			size = -size;
		size *= currentData[2];

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
		let value = new Uint8Array(dataHeap.buffer, dataHeap.byteOffset, num_bytes);

		// Free allocated memory
		Module._free(dataHeap.byteOffset);

		var currentWidth = currentData[3];
		var currentHeight = currentData[2];

		if (currentWidth == 0 || currentHeight == 0) {
			// We use a single empty pixel to represent symbols that don't
			// have a visual representation, e.g. space or new line.
			currentWidth = 1;
			currentHeight = 1;
			var emptyPixel = new Uint8Array(1); // Initialized to zero
			//emptyPixel.put(0, (byte)0);
			pixels[current] = emptyPixel;
			//pixels.push(emptyPixel);
		}
		else {
			//ByteBuffer valueCopy = BufferUtils.newByteBuffer(currentWidth * currentHeight);
			//BufferUtils.copy(value, valueCopy, (currentWidth * currentHeight));
			var valueCopy = new ArrayBuffer(value.byteLength);
			new Uint8Array(valueCopy).set(new Uint8Array(value));
			//pixels[current] = valueCopy;
			pixels.push(value);
		}

		var glyph = new quorum_Libraries_Game_Graphics_Glyph_();
		glyph.Set_Libraries_Game_Graphics_Glyph__horizontalAdvance_(currentData[4] >> 6);
		glyph.Set_Libraries_Game_Graphics_Glyph__verticalAdvance_(currentData[5] >> 6);
		glyph.Set_Libraries_Game_Graphics_Glyph__lengthToGlyph_(currentData[0]);
		glyph.Set_Libraries_Game_Graphics_Glyph__heightFromBaseLine_(currentData[1]);
		glyphs[current] = glyph;

		//table.Add(glyph);
		table.Add$quorum_Libraries_Language_Object(glyph);

		var x = rowWidth;
		rowWidth += currentWidth + padding;

		if (rowWidth > totalWidth)
			totalWidth = rowWidth;

		if (rowWidth > maxSize) {
			var newRow = new ImageSheetRow(rowHeight, current - 1);
			rows.push(newRow);

			totalHeight += rowHeight;
			rowWidth = currentWidth;
			x = padding;
			rowHeight = padding;
		}

		if (currentHeight + padding > rowHeight) {
			rowHeight = currentHeight + padding;
			if (totalHeight + rowHeight > maxSize) {
				// We've exceeded the maximum size we can place in a Texture.
				// Return false to indicate failure.
				return false;
			}
		}

		regionData[current] = new TextureRegionData(x, totalHeight, currentWidth, currentHeight);
	}

	totalHeight += rowHeight + padding;

	// Add the current and final row to the queue.
	rows.push(new ImageSheetRow(rowHeight, 255));/////////////////////////////

	// Assemble the ByteBuffers into a single ByteBuffer for use by PixelMap.
	//ByteBuffer destination = BufferUtils.newByteBuffer(totalWidth * totalHeight);
	var destination = new Uint8Array(totalWidth * totalHeight);
	//ImageSheetRow currentRow = rows.remove();
	var currentRow = rows.shift(); // O(n)
	//ByteBuffer currentSource = null;
	var currentSource = null;
	//TextureRegionData currentRegion = null;
	var currentRegion;
	var startOfRow = 0;
	var currentImage = 0;
	var destinationIndex = 0;

	for (var y = 0, subY = -padding; y < totalHeight; y++, subY++) {
		// The subY is the current row of pixels being rendered for the
		// current row of images. When it matches the height of the current
		// row of images, it's time to begin the next row.
		if (subY == currentRow.height) {
			startOfRow = currentRow.endOfRow + 1;

			if (rows.length > 0)
				currentRow = rows.shift(); // O(n)
			else
				currentRow = null;

			subY = -padding;
		}

		if (currentRow != null) {
			currentImage = startOfRow;
			currentSource = pixels[startOfRow];
			currentRegion = regionData[startOfRow];
		}

		for (var x = 0, subX = -padding; x < totalWidth; x++, subX++, destinationIndex++) {
			if (currentRow == null || currentImage > currentRow.endOfRow || subX < 0) {
				//destination.put(destinationIndex, (byte)0);
				destination[destinationIndex] = 0;
				continue;
			}

			// The subX is the current pixel x position being rendered in
			// the current image. When it matches the width of the current
			// image, it's time to begin the next one.
			if (subX >= currentRegion.width) {
				currentImage++;
				if (currentImage <= currentRow.endOfRow) {
					currentSource = pixels[currentImage];
					currentRegion = regionData[currentImage];
					subX = -padding;
				}
				else {
					continue;
				}
			}

			if (subY >= currentRegion.height || subY < 0 || subX < 0) {
				//destination.put(destinationIndex, (byte)0);
				destination[destinationIndex] = 0;
			}
			else {
				//destination.put(destinationIndex, currentSource.get(currentRegion.width * subY + subX));
				var t3mp = currentSource[currentRegion.width * subY + subX];
				destination[destinationIndex] = currentSource[currentRegion.width * subY + subX];
				//console.log(currentSource[currentRegion.width * subY + subX]);
			}
		}
	}
	/*
	console.log("DESTINATION OUTPUT:");
	var output;
	for (var i = 0; i < destination.length; i++)
		output = output + destination[i].toString(10) + " ";
	console.log(output);
	*/
	/*
	quorum.Libraries.Game.Graphics.PixelMap pixmap = new quorum.Libraries.Game.Graphics.PixelMap();
	plugins.quorum.Libraries.Game.Graphics.PixelMap map = pixmap.plugin_;

	map.LoadFromFontBitmap(destination, totalWidth, totalHeight, PixelMap.FORMAT_ALPHA);
	*/

	// Create Alpha pixel map
	var pixmap = new quorum_Libraries_Game_Graphics_PixelMap_();
	var map = pixmap.plugin_;
	var format = new quorum_Libraries_Game_Graphics_Format_();
	format.SetValue$quorum_integer(format.Get_Libraries_Game_Graphics_Format__ALPHA_());
	map.LoadFromFontBitmap(destination, totalWidth, totalHeight, format);

	/*
	quorum.Libraries.Game.Graphics.FileTextureData texData = new quorum.Libraries.Game.Graphics.FileTextureData();
	texData.InitializeFileTextureData(null, pixmap, null, false);
	texData.SetDisposalState(false);

	texture.LoadFromTextureData(texData);
	*/

	// Create File texture data
	var texData = new quorum_Libraries_Game_Graphics_FileTextureData_();
	texData.InitializeFileTextureData$quorum_Libraries_System_File$quorum_Libraries_Game_Graphics_PixelMap$quorum_Libraries_Game_Graphics_Format$quorum_boolean(null, pixmap, null, false);
	//texData.SetDisposalState(false);

	// Create texture
	var texture = new quorum_Libraries_Game_Graphics_Texture_();
	texture.LoadFromTextureData$quorum_Libraries_Game_Graphics_TextureData(texData);
	/*
	quorum.Libraries.Game.Graphics.Color c = new quorum.Libraries.Game.Graphics.Color();
	c.SetColor(color.GetRed(), color.GetGreen(), color.GetBlue(), color.GetAlpha());
	((Texture)texture).plugin_.fontColor = c;
	*/
	// Create color
	var c = new quorum_Libraries_Game_Graphics_Color_();
	c.SetColor$quorum_number$quorum_number$quorum_number$quorum_number(color.GetRed(), color.GetGreen(), color.GetBlue(), color.GetAlpha());
	texture.plugin_.fontColor = c;

	for (var i = 0; i < 256; i++) {
		var data = regionData[i];
		var glyph = glyphs[i];

		//quorum.Libraries.Game.Graphics.TextureRegion region = new quorum.Libraries.Game.Graphics.TextureRegion();
		//region.LoadTextureRegion(texture, data.x, data.y, data.width, data.height);
		var region = new quorum_Libraries_Game_Graphics_TextureRegion_();
		region.LoadTextureRegion$quorum_Libraries_Game_Graphics_Texture$quorum_integer$quorum_integer$quorum_integer$quorum_integer(texture, data.x, data.y, data.width, data.height);

		glyph.texture = region;
	}

	// True indicates successful loading of the ImageSheet and caching of Glyph data.
	return true;
};