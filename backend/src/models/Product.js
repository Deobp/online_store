import mongoose from "mongoose";

const nameRegEx = /^[A-Za-z0-9][A-Za-z0-9\s&,.()/-]*[A-Za-z0-9).]$/ // letters, numbers, spaces, &, comma, dot, brackets, hyphen
const descrRegEx = /^[A-Za-z0-9][A-Za-z0-9\s,.!?()&$#@%*+\-"':]*[A-Za-z0-9.!?)]$/ // letters, numbers, spaces, punctuation marks, quotes, special chars like @#$%
const imagePathRegEx = /^(https?:\/\/[\w-]+\.[\w-]+\.|\/)?[\w/-]+\.(png|jpg|jpeg)$/i

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        match: [nameRegEx, "Only english letters, numbers, spaces, quotes and '-' allowed."],
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
        match: [imagePathRegEx, "Only PNG, JPG, JPEG files allowed."],
        default: "/img/products/default.png",
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
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: "Value must be an integer"
          }
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    isEnded: { 
        type: Boolean, 
        required: true,
        default: false
    }

},
    {
        collation: { locale: 'en', strength: 2 },  // TeXt = text
        toJSON: { virtuals: true },  
        toObject: { virtuals: true } 
    }
    
);

productSchema.methods.updateName = async function(newName) {
    /*if (!newName) throw new Error("Product's name didn't change. Invalid value.");
      
    if(newName === this.name) throw new Error("Product's name didn't change. Same value entered.");*/
    
    this.name = newName;
    
    return await this.save();
    
  };

  productSchema.methods.updateDescription = async function(newDescription) {
    /*if (!newDescription) throw new Error("Product's description didn't change. Invalid value.");
      
    if(newDescription === this.description) throw new Error("Product's description didn't change. Same value entered.");*/
    
    this.description = newDescription;
    
    return await this.save();
    
  };

  productSchema.methods.updatePrice = async function(newPrice) {
    /*if (!newPrice) throw new Error("Product's price didn't change. Invalid value.");
      
    if(newPrice === this.price) throw new Error("Product's price didn't change. Same value entered.");*/
    
    this.price = newPrice;
    
    return await this.save();
    
  };

  productSchema.methods.updateQuantity = async function(newQuantity) {
    /*if (newQuantity === undefined || newQuantity === null) throw new Error("Product's quantity didn't change. Invalid value.");
      
    if(newQuantity === this.quantity) throw new Error("Product's quantity didn't change. Same value entered.");*/
    
    if(newQuantity === 0) this.isEnded = true

    if(this.quantity === 0) this.isEnded = false

    this.quantity = newQuantity;
    
    return await this.save();
    
  };

  productSchema.methods.increaseQuantity = async function(amount) {
    /*if(!amount || amount < 0) throw new Error("Product's quantity didn't change. Invalid value entered.")
    
    if(amount === 0) throw new Error("Product's quantity didn't change. You entered 0.")*/
    
    return await this.updateQuantity(this.quantity + amount)
}

productSchema.methods.decreaseQuantity = async function(amount) {
    amount = parseInt(amount)

    /*if(this.isEnded)
        throw new Error("Product's quantity didn't change. Out of stock.")*/
    
  //  if(!amount || amount < 0) throw new Error("Product's quantity didn't change. Invalid value entered.")

  //  if(amount === 0) throw new Error("Product's quantity didn't change. You entered 0.")
    
    /*if(amount > this.quantity)
        throw new Error("Product's quantity didn't change. Not enough products in stock.")*/
    
    
    return await this.updateQuantity(this.quantity - amount)
}

  productSchema.methods.updateCategoryId = async function(newCategoryId) {
    /*if (!newCategoryId) throw new Error("Category ID didn't change. Invalid value.");
      
    if(newCategoryId.toString() === this.categoryId.toString()) throw new Error("Category ID didn't change. Same value entered.");*/
    
    this.categoryId = newCategoryId;
    
    return await this.save();
    
  };

  productSchema.methods.updateImagePath = async function(newImagePath) {
    /*if (!newImagePath) throw new Error("Image path didn't change. Invalid value.");
      
    if(newImagePath === this.imagePath) throw new Error("Image path didn't change. Same value entered.");*/
    
    this.imagePath = newImagePath;
    
    return await this.save();
    
  };



const Product = mongoose.model("Product", productSchema);

export default Product