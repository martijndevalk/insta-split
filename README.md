# InstaSplit Pro

Een verfijnde layout editor voor het ontwerpen en splitten van aaneengesloten Instagram carrousels.

## ✨ Kenmerken

- **Astro & React**: Het beste van twee werelden voor snelle performance.
- **Component-based Design**: Netjes opgeknipt in gefocuste React-componenten en CSS-modules met vanilla CSS.
- **Geen Tailwind**: Volledig gestijld met CSS-modules en op maat gemaakte Design Tokens.
- **Geavanceerde Instellingen**: Formaat, slices, gap, en zij-marge zijn real-time in te stellen.
- **Yarn**: Dependency management via Yarn (configuratie overgezet vanaf NPM).
- **Client-Side Export**: Slides genereren gebeurt lokaal in de browser op hoge kwaliteit.

## 🚀 Aan de slag

### 1. Installeren
Zorg ervoor dat dependencies correct worden geïnstalleerd via **yarn** (npm in dit project is vervangen wegens package management constraints):

```bash
yarn install
```

### 2. Ontwikkelen
Start de lokale ontwikkelserver:

```bash
yarn run dev
```

Je editor is bereikbaar via `http://localhost:4321/whitelabel`.
*Let op: de base URL in `astro.config.mjs` is nog ingesteld op `/whitelabel`*.

### 3. Bouwen & Productie
Bouw bestanden voor productie:

```bash
yarn run build
```

De output wordt weggeschreven in de `dist/` folder.

## Structuur

De React componenten zijn te vinden in `src/components/`, verdeeld in logische subsecties (`Sidebar` & `CanvasArea`). De basisstijl met CSS tokens is te vinden in `global.css` onder `styles/`.
