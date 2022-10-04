export default function getPhotos(req, res) {

    if (req.method === "GET") {
        const { category } = req.query;
        res.status(200).json({ data: category });
    }

}