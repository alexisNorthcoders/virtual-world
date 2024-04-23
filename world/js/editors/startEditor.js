class StartEditor extends MarkingEditor{
  constructor(viewport, world) {
    super(viewport,world,world.laneGuides)
  
  }

  createMarking(center,directionVector){
    return new Start(
      center,
      directionVector,
      world.roadWidth*0.5,
      world.roadWidth*0.5
    )
  }
  
}
