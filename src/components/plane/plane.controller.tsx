import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FederatedPointerEvent } from 'pixi.js';
import { toast } from 'react-toastify';
import { ReadyState } from 'react-use-websocket';
import planetToPlanetDTO from '../../utils/backend/convert-dtos';
import { ClientMessage, ClientMessageType } from '../../hooks/use-server/types';
import { OwnedPlanet } from '../planet/types';
import { User } from '../user/types';
import euqlidianDistance from '../../utils/geo/distance';
import generateRandomPointInCircle from '../../utils/random/rand-circle-pont';
import PixiContext from '../pixi/context/pixi.context';
import PlaneRenderer from './plane.renderer';
import { OwnedPlane } from './types';
import PlanePopup from './components/plane-popup';
import { ServerMessageType } from '../../shared/interfaces/message';

interface PlaneControlProps {
  planes: OwnedPlane[];
  planets: OwnedPlanet[];
  user: User;
  sendMessage: (msg: ClientMessage) => void;
  readyState: ReadyState;
  lastMessage: MessageEvent<any> | null;
}
export default function PlaneController({
  planes,
  planets,
  user,
  sendMessage,
  lastMessage,
  readyState,
}: PlaneControlProps) {
  const pixiApp = useContext(PixiContext);
  const [currentPlanet, setCurrentPlanet] = useState<OwnedPlanet | null>(null);
  const instructionsRef = useRef<Record<string, { x: number; y: number }>>({});

  const [selectedPlanes, setSelectedPlanes] = useState<OwnedPlane[]>([]);

  const planesOnClickedPlanet = useMemo(() => {
    return planes.filter((plane) => {
      if (
        !currentPlanet ||
        currentPlanet?.owner !== user.id ||
        plane.owner !== currentPlanet.owner
      )
        return false;
      return (
        euqlidianDistance(currentPlanet.position, plane.position) <
        currentPlanet.radius
      );
    });
  }, [planes, currentPlanet, user.id]);

  useEffect(() => {
    if (!pixiApp) return () => {};

    const handleStageClick = (e: FederatedPointerEvent) => {
      console.log('CLICKED');
      const clickedPlanet = planets.find((planet) => {
        return (
          euqlidianDistance(planet.position, { x: e.global.x, y: e.global.y }) <
          planet.radius
        );
      });
      console.log(
        'CLICKED',
        clickedPlanet,
        selectedPlanes.length && clickedPlanet
      );
      if (selectedPlanes.length && clickedPlanet) {
        selectedPlanes.forEach((plane) => {
          const clickedPlanetPoint = generateRandomPointInCircle(
            clickedPlanet.position,
            Math.floor(clickedPlanet.radius / 2)
          );
          instructionsRef.current[plane.id] = {
            x: clickedPlanetPoint.x,
            y: clickedPlanetPoint.y,
          };
        });

        if (!currentPlanet) return;

        sendMessage({
          type: ClientMessageType.SEND_PLANES,
          value: {
            destinationPlanet: planetToPlanetDTO(
              clickedPlanet,
              clickedPlanet.owner === user.id
            ),
            startPlanet: planetToPlanetDTO(
              currentPlanet,
              clickedPlanet.owner === user.id
            ),
            percentage: selectedPlanes.length / planesOnClickedPlanet.length,
          },
        });

        setSelectedPlanes([]);

        return;
      }

      if (!clickedPlanet) {
        setCurrentPlanet(null);
        return;
      }

      setCurrentPlanet(clickedPlanet);
    };

    pixiApp.stage.addEventListener('click', handleStageClick);

    return () => {
      pixiApp.stage.removeEventListener('click', handleStageClick);
    };
  }, [
    currentPlanet,
    pixiApp,
    planes,
    planesOnClickedPlanet.length,
    planets,
    selectedPlanes,
    sendMessage,
    user.id,
  ]);

  useEffect(() => {
    if (readyState && lastMessage) {
      const serverResponse = JSON.parse(lastMessage?.data);
      let msg_text = '';
      if (serverResponse.type === ServerMessageType.PLANES_START_FLIGHT) {
        const startx = Math.round(
          serverResponse.value.startFlightData.startPlanet.geometry.coordinates
            .x
        );
        const starty = Math.round(
          serverResponse.value.startFlightData.startPlanet.geometry.coordinates
            .y
        );
        const destx = Math.round(
          serverResponse.value.startFlightData.destinationPlanet.geometry
            .coordinates.x
        );
        const desty = Math.round(
          serverResponse.value.startFlightData.destinationPlanet.geometry
            .coordinates.y
        );
        msg_text = ` from planet (${startx}, ${starty}) to planet (${destx}, ${desty})`;
      } else if (
        serverResponse.type === ServerMessageType.PLANES_REACH_OWN_PLANET
      ) {
        const destx = Math.round(
          serverResponse.value.destinationPlanet.geometry.coordinates.x
        );
        const desty = Math.round(
          serverResponse.value.destinationPlanet.geometry.coordinates.y
        );
        msg_text = `  planet (${destx}, ${desty})`;
      }

      toast.info(serverResponse.type + msg_text);
    }
  }, [lastMessage, readyState]);

  return (
    <>
      <PlaneRenderer planes={planes} />
      {currentPlanet && !selectedPlanes.length ? (
        <PlanePopup
          position={currentPlanet.position}
          planes={planesOnClickedPlanet}
          setSelectedPlanes={setSelectedPlanes}
        />
      ) : undefined}
    </>
  );
}
