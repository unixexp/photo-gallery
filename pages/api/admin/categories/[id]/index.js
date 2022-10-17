import { prisma } from "../../../../../lib/db"

export default async function getCategories(req, res) {

    if (req.method === "GET") {

        const { id } = req.query
        
        // const categories = await prisma.Category.findMany()

        res.status(200).json({ data: categories })
    }

}