import { OwnedPlanet } from 'components/planet/types';
import { SCALE_MULTIPLIER } from '../../const';

export default function planetToPlanetDTO(
  planet: OwnedPlanet,
  isOwned: boolean
) {
  return {
    id: planet.id,
    numberOfPlanes: 1,
    geometry: {
      radius: planet.radius / SCALE_MULTIPLIER,
      coordinates: {
        x: planet.position.x / SCALE_MULTIPLIER,
        y: planet.position.y / SCALE_MULTIPLIER,
      },
    },
    owner: isOwned ? ('player1' as const) : ('player2' as const),
    size: 'medium' as const,
  };
}
