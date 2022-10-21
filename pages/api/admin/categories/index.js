import { prisma } from "~/lib/db"
import {
    convertUUIDBufferedToString,
    makeUUIDBuffered,
    resultOK,
    resultError
} from "~/lib/util"

export default async function getCategories(req, res) {

    if (req.method === "GET") {

        let result = null

        try {
            result = await prisma.Category.findMany()
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = result.map((entry) => {
            entry.createdAt = null
            entry.updatedAt = null
            entry.id = convertUUIDBufferedToString(entry.id)
            return entry
        })

        res.status(200).json(resultOK(data))
        
    } else if (req.method === "POST") {

        const category = {
            data: {
                id: makeUUIDBuffered(),
                name: req.body.name
            }
        }
        let result = null

        try {
            result = await prisma.Category.create(category)
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError("Error create category"))
            return
        }

        const data = { ...result }
        data.id = convertUUIDBufferedToString(data.id)

        res.status(200).json(resultOK(data))

    }

}