import { memo, useContext, useEffect, useRef } from 'react';
import { Graphics } from 'pixi.js';
import PixiContext from '../pixi/context/pixi.context';
import { Plane } from './types';

interface PlaneRenderProps {
  planes: Plane[];
}

function PlaneRenderer({ planes }: PlaneRenderProps) {
  const pixiApp = useContext(PixiContext);
  const planesRef = useRef<Record<string, Graphics>>({});

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

      planeGraphic.label = plane.id;

      pixiApp.stage.addChild(planeGraphic);
      ref[planeGraphic.label] = planeGraphic;
    });

    return () => {
      Object.values(ref).forEach((graphic) => {
        pixiApp.stage.removeChild(graphic);
      });
    };
  }, [pixiApp, planes]);

  return null;
}

export default memo(PlaneRenderer);
