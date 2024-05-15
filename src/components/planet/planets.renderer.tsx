import { useContext, useEffect, useRef } from 'react';
import { Graphics } from 'pixi.js';
import PixiContext from '../pixi/context/pixi.context';
import { Planet } from './types';

interface PlanetRenderProps {
  planets: Planet[];
}

export default function PlanetRenderer({ planets }: PlanetRenderProps) {
  const pixiApp = useContext(PixiContext);
  const planetsRef = useRef<Graphics[]>([]);

  useEffect(() => {
    if (!pixiApp) {
      return () => {};
    }

    const ref = planetsRef.current;

    planets.forEach((planet) => {
      const planetGraphic = new Graphics()
        .circle(planet.position.x, planet.position.y, planet.radius)
        .fill({ color: planet.color });

      pixiApp.stage.addChild(planetGraphic);
      ref.push(planetGraphic);
    });

    return () => {
      ref.forEach((graphic) => {
        pixiApp.stage.removeChild(graphic);
      });
      planetsRef.current = [];
    };
  }, [pixiApp, planets]);

  return null;
}
