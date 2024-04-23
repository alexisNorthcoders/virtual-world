class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }
  static load(info){
    const points = info.points.map((point)=> new Point(point.x,point.y))
    const segments = info.segments.map((segment)=>new Segment(
      points.find((p)=> p.equals(segment.p1)),
      points.find((p)=> p.equals(segment.p2))
))
    return new Graph(points,segments)

  }
  hash(){
    return JSON.stringify(this)
  }
  addPoint(point) {
    this.points.push(point);
  }
  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }
  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }

  draw(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx);
    }
    for (const point of this.points) {
      point.draw(ctx);
    }
  }
  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  addSegment(seg) {
    this.segments.push(seg);
  }
  containsSegment(seg) {
    return this.segments.find((s) => s.equals(seg));
  }
  getSegmentsWithPoint(point) {
    const segs = [];
    for (const seg of this.segments) {
      if (seg.includes(point)) {
        segs.push(seg);
      }
    }
    return segs;
  }
  tryAddSegment(seg) {
    if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
      this.addSegment(seg);
      return true;
    }
    return false;
  }
  removeSegment(seg) {
    this.segments.splice(this.segments.indexOf(seg), 1);
  }
  removePoint(point) {
    const segs = this.getSegmentsWithPoint(point);
    for (const seg of segs) {
      this.removeSegment(seg);
    }
    this.points.splice(this.points.indexOf(point), 1);
  }
}