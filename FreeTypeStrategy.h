#include <string>

extern "C" {

    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_InitializeFreeType();

    //int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative(); //$quorum_Libraries_System_File = function(file)


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative(char* font); //$quorum_text = function(fontName)


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_IsFontAvailable(char* font); //$quorum_text = function(fontName)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetSizeNative(int size); //$quorum_integer = function(size)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetAngleNative(int angle); //$quorum_number = function(angle)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetColorNative(); //$quorum_Libraries_Game_Graphics_Color = function(newColor)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetColor(); // = function()


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_DisposeNative(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetGlyphNative(char* sym);


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetKerning(); //$quorum_text$quorum_text = function(currentCharacter, nextCharacter)


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_FinishedLoading(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadImageSheet(); // $Libraries_Game_Graphics_Fonts_FontImageSheet() = function(imageSheet)


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetHeight(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumAscent(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumDescent(); // = function()


    long wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlinePosition(); // = function()


    long wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlineThickness(); // = function()
 

    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineHeight(); // = function()


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetAvailableFonts(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumAscent(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumDescent(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineGap(); // = function()

    //int getBitmap(unsigned char* buf);
    //int getBitmap(int* bitmapBuffer);
    void getBitmap(unsigned int output_ptr, int num_bytes);

    int getBitmapData(long* bitmapData);

    int loadChar(char* symbol);

    unsigned char* getBitmapBuffer();

    //void write_data(unsigned int output_ptr, int num_bytes);
}

