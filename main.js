const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth - 330;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const N = 1;
let cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, brainMutation / 100);
    }
  }
}
const traffic = [];
const roadBorders = []


function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  console.log("bestBrain saved in localStorage");
}
function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N, speed = 5) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(100, 100, 30, 50, "KEYS", speed));
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
  bestCar = cars.find((car) => car.y === Math.min(...cars.map((car) => car.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}
