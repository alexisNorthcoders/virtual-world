class StopEditor {
  constructor(viewport, world) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.mouse = null
    this.intent = null
  }
  enable() {
    this.#addEventListeners();
  }
  disable() {
    this.#removeEventListeners();
  }
  #addEventListeners() {
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundContextMenu = (event) => event.preventDefault();
    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }
  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }
  #handleMouseMove(e) {
    this.mouse = this.viewport.getMouse(e, true);
    const segment = getNearestSegment(
      this.mouse,
      this.world.graph.segments,
      10 * this.viewport.zoom
    );
    if (segment){
        this.intent = segment
    }
    else {
        this.intent = null
    }
  }
  #handleMouseDown(){
    
  }
  display(){
    if (this.intent){
        this.intent.draw(this.ctx)
    }
  }
}
