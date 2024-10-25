import mongoose from "mongoose";
import bcrypt from "bcrypt"

const namesRegex = /^[A-Za-z\s'-]+$/
const usernameRegex = /^[a-z][a-z0-9]*$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]{8,}$/;    // symbols and length
const phoneRegex = /^\+[0-9]+$/
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const countryCityStreetRegex = /^[A-Za-z\s\-.']+$/;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        match: [namesRegex, "Only english letters and spaces allowed."],
        minlength: [1, "First name should be equal or more than 1 letter."],
        maxlength: [50, "First name shouldn't be more than 50 letters."],
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        match: [namesRegex, "Only english letters and spaces allowed."],
        minlength: [1, "Last name should be equal or more than 1 letter."],
        maxlength: [50, "Last name shouldn't be more than 50 letters."],
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        match: [usernameRegex, "Only lowercase english letters and numbers allowed."],
        minlength: [4, "Username should be equal or more than 4 letters."],
        maxlength: [16, "Username shouldn't  be more than 16 letters."],
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        set: function(value) {
            
            if (!passRegex.test(value)) {
                throw new Error(`Invalid value. Password must be at least 8 symbols (min. 1 uppercase letter, min. 1 lowercase, min. 1 number,
                    min. 1 special symbol`)
            }

           try{
            const hashedPassword = bcrypt.hashSync(value, parseInt(process.env.SALT_ROUNDS))
            
            return hashedPassword

           } catch(error) {
            console.log(error.message)
           }
            

        }
    },
    role: { 
        type: String, 
        enum: ["user", "admin"],
        default: 'user' 
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [phoneRegex, "Only '+' and numbers allowed."],
        minlength: [10, "Phone number should be equal or more than 10 symbols."],
        maxlength: [15, "Phone number shouldn't be more than 15 symbols."],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 254,
        match: [emailRegex, "Email is not correct."],
        trim: true,
    },
    country: {
        type: String,
        required: true,
        match: [countryCityStreetRegex, "Only english letters and spaces allowed."],
        trim: true
    },
    city: {
        type: String,
        required: true,
        match: [countryCityStreetRegex, "Only english letters and spaces allowed."],
        trim: true
    },
    street: {
        type: String,
        required: true,
        match: [countryCityStreetRegex, "Only english letters and spaces allowed."],
        trim: true
    },
    house: {
        type: Number,
        required: true,
        min: 1
    },
    apartment: {
        type: Number,
        default: null,
        min: 1
    },
    cart: [{ 
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: { 
            type: Number,
            default: 1 
        } }],

},
    {
        collation: { locale: 'en', strength: 2 },  // TeXt = text
        toJSON: { virtuals: true },  
        toObject: { virtuals: true } 
    }
    
);

userSchema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("fullAddress").get(function() {
    return `${this.country} ${this.city} ${this.street} ${this.house} ${this.apartment}`;
});

userSchema.methods.addToCart = async function(productId, quantity) {
    const cartItem = this.find(item => item.productId === productId)
    
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        this.cart.push({ productId, quantity });
    } 
    
    return await this.save() 

}

userSchema.methods.updateFirstName = async function(newFirstName) {
    if (!newFirstName) throw new Error("First name didn't change. Invalid value.");
      
    if(newFirstName === this.firstName) throw new Error("First name didn't change. Same value entered.");
    
    this.firstName = newFirstName;
    
    return await this.save();
    
  };

  userSchema.methods.updateLastName = async function(newLastName) {
    if (!newLastName) throw new Error("Last name didn't change. Invalid value.");
      
    if(newLastName === this.lastName) throw new Error("Last name didn't change. Same value entered.");
    
    this.lastName = newLastName;
    
    return await this.save();
    
  };

  userSchema.methods.updateUsername = async function(newUsernane) {
    if (!newUsernane) throw new Error("Username didn't change. Invalid value.");
      
    if(newUsernane === this.username) throw new Error("Username didn't change. Same value entered.");
    
    this.username = newUsernane;
    
    return await this.save();
    
  };

  userSchema.methods.updatePassword = async function(newPassword) {
    /*if (!passRegex.test(newPassword)) {
        throw new Error("Password must be at least 8 symbols (min. 1 uppercase letter, min. 1 lowercase, min. 1 number, min. 1 special symbol)")
    }*/
    
    this.password = newPassword
    return await this.save()
    
  };

  userSchema.methods.updateEmail = async function(newEmail) {
    if (!newEmail) throw new Error("email didn't change. Invalid value.");
      
    if(newEmail === this.email) throw new Error("email didn't change. Same value entered.");
    
    this.email = newEmail;
    
    return await this.save();
    
  };

  userSchema.methods.updatePhone = async function(newPhone) {
    if (!newPhone) throw new Error("Phone number didn't change. Invalid value.");
      
    if(newPhone === this.phone) throw new Error("Phone mumber didn't change. Same value entered.");
    
    this.phone = newPhone;
    
    return await this.save();
    
  };


  userSchema.methods.updateCountry = async function(newCountry) {
    if (!newCountry) throw new Error("Country didn't change. Invalid value.");
      
    if(newCountry === this.country) throw new Error("Country didn't change. Same value entered.");
    
    this.country = newCountry;
    
    return await this.save();
    
  };

  userSchema.methods.updateCity = async function(newCity) {
    if (!newCity) throw new Error("City didn't change. Invalid value.");
      
    if(newCity === this.city) throw new Error("City didn't change. Same value entered.");
    
    this.city = newCity;
    
    return await this.save();
    
  };

  userSchema.methods.updateStreet = async function(newStreet) {
    if (!newStreet) throw new Error("Street didn't change. Invalid value.");
      
    if(newStreet === this.street) throw new Error("Street didn't change. Same value entered.");
    
    this.street = newStreet;
    
    return await this.save();
    
  };

  userSchema.methods.updateHouse = async function(newHouse) {
    if (!newHouse) throw new Error("House number didn't change. Invalid value.");
      
    if(newHouse === this.house) throw new Error("House number didn't change. Same value entered.");
    
    this.house = newHouse;
    
    return await this.save();
    
  };

  userSchema.methods.updateApartment = async function(newApartment) {
    if (!newApartment) throw new Error("Apartment number didn't change. Invalid value.");
      
    if(newApartment === this.apartment) throw new Error("Apartment number didn't change. Same value entered.");
    
    this.apartment = newApartment;
    
    return await this.save();
    
  };




const User = mongoose.model("User", userSchema);

export default User