const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth - 330;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const worldString = localStorage.getItem("world");
const worldInfo = worldString ? JSON.parse(worldString) : null;
const world = worldInfo ? World.load(worldInfo) : new World(new Graph());

const viewport = new Viewport(carCanvas, world.zoom, world.offset);

const N = 1;
let cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}
const traffic = [];
const roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  console.log("bestBrain saved in localStorage");
}
function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N, speed = 5) {
  const startPoints = world.markings.filter((m) => m instanceof Start);
  const startPoint =
    startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);
  const startDirection =
    startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
  const startAngle = -angle(startDirection) + Math.PI / 2;
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(
      new Car(startPoint.x, startPoint.y, 30, 50, "AI", startAngle, speed)
    );
  }

  return cars;
}
animate();
function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(roadBorders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(roadBorders, traffic);
  }
  bestCar = cars.find((car) => car.fitness === Math.max(...cars.map((car) => car.fitness)));

  world.cars = cars;
  world.bestCar = bestCar;

  viewport.offset.x = -bestCar.x;
  viewport.offset.y = -bestCar.y;

  viewport.reset();
  const viewPoint = scale(viewport.getOffset(), -1);

  world.draw(carCtx, viewPoint, false);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  networkCtx.lineDashOffset = -time / 50;
  networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}