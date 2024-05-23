export interface Plane {
  id: string;

  position: {
    x: number;
    y: number;
  };

  color: string;
}

export interface OwnedPlane extends Plane {
  owner: string;
}
