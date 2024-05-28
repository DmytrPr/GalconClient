import { useContext, useEffect, useRef, useState } from 'react';
import { FederatedPointerEvent } from 'pixi.js';
import { OwnedPlanet } from '../planet/types';
import { User } from '../user/types';
import euqlidianDistance from '../../utils/geo/distance';
import generateRandomPointInCircle from '../../utils/random/rand-circle-pont';
import PixiContext from '../pixi/context/pixi.context';
import PlaneRenderer from './plane.renderer';
import { OwnedPlane } from './types';
import PlanePopup from './components/plane-popup';


interface PlaneControlProps {
  planes: OwnedPlane[];
  planets: OwnedPlanet[];
  user: User;
  setPlanes: React.Dispatch<React.SetStateAction<OwnedPlane[]>>;
}
export default function PlaneController({
  planes,
  planets,
  user,
  setPlanes,
}: PlaneControlProps) {
  const pixiApp = useContext(PixiContext);
  const currentPlanetRef = useRef<OwnedPlanet | null>(null);
  const instructionsRef = useRef<Record<string, { x: number; y: number }>>({});

  const [selectedPlanes, setSelectedPlanes] = useState<OwnedPlane[]>([]);

  useEffect(() => {
    if (!pixiApp) return () => {};

    const handleStageClick = (e: FederatedPointerEvent) => {
      const clickedPlanet = planets.find((planet) => {
        return (
          euqlidianDistance(planet.position, { x: e.global.x, y: e.global.y }) < planet.radius
        );
      });
      if (selectedPlanes.length && clickedPlanet) {
        selectedPlanes.forEach((plane) => {
          const clickedPlanetPoint = generateRandomPointInCircle(clickedPlanet.position, Math.floor(clickedPlanet.radius/2))
          instructionsRef.current[plane.id] = {
            x: clickedPlanetPoint.x,
            y: clickedPlanetPoint.y,
          };
        });

        setSelectedPlanes([]);

        return;
      }

      if (!clickedPlanet) {
        currentPlanetRef.current = null;
        return;
      }

      currentPlanetRef.current = clickedPlanet;
    };

    pixiApp.stage.addEventListener('click', handleStageClick);

    const interval = setInterval(() => {
      setPlanes((old) => {
        return old.map((plane) => {
          if (instructionsRef.current[plane.id]) {
            const diffX =
              instructionsRef.current[plane.id].x - plane.position.x;
            const diffY =
              instructionsRef.current[plane.id].y - plane.position.y;
            
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);
            const speed = 5; 
            
            if (distance < speed) {
              delete instructionsRef.current[plane.id];
            }
            
            const velocity = {
              x: (diffX / distance) * speed,
              y: (diffY / distance) * speed,
            };
            return {
              ...plane,
              position: {
                x: plane.position.x + velocity.x,
                y: plane.position.y + velocity.y,
              },
            };
          }

          return plane;
        });
      });
    }, 50);

    return () => {
      pixiApp.stage.removeEventListener('click', handleStageClick);
      clearInterval(interval);
    };
  }, [pixiApp, planes, planets, selectedPlanes, setPlanes]);

  return (
    <>
      <PlaneRenderer planes={planes} />
      {currentPlanetRef.current && !selectedPlanes.length ? (
        <PlanePopup
          position={currentPlanetRef.current.position}
          planes={planes.filter((plane) => {
            if (
              !currentPlanetRef.current ||
              (currentPlanetRef.current.owner !== user.id && !user.is_admin) ||
              plane.owner !== currentPlanetRef.current.owner
            )
              return false;
            return (
              euqlidianDistance(
                currentPlanetRef.current.position,
                plane.position
              ) < currentPlanetRef.current.radius
            );
          })}
          setSelectedPlanes={setSelectedPlanes}
        />
      ) : undefined}
    </>
  );
}
