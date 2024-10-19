import Category from "../models/Category"

async function getAllCats(req, res, next) {
    try{
        const cats = await Category.find({})
        if (cats.length === 0) 
           return res.status(404).json({ message: "No categories found" })      
        
        res.status(200).json(cats)

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

async function getCatById(req, res, next) {
    try {
        const { id } = req.params
        const cat = await Category.findById(id)

        if (!cat)
           return res.status(404).json({ message: "Category not found" })
        
        res.status(200).json(cat)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createCat(req, res, next) {
    try {
        const {name, description} = req.body
        if(!name)
            return res.status(400).json({ message: "Category name is missing" })
        const newCat = Category({name, description})
        await newCat.save()

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

async function updateCatDescr(req, res, next) {
    try {
        const { id } = req.params
        const {description} = req.body
        
        const cat = await Category.findById(id)

        if (!cat)
           res.status(404).json({ message: "Category not found" })

        if (!description)
            res.status(400).json({ message: "Description is missing" })

        if (description === cat.description)
            res.status(400).json({ message: "There is nothing to change" })

        await cat.updateDescription(description)
        await cat.save()
        res.status(200).json({ message: "Description updated successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteCat(req, res, next) {
    try {
        const { id } = req.params
        if(!id)
            res.status(400).json({ message: "Category ID is missing" })
       
        const deletedCat = await Category.findByIdAndDelete(id)

        if (!deletedCat)
            res.status(404).json({ message: "Category not found" });
        
        res.status(204).send();

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

module.exports = {
    getAllCats,
    getCatById,
    createCat,
    updateCatDescr,
    deleteCat
  };
  