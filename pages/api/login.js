const jwt = require("jsonwebtoken")

export default async function login(req, res) {

    const users = [{ login: "admin", password: "friend" }]
    const { username, password } = {...req.body}
    const secret = process.env.tokenKey

    // TO DO: use database for user search
    const found = users.filter(el => (el.login === username && el.password === password))

    if (found.length) {
        const user = found[0]
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: user.login
            }, secret)
        res.status(200).json({ token: token })
    } else {
        res.status(404).json(null)
    }

}