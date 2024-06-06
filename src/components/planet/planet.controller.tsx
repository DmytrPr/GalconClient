import { OwnedPlane } from 'components/plane/types';
import { User } from 'components/user/types';
import { useEffect, useRef } from 'react';
import euqlidianDistance from '../../utils/geo/distance';
import PlanetRenderer from './planets.renderer';
import { OwnedPlanet } from './types';
import { PLAYER_0_NAME, PLAYER_1_NAME } from '../../const';
import { ENEMY_PLANET_COLOR, PLAYER_PLANET_COLOR } from '../../const/colors';

interface PlanetControllerProps {
  planets: OwnedPlanet[];
}

export default function PlanetController({ planets }: PlanetControllerProps) {
  return <PlanetRenderer planets={planets} />;
}
