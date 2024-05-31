export enum ClientMessageType {
  SEND_PLANES = 'SEND_PLANES',
}

export type PlanetOwner = 'player1' | 'player2' | 'neutral';
export type PlanetSize = 'large' | 'small' | 'medium';
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

export type ClientMessage = {
  type: ClientMessageType;
  value: {
    startPlanet?: Planet;
    destinationPlanet?: Planet;
    percentage?: number;
  };
};
