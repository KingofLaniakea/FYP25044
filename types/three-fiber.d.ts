import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      directionalLight: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      cylinderGeometry: any;
      sphereGeometry: any;
      boxGeometry: any;
      planeGeometry: any;
      torusGeometry: any;
    }
  }
}

export {};
