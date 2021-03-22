#include <string>
#include <iostream>

#include "FreeTypeStrategy.h"

// EMSCRIPTEN WASM
#include <emscripten.h>

// FREETYPE
#include <ft2build.h>
#include FT_FREETYPE_H

FT_Library library;
FT_Face face;
FT_Error error;
FT_GlyphSlot glyph;

//const std::string FONT_PATH = "fonts/";
//const std::string TTF_FILE_EXTENSION = ".ttf";

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_InitializeFreeType() {
    // Initialize FreeType
    error = FT_Init_FreeType(&library);
    if (error) {
        std::cerr << "Error initializing FreeType" << std::endl;
    }

    return error;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadFontNative(char* font) //$quorum_text = function(fontName)
{
    // Make sure requested font is arial
    //if (font != "Arial") {
    char arialFont[] = "Arial";
    if (strcmp(font, arialFont) != 0) {
        std::cerr << "Only the arial font face is supported at this time." << std::endl;
        return 1;
    }
    else {
        std::cerr << "'Arial' passed to LoadFontNative." << std::endl;
    }

    // Load font
    error = FT_New_Face(library, "fonts/Arial.ttf", 0, &face);
    if (error == FT_Err_Unknown_File_Format) {
        std::cerr << "Font format is unsupported" << std::endl;
        return 1;
    }
    else if (error) {
        std::cerr << "Font file is missing or corrupted" << std::endl;
        return 1;
    }

    wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetSizeNative(12); // temporary, but needed to render glyph
    return 0;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_IsFontAvailable(char* font) //$quorum_text = function(fontName)
{
    char arialFont[] = "Arial";
    return strcmp(font, arialFont); // Return 1 (True) if font == 'Arial'
}

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetSizeNative(int size) //$quorum_integer = function(size)
{
    error = FT_Set_Char_Size(face, size << 6, 0, 72, 0);
}

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetAngleNative(int angle) //$quorum_number = function(angle)
{
    // NYI
}

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SetColorNative() //$quorum_Libraries_Game_Graphics_Color = function(newColor)
{
    //color = newColor;
}

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetColor() // = function()
{
    //return color;
}

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_DisposeNative() // = function()
{
    FT_Done_Face(face);
}


int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetGlyphNative(char* character)
{
    /*
    var glyph = new quorum_Libraries_Game_Graphics_Glyph_();
    glyph.Set_Libraries_Game_Graphics_Glyph__texture_(plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_.testDrawable);
    glyph.Set_Libraries_Game_Graphics_Glyph__horizontalAdvance_(8);
    glyph.Set_Libraries_Game_Graphics_Glyph__verticalAdvance_(0);
    glyph.Set_Libraries_Game_Graphics_Glyph__lengthToGlyph_(0);
    glyph.Set_Libraries_Game_Graphics_Glyph__heightFromBaseLine_(0);
    return glyph;
    */
}


int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetKerning() //$quorum_text$quorum_text = function(currentCharacter, nextCharacter)
{
    // NYI
    return 0;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_FinishedLoading() // = function()
{
    return 1;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_LoadImageSheet() //$Libraries_Game_Graphics_Fonts_FontImageSheet = function(imageSheet)
{
    return 0;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetHeight() // = function()
{
    // NYI
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumAscent() // = function()
{
    // NYI
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetMaximumDescent() // = function()
{
    // NYI
}

long wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlinePosition() // = function()
{
    return FT_MulFix(face->underline_position, face->size->metrics.y_scale);
}

long wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_SystemGetUnderlineThickness() // = function()
{
    return FT_MulFix(face->underline_thickness, face->size->metrics.y_scale);
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineHeight() // = function()
{
    return face->size->metrics.height;
}

void wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetAvailableFonts() // = function()
{
    // NYI
    //return null;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumAscent() // = function()
{
    return face->size->metrics.ascender;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetMaximumDescent() // = function()
{
    return face->size->metrics.descender;
}

int wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_GetLineGap() // = function()
{
    // NYI
    return 0;
}

int loadChar(char* symbol)
{
    char sym = *symbol;
    std::cerr << "Loading glyph:" << sym << std::endl;
    glyph = face->glyph;

    // If an error occurs during FT_Load_Char, return 1.
    error = FT_Load_Char(face, sym, FT_LOAD_RENDER);
    if (error) {
        std::cerr << "Error: FT_Load_Char " << error << std::endl;
        return 1;
    }
    else {
        return 0;
    }
}

int getBitmap(unsigned char* buf)
{
    buf = glyph->bitmap.buffer;

    return 0;
}

int getBitmapData(long* bitmapData)
{
    bitmapData[0] = glyph->bitmap_left;
    bitmapData[1] = glyph->bitmap_top;
    bitmapData[2] = glyph->bitmap.rows;
    bitmapData[3] = glyph->bitmap.width;
    bitmapData[4] = glyph->advance.x;
    bitmapData[5] = glyph->advance.y;
    bitmapData[6] = glyph->bitmap.pitch;
    
    return 0;
}

int main() {
    return wasm_plugins_quorum_Libraries_Game_Graphics_Fonts_FreeTypeStrategy_InitializeFreeType();
}