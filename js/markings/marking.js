class Marking {
  constructor(center, directionVector, width, height) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2)
    );
    this.poly = new Envelope(this.support, width, 0).poly;
    this.type = "marking";
  }
  static load(info) {
    const point = new Point(info.center.x, info.center.y);
    const dir = new Point(info.directionVector.x, info.directionVector.y);
    const params = [ point,dir,info.width,info.height]

    switch (info.type) {
      case "crossing":
        return new Crossing(...params);
      case "parking":
        return new Parking(...params);
      case "light":
        return new Light(...params);
      case "yield":
        return new Yield(...params);
      case "start":
        return new Start(...params);
      case "target":
        return new Target(...params);
      case "stop":
        return new Stop(...params);
    }
  }
  draw(ctx) {
    this.poly.draw(ctx);
  }
}
