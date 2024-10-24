import Order from "../models/Order.js"
import User from "../models/User.js"

export async function getAllOrders(req, res, next) {
    try{
        const orders = await Order.find({})
        if (orders.length === 0) 
           return res.status(404).json({ message: "No orders found" })      
        
        res.status(200).json(orders)

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

export async function getOrderById(req, res, next) {
    try {
        const { id } = req.params
        const order = await Category.findById(id)
        if(req.user.id !== order.userId || req.user.role !== "admin")
            return res.status(401).json({ message: "Access denied, you are not admin or this is not your order"})
        
        if (!order)
           return res.status(404).json({ message: "Order not found" })
        
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createOrder(req, res, next) {
    try {
        const {userId} = req.body
        if(!userId)
            return res.status(400).json({ message: "User ID is missing" })
        
        const user = await User.findById(userId)

        if(!user)
            return res.status(400).json({ message: "User not found." })

        if (user.cart.length === 0) 
            return res.status(400).json({ message: "User's cart is empty" })
        const products = []
        let total = 0
        for (const item of user.cart) {
            products.push({
                productId: item.productId._id,
                priceAtPurchase: item.productId.price,
                quantity: item.quantity
            })

            total += item.productId.price * item.quantity

        }
        
        const newOrder = Order({userId, products, total})
        await newOrder.save()

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

export async function updateStatus(req, res, next) {
    try {
        const { id } = req.params
        const {status} = req.body
        
        const order = await Order.findById(id)

        if (!order)
           res.status(404).json({ message: "Order not found" })

        if (!status)
            res.status(400).json({ message: "New status is missing" })

        if (status === order.status)
            res.status(400).json({ message: "There is nothing to change" })

        await order.updateStatus(status)
        await order.save()
        res.status(200).json({ message: "Status updated successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteOrder(req, res, next) {
    try {
        const { id } = req.params
        if(!id)
            res.status(400).json({ message: "Order ID is missing" })
       
        const deletedOrder = await Order.findByIdAndDelete(id)

        if (!deletedOrder)
            res.status(404).json({ message: "Order not found" });
        
        res.status(204).send();

    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    
}

