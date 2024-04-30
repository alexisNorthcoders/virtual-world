const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth;
carCanvas.height = window.innerHeight;
const miniMapCanvas = document.getElementById("miniMapCanvas");
miniMapCanvas.width = 300;
miniMapCanvas.height = 300;

const carCtx = carCanvas.getContext("2d");

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, 300);

const N = 100;
let cars = generateCars(1, "KEYS").concat(generateCars(N, "AI"));
const myCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.05);
    }
  }
}

let roadBorders = [];
const target = world.markings.find((m) => m instanceof Target);
if (target) {
  world.generateCorridor(myCar, target.center);
  roadBorders = world.corridor.borders.map((s) => [s.p1, s.p2]);
} else {
  roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(myCar.brain));
  console.log("bestBrain saved in localStorage");
}
function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N, type) {
  const startPoints = world.markings.filter((m) => m instanceof Start);
  const startPoint =
    startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);
  const dir =
    startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
  const startAngle = -angle(dir) + Math.PI / 2;

  const cars = [];
  for (let i = 1; i <= N; i++) {
    const color = type === "AI" ? getRandomColor() : "blue";
    const car = new Car(
      startPoint.x,
      startPoint.y,
      30,
      50,
      type,
      startAngle,
      3,
      color
    );
    car.load(carInfo);
    cars.push(car);
  }
  return cars;
}
let frameCount = 0

animate();
function updateCarProgress(car){
  if (!car.finishTime){
    car.progress = 0
    const carSeg = getNearestSegment(car, world.corridor.skeleton);
    for (let i = 0; i < world.corridor.skeleton.length; i++) {
      const s = world.corridor.skeleton[i];
      
      if (s.equals(carSeg)){
        const proj = s.projectPoint(car)
        proj.point.draw(carCtx)
        const firstPartOfSegment = new Segment(s.p1,proj.point)
        firstPartOfSegment.draw(carCtx, { color: "purple", width: 5 });
        car.progress += firstPartOfSegment.length()
        break
      }
      else{
        s.draw(carCtx, { color: "purple", width: 5 });
        car.progress += s.length()
      }
    }
    const totalDistance = world.corridor.skeleton.reduce((acc,s)=> acc + s.length(),0)
    car.progress /= totalDistance
    if (car.progress >= 1){
      car.progress = 1
      car.finishTime = frameCount
    }
    console.log(car.progress)
   }

}
function animate() {
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(roadBorders, []);
  }

  world.cars = cars;
  world.bestCar = myCar;

  viewport.offset.x = -myCar.x;
  viewport.offset.y = -myCar.y;

  viewport.reset();
  const viewPoint = scale(viewport.getOffset(), -1);

  world.draw(carCtx, viewPoint, false);
  miniMap.update(viewPoint);

  updateCarProgress(myCar)
  frameCount++
  requestAnimationFrame(animate);
}
