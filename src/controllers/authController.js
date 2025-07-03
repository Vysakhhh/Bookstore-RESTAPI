const fs = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userPath = path.join(__dirname, '../data/users.json')

exports.registerUserController = async (req, res) => {

    console.log("in  registerUserController");

    const { email, password } = req.body

    try {

        const data = await fs.readFile(userPath, 'utf-8')
        const users = JSON.parse(data)


        if (users.find(u => u.email === email)) {
            return res.status(400).json("User already exists...  please login!")
        }

        const encryptedPassword = await bcrypt.hash(password, 10)
        users.push({ id: Date.now().toString(), email, password: encryptedPassword })


        await fs.writeFile(userPath, JSON.stringify(users, null, 2))

        res.status(200).json("User registered")

    }
    catch (err) {
        console.log("error in registerUserController", err);
        res.status(500).json("Internal server error")

    }
}

exports.loginUserController = async (req, res) => {
    console.log("in loginUserController");

    const { email, password } = req.body

    try {

        const data = await fs.readFile(userPath, 'utf-8')
        const users = JSON.parse(data)

        const user = users.find(u => u.email === email)

        if (!user) {
            return res.status(401).json("Invalid credentials")
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(401).json("Invalid credentials")
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' })
        res.json({ token })

    }
    catch (err) {
        console.log("error in loginUserController", err);
        res.status(500).json("Internal server error")
    }

}