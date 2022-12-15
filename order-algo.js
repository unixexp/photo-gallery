const db = {
    links: [
        {
            id: "A",
            order: 15
        },
        {
            id: "B",
            order: 5
        },
        {
            id: "C",
            order: 65
        },
        {
            id: "E",
            order: 34
        },
        {
            id: "D",
            order: 23
        }
    ]
}

const move = (id, order, links) => {

    if (order < 1)
        order = 1

    let n = 1
    const linksWithoutCurrent = (links.filter(item => item.id != id).sort((a, b) => a.order - b.order))
    const linksOrdered = []
    for (let link of linksWithoutCurrent) {
        if (n == order)
            n++
        link.order = n
        n++
        linksOrdered.push(link)
    }

    const currentLink = (links.filter(item => item.id == id))[0]
    currentLink.order = order > n ? n : order
    linksOrdered.push(currentLink)
    linksOrdered.sort((a, b) => a.order - b.order)

    return {linksOrdered}

}

const result = move("C", 2, db.links)
console.log(result)