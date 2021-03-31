function plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_() {
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

    this.LoadFontNative$quorum_Libraries_System_File = function (file) {
        // NYI
        console.log('LoadFontNative$quorum_Libraries_System_File = function(file)');
    };

    this.LoadFontNative$quorum_text = function (fontName) {
        // NYI
        console.log('LoadFontNative$quorum_text = function(fontName)');
        console.log('fontName = ' + fontName);
        //var LoadFontNativeC = Module.ccall('wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative', 'number', ['string'], [1]);
        //LoadFontNativeC(fontName);
        // Call C from JavaScript
        //var LoadFontNativeC = Module.ccall('wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative', // name of C function
        //						'number', // return type
        //						['string'], // argument types
        //						[fontName]); // arguments
        var loadFontNativeC = Module.cwrap('wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative', 'number', ['string']);
        var loadFontNativeResult = loadFontNativeC(fontName);
        if (loadFontNativeResult == 1) {
            // error loading font
            console.log('Error loading font.');
        } else {
            console.log('Font loaded succesfully.');
        }
    };

    this.IsFontAvailable$quorum_text = function (fontName) {
        // NYI
        console.log('IsFontAvailable$quorum_text = function(fontName)');
        return true;
    };

    this.SetSizeNative$quorum_integer = function (size) {
        // NYI
        console.log('SetSizeNative$quorum_integer = function(size)');
    };

    this.SetAngleNative$quorum_number = function (angle) {
        // NYI
        console.log('SetAngleNative$quorum_number = function(angle)');
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
        // NYI
        console.log('DisposeNative = function()');
    };

    this.GetGlyphNative$quorum_text = function (character) {
        console.log('GetGlyphNative$quorum_text = function(' + character + ')');


        // Load character into glyph
        var loadChar = Module.cwrap('loadChar', 'number', ['string']);
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
        var getBitmapData = Module.cwrap('getBitmapData', 'number', ['number']);

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
        var getBitmap = Module.cwrap('getBitmap', null, ['number', 'number']);
        getBitmap(dataHeap.byteOffset, num_bytes);

        // Get data from Emscripten heap
        let bitmapBuffer = new Uint8Array(dataHeap.buffer, dataHeap.byteOffset, num_bytes);
        console.log('out_data: ' + bitmapBuffer[0] + ', ' + bitmapBuffer[1] + ', ..., ' + bitmapBuffer[size - 1]);
        console.log(bitmapBuffer);

        // Free allocated memory
        Module._free(dataHeap.byteOffset);

        // Create Alpha pixel map
        var pixmap = new quorum_Libraries_Game_Graphics_PixelMap_();
        var map = pixmap.plugin_;
        map.format = 1; // FORMAT_ALPHA
        map.width = bitmapData[3]; // glyph->bitmap.width
        map.height = bitmapData[2]; // glyph->bitmap.rows
        map.pixels = bitmapBuffer; // glyph->bitmap.buffer

        // Create texture


        // Create color


        // Create texture region


        // Create glyph
        var glyph = new quorum_Libraries_Game_Graphics_Glyph_();
        glyph.Set_Libraries_Game_Graphics_Glyph__texture_(plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_.testDrawable);
        glyph.Set_Libraries_Game_Graphics_Glyph__horizontalAdvance_(8);
        glyph.Set_Libraries_Game_Graphics_Glyph__verticalAdvance_(0);
        glyph.Set_Libraries_Game_Graphics_Glyph__lengthToGlyph_(0);
        glyph.Set_Libraries_Game_Graphics_Glyph__heightFromBaseLine_(0);




        return glyph;
    };

    this.GetKerning$quorum_text$quorum_text = function (currentCharacter, nextCharacter) {
        // NYI
        console.log('GetKerning$quorum_text$quorum_text = function(currentCharacter, nextCharacter)');
        return 0;
    };

    this.FinishedLoading = function () {
        console.log('FinishedLoading = function()');
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
        // NYI
        console.log('SystemGetHeight = function()');
    };

    this.SystemGetMaximumAscent = function () {
        // NYI
        console.log('SystemGetMaximumAscent = function()');
    };

    this.SystemGetMaximumDescent = function () {
        // NYI
        console.log('SystemGetMaximumDescent = function()');
    };

    this.SystemGetUnderlinePosition = function () {
        // NYI
        console.log('SystemGetUnderlinePosition = function()');
    };

    this.SystemGetUnderlineThickness = function () {
        // NYI
        console.log('SystemGetUnderlineThickness = function()');
    };

    this.GetLineHeight = function () {
        // NYI
        console.log('GetLineHeight = function()');
        return 16;
    };

    this.GetAvailableFonts = function () {
        // NYI
        console.log('GetAvailableFonts = function()');
        return null;
    };

    this.GetMaximumAscent = function () {
        // NYI
        console.log('GetMaximumAscent = function()');
        return 0;
    };

    this.GetMaximumDescent = function () {
        // NYI
        console.log('GetMaximumDescent = function()');
        return 0;
    };

    this.GetLineGap = function () {
        // NYI
        console.log('GetLineGap = function()');
        return 0;
    };
}