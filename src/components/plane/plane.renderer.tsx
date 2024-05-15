import { useContext, useEffect, useRef } from 'react';
import { Graphics, Point, Ticker } from 'pixi.js';
import PixiContext from '../pixi/context/pixi.context';
import { Plane } from './types';

interface PlaneRenderProps {
  planes: Plane[];
}

export default function PlaneRenderer({ planes }: PlaneRenderProps) {
  const pixiApp = useContext(PixiContext);
  const planesRef = useRef<Graphics[]>([]);

  useEffect(() => {
    if (!pixiApp) {
      return () => {};
    }

    const ref = planesRef.current;

    planes.forEach((plane) => {
      const planeGraphic = new Graphics()
        .poly([
          { x: 0, y: 5 },
          { x: -5, y: 0 },
          { x: 5, y: 0 },
        ])
        .fill({ color: plane.color });

      planeGraphic.x = plane.position.x;
      planeGraphic.y = plane.position.y;
      pixiApp.stage.addEventListener('click', (e) => {
        const flyPlane = (ticker: Ticker) => {
          planeGraphic.position.x +=
            ((e.client.x - planeGraphic.position.x) * ticker.deltaTime) / 100;
          planeGraphic.position.y +=
            ((e.client.y - planeGraphic.position.y) * ticker.deltaTime) / 100;
          if (
            Math.abs(planeGraphic.position.x - e.client.x) +
              Math.abs(planeGraphic.position.y - e.client.y) <
            5
          ) {
            pixiApp.ticker.remove(flyPlane);
          }
        };
        console.log('Here', planeGraphic.position);
        pixiApp.ticker.add(flyPlane);
      });

      pixiApp.stage.addChild(planeGraphic);
      ref.push(planeGraphic);
    });

    return () => {
      ref.forEach((graphic) => {
        pixiApp.stage.removeChild(graphic);
      });
      planesRef.current = [];
    };
  }, [pixiApp, planes]);

  return null;
}
