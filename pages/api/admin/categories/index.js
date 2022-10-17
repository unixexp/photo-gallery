import {
    v4 as uuidV4,
    parse as uuidParse,
    stringify as uuidStringify
} from "uuid";
import { prisma } from "../../../../lib/db"

export default async function getCategories(req, res) {

    if (req.method === "GET") {

        let result = null
        try {
            result = await prisma.Category.findMany()
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            res.status(500).json({error: "Error get categories"})
            return
        }

        const data = result.map((entry) => {
            entry.id = uuidStringify(new Uint8Array(entry.id))
            return entry
        })

        res.status(200).json({data: data})
        
    } else if (req.method === "POST") {

        const category = {
            data: {
                id: Buffer.from(uuidParse(uuidV4())),
                name: req.body.name
            }
        }

        let result = null;
        try {
            result = await prisma.Category.create(category)
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            res.status(500).json({error: "Error create category"})
            return
        }

        const data = { ...result }
        data.id = uuidStringify(new Uint8Array(data.id))

        res.status(200).json({data: data})

    }

}