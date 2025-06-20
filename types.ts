
export enum LayoutType {
  Grid = 'grid', // Négyzetrács
  Strip = 'strip' // Fotócsík
}

export enum FilterType {
  Original = 'original',
  BlackAndWhite = 'bw', // Fekete-fehér
  Sepia = 'sepia',
  Vintage = 'vintage'
}

export interface Photo {
  id: string;
  src: string; // dataURL
}

export interface CapturedPhoto {
  dataUrl: string;
}

