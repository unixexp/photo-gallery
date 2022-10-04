export default function login(req, res) {

    const users = [{ username: "admin", password: "friend" }]
    const { username, password } = {...req.body}

    const found = users.filter(el => (el.username === username && el.password === password))
    if (found.length)
        res.status(200).json(found[0])
    else
        res.status(404).json(null)

}