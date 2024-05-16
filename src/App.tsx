import { useEffect, useState } from 'react';
import randHEXColor from './utils/random/rand-color';
import { Planet } from './components/planet/types';
import randRange from './utils/random/rand-range';
import PlaneRenderer from './components/plane/plane.renderer';
import PlanetRenderer from './components/planet/planets.renderer';
import PixiContainer from './components/pixi/container';

export default function App() {
  const [planets, setPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    if (planets.length) {
      return;
    }
    const newPlanets: Planet[] = [];

    for (let i = 0; i < 50; i++) {
      const planet: Planet = {
        position: {
          x: randRange(100, 1000),
          y: randRange(100, 1000),
        },
        color: randHEXColor(),
        radius: randRange(5, 40),
      };

      if (
        !newPlanets.find((existingPlanet) => {
          return (
            Math.sqrt(
              (existingPlanet.position.x - planet.position.x) ** 2 +
                (existingPlanet.position.y - planet.position.y) ** 2
            ) <
            existingPlanet.radius + planet.radius
          );
        })
      ) {
        newPlanets.push(planet);
      }
    }
    setPlanets(newPlanets);
  }, [planets.length]);

  return (
    <PixiContainer>
      <PlanetRenderer planets={planets} />
      <PlaneRenderer
        planes={[
          { position: { x: 200, y: 200 }, color: '#0000FF' },
          { position: { x: 250, y: 200 }, color: '#0000FF' },
          { position: { x: 300, y: 200 }, color: '#0000FF' },
          { position: { x: 150, y: 200 }, color: '#0000FF' },
        ]}
      />
    </PixiContainer>
  );
}
