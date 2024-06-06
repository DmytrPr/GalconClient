import { Coordinates, Planet } from './planet';

export const PLANE_VELOCITY = 1; // units per millisecond, so: 5 units per second

export type StartFlightResponse = {
  startPlanet: Planet; // with updated quantity of planes
  destinationPlanet: Planet;
  numberOfPlanesToFly: number;
  startCoordinates: Coordinates; // startPlanet
  destinationCoordinates: Coordinates; // destinationPlanet
  time: number; // in milliseconds
  distance: number;
  velocity: number;
};

export type DistanceBetweenTwoPoints = {
  point1: Coordinates;
  point2: Coordinates;
  distance: number;
};
