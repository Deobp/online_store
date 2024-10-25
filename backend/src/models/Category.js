import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(value) {
        //letters, numbers, spaces, hyphens, and underscores =>
        return /^[a-zA-Z0-9-_ ]+$/.test(value);
      },
      message: 'Category name can only contain letters, numbers, spaces, hyphens, and underscores.'
    },
  },
  
  description: {
    type: String,
    trim: true,
  },
},

{
  collation: { locale: 'en', strength: 2 },  // TeXt = text
  toJSON: { virtuals: true },  
  toObject: { virtuals: true } 
}
);

categorySchema.methods.updateName = async function(newName) {
  if (!newName) throw new Error("Name didn't change. Invalid value.");
    
  if(newName === this.name) throw new Error("Name didn't change. Same value entered.");
  
  this.name = newName;
  
  return await this.save();
  
};

categorySchema.methods.updateDescription = async function(newDescription) {
  if (!newDescription) throw new Error("Description didn't change. Invalid value.");
    
  if(newDescription === this.description) throw new Error("Description didn't change. Same value entered.");
  
  this.description = newDescription;
  
  return await this.save();
};

categorySchema.methods.deleteCategory = async function() {
  return await this.remove();
};

categorySchema.statics.findByName = async function(name) {
  return await this.findOne({ name: name }); 
};

categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "categoryId"
});

const Category = mongoose.model('Category', categorySchema);

//module.exports = Category;
export default Category
