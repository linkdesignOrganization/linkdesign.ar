export interface ResponsiveMediaSource {
  src: string;
  srcset?: string;
  sizes?: string;
  width: number;
  height: number;
  type?: string;
}

export interface ResponsiveImageAsset {
  fallback: ResponsiveMediaSource;
  webp?: ResponsiveMediaSource;
}

interface BuildResponsiveImageAssetOptions {
  basePath: string;
  fallbackExt: 'jpg' | 'jpeg' | 'png' | 'svg';
  width: number;
  height: number;
  sizes?: string;
  widths?: number[];
  includeWebp?: boolean;
}

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp'
};

function buildSrcset(basePath: string, ext: string, widths?: number[]): string | undefined {
  if (!widths || widths.length === 0) {
    return undefined;
  }

  return widths
    .map((width) => `${basePath}-${width}w.${ext} ${width}w`)
    .join(', ');
}

export function buildResponsiveImageAsset({
  basePath,
  fallbackExt,
  width,
  height,
  sizes,
  widths,
  includeWebp = fallbackExt !== 'svg'
}: BuildResponsiveImageAssetOptions): ResponsiveImageAsset {
  const fallback: ResponsiveMediaSource = {
    src: `${basePath}.${fallbackExt}`,
    srcset: buildSrcset(basePath, fallbackExt, widths),
    sizes,
    width,
    height,
    type: MIME_BY_EXT[fallbackExt]
  };

  if (!includeWebp) {
    return { fallback };
  }

  return {
    fallback,
    webp: {
      src: `${basePath}.webp`,
      srcset: buildSrcset(basePath, 'webp', widths),
      sizes,
      width,
      height,
      type: MIME_BY_EXT['webp']
    }
  };
}
