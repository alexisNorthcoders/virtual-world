const Osm = {
  parseRoads: (data) => {
    const nodes = data.elements.filter((n) => n.type === "node");

    const lats = nodes.map((node) => node.lat);
    const longs = nodes.map((node) => node.lon);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...longs);
    const maxLon = Math.max(...longs);

    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;
    const aspectRatio = deltaLon / deltaLat;
    const height = deltaLat * 111000 * 10;
    const width = height * aspectRatio * Math.cos(degreeToRadius(maxLat));

    const points = [];
    const segments = [];
    for (const node of nodes) {
      const y = invLerp(maxLat, minLat, node.lat) * height;
      const x = invLerp(minLon, maxLon, node.lon) * width;
      const point = new Point(x, y);
      point.id = node.id;
      points.push(point);
    }

    const ways = data.elements.filter((w) => w.type === "way");
    for (const way of ways) {
      const ids = way.nodes;
      for (let i = 1; i < ids.length; i++) {
        const previous = points.find((p) => p.id === ids[i - 1]);
        const current = points.find((p) => p.id === ids[i]);
        let oneWay = false;
        if (way.tags && (way.tags.oneway || way.tags.lanes === 1)) {
          oneWay = way.tags.oneway || way.tags.lanes === 1;
        }
        segments.push(new Segment(previous, current, oneWay));
      }
    }

    return { points, segments };
  },
  parseBuildings: (data, minLat, maxLat, minLon, maxLon) => {
    const nodes = data.elements.filter((n) => n.type == "node");

    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;
    const ar = deltaLon / deltaLat;
    const height = deltaLat * 111000 * 10;
    const width = height * ar * Math.cos(degToRad(maxLat));

    const points = [];
    const segments = [];
    for (const node of nodes) {
       const y = invLerp(maxLat, minLat, node.lat) * height;
       const x = invLerp(minLon, maxLon, node.lon) * width;
       const point = new Point(x, y);
       point.id = node.id;
       points.push(point);
    }

    const ways = data.elements.filter((w) => w.type == "way");
    const buildings = [];
    for (const way of ways) {
       const ids = way.nodes;
       const polyPoints = [];
       for (let i = 0; i < ids.length; i++) {
          const cur = points.find((p) => p.id == ids[i]);
          polyPoints.push(cur);
       }
       const b = new Building(new Polygon(polyPoints));
       b.id = way.id;
       buildings.push(b);
    }

    return buildings;
 },
 parseWaters: (data, minLat, maxLat, minLon, maxLon) => {
    const nodes = data.elements.filter((n) => n.type == "node");

    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;
    const ar = deltaLon / deltaLat;
    const height = deltaLat * 111000 * 10;
    const width = height * ar * Math.cos(degToRad(maxLat));

    const points = [];
    const polys = [];
    for (const node of nodes) {
       const y = invLerp(maxLat, minLat, node.lat) * height;
       const x = invLerp(minLon, maxLon, node.lon) * width;
       const point = new Point(x, y);
       point.id = node.id;
       points.push(point);
    }

    const ways = data.elements.filter((w) => w.type == "way");
    for (const way of ways) {
       const ids = way.nodes;
       const polyPoints = [];
       for (let i = 0; i < ids.length; i++) {
          const cur = points.find((p) => p.id == ids[i]);
          polyPoints.push(cur);
       }
       const poly = new Polygon(polyPoints);
       poly.id = way.id;
       polys.push(poly);
    }

    return new Water(polys);
 },
 parseLights: (data, minLat, maxLat, minLon, maxLon) => {
    const nodes = data.elements.filter((n) => n.type == "node");

    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;
    const ar = deltaLon / deltaLat;
    const height = deltaLat * 111000 * 10;
    const width = height * ar * Math.cos(degToRad(maxLat));

    const points = [];
    for (const node of nodes) {
       const y = invLerp(maxLat, minLat, node.lat) * height;
       const x = invLerp(minLon, maxLon, node.lon) * width;
       const point = new Point(x, y);
       point.id = node.id;
       points.push(point);
    }

    return points.map(
       (p) => new Light(p, new Point(0, 1), world.roadWidth / 2)
    );
 },
 parseCrossings: (data, minLat, maxLat, minLon, maxLon) => {
    const nodes = data.elements.filter((n) => n.type == "node");

    const deltaLat = maxLat - minLat;
    const deltaLon = maxLon - minLon;
    const ar = deltaLon / deltaLat;
    const height = deltaLat * 111000 * 10;
    const width = height * ar * Math.cos(degToRad(maxLat));

    const points = [];
    for (const node of nodes) {
       const y = invLerp(maxLat, minLat, node.lat) * height;
       const x = invLerp(minLon, maxLon, node.lon) * width;
       const point = new Point(x, y);
       point.id = node.id;
       points.push(point);
    }

    return points.map((p) => {
       const segs = world.graph.getSegmentsWithPoint(p);
       let dir = new Point(0, 1);
       if (segs.length == 2) {
          dir = normalize(subtract(segs[0].p1, segs[1].p2));
       }
       return new Crossing(p, dir, world.roadWidth,world.roadWidth/2);
    });
 },
};
