import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { shapes } from './shapes';
import { useSpringValue } from '@react-spring/three'

interface Variant {
  textureUrl: string
  particleCount: number
  pointSize: string
  materialColor: THREE.Color
}

const defaultMacros: Variant = {
  textureUrl: '',
  particleCount: 400,
  pointSize: '400.0',
  materialColor: new THREE.Color(0x1225ff),
}

const variants: { [key: string]: Variant } = {
  var1: {
    ...defaultMacros,
    textureUrl: 'https://github.com/mrdoob/three.js/blob/master/examples/textures/waternormals.jpg?raw=true',
    particleCount: 400,
  },
  var2: {
    ...defaultMacros,
    textureUrl: 'https://github.com/mrdoob/three.js/blob/master/examples/textures/lensflare/lensflare0_alpha.png?raw=true',
    particleCount: 800,
    pointSize: '450.0',
  },
  var3: {
    ...defaultMacros,
    textureUrl: 'https://github.com/mrdoob/three.js/blob/master/examples/textures/opengameart/smoke1.png?raw=true',
    particleCount: 600,
    pointSize: '400.0',
    materialColor: new THREE.Color(0x2225ff),
  }
}

const VARIANT = variants.var2;

type AnimationState = 'normal' | 'alert' | 'communicating';
interface StateParams {
  speed: number;
  orbitRadius: number;
  baseOrbitSpeed: number;
  accelerationDuration: number;
  maxAcceleration: number;
}

interface ParticleAnimationProps {
  state?: AnimationState;
  shape?: keyof typeof shapes;
  width?: number;
  height?: number;
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({
  state = 'normal',
  shape = 'h',
  width = 500,
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.BufferGeometry | null>(null);
  const shapeRef = useRef<keyof typeof shapes>(shape);
  const animationLastTime = useRef(0);
  const _baseOrbitSpeed = useSpringValue(0.6, {
    config: {
      mass: 4,
      friction: 10,
      tension: 5,
    }
  })
  const _orbitRadius = useSpringValue(30, {
    config: {
      mass: 100,
      friction: 10,
      tension: 100
    }
  })

  const getStateParams = (state: AnimationState): StateParams => {
    switch (state) {
      case 'normal':
        return { speed: 0.5, orbitRadius: 20, baseOrbitSpeed: 1.0, accelerationDuration: 1000, maxAcceleration: 0.5 };
      case 'alert':
        return { speed: 0.5, orbitRadius: 40, baseOrbitSpeed: 3.0, accelerationDuration: 3000, maxAcceleration: 0.5 };
      case 'communicating':
        return { speed: 0.5, orbitRadius: 50, baseOrbitSpeed: 4.0, accelerationDuration: 2000, maxAcceleration: 0.8 };
    }
  };

  const sigmoid = (x: number): number => {
    return 1 / (1 + Math.exp(-x))
  }

  const createParticles = (count: number, width: number, height: number): THREE.BufferGeometry => {
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const targets = new Float32Array(count * 3);
    const orbitCenters = new Float32Array(count * 3);
    const orbitAngles = new Float32Array(count);
    const orbitRadii = new Float32Array(count);
    const accelerationStates = new Float32Array(count);
    const accelerationTimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const point = shapes[shapeRef.current](width, height);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;

      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.4, 0.5, 1.0 + Math.random() * 2.0);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 2;

      targets[i * 3] = point.x;
      targets[i * 3 + 1] = point.y;
      targets[i * 3 + 2] = point.z;

      orbitCenters[i * 3] = point.x;
      orbitCenters[i * 3 + 1] = point.y;
      orbitCenters[i * 3 + 2] = point.z;

      orbitAngles[i] = Math.random() * Math.PI * 2;
      orbitRadii[i] = Math.random() * 0.5 + 0.5; // Random radius between 0.5 and 1
      accelerationStates[i] = Math.random() * 2 - 1; // Random value between -1 and 1
      accelerationTimes[i] = Math.random() * 1000; // Random start time for acceleration
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute('target', new THREE.BufferAttribute(targets, 3));
    particles.setAttribute('orbitCenter', new THREE.BufferAttribute(orbitCenters, 3));
    particles.setAttribute('orbitAngle', new THREE.BufferAttribute(orbitAngles, 1));
    particles.setAttribute('orbitRadius', new THREE.BufferAttribute(orbitRadii, 1));
    particles.setAttribute('accelerationState', new THREE.BufferAttribute(accelerationStates, 1));
    particles.setAttribute('accelerationTime', new THREE.BufferAttribute(accelerationTimes, 1));

    return particles;
  };

  const updateParticleTargets = (particles: THREE.BufferGeometry, width: number, height: number): void => {
    const targets = particles.attributes.target.array as Float32Array;
    const count = targets.length / 3;

    for (let i = 0; i < count; i++) {
      const point = shapes[shapeRef.current](width, height);
      targets[i * 3] = point.x;
      targets[i * 3 + 1] = point.y;
      targets[i * 3 + 2] = point.z;
    }

    particles.attributes.target.needsUpdate = true;
    particles.attributes.orbitCenter.needsUpdate = true;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    console.log('ParticleAnimation mounted [reinit]');

    const scene = new THREE.Scene();
    const aspectRatio = width / height * 1.1;
    const camera = new THREE.PerspectiveCamera(145, aspectRatio, 0.06, 400);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // the default
    containerRef.current.appendChild(renderer.domElement);

    const { particleCount } = VARIANT;
    const particles = createParticles(particleCount, width, height);

    const customMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: VARIANT.materialColor },
        pointTexture: { value: new THREE.TextureLoader().load(VARIANT.textureUrl) },
        up: { value: new THREE.Vector3(1 * Math.random(), 1 * Math.random(), 1 * Math.random()) },
      },
      vertexShader: `
        attribute float orbitAngle;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAngle;
        void main() {
          vColor = color;
          vAngle = orbitAngle;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (${VARIANT.pointSize} / -mvPosition.z);
          gl_Position = projectionMatrix *  mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        varying float vAngle;
        void main() {
          gl_FragColor = vec4(color * 32.0 * vColor, vAngle * 1.8 / 3.14159265359);
          gl_FragColor = gl_FragColor * 1.0 * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    const pointCloud = new THREE.Points(particles, customMaterial);
    scene.add(pointCloud);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    particlesRef.current = particles;

    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [width, height]);

  useEffect(() => {
    let stopAnimation = false;
    const animate = (time: number): void => {
      if (!particlesRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      const deltaTime = time - animationLastTime.current;
      animationLastTime.current = time;
      _baseOrbitSpeed.advance(deltaTime);
      _orbitRadius.advance(deltaTime);

      const baseOrbitSpeed = _baseOrbitSpeed.get();
      const orbitRadius = _orbitRadius.get();
      const { speed, accelerationDuration, maxAcceleration } = getStateParams(state);

      const positions = particlesRef.current.attributes.position.array as Float32Array;
      const targets = particlesRef.current.attributes.target.array as Float32Array;
      const orbitCenters = particlesRef.current.attributes.orbitCenter.array as Float32Array;
      const orbitAngles = particlesRef.current.attributes.orbitAngle.array as Float32Array;
      const orbitRadii = particlesRef.current.attributes.orbitRadius.array as Float32Array;
      const accelerationStates = particlesRef.current.attributes.accelerationState.array as Float32Array;
      const accelerationTimes = particlesRef.current.attributes.accelerationTime.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        // Move towards target
        positions[i] += (targets[i] - positions[i]) * speed * 0.02;
        positions[i + 1] += (targets[i + 1] - positions[i + 1]) * speed * 0.02;
        positions[i + 2] += (targets[i + 2] - positions[i + 2]) * speed * 0.02;

        orbitCenters[i] += (targets[i] - orbitCenters[i]) * speed * 0.02;
        orbitCenters[i + 1] += (targets[i + 1] - orbitCenters[i + 1]) * speed * 0.02;
        orbitCenters[i + 2] += (targets[i + 2] - orbitCenters[i + 2]) * speed * 0.02;

        // Calculate acceleration
        const accelerationProgress = ((time + accelerationTimes[i / 3]) % accelerationDuration) / accelerationDuration;
        const accelerationFactor = 1.1; // sigmoid(accelerationStates[i / 3] * (accelerationProgress * 2 - 1) * 4) * 2 - 1;
        const currentSpeed = baseOrbitSpeed * (1 + accelerationFactor * (maxAcceleration - 1));

        // Orbital movement
        const currentRadius = orbitRadii[i / 3] * (orbitRadius * 2 / 3 + Math.sin(time * 0.0005) * orbitRadius / 3);
        const angleChange = currentSpeed * deltaTime * 0.001 * (currentRadius * 0.05); // Convert to seconds and apply speed
        orbitAngles[i / 3] = (orbitAngles[i / 3] + angleChange) % (Math.PI * 2);

        const orbitX = Math.cos(orbitAngles[i / 3]) * currentRadius;
        const orbitY = Math.sin(orbitAngles[i / 3]) * currentRadius;

        positions[i] = orbitCenters[i] + orbitX;
        positions[i + 1] = orbitCenters[i + 1] + orbitY;
      }

      particlesRef.current.attributes.position.needsUpdate = true;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      if (!stopAnimation) requestAnimationFrame(animate);
    };

    animate(animationLastTime.current);

    return () => {
      stopAnimation = true;
    }
  }, [state])

  useEffect(() => {
    const { baseOrbitSpeed, orbitRadius } = getStateParams(state);
    _baseOrbitSpeed.start(baseOrbitSpeed);
    _orbitRadius.start(orbitRadius);
  }, [state])

  useEffect(() => {
    if (shapeRef.current !== shape && particlesRef.current) {
      shapeRef.current = shape;
      updateParticleTargets(particlesRef.current, width, height);
    }
  }, [shape, width, height]);

  return (
    <div ref={containerRef} style={{ width: `${width}px`, height: `${height}px` }} />
  );
};

export default ParticleAnimation;
