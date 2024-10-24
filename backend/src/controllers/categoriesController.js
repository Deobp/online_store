import Category from "../models/Category.js"

export async function getAllCategories(req, res, next) {
    try{
        const categories = await Category.find({})
        if (categories.length === 0) 
           return res.status(404).json({ message: "No categories found" })      
        
        res.status(200).json(categories)

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

export async function getCategoryById(req, res, next) {
    try {
        const { id } = req.params
        const category = await Category.findById(id)

        if (!category)
           return res.status(404).json({ message: "Category not found" })
        
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createCategory(req, res, next) {
    try {
        const {name, description} = req.body
        if(!name)
            return res.status(400).json({ message: "Category name is missing" })
        const newCategory = Category({name, description})
        await newCategory.save()
        res.status(201).json({ message: "The new category added successfully" });

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

export async function updateCategoryDescr(req, res, next) {
    try {
        const { id } = req.params
        const {description} = req.body
        
        const category = await Category.findById(id)

        if (!category)
           res.status(404).json({ message: "Category not found" })

        if (!description)
            res.status(400).json({ message: "Description is missing" })

        if (description === category.description)
            res.status(400).json({ message: "There is nothing to change" })

        await category.updateDescription(description)
        await category.save()
        res.status(200).json({ message: "Description updated successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteCategory(req, res, next) {
    try {
        const { id } = req.params
        if(!id)
            res.status(400).json({ message: "Category ID is missing" })
       
        const deletedCategory = await Category.findByIdAndDelete(id)

        if (!deletedCategory)
            res.status(404).json({ message: "Category not found" });
        
        res.status(204).send();

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}
  