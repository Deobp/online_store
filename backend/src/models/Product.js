import mongoose from "mongoose";

const nameRegEx = /^[A-Za-z0-9][A-Za-z0-9\s&,.()-]*[A-Za-z0-9).]$/ // letters, numbers, spaces, &, comma, dot, brackets, hyphen
const descrRegEx = /^[A-Za-z0-9][A-Za-z0-9\s,.!?()&$#@%*+\-"':]*[A-Za-z0-9.!?)]$/ // letters, numbers, spaces, punctuation marks, quotes, special chars like @#$%

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [nameRegEx, "Only english letters, spaces, quotes and '-' allowed."],
        minlength: [3, "Name should be equal or more than 3 letters."],
        maxlength: [100, "Name shouldn't be more than 100 letters."],
        trim: true,
    },    
    description: {
        type: String,
        required: true,
        match: [descrRegEx, "Only english letters, spaces, quotes and '-' allowed."],
        minlength: [10, "Description should be equal or more than 10 letters."],
        maxlength: [1000, "Description shouldn't be more than 1000 letters."],
        trim: true,
    },
    imagePath: {
        type: String,
        required: true,
        default: "https://picsum.photos/200/300",
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
    if (!newName) throw new Error("Product's name didn't change. Invalid value.");
      
    if(newName === this.name) throw new Error("Product's name didn't change. Same value entered.");
    
    this.name = newName;
    
    return await this.save();
    
  };

  productSchema.methods.updateDescription = async function(newDescription) {
    if (!newDescription) throw new Error("Product's description didn't change. Invalid value.");
      
    if(newDescription === this.description) throw new Error("Product's description didn't change. Same value entered.");
    
    this.description = newDescription;
    
    return await this.save();
    
  };

  productSchema.methods.updatePrice = async function(newPrice) {
    if (!newPrice) throw new Error("Product's price didn't change. Invalid value.");
      
    if(newPrice === this.price) throw new Error("Product's price didn't change. Same value entered.");
    
    this.price = newPrice;
    
    return await this.save();
    
  };

  productSchema.methods.updateQuantity = async function(newQuantity) {
    if (!newQuantity) throw new Error("Product's quantity didn't change. Invalid value.");
      
    if(newQuantity === this.quantity) throw new Error("Product's quantity didn't change. Same value entered.");
    
    this.quantity = newQuantity;
    
    return await this.save();
    
  };

  productSchema.methods.updateImagePath = async function(newImagePath) {
    if (!newImagePath) throw new Error("Image path didn't change. Invalid value.");
      
    if(newImagePath === this.imagePath) throw new Error("Image path didn't change. Same value entered.");
    
    this.imagePath = newImagePath;
    
    return await this.save();
    
  };

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

export default Product