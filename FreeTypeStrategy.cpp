#include <string>
#include "FreeTypeStrategy.h"

// EMSCRIPTEN WASM
#include <emscripten.h>

// FREETYPE
#include <ft2build.h>
#include FT_FREETYPE_H

FT_Library library;
FT_Face* face;
FT_Error error;

/*
int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative() //$quorum_Libraries_System_File = function(file)
{
    // NYI
};
*/

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative(const std::string& font) //$quorum_text = function(fontName)
{
    // Load font
    error = FT_New_Face(ftLib, font.c_str(), 0, &ftFace);
    if (error == FT_Err_Unknown_File_Format) {
        std::cerr << "Font format is unsupported" << std::endl;
        return 1;
    }
    else if (error) {
        std::cerr << "Font file is missing or corrupted" << std::endl;
        return 1;
    }

    return 0;
};

bool wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_IsFontAvailable(const std::string& font) //$quorum_text = function(fontName)
{
    // NYI
    if (font == "arial") {
        return true;
    }
    else {
        return false;
    }
};

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetSizeNative(int size) //$quorum_integer = function(size)
{
    // NYI
};

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetAngleNative(int angle) //$quorum_number = function(angle)
{
    // NYI
};

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetColorNative() //$quorum_Libraries_Game_Graphics_Color = function(newColor)
{
    //color = newColor;
};

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetColor() // = function()
{
    //return color;
};

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_DisposeNative() // = function()
{
    // NYI
};

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

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetKerning() //$quorum_text$quorum_text = function(currentCharacter, nextCharacter)
{
    // NYI
    return 0;
};

bool wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_FinishedLoading() // = function()
{
    return true;
};

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadImageSheet() //$Libraries_Game_Graphics_Fonts_FontImageSheet = function(imageSheet)
{
    // NYI
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetHeight() // = function()
{
    // NYI
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumAscent() // = function()
{
    // NYI
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumDescent() // = function()
{
    // NYI
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlinePosition() // = function()
{
    // NYI
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlineThickness() // = function()
{
    // NYI
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineHeight() // = function()
{
    // NYI
    return 16;
};

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetAvailableFonts() // = function()
{
    // NYI
    return null;
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumAscent() // = function()
{
    // NYI
    return 0;
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumDescent() // = function()
{
    // NYI
    return 0;
};

unsigned int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineGap() // = function()
{
    // NYI
    return 0;
};

int main() {
    // Initialize FreeType
    error = FT_Init_FreeType(&library);
    if (error) {
        std::cerr << "Error initializing FreeType" << std::endl;
    }
}