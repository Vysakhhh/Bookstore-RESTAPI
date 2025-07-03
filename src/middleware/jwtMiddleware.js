const jwt = require('jsonwebtoken')


const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json('No token provided')
    }


    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).json('Invalid or expired token')
    }
}

module.exports = jwtMiddleware