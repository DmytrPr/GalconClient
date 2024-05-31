export default function generateRandomPointInCircle (
    center: { x: number; y: number },
    radius: number
  ) {
    const angle = Math.random() * 2 * Math.PI;
    const r = radius * Math.sqrt(Math.random());
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    return { x, y };
  };