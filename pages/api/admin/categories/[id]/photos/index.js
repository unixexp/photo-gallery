import { prisma } from "../../../../../../lib/db"

export default async function getCategoryPhotos(req, res) {

    if (req.method === "GET") {

        const categories = await prisma.Category.findMany()

        res.status(200).json({ index: categories })
    }

}