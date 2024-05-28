import { useCallback, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OwnedPlane } from 'components/plane/types';
import { v4 as uuid } from 'uuid';
import PlanetController from './components/planet/planet.controller';
import PlaneController from './components/plane/plane.controller';
import { OwnedPlanet } from './components/planet/types';
import { User } from './components/user/types';
import randRange from './utils/random/rand-range';
import randString from './utils/random/rand-string';
import generateRandomPointInCircle from './utils/random/rand-circle-pont';
import PixiContainer from './components/pixi/container';
import euqlidianDistance from './utils/geo/distance';
import { NEUTRAL_NAME, PLAYER_0_NAME, PLAYER_1_NAME } from './const';
import { ENEMY_PLANET_COLOR, ENEMY_PLANE_COLOR, NEUTRAL_PLANET_COLOR, PLAYER_PLANET_COLOR, PLAYER_PLANE_COLOR } from './const/colors';

export default function App() {
  const [planets, setPlanets] = useState<OwnedPlanet[]>([]);
  const [planes, setPlanes] = useState<OwnedPlane[]>([]);
  const [user, setUser] = useState<User>({id:'', is_admin :false});
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);
  const spawnIntervalRef = useRef<NodeJS.Timeout[]>([]);

  function getUser(): User {
    const id = randString([PLAYER_0_NAME, PLAYER_1_NAME]);
    return { id:id, is_admin: false };
  };  
  
  const addPlaneSpawn = useCallback((planet: OwnedPlanet) => {
    const maxPlanesOnPlanet = Math.floor(planet.radius * 1.5);

    spawnIntervalRef.current.push(
      setInterval(() => {
        setPlanes((old) => {
          const planesOnPlanet = old.filter(
            (plane) =>
              euqlidianDistance(plane.position, planet.position) < planet.radius
          );

          if (planesOnPlanet.length >= maxPlanesOnPlanet || !user.id) {
            return old;
          }
          return [
            ...old,
            {
              id: uuid(),
              position: generateRandomPointInCircle(planet.position, planet.radius),
              color: [PLAYER_PLANE_COLOR, ENEMY_PLANE_COLOR][planet.owner === user.id ? 0 : 1],
              owner: planet.owner,
            },
          ];
        });
      }, 200000 / planet.radius)
    );
  }, [user]);

  useEffect(() => {
    const new_user = getUser();
    setUser(new_user);
    const newPlanets: OwnedPlanet[] = [];

    for (let i = 0; i < 25; i++) {
      const type = Math.floor(randRange(0, 3));
      const owner = [PLAYER_0_NAME, PLAYER_1_NAME, NEUTRAL_NAME][type]
      let color = NEUTRAL_PLANET_COLOR
      if (owner != NEUTRAL_NAME){
        color = [PLAYER_PLANET_COLOR, ENEMY_PLANET_COLOR][owner === new_user.id ? 0 : 1]
      }
      const widthWindow = window.innerWidth;
      const heightWindow = window.innerHeight;
      const minRadius = 5
      const maxRadius = 40
      const planet: OwnedPlanet = {
        id: uuid(),
        position: {
          x: randRange(100, widthWindow - 3 * maxRadius),
          y: randRange(100, heightWindow - 3 * maxRadius),
        },
        color: color,
        owner: owner,
        radius: randRange(minRadius, maxRadius),
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
      if (planet.owner === NEUTRAL_NAME) return;

      newPlanes.push({
        id: uuid(),
        position: { x: planet.position.x, y: planet.position.y },
        color: [PLAYER_PLANE_COLOR, ENEMY_PLANE_COLOR][planet.owner === user.id ? 0 : 1],
        owner: planet.owner,
      });
      addPlaneSpawn(planet);
    });

    setPlanes((old) => old.concat(newPlanes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addPlaneSpawn, planets.length]);

  useEffect(() => {
    const isGameWon = (planets.every(p => p.owner == PLAYER_0_NAME)) || (planets.every(p => p.owner == PLAYER_1_NAME));
    if (isGameWon && planets && planets[0] && !isGameEnded){
      setIsGameEnded(true)
      if (planets[0].owner === user.id){
        toast.success('You won!', {
          position: "top-center"
        });
      }
      else{
        toast.error('You lost!', {
          position: "top-center"
        });
      }
      
    }
    planets.forEach((planet) => {
      if (planet.owner === NEUTRAL_NAME) return;

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

    if (!user.id) {
    return <div>Loading...</div>; 
  }

  return (
    <PixiContainer>
      <PlanetController
        planets={planets}
        planes={planes}
        user={user}
        setPlanets={setPlanets}
        setPlanes={setPlanes}
      />
      <PlaneController
        user={user}
        planes={planes}
        planets={planets}
        setPlanes={setPlanes}
      />
      <ToastContainer autoClose={false} />
    </PixiContainer>
  );
}
