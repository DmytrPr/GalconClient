import { OwnedPlanet } from 'components/planet/types';

export default function planetToPlanetDTO(
  planet: OwnedPlanet,
  isOwned: boolean
) {
  return {
    id: planet.id,
    numberOfPlanes: 1,
    geometry: {
      radius: planet.radius,
      coordinates: planet.position,
    },
    owner: isOwned ? ('player1' as const) : ('player2' as const),
    size: 'medium' as const,
  };
}
