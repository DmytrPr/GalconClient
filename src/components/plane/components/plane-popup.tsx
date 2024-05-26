import { MutableRefObject, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { OwnedPlane } from '../types';

interface PlanePopupProps {
  position: { x: number; y: number };
  planes: OwnedPlane[];
  setSelectedPlanes: (planes: OwnedPlane[]) => void;
}

export default function PlanePopup({
  planes,
  position,
  setSelectedPlanes,
}: PlanePopupProps) {
  const [amount, setAmount] = useState(0);

  const selectPlanes = useCallback(() => {
    setSelectedPlanes(planes.slice(0, amount));
  }, [amount, planes, setSelectedPlanes]);

  if (!planes.length) return null;

  return createPortal(
    <div
      style={{
        top: position.y - 20,
        left: position.x,
        position: 'absolute',
      }}
    >
      <div
        style={{
          display: 'flex',
          background: '#00F0F0',
          padding: '10px',
        }}
      >
        <input
          type="number"
          step={1}
          max={planes.length}
          min={1}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={selectPlanes} type="button">
          Select
        </button>
      </div>
    </div>,
    document.getElementById('root')!
  );
}
