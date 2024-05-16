export type PlanetOwner = "player1" | "player2" | "neutral";
export type PlanetSize = "large" | "small" | "medium";
export type Coordinates = {
  x: number;
  y: number;
};

export type PlanetGeometry = {
  coordinates: Coordinates;
  radius: number;
};

export type Planet = {
  id: string;
  owner: PlanetOwner;
  size: PlanetSize;
  numberOfPlanes: number;
  geometry: PlanetGeometry;
};

export const playerPlanetSizeOrder: PlanetSize[] = [
  "large",
  "medium",
  "medium",
  "small",
  "small",
];

export const neutralPlanetSizeOrder: PlanetSize[] = [
  ...playerPlanetSizeOrder,
  ...playerPlanetSizeOrder,
];

export const PlanetRadiusMap: Record<PlanetSize, number> = {
  large: 2,
  medium: 1,
  small: 0.5,
};

export const minimumNumberOfPlanes = 1;
export const maximumNumberOfPlanes = 50;
