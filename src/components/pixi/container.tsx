import { Application } from 'pixi.js';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { PIXI_CONTAINER_ID } from '../../const';
import PixiContext from './context/pixi.context';

const PIXI_APP = new Application();

export default function PixiContainer({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReadyRef = useRef(false);
  const [app, setApp] = useState<Application<any> | null>(null);

  useEffect(() => {
    const ref = containerRef.current;
    console.log(isReadyRef.current);
    if (isReadyRef.current) return;

    (async () => {
      try {
        isReadyRef.current = true;

        await PIXI_APP.init({ resizeTo: window });

        PIXI_APP.stage.eventMode = 'static';
        PIXI_APP.stage.hitArea = PIXI_APP.screen;
        // PIXI_APP.stage.hitArea = new Rectangle(
        //   0,
        //   0,
        //   PIXI_APP.stage.width,
        //   PIXI_APP.stage.height
        // );

        ref?.appendChild(PIXI_APP.canvas);

        setApp(PIXI_APP);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <>
      <div id={PIXI_CONTAINER_ID} ref={containerRef} />
      <PixiContext.Provider value={app}>{children}</PixiContext.Provider>
    </>
  );
}
