import { useContext, useEffect, useRef } from 'react';
import { Graphics, Point, Ticker } from 'pixi.js';
import PixiContext from '../pixi/context/pixi.context';
import { Plane } from './types';

interface PlaneRenderProps {
  planes: Plane[];
}

export default function PlaneRenderer({ planes }: PlaneRenderProps) {
  const pixiApp = useContext(PixiContext);
  const planesRef = useRef<Record<string, Graphics>>({});
  const currentPlaneIdRef = useRef<string | null>(null);
  const instructionsRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    if (!pixiApp) {
      return () => {};
    }

    const ref = planesRef.current;

    planes.forEach((plane, idx) => {
      const planeGraphic = new Graphics()
        .poly([
          { x: 0, y: 5 },
          { x: -5, y: 0 },
          { x: 5, y: 0 },
        ])
        .fill({ color: plane.color });

      planeGraphic.x = plane.position.x;
      planeGraphic.y = plane.position.y;

      planeGraphic.label = idx.toString();
      planeGraphic.interactive = true;
      planeGraphic.addEventListener('click', () => {
        currentPlaneIdRef.current = planeGraphic.label;
      });

      pixiApp.stage.addChild(planeGraphic);
      ref[planeGraphic.label] = planeGraphic;
    });

    pixiApp.stage.addEventListener('click', (e) => {
      if (!currentPlaneIdRef.current) return;
      console.log(
        planesRef.current[currentPlaneIdRef.current].containsPoint(
          new Point(e.x, e.y)
        )
      );
      if (
        planesRef.current[currentPlaneIdRef.current].containsPoint(
          new Point(e.x, e.y)
        )
      ) {
        return;
      }
      instructionsRef.current[currentPlaneIdRef.current] = { x: e.x, y: e.y };
    });

    pixiApp.ticker.add((ticker) => {
      Object.entries(instructionsRef.current).forEach(([planeId, point]) => {
        if (!planesRef.current) return;

        const plane = planesRef.current[planeId];

        plane.position.x +=
          (point.x - plane.position.x) / ticker.deltaTime / 100;
        plane.position.y +=
          (point.y - plane.position.y) / ticker.deltaTime / 100;
      });
    });

    return () => {
      Object.values(ref).forEach((graphic) => {
        pixiApp.stage.removeChild(graphic);
      });
      planesRef.current = {};
    };
  }, [pixiApp, planes]);

  return null;
}
