export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type ShapeFunction = (width: number, height: number) => Point3D;

export interface Shapes {
  [key: string]: ShapeFunction;
}

export const shapes: Shapes = {
  h: (width: number, height: number): Point3D => {
    const lineWidth = width * 0.15;
    const gap = height * 0.2;
    const topY = height * 0.4;
    const bottomY = -height * 0.4;
    const middleY = 0;

    let x: number, y: number;
    do {
      x = (Math.random() - 0.5) * width * 0.7;
      y = (Math.random() - 0.5) * height * 0.85;
    } while (
      !(x >= -width * 0.3 && x <= -width * 0.3 + lineWidth && y >= bottomY && y <= topY) &&
      !(x >= width * 0.3 - lineWidth && x <= width * 0.3 && y >= bottomY && y <= topY) &&
      !(x >= -width * 0.3 && x <= width * 0.3 && y >= middleY - gap / 2 && y <= middleY + gap / 2)
    );

    return { x, y, z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
  },
  circle: (width: number, height: number): Point3D => {
    const angle = Math.random() * Math.PI * 2;
    const radiusX = width * 0.35;
    const radiusY = height * 0.425;
    return {
      x: Math.cos(angle) * radiusX,
      y: Math.sin(angle) * radiusY,
      z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1)
    };
  },
  triangle: (width: number, height: number): Point3D => {
    const side = Math.floor(Math.random() * 3);
    const t = Math.random();
    const scaleFactor = 0.8;
    const h = height * scaleFactor;
    const w = width * scaleFactor;
    switch (side) {
      case 0: return { x: w * (t - 0.5), y: -h / 3, z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
      case 1: return { x: w * (0.5 - t / 2), y: h * (t - 1 / 3), z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
      case 2: return { x: w * (-0.5 + t / 2), y: h * (t - 1 / 3), z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
      default: throw new Error("Invalid side");
    }
  },
  square: (width: number, height: number): Point3D => {
    const side = Math.floor(Math.random() * 4);
    const t = Math.random();
    const halfWidth = width * 0.35;
    const halfHeight = height * 0.425;
    switch (side) {
      case 0: return { x: -halfWidth + t * width * 0.7, y: -halfHeight, z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
      case 1: return { x: halfWidth, y: -halfHeight + t * height * 0.85, z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
      case 2: return { x: halfWidth - t * width * 0.7, y: halfHeight, z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
      case 3: return { x: -halfWidth, y: halfHeight - t * height * 0.85, z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1) };
      default: throw new Error("Invalid side");
    }
  },
  pentagon: (width: number, height: number): Point3D => {
    const angle = (Math.random() + Math.floor(Math.random() * 5)) * (Math.PI * 2 / 5);
    const radiusX = width * 0.35;
    const radiusY = height * 0.425;
    return {
      x: Math.cos(angle) * radiusX,
      y: Math.sin(angle) * radiusY,
      z: (Math.random() - 0.5) * (Math.min(width, height) * 0.1)
    };
  },
  bird: (width: number, height: number): Point3D => {
    const aspectRatio = width / height;
    const size = Math.min(width, height);
    const centerX = 0;
    const centerY = 0;

    // Define the bird's body parts with more pronounced shapes
    const parts = [
      {
        name: 'body', weight: 0.4, shape: (t: number) => ({
          x: (t - 0.5) * 0.6 * size * aspectRatio,
          y: Math.sin(t * Math.PI) * 0.1 * size
        })
      },
      {
        name: 'head', weight: 0.1, shape: (t: number) => ({
          x: 0.3 * size * aspectRatio,
          y: (Math.sin(t * Math.PI * 2) * 0.05 + 0.1) * size
        })
      },
      {
        name: 'beak', weight: 0.05, shape: (t: number) => ({
          x: (0.35 + t * 0.1) * size * aspectRatio,
          y: 0.1 * size
        })
      },
      {
        name: 'tail', weight: 0.15, shape: (t: number) => ({
          x: -0.35 * size * aspectRatio,
          y: (t - 0.5) * 0.2 * size
        })
      },
      {
        name: 'wing_up', weight: 0.15, shape: (t: number) => ({
          x: (t - 0.5) * 0.4 * size * aspectRatio,
          y: (Math.sin(t * Math.PI) * 0.3 + 0.1) * size
        })
      },
      {
        name: 'wing_down', weight: 0.15, shape: (t: number) => ({
          x: (t - 0.5) * 0.4 * size * aspectRatio,
          y: (-Math.sin(t * Math.PI) * 0.3 - 0.1) * size
        })
      }
    ];

    // Randomly select a part based on weights
    const random = Math.random();
    let cumulativeWeight = 0;
    const selectedPart = parts.find(part => {
      cumulativeWeight += part.weight;
      return random < cumulativeWeight;
    }) || parts[0];

    // Generate a point on the selected part
    const t = Math.random();
    const point = selectedPart.shape(t);

    // Add some randomness to make the shape less rigid
    const jitter = size * 0.01;
    const jitterX = (Math.random() - 0.5) * jitter;
    const jitterY = (Math.random() - 0.5) * jitter;

    return {
      x: centerX + point.x + jitterX,
      y: centerY + point.y + jitterY,
      z: (Math.random() - 0.5) * (size * 0.1)
    };
  },
};

