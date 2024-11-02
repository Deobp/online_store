import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserError } from "../utils/errors.js";
import { USER_COUNTRY_CITY_STREET, USER_EMAIL_REGEX, USER_NAMES_REGEX, USER_PASSWORD_REGEX, USER_PHONE_REGEX, USER_USERNAME_REGEX } from "../utils/regEx.js";

const namesRegex = /^[A-Za-z\s'-]+$/;
const usernameRegex = /^[a-z][a-z0-9]*$/;
const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]{8,}$/; // symbols and length
const phoneRegex = /^\+[0-9]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const countryCityStreetRegex = /^[A-Za-z\s\-.']+$/;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      match: [USER_NAMES_REGEX, "Allowed only: English letters (a-z, A-Z), spaces, apostrophe ('), hyphen (-)"],
      minlength: [1, "First name should be equal or more than 1 letter."],
      maxlength: [50, "First name shouldn't be more than 50 letters."],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      match: [USER_NAMES_REGEX, "Allowed only: English letters (a-z, A-Z), spaces, apostrophe ('), hyphen (-)"],
      minlength: [1, "Last name should be equal or more than 1 letter."],
      maxlength: [50, "Last name shouldn't be more than 50 letters."],
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: [
        USER_USERNAME_REGEX,
        "Must start with lowercase letter, only lowercase letters and numbers allowed.",
      ],
      minlength: [4, "Username should be equal or more than 4 letters."],
      maxlength: [16, "Username shouldn't  be more than 16 letters."],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      set: function (value) {
        if (!USER_PASSWORD_REGEX.test(value)) {
          throw new UserError(`Invalid value. Password requirements:
            - At least one lowercase letter
            - At least one uppercase letter
            - At least one number
            - At least one special character
            - Length between 8 and 128 characters`);
        }

        try {
          const hashedPassword = bcrypt.hashSync(
            value,
            parseInt(process.env.SALT_ROUNDS)
          );

          return hashedPassword;
        } catch (error) {
          console.log(error.message);
        }
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [USER_PHONE_REGEX, "Only '+' and numbers allowed."],
      minlength: [10, "Phone number should be equal or more than 10 symbols."],
      maxlength: [15, "Phone number shouldn't be more than 15 symbols."],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 254,
      match: [USER_EMAIL_REGEX, "Email is not correct."],
      trim: true,
    },
    country: {
      type: String,
      required: true,
      match: [
        USER_COUNTRY_CITY_STREET,
        "Only English letters, spaces, hyphens, periods, apostrophes allowed.",
      ],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      match: [
        USER_COUNTRY_CITY_STREET,
        "Only English letters, spaces, hyphens, periods, apostrophes allowed.",
      ],
      trim: true,
    },
    street: {
      type: String,
      required: true,
      match: [
        USER_COUNTRY_CITY_STREET,
        "Only English letters, spaces, hyphens, periods, apostrophes allowed.",
      ],
      trim: true,
    },
    house: {
      type: Number,
      required: true,
      min: 1,
    },
    apartment: {
      type: Number,
      default: null,
      min: 1,
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    collation: { locale: "en", strength: 2 }, // TeXt = text
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("fullAddress").get(function () {
  return `${this.country} ${this.city} ${this.street} ${this.house} ${this.apartment}`;
});

userSchema.methods.addToCart = async function (
  productId,
  quantity,
  availableAmount
) {
  const cartItem = this.cart.find(
    (item) => item.productId.toString() === productId.toString()
  );

  //quantity = parseInt(quantity);

  if (cartItem) {
    if (cartItem.quantity + quantity > availableAmount) {
      throw new UserError(
        `Not enough products in stock. Only ${availableAmount} left. You already have ${cartItem.quantity} in the cart.`
      );
    }

    cartItem.quantity += quantity;
  } else {
    this.cart.push({ productId, quantity });
  }

  return await this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart = [];
  return await this.save();
};

userSchema.methods.getCart = async function () {
  return this.cart;
};

userSchema.methods.updateFirstName = async function (newFirstName) {
  this.firstName = newFirstName;

  return await this.save();
};

userSchema.methods.updateLastName = async function (newLastName) {
  this.lastName = newLastName;

  return await this.save();
};

userSchema.methods.updateUsername = async function (newUsernane) {
  this.username = newUsernane;

  return await this.save();
};

userSchema.methods.updatePassword = async function (newPassword) {
  this.password = newPassword;
  return await this.save();
};

userSchema.methods.updateEmail = async function (newEmail) {
  this.email = newEmail;

  return await this.save();
};

userSchema.methods.updatePhone = async function (newPhone) {
  this.phone = newPhone;

  return await this.save();
};

userSchema.methods.updateCountry = async function (newCountry) {
  this.country = newCountry;

  return await this.save();
};

userSchema.methods.updateCity = async function (newCity) {
  this.city = newCity;

  return await this.save();
};

userSchema.methods.updateStreet = async function (newStreet) {
  this.street = newStreet;

  return await this.save();
};

userSchema.methods.updateHouse = async function (newHouse) {
  this.house = newHouse;

  return await this.save();
};

userSchema.methods.updateApartment = async function (newApartment) {
  this.apartment = newApartment;

  return await this.save();
};

userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.model("User", userSchema);

export default User;
