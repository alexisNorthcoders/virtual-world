const Osm = {
    parseRoads: (data) =>{
        const nodes = data.elements.filter((n)=> n.type === "node")
        
        const lats = nodes.map(node => node.lat)
        const longs = nodes.map(node => node.lon)

        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const minLon = Math.min(...longs)
        const maxLon = Math.max(...longs)

        const deltaLat = maxLat - minLat
        const deltaLon = maxLon - minLon
        const aspectRatio = deltaLon / deltaLat
        const height = deltaLat * 111000 * 10 
        const width = height * aspectRatio * Math.cos(degreeToRadius(maxLat))



        const points = []
        const segments = []
        for (const node of nodes){
            const y = invLerp(maxLat,minLat,node.lat) * height
            const x = invLerp(minLon,maxLon,node.lon) * width
            const point = new Point(x,y)
            point.id = node.id
            points.push(point)
        }

        const ways = data.elements.filter(w => w.type === "way")
        for (const way of ways){
            const ids = way.nodes
            for (let i=1; i< ids.length;i++){
                const previous = points.find((p)=> p.id === ids[i-1])
                const current = points.find((p)=> p.id === ids[i])
                segments.push(new Segment(previous,current))
            }
        }

        return {points,segments}
    }
}