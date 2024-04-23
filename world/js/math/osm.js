const Osm = {
    parseRoads: (data) =>{
        const nodes = data.elements.filter((n)=> n.type === "node")
        console.log(nodes)
    }
}