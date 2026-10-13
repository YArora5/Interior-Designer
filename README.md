# Interactive 3D Interior Designer

A React + Three.js prototype for arranging simplified furniture models inside a 3D room. The main experience is implemented with React Three Fiber and Drei.

## Current features

- 3D room view with orbit controls and zoom
- Simplified furniture primitives such as sofas, chairs, tables, beds, doors, windows, and shelves
- Furniture selection and in-scene movement
- Colour/scale/rotation controls and optional measurement labels where supported by the current UI
- Room lighting, sky, shadows, and grid visualization

## Tech stack

- React 19
- Vite
- Three.js
- `@react-three/fiber` and `@react-three/drei`

## Run locally

```bash
npm install
npm run dev
```

Production build and lint commands are available as `npm run build` and `npm run lint`. Run both before sharing a release; they have not been verified as part of this documentation update.

## Important limitations

- The current app keeps room/furniture state in memory; there is no project save/load or backend persistence yet.
- The main experience is concentrated in `src/App.jsx`, while `src/components/RoomCanvas.jsx` and related furniture components represent a second/older implementation path. Consolidate the duplicate approaches before adding more features.
- Pointer-drag behaviour and layout boundaries need testing across mouse/touch devices; furniture can be dragged beyond the room, and pointer release handling should be verified.
- Furniture meshes are simplified placeholders rather than dimensionally accurate manufacturer models.
- There is no automated test suite or CI workflow currently documented.

## Next steps

1. Add save/load using versioned JSON and local storage or a backend.
2. Constrain furniture to room bounds and add collision/overlap checks.
3. Add keyboard-accessible selection and movement controls.
4. Split the main scene into focused components and add unit/interaction tests.
5. Add real screenshots or a short screen recording of the running application.

**Status: prototype in active development.** Do not describe it as a production-grade interior-design tool until save/load, bounds validation, accessibility, and test coverage are implemented.
