import mongoose from "mongoose";

const regEx = /^[a-zA-Z0-9\s-'"“”‘’]+$/ // letters, spaces, quotes, "-"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [regEx, "Only english letters, spaces, quotes and '-' allowed."],
        minlength: [3, "Name should be equal or more than 3 letters."],
        maxlength: [100, "Name shouldn't be more than 100 letters."],
        trim: true,
    },    
    description: {
        type: String,
        required: true,
        match: [regEx, "Only english letters, spaces, quotes and '-' allowed."],
        minlength: [10, "Description should be equal or more than 10 letters."],
        maxlength: [1000, "Description shouldn't be more than 1000 letters."],
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
    },
    quantity: { 
        type: Number,
        required: true,
        min: 0
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

},
    {
        collation: { locale: 'en', strength: 2 },  // TeXt = text
        toJSON: { virtuals: true },  
        toObject: { virtuals: true } 
    }
    
);

productSchema.methods.updateName = async function(newName) {
    if(newName && newName !== this.name) {
        this.name = newName
        return await this.save() 
    } else 
        return {message: "Name didn't change"}
}

productSchema.methods.updateDescription = async function(newDescription) {
    if(newDescription && newDescription !== this.description) {
        this.description = newDescription
        return await this.save() 
    } else 
        return {message: "Description didn't change"}
}

productSchema.methods.updatePrice = async function(newPrice) {
    if(newPrice && newPrice !== this.price) {
        this.price = newPrice
        return await this.save() 
    } else 
        return {message: "Price didn't change"}
}

productSchema.methods.updateQuantity = async function(newQuantity) {
    if(newQuantity && newQuantity !== this.quantity) {
        this.quantity = newQuantity
        return await this.save() 
    } else 
        return {message: "Quantity didn't change"}
}

productSchema.methods.increaseQuantity = async function(amount) {
    if(amount && amount > 0) {
        await this.updateQuantity(this.quantity + amount)
    } else {
        return {message: "Value of increasing amount is not correct"}
    }
}

productSchema.methods.decreaseQuantity = async function(amount) {
    if(amount && amount > 0) {
        if(amount > this.quantity) {
            return {message: "Not enought products in stock."}
        } else await this.updateQuantity(this.quantity - amount)
    } else {
        return {message: "Value of decreasing amount is not correct."}
    }
}

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };