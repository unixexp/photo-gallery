export default function getCategoryPhotos(req, res) {

    if (req.method === "GET") {
        const { id: categoryId } = req.query;

        res.status(200).json({ data: categoryId })
    }

}