interface SimplePoint {
  x: number;
  y: number;
}

export default function euqlidianDistance(a: SimplePoint, b: SimplePoint) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
