#include <math.h>

// FREETYPE
#include <ft2build.h>
#include FT_FREETYPE_H

FT_Library library;
FT_Face* face;
FT_Error error;

extern "C" {

    int int_sqrt(int x) {
        return sqrt(x);
    }
}