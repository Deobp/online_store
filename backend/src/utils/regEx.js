/*----- 
Allows:
- English letters (a-z, A-Z)
- Numbers (0-9)
- Hyphen (-)
- Underscore (_)
- Space ( )
-----*/
export const CATEGORY_NAME_REGEX = /^[a-zA-Z0-9-_ ]+$/;

/*-----
Must start with letter/number
Allows in the middle:
- English letters (a-z, A-Z)
- Numbers (0-9)
- Whitespace (\s)
- Punctuation marks (,.!?)
- Brackets ()
- Special chars (&$#@%*+)
- Hyphen (-)
- Quotes ("':)
Must end with letter/number or .
-----*/
export const CATEGORY_DESCRIPTION_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9\s,.!?()&$#@%*+\-"':]*[a-zA-Z0-9.]$/;

