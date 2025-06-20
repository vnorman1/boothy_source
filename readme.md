# Boothy

Ez egy modern, TypeScript-alapú fotófülke webapp, amelyet Vite és React technológiák segítségével fejlesztettünk. A projekt célja egy interaktív, reszponzív fotófülke alkalmazás létrehozása, amely különböző elrendezéseket és testreszabható funkciókat kínál.

## Mappastruktúra

```
/
├── components/          # React komponensek
│   ├── CameraView.tsx   # Kamera nézet megjelenítése
│   ├── Darkroom_gif.tsx # Sötét szoba animációk
│   ├── DarkroomSection.tsx # Sötét szoba szekció
│   ├── FooterSection.tsx # Lábjegyzet szekció
│   ├── GallerySection.tsx # Galéria szekció
│   ├── HeroSection.tsx  # Fő szekció (Hero)
│   ├── StudioSection.tsx # Fotófülke szekció
│   ├── icons.tsx        # Ikonok gyűjteménye
│   ├── nav-side.tsx     # Oldalsó navigáció
├── public/              # Nyilvános statikus fájlok
│   ├── favicon_boothy.png # Favicon
│   ├── gif.worker.js    # GIF generálás worker
│   ├── manifest.webmanifest.json # Webalkalmazás manifest
│   ├── robots.txt       # SEO és keresőrobotok beállításai
│   ├── service-worker.js # Service worker
│   ├── shutter.mp3      # Kamera hang
│   ├── sitemap.xml      # Webhely térkép
├── App.tsx              # Fő alkalmazás komponens
├── constants.ts         # Állandó értékek (pl. visszaszámláló, elrendezések)
├── global.css           # Globális stílusok
├── index.html           # Alap HTML fájl
├── index.tsx            # Belépési pont a React alkalmazáshoz
├── package.json         # Projekt függőségei és parancsai
├── tsconfig.json        # TypeScript konfiguráció
├── types.ts             # Típusdefiníciók
├── vite.config.ts       # Vite konfiguráció
```

## Hogyan működik?

### Fő komponensek
- **App.tsx**: Az alkalmazás belépési pontja, amely összefogja a különböző szekciókat.
- **StudioSection.tsx**: A fotófülke szekció, amely tartalmazza a kamera nézetet, vezérlőket és a galériát.
- **CameraView.tsx**: A kamera stream megjelenítése és fotózás kezelése.
- **GallerySection.tsx**: Az elkészült képek megjelenítése.

### Állandók és típusok
- **constants.ts**: Visszaszámláló értékek, elrendezési opciók és egyéb állandók.
- **types.ts**: TypeScript típusok, például a LayoutType.

### Statikus fájlok
- **public/**: Olyan fájlok, amelyek közvetlenül elérhetők a böngészőből, például a kamera hang (`shutter.mp3`) és a service worker.

## Fejlesztési lépések

1. Telepítsd a függőségeket:

```bash
npm install
```

2. Indítsd el a fejlesztői szervert:

```bash
npm run dev
```

A fejlesztői szerver elérhető lesz a [http://localhost:5173](http://localhost:5173) címen.
