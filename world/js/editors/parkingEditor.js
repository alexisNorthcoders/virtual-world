class ParkingEditor extends MarkingEditor{
  constructor(viewport, world) {
    super(viewport,world,world.laneGuides)
  
  }

  createMarking(center,directionVector){
    return new Parking(
      center,
      directionVector,
      world.roadWidth*0.5,
      world.roadWidth*0.5
    )
  }
  
}
