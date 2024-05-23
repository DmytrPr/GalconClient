import { useEffect, useRef, useState } from 'react';
import { OwnedPlane } from 'components/plane/types';
import { v4 as uuid } from 'uuid';
import PlanetController from './components/planet/planet.controller';
import PlaneController from './components/plane/plane.controller';
import { OwnedPlanet } from './components/planet/types';
import randRange from './utils/random/rand-range';
import PixiContainer from './components/pixi/container';

export default function App() {
  const [planets, setPlanets] = useState<OwnedPlanet[]>([]);
  const [planes, setPlanes] = useState<OwnedPlane[]>([]);
  const spawnIntervalRef = useRef<NodeJS.Timeout[]>([]);
  useEffect(() => {
    const newPlanets: OwnedPlanet[] = [];

    for (let i = 0; i < 25; i++) {
      const type = Math.floor(randRange(0, 3));
      const planet: OwnedPlanet = {
        id: uuid(),
        position: {
          x: randRange(100, 1000),
          y: randRange(100, 1000),
        },
        color: ['#5050FF', '#FF5050', '#505050'][type],
        owner: ['player0', 'player1', 'neutral'][type],
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

    const newPlanes: OwnedPlane[] = [];

    newPlanets.forEach((planet) => {
      if (planet.owner === 'neutral') return;
      newPlanes.push({
        id: uuid(),
        position: { x: planet.position.x, y: planet.position.y },
        color: ['#0000FF', '#FF0000'][planet.owner === 'player0' ? 0 : 1],
        owner: planet.owner,
      });

      spawnIntervalRef.current.push(
        setInterval(() => {
          setPlanes((old) => [
            ...old,
            {
              id: uuid(),
              position: {
                x: planet.position.x + randRange(-planet.radius, planet.radius),
                y: planet.position.y + randRange(-planet.radius, planet.radius),
              },
              color: ['#0000FF', '#FF0000'][planet.owner === 'player0' ? 0 : 1],
              owner: planet.owner,
            },
          ]);
        }, 250000 / planet.radius)
      );
    });

    setPlanes(newPlanes);

    const intervalRef = spawnIntervalRef.current;

    return () => {
      setPlanes([]);
      setPlanets([]);

      intervalRef.forEach((planeSpawnInterval) =>
        clearInterval(planeSpawnInterval)
      );
      spawnIntervalRef.current = [];
    };
  }, [planets.length]);

  return (
    <PixiContainer>
      <PlanetController
        planets={planets}
        planes={planes}
        setPlanets={setPlanets}
        setPlanes={setPlanes}
      />
      <PlaneController planes={planes} setPlanes={setPlanes} />
    </PixiContainer>
  );
}
