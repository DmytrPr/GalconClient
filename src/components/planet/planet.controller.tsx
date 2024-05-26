import { OwnedPlane } from 'components/plane/types';
import { useEffect, useRef } from 'react';
import euqlidianDistance from '../../utils/geo/distance';
import PlanetRenderer from './planets.renderer';
import { OwnedPlanet } from './types';

interface PlanetControllerProps {
  planets: OwnedPlanet[];
  planes: OwnedPlane[];

  setPlanets: React.Dispatch<React.SetStateAction<OwnedPlanet[]>>;
  setPlanes: React.Dispatch<React.SetStateAction<OwnedPlane[]>>;
}

export default function PlanetController({
  planets,
  planes,
  setPlanets,
  setPlanes,
}: PlanetControllerProps) {
  const battleDataRef = useRef<{
    planes: OwnedPlane[];
    planets: OwnedPlanet[];
  }>({ planes: [], planets: [] });

  useEffect(() => {
    battleDataRef.current.planes = planes;
    battleDataRef.current.planets = planets;
  }, [planes, planets]);

  useEffect(() => {
    const interval = setInterval(() => {
      let unusedPlanes = [...battleDataRef.current.planes];
      let alivePlanes: OwnedPlane[] = [];

      battleDataRef.current.planets.forEach((planet) => {
        const planesOnPlanet = unusedPlanes.filter((plane) => {
          return (
            euqlidianDistance(planet.position, plane.position) < planet.radius
          );
        });

        const player0Planes = planesOnPlanet.filter(
          (plane) => plane.owner === 'player0'
        );
        const player1Planes = planesOnPlanet.filter(
          (plane) => plane.owner === 'player1'
        );

        const outcome = player0Planes.length - player1Planes.length;

        if (outcome > 0) {
          alivePlanes = alivePlanes.concat(player0Planes.slice(0, outcome));

          setPlanets((old) => {
            const idx = old.findIndex((pl) => pl.id === planet.id);

            if (idx > -1) {
              const newPlanets = [...old];
              newPlanets[idx].owner = 'player0';
              newPlanets[idx].color = '#5050FF';

              return newPlanets;
            }

            return old;
          });
        }

        if (outcome < 0) {
          alivePlanes = alivePlanes.concat(player1Planes.slice(0, -outcome));

          setPlanets((old) => {
            const idx = old.findIndex((pl) => pl.id === planet.id);

            if (idx > -1) {
              const newPlanets = [...old];
              newPlanets[idx].owner = 'player1';
              newPlanets[idx].color = '#FF5050';

              return newPlanets;
            }

            return old;
          });
        }

        unusedPlanes = unusedPlanes.filter((plane) => {
          return (
            euqlidianDistance(planet.position, plane.position) > planet.radius
          );
        });
      });

      setPlanes(alivePlanes.concat(unusedPlanes));
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [setPlanes, setPlanets]);
  return <PlanetRenderer planets={planets} />;
}
