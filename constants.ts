
import { LayoutType, FilterType } from './types';

export const APP_NAME = "The Photobooth Experience";
export const APP_DESCRIPTION = "Egy digitális fotóautomata, ami a te zsebedben is elfér. Minőség, stílus és egyszerűség, egy helyen.";

export const LAYOUT_OPTIONS = [
  { id: LayoutType.Grid, name: "Négyzetrács", iconKey: 'grid' },
  { id: LayoutType.Strip, name: "Fotócsík", iconKey: 'strip' },
];

export const COUNTDOWN_VALUES = [3, 5, 10]; // seconds

export const FILTER_OPTIONS = [
  { id: FilterType.Original, name: "Eredeti", className: "" },
  { id: FilterType.BlackAndWhite, name: "Fekete-fehér", className: "filter grayscale" },
  { id: FilterType.Sepia, name: "Szépia", className: "filter sepia" },
  { id: FilterType.Vintage, name: "Vintage", className: "filter vintage" }, // Ensure 'vintage' is defined in tailwind.config
];

export const PHOTOS_PER_SESSION = 4; // All layouts take 4 photos

// Example placeholder images from the original HTML
export const PLACEHOLDER_PORTRAITS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
];

// Models not used, but included to satisfy prompt boilerplate
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002';

