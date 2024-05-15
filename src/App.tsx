import PlaneRenderer from './components/plane/plane.renderer';
import PlanetRenderer from './components/planet/planets.renderer';
import PixiContainer from './components/pixi/container';

export default function App() {
  return (
    <PixiContainer>
      <PlanetRenderer
        planets={[
          { position: { x: 100, y: 100 }, radius: 100, color: '#00FF00' },
          { position: { x: 1000, y: 900 }, radius: 80, color: '#FF0000' },
        ]}
      />
      <PlaneRenderer
        planes={[
          { position: { x: 200, y: 200 }, color: '#0000FF' },
          { position: { x: 250, y: 200 }, color: '#0000FF' },
          { position: { x: 300, y: 200 }, color: '#0000FF' },
          { position: { x: 150, y: 200 }, color: '#0000FF' },
        ]}
      />
    </PixiContainer>
  );
}
