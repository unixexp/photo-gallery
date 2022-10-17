import { parse as uuidParse } from "uuid";
import { PrismaClient } from "@prisma/client";

function main() {

    const prisma = new PrismaClient()

    const categories = [
        { id: Buffer.from(uuidParse("755d2eda-77ec-4456-9d0f-f6597ea8dda1")), name: "Category 1" },
        { id: Buffer.from(uuidParse("5d03f72c-489c-4bcc-8b9f-d3e54e1a5e4a")), name: "Category 2" }
    ]

    let result = null;
    categories.map(async (cat) => {
        try {
            result = await prisma.Category.create({ data: cat })
        } catch (e) {
            console.log("----- Create error -----")
            console.log(e)
        } finally {
            console.log("----- Created -----")
            console.log(result)
        }
    })

    prisma.$disconnect()

}

main()