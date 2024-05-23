import { Application } from 'pixi.js';
import { ReactNode, memo, useEffect, useRef, useState } from 'react';
import { PIXI_CONTAINER_ID } from '../../const';
import PixiContext from './context/pixi.context';

const PIXI_APP = new Application();

function PixiContainer({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReadyRef = useRef(false);
  const [app, setApp] = useState<Application<any> | null>(null);

  useEffect(() => {
    const ref = containerRef.current;

    if (isReadyRef.current) return;

    (async () => {
      try {
        isReadyRef.current = true;

        await PIXI_APP.init({ resizeTo: window });

        PIXI_APP.stage.eventMode = 'static';
        PIXI_APP.stage.hitArea = PIXI_APP.screen;

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

export default memo(PixiContainer);
