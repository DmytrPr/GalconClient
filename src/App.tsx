import { useCallback, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OwnedPlane } from 'components/plane/types';
import { v4 as uuid } from 'uuid';
import PlanetController from './components/planet/planet.controller';
import PlaneController from './components/plane/plane.controller';
import { OwnedPlanet } from './components/planet/types';
import randRange from './utils/random/rand-range';
import generateRandomPointInCircle from './utils/random/rand-circle-pont';
import PixiContainer from './components/pixi/container';
import euqlidianDistance from './utils/geo/distance';

export default function App() {
  const [planets, setPlanets] = useState<OwnedPlanet[]>([]);
  const [planes, setPlanes] = useState<OwnedPlane[]>([]);
  const spawnIntervalRef = useRef<NodeJS.Timeout[]>([]);

  const addPlaneSpawn = useCallback((planet: OwnedPlanet) => {
    const maxPlanesOnPlanet = Math.floor(planet.radius * 1.5);

    spawnIntervalRef.current.push(
      setInterval(() => {
        setPlanes((old) => {
          const planesOnPlanet = old.filter(
            (plane) =>
              euqlidianDistance(plane.position, planet.position) < planet.radius
          );

          if (planesOnPlanet.length >= maxPlanesOnPlanet) {
            return old;
          }
          return [
            ...old,
            {
              id: uuid(),
              position: generateRandomPointInCircle(planet.position, planet.radius),
              color: ['#0000FF', '#FF0000'][planet.owner === 'player0' ? 0 : 1],
              owner: planet.owner,
            },
          ];
        });
      }, 200000 / planet.radius)
    );
  }, []);

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

    return () => {
      setPlanes([]);
      setPlanets([]);
    };
  }, []);

  useEffect(() => {
    const newPlanes: OwnedPlane[] = [];

    planets.forEach((planet) => {
      if (planet.owner === 'neutral') return;

      newPlanes.push({
        id: uuid(),
        position: { x: planet.position.x, y: planet.position.y },
        color: ['#0000FF', '#FF0000'][planet.owner === 'player0' ? 0 : 1],
        owner: planet.owner,
      });
      addPlaneSpawn(planet);
    });

    setPlanes((old) => old.concat(newPlanes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addPlaneSpawn, planets.length]);

  useEffect(() => {
    const isGameWon = (planets.every(p => p.owner == 'player0')) || (planets.every(p => p.owner == 'player1'));
    if (isGameWon && planets && planets[0]){
      toast.success(`${planets[0].owner} won!`, {
        position: "top-center"
      });
    }
    planets.forEach((planet) => {
      if (planet.owner === 'neutral') return;

      addPlaneSpawn(planet);
    });

    const intervalRef = spawnIntervalRef.current;

    return () => {
      intervalRef.forEach((planeSpawnInterval) =>
        clearInterval(planeSpawnInterval)
      );

      spawnIntervalRef.current = [];
    };
  }, [addPlaneSpawn, planets]);

  return (
    <PixiContainer>
      <PlanetController
        planets={planets}
        planes={planes}
        setPlanets={setPlanets}
        setPlanes={setPlanes}
      />
      <PlaneController
        planes={planes}
        planets={planets}
        setPlanes={setPlanes}
      />
      <ToastContainer autoClose={false} />
    </PixiContainer>
  );
}
