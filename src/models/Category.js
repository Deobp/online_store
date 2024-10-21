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
});

categorySchema.methods.updateName = async function(newName) {
  if (newName && newName !== this.name) {
    this.name = newName;
    return await this.save();
  } else {
    return { message: "Name didn't is invalid" };
  }
};

categorySchema.methods.updateDescription = async function(newDescription) {
  if (newDescription && newDescription !== this.description) {
    this.description = newDescription;
    return await this.save();
  } else {
    return { message: "Description didn't change or is invalid" };
  }
};

categorySchema.methods.deleteCategory = async function() {
  return await this.remove();
};

categorySchema.statics.findByName = async function(name) {
  return await this.findOne({ name: name }); 
};

const Category = mongoose.model('Category', categorySchema);

//module.exports = Category;
export default Category
