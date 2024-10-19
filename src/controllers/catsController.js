import Category from "../models/Category"

async function getAllCats(req, res, next) {
    try{
        const cats = await Category.find({})
        if (cats.length === 0) {
            res.status(404).json({ message: "No categories found" })
        }
        else {
            res.status(200).json(cats)
        }

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

async function createCat(req, res, next) {
    try {
        const {name, description} = req.body
        if(!name) {
            res.status(400).json({ message: "Category name is missing" })
        } else {
            const newCat = Category(name, description)
            await newCat.save()
        }

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

async function deleteCat(req, res, next) {
    try {
        const {name, description} = req.body
        if(!name) {
            res.status(400).json({ message: "Category name is missing" })
        } else {
            const deletedCat = await Category.findOneAndDelete({ name });

            if (!deletedCat) {
                res.status(404).json({ message: "Category not found" });
            } else 
                res.status(204).send();
            }

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

module.exports = {
    getAllCats,
    createCat,
    deleteCat
  };
  