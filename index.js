const express = require('express')
const app = express()
const exhbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/User')

require('dotenv').config()

// Importing routers 
const homeRouter = require('./routers/home')
const booksRouter = require('./routers/books')
const cardRouter = require('./routers/card')
const orderRouter = require('./routers/order')
const { normalize } = require('path')

// Using exhbs
const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    req.user = await User.findById('61f226420be73d5b55a4cb7d')  // id orqali userni topib beradi
    next()
})

// Watching public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))

// Using routers
app.use('/', homeRouter)
app.use('/books', booksRouter)
app.use('/card', cardRouter)
app.use('/orders', orderRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://Nuriddinov:6wiMgddQQBcnGz3O@cluster0.kd7hv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
                               
        const candidate = await User.findOne()

        if (!candidate) {
            const user = new User({
                email: 'nuriddinovqorabotir@gmail.com',
                name: 'Mirzabotir',
                cart: { items: [] }  // userni korzinasi default bo'sh
            })

            await user.save()  // userni saqladik
        }

        // Listening port
        //const port = 5000 || 8080
        const port = normalizePort(process.env.PORT || '5000')
        app.set('port', port);


        function normalizePort(val) {
            const port = parseInt(val, 10);

            if (isNaN(port)) {
                //named pipe
                return val;
            }

            if (port >= 0) {
                //port number
                return port;
            }

            return false;
        }

        app.listen(port, () => {
            console.log(`Server watching ${port}...`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()

