class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext("2d");

    this.selected = null;
    this.hovered = null;
    this.dragging = false;

    this.#addEventListeners();
  }
  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      if (event.button === 2) {
        if (this.hovered) {
          this.#removePoint(this.hovered);
        }
        else{
            this.selected = null
        }
      }
      if (event.button === 0) {
        const mouse = new Point(event.offsetX, event.offsetY);
        if (this.hovered) {
           this.#select(this.hovered)
          this.dragging = true;
          return;
        }
        this.graph.addPoint(mouse);
        this.#select(mouse)
        this.hovered = mouse;
      }
    });

    this.canvas.addEventListener("mousemove", (event) => {
      const mouse = new Point(event.offsetX, event.offsetY);
      this.hovered = getNearestPoint(mouse, this.graph.points, 10);
      if (this.dragging === true) {
        this.selected.x = mouse.x;
        this.selected.y = mouse.y;
      }
    });
    this.canvas.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
  }
  #select(point){
    if (this.selected){
        this.graph.tryAddSegment(new Segment(this.selected,point))
    }
    this.selected = point
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      this.selected.draw(this.ctx, { outline: true });
    }
  }
  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }
}
