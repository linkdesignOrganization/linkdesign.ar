declare module 'vanta/dist/vanta.globe.min' {
  export interface VantaEffectInstance {
    destroy(): void;
    resize(): void;
    setOptions?(options: Partial<VantaGlobeOptions>): void;
  }

  export interface VantaGlobeOptions {
    el: HTMLElement;
    THREE: typeof import('three');
    backgroundAlpha?: number;
    backgroundColor?: number;
    color?: number;
    color2?: number;
    gyroControls?: boolean;
    maxDistance?: number;
    minHeight?: number;
    minWidth?: number;
    mouseControls?: boolean;
    points?: number;
    scale?: number;
    scaleMobile?: number;
    showDots?: boolean;
    size?: number;
    spacing?: number;
    touchControls?: boolean;
  }

  export default function GLOBE(options: VantaGlobeOptions): VantaEffectInstance | null;
}
