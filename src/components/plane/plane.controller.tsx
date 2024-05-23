import { useContext, useEffect, useRef } from 'react';
import { FederatedPointerEvent } from 'pixi.js';
import PixiContext from '../pixi/context/pixi.context';
import PlaneRenderer from './plane.renderer';
import { OwnedPlane } from './types';
import { PLANE_CLICK_RANGE } from './const';

interface PlaneControlProps {
  planes: OwnedPlane[];
  setPlanes: React.Dispatch<React.SetStateAction<OwnedPlane[]>>;
}
export default function PlaneController({
  planes,
  setPlanes,
}: PlaneControlProps) {
  const pixiApp = useContext(PixiContext);
  const currentPlaneIdRef = useRef<string | null>(null);
  const instructionsRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    if (!pixiApp) return () => {};

    const handleStageClick = (e: FederatedPointerEvent) => {
      if (currentPlaneIdRef.current) {
        instructionsRef.current[currentPlaneIdRef.current] = { x: e.x, y: e.y };
        currentPlaneIdRef.current = null;
        return;
      }

      const { plane } = planes.reduce(
        (acc, pln) => {
          const dist = Math.sqrt(
            (pln.position.x - e.x) ** 2 + (pln.position.y - e.y) ** 2
          );
          if (dist > PLANE_CLICK_RANGE) {
            return acc;
          }
          if (!acc.plane || acc.bestDist > dist) {
            acc.plane = pln;
            acc.bestDist = dist;
          }

          return acc;
        },
        { plane: null, bestDist: Number.MAX_VALUE } as {
          plane: OwnedPlane | null;
          bestDist: number;
        }
      );

      currentPlaneIdRef.current = plane?.id ?? null;
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
  }, [pixiApp, planes, setPlanes]);

  return <PlaneRenderer planes={planes} />;
}
