import { prisma } from "~/lib/db"
import {
    convertUUIDStringToBuffered,
    convertUUIDBufferedToString,
    resultOK,
    resultError
} from "~/lib/util"

export default async function getCategories(req, res) {

    if (req.method === "GET") {

        const { id } = req.query
        let result = null

        try {
            result = await prisma.Category.findUnique({ where: { id: convertUUIDStringToBuffered(id) } })
            if (!result) {
                res.status(404).json(resultError("Category not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = { ...result }
        data.id = convertUUIDBufferedToString(data.id)

        res.status(200).json(resultOK(data))

    } else if (req.method === "PUT") {

        const { id } = req.query
        const category = req.body
        let result = null

        try {
            result = await prisma.Category.findUnique({ where: { id: convertUUIDStringToBuffered(id) } })
            if (!result) {
                res.status(404).json(resultError("Category not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        try {
            result = await prisma.Category.update({
                where: { id: convertUUIDStringToBuffered(id) },
                data: {...category, id: convertUUIDStringToBuffered(id)}
            })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = { ...result }
        data.id = convertUUIDBufferedToString(data.id)

        res.status(200).json(resultOK(data))

    } else if (req.method === "DELETE") {

        const { id } = req.query
        let result = null

        try {
            result = await prisma.Category.findUnique({ where: { id: convertUUIDStringToBuffered(id) } })
            if (!result) {
                res.status(404).json(resultError("Category not found"))
                return
            }
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        try {
            result = await prisma.Category.delete({ where: { id: convertUUIDStringToBuffered(id) } })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        res.status(200).json(resultOK())

    }

}