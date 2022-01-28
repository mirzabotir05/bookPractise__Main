const { Router } = require('express')
const Order = require('../models/Order')
const router = Router()

router.get('/', async (req, res) => {
    const orders = await Order.find({ 'user.userId': req.user._id }).populate('user.userId') //{books: [], user:{name: '', email:}, date: '21.01.2022'}

    // console.log(orders[0].books);

    // console.log(orders[0].books);

    const forPrice = orders.map(c => {
        return {
            ...c._doc,
            price: c.books.reduce((total, b) => {
                return total += b.book.price * b.count 
            }, 0)
        }
    })

    res.render('orders', {
        title: 'Order',
        orders: forPrice  // array
    })
})

router.post('/', async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.bookId')  // {name, email, bookId: {name, price, img,id}}
        // console.log('User', user.cart.items);
        const books = user.cart.items.map(c => { // array
            return {
                count: c.count,
                book: { ...c.bookId._doc }
            }
        })

        const order = new Order({
            books,
            user: {
                name: req.user.name,
                userId: req.user
            },
        })

        await order.save()
        await req.user.clearCart()
        res.redirect('/orders')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router