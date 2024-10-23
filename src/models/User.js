import mongoose from "mongoose";
import bcrypt from "bcrypt"

const engOnlyRegex = /^[A-Za-z\s]+$/;
const usernameRegex = /^[a-z][a-z0-9]*$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;    // symbols and length
const phoneRegex = /^\+\d+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        match: [engOnlyRegex, "Only english letters and spaces allowed."],
        minlength: [1, "First name should be equal or more than 1 letter."],
        maxlength: [50, "First name shouldn't be more than 50 letters."],
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        match: [engOnlyRegex, "Only english letters and spaces allowed."],
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
                
                this.invalidate('password', `Password must be at least 8 symbols (min. 1 uppercase letter, min. 1 lowercase, min. 1 number,
                    min. 1 special symbol)`);   // creating validation error to catch it later in controller
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
        match: [engOnlyRegex, "Only english letters and spaces allowed."],
        trim: true
    },
    city: {
        type: String,
        required: true,
        match: [engOnlyRegex, "Only english letters and spaces allowed."],
        trim: true
    },
    street: {
        type: String,
        required: true,
        match: [engOnlyRegex, "Only english letters and spaces allowed."],
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

userSchema.methods.updatefirstName = async function(newFirstName) {
    if(newFirstName && newFirstName !== this.firstName) {
        this.firstName = newFirstName
        return await this.save() 
    } else 
        return {message: "First name didn't change"}
}

userSchema.methods.updateLastName = async function(newLastName) {
    if(newLastName && newLastName !== this.lastName) {
        this.lastName = newLastName
        return await this.save() 
    } else 
        return {message: "Last name didn't change"}
}

userSchema.methods.updatePassword = async function(newPassword) {
    if (!passRegex.test(newPassword)) {
        throw new Error("Password must be at least 8 symbols (min. 1 uppercase letter, min. 1 lowercase, min. 1 number, min. 1 special symbol)")
    }
    
    this.password = newPassword
    return await this.save()
}

const User = mongoose.model("User", userSchema);

//module.exports = { User };

export default User