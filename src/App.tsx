import { useCallback, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuid } from 'uuid';
import { ReadyState } from 'react-use-websocket';
import { OwnedPlane } from './components/plane/types';
import useServer from './hooks/use-server/use-server';
import PlanetController from './components/planet/planet.controller';
import PlaneController from './components/plane/plane.controller';
import { OwnedPlanet } from './components/planet/types';
import { User } from './components/user/types';
import randRange from './utils/random/rand-range';
import randString from './utils/random/rand-string';
import generateRandomPointInCircle from './utils/random/rand-circle-pont';
import PixiContainer from './components/pixi/container';
import euqlidianDistance from './utils/geo/distance';
import {
  NEUTRAL_NAME,
  PLAYER_0_NAME,
  PLAYER_1_NAME,
  SCALE_MULTIPLIER,
} from './const';
import {
  ENEMY_PLANET_COLOR,
  ENEMY_PLANE_COLOR,
  NEUTRAL_PLANET_COLOR,
  PLAYER_PLANET_COLOR,
  PLAYER_PLANE_COLOR,
} from './const/colors';

export default function App() {
  const [planets, setPlanets] = useState<OwnedPlanet[]>([]);
  const [planes, setPlanes] = useState<OwnedPlane[]>([]);
  const [user, setUser] = useState<User>({ id: '' });
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);
  const spawnIntervalRef = useRef<NodeJS.Timeout[]>([]);

  const { sendMessage, lastMessage, readyState } = useServer();

  useEffect(() => {
    if (!lastMessage?.data || readyState !== ReadyState.OPEN) return;

    const parsedData = JSON.parse(lastMessage.data);
    console.log(parsedData);
    switch (parsedData.type) {
      case 'PLAYER_JOINED':
        setUser({
          id: parsedData.value.player.id,
        });
        break;
      case 'GAME_START_COUNTDOWN':
      case 'REGULAR_GENERATED_PLANES_UPDATE':
        setPlanets(
          parsedData.value.gameMap.planets.map((planet: any) => {
            const ownedColor = planet.owner === 1 ? '#0000FF' : '#FF0000';
            return {
              id: planet.id,
              position: {
                x: planet.geometry.coordinates.x * SCALE_MULTIPLIER,
                y: planet.geometry.coordinates.y * SCALE_MULTIPLIER,
              },
              radius: planet.geometry.radius * SCALE_MULTIPLIER,
              owner: planet.owner,
              color: planet.owner !== 'neutral' ? ownedColor : '#505050',
            };
          })
        );

        console.log(
          parsedData.value.gameMap.planets.map((planet: any) => {
            const ownedColor = planet.owner === 1 ? '#0000FF' : '#FF0000';
            return {
              id: planet.id,
              position: {
                x: planet.geometry.coordinates.x * SCALE_MULTIPLIER,
                y: planet.geometry.coordinates.y * SCALE_MULTIPLIER,
              },
              radius: planet.geometry.radius * SCALE_MULTIPLIER,
              owner: planet.owner,
              color: planet.owner !== 'neutral' ? ownedColor : '#505050',
            };
          })
        );

        setPlanes(
          parsedData.value.gameMap.planets
            .map((planet: any) => {
              if (!planet.numberOfPlanes || planet.owner === 'neutral')
                return [];
              return [...Array(planet.numberOfPlanes)].map(() => {
                const ownedColor = planet.owner === 1 ? '#0000FF' : '#FF0000';
                const planePosition = generateRandomPointInCircle(
                  {
                    x: planet.geometry.coordinates.x * SCALE_MULTIPLIER,
                    y: planet.geometry.coordinates.y * SCALE_MULTIPLIER,
                  },
                  planet.geometry.radius * SCALE_MULTIPLIER
                );

                return {
                  color: ownedColor,
                  id: uuid(),
                  owner: planet.owner,
                  position: planePosition,
                } as OwnedPlane;
              });
            })
            .flat()
        );
        break;
      default:
        console.error('Unknown message type');
    }
  }, [lastMessage?.data, readyState]);

  if (!user.id) {
    return <div>Loading...</div>;
  }

  return (
    <PixiContainer>
      <PlanetController planets={planets} />
      <PlaneController
        user={user}
        planes={planes}
        planets={planets}
        lastMessage={lastMessage}
        readyState={readyState}
        sendMessage={sendMessage}
      />
      <ToastContainer autoClose={false} />
    </PixiContainer>
  );
}
