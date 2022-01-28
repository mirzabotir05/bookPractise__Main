const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    books: [
        {
            book: {
                type: Object, // {price, name, id}
                required: true
            },
            count: {
                type: Number,
                required: true
            }
        },
    ],

    user: {
        name: String,
        userId: {
            type: Schema.Types.ObjectId,  // {name, id}
            ref: 'User',
            required: true
        }
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Order', orderSchema)