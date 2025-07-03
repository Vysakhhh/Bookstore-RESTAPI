require('dotenv').config()
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')

const app = express()

const PORT = 3000

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

app.get('/', (req, res) => {
    res.send("Bookstore API started running");

})

app.listen(PORT, () => {
    console.log(`server started working on port:${PORT}`);

})
