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
        if (error.name === "ValidationError" || error.code === 11000)
            return res.status(400).json({ message: error.message })
        res.status(500).json({ message: error.message })
    }
    
}

export const updateCategoryById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.name === "ValidationError" || error.code === 11000)
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
  };

export async function updateCategoryName(req, res, next) {
    try {
        const { id } = req.params
        const {name} = req.body
        
        const category = await Category.findById(id)

        if (!category)
           return res.status(404).json({ message: "Category not found" })

        if (!name)
            return res.status(400).json({ message: "Name is missing" })

        await category.updateName(name)
       
        res.status(200).json({ message: "Category's name updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}


export async function updateCategoryDescr(req, res, next) {
    try {
        const { id } = req.params
        const {description} = req.body
        
        const category = await Category.findById(id)

        if (!category)
           return res.status(404).json({ message: "Category not found" })

        if (!description)
            return res.status(400).json({ message: "Description is missing" })

        await category.updateDescription(description)
        
        res.status(200).json({ message: "Description updated successfully"});
    } catch (error) {
        if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
            return res.status(400).json({ message: error.message })

        res.status(500).json({ message: error.message });
    }
}

export async function deleteCategory(req, res, next) {
    try {
        const { id } = req.params
        if(!id)
           return res.status(400).json({ message: "Category ID is missing" })
       
        const deletedCategory = await Category.findByIdAndDelete(id)

        if (!deletedCategory)
           return res.status(404).json({ message: "Category not found" });
        
        res.status(204).send();

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}
  