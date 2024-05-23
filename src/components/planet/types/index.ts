export interface Planet {
  id: string;

  position: {
    x: number;
    y: number;
  };
  radius: number;

  color: string;
}

export interface OwnedPlanet extends Planet {
  owner: string;
}
