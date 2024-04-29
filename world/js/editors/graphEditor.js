class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext("2d");

    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;
  }
  enable() {
    this.#addEventListeners();
  }
  disable() {
    this.#removeEventListeners();
    this.selected = false;
    this.hovered = false;
  }
  #handleMouseDown(event) {
    if (event.button === 2) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.#removePoint(this.hovered);
      }
    }
    if (event.button === 0) {
      if (this.hovered) {
        this.#select(this.hovered);
        this.dragging = true;
        return;
      }
      this.graph.addPoint(this.mouse);
      this.#select(this.mouse);
      this.hovered = this.mouse;
    }
  }
  #handleMouseMove(e) {
    this.mouse = this.viewport.getMouse(e, true);
    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      10 * this.viewport.zoom
    );
    if (this.dragging === true) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }
  #addEventListeners() {
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundMouseUp = () => (this.dragging = false);
    this.boundContextMenu = (event) => event.preventDefault();
    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("mouseup", this.boundMouseUp);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);

    window.addEventListener("keydown", (e) => {
      if (this.hovered) {
        if (e.key === "s") {
          this.start = this.hovered;
        }
      }
    });
    window.addEventListener("keydown", (e) => {
      if (this.hovered) {
        if (e.key === "e") {
          this.end = this.hovered;
        }
      }
    });
  }
  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("mouseup", this.boundMouseUp);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }
  #select(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
  }
  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      const intent = this.hovered ? this.hovered : this.mouse;
      new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
      this.selected.draw(this.ctx, { outline: true });
    }
    if (this.start && this.end) {
      const path = this.graph.getShortestPath(this.start, this.end);
      for (const point of path) {
        point.draw(this.ctx, { size: 50, color: "blue" });
        if (point.prev) {
          new Segment(point, point.prev).draw(this.ctx, { width: 20 });
        }
      }
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
