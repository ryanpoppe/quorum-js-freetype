#include <string>

extern "C" {


    //int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative(); //$quorum_Libraries_System_File = function(file)


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative(const std::string& font); //$quorum_text = function(fontName)


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_IsFontAvailable(const std::string& font); //$quorum_text = function(fontName)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetSizeNative(int size); //$quorum_integer = function(size)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetAngleNative(int angle); //$quorum_number = function(angle)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetColorNative(); //$quorum_Libraries_Game_Graphics_Color = function(newColor)


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetColor(); // = function()


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_DisposeNative(); // = function()


    /*
    wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetGlyphNative$quorum_text = function(character)
    {
        var glyph = new quorum_Libraries_Game_Graphics_Glyph_();
        glyph.Set_Libraries_Game_Graphics_Glyph__texture_(plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_.testDrawable);
        glyph.Set_Libraries_Game_Graphics_Glyph__horizontalAdvance_(8);
        glyph.Set_Libraries_Game_Graphics_Glyph__verticalAdvance_(0);
        glyph.Set_Libraries_Game_Graphics_Glyph__lengthToGlyph_(0);
        glyph.Set_Libraries_Game_Graphics_Glyph__heightFromBaseLine_(0);
        return glyph;
    };
    */

    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetKerning(); //$quorum_text$quorum_text = function(currentCharacter, nextCharacter)


    bool wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_FinishedLoading(); // = function()


    int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadImageSheet(); // $Libraries_Game_Graphics_Fonts_FontImageSheet() = function(imageSheet)


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetHeight(); // = function()


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumAscent(); // = function()


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumDescent(); // = function()


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlinePosition(); // = function()


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlineThickness(); // = function()
 

    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineHeight(); // = function()


    void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetAvailableFonts(); // = function()


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumAscent(); // = function()


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumDescent(); // = function()


    unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineGap(); // = function()
 
}