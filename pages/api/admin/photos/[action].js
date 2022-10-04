export default function handle(req, res) {

    const { action } = req.query;

    if (req.method === "POST") {

        if (action === "add") {
            
            res.status(200).json({ added: req.body.name });

        } else if (action === "remove") {

            res.status(200).json({ removed: req.body.name });

        }

    }

}