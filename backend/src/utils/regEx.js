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

// Allows real names like "John", "O'Connor", "Mary-Jane"
// - English letters (a-z, A-Z)
// - Spaces
// - Apostrophe (') for names like O'Connor
// - Hyphen (-) for double-barreled names
export const USER_NAMES_REGEX = /^[A-Za-z\s'-]+$/;

// Allows usernames like "john123" but must start with letter
// - Must start with lowercase letter
// - Can contain lowercase letters and numbers
// - No special characters or spaces allowed
export const USER_USERNAME_REGEX = /^[a-z][a-z0-9]*$/;

// Phone number must:
// - Start with plus sign
// - Contain only numbers after plus
// Length is controlled by mongoose schema
export const USER_PHONE_REGEX = /^\+[0-9]+$/;

// Password requirements:
// - At least one lowercase letter
// - At least one uppercase letter
// - At least one number
// - At least one special character
// - Length between 8 and 128 characters (controlled here because of complex structure)
export const USER_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]{8,128}$/;

// Standard email regex
// - Local part can contain letters, numbers, and common special chars
// - Domain part follows standard rules
// - TLD must be at least 2 characters
export const USER_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Allows address input like "New York", "O'Connell Street"
// - English letters
// - Spaces
// - Hyphens
// - Periods
// - Apostrophes
export const USER_COUNTRY_CITY_STREET = /^[A-Za-z\s\-.']+$/;

// Product name allows:
// - Must start with letter or number
// - Can contain:
//   - English letters (a-z, A-Z)
//   - Numbers (0-9)
//   - Spaces
//   - Ampersand (&) for product lines like "M&M's"
//   - Apostrophe (') for possessive forms like "Baker's"
//   - Basic punctuation (,.)
//   - Brackets () for specifications
//   - Forward slash (/) for product variations
//   - Hyphen (-) for compound names
// - Must end with letter, number, closing bracket, or period
export const PRODUCT_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s&,.()/'(-]*[A-Za-z0-9).]$/;

// Product description allows:
// - Must start with letter or number
// - Can contain:
//   - English letters (a-z, A-Z)
//   - Numbers (0-9)
//   - Spaces
//   - Basic punctuation (,.!?)
//   - Brackets () for specifications or quotes
//   - Common special chars (&$#@%*+)
//   - Hyphen (-)
//   - Various quotes ("':)
// - Must end with letter, number, punctuation (.!?) or closing bracket
export const PRODUCT_DESCRIPTION_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s,.!?()&$#@%*+\-"':]*[A-Za-z0-9.!?)]$/;

// Image path validation:
// Allows both URLs and local paths:
// - Optional http:// or https:// prefix
// - Optional domain (example.com)
// - Path segments with letters, numbers, hyphens
// - Must end with .png, .jpg, or .jpeg (case insensitive)
// Examples:
// - https://example.com/images/product.jpg
// - /uploads/product-image.png
// - images/my-product.jpeg
export const PRODUCT_IMAGE_PATH_REGEX = /^(https?:\/\/[\w-]+\.[\w-]+\.|\/)?[\w/-]+\.(png|jpg|jpeg)$/i;