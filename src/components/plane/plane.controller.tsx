import { useContext, useEffect, useRef, useState } from 'react';
import { FederatedPointerEvent } from 'pixi.js';
import randRange from 'utils/random/rand-range';
import { OwnedPlanet } from '../planet/types';
import euqlidianDistance from '../../utils/geo/distance';
import PixiContext from '../pixi/context/pixi.context';
import PlaneRenderer from './plane.renderer';
import { OwnedPlane } from './types';
import PlanePopup from './components/plane-popup';

interface PlaneControlProps {
  planes: OwnedPlane[];
  planets: OwnedPlanet[];
  setPlanes: React.Dispatch<React.SetStateAction<OwnedPlane[]>>;
}
export default function PlaneController({
  planes,
  planets,
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
          euqlidianDistance(planet.position, { x: e.x, y: e.y }) < planet.radius
        );
      });

      if (selectedPlanes.length) {
        selectedPlanes.forEach((plane) => {
          instructionsRef.current[plane.id] = {
            x: e.x,
            y: e.y,
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

            if (Math.sqrt(diffX * diffX + diffY * diffY) < 10) {
              delete instructionsRef.current[plane.id];
            }

            return {
              ...plane,
              position: {
                x: plane.position.x + diffX / 20,
                y: plane.position.y + diffY / 20,
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
