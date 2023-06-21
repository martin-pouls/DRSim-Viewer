# DRSim-Viewer
The is a viewer for the companion project [DRSim](https://github.com/martin-pouls/DRSim). It can replay a simulation scenario and visualize vehicle movements on a map. Vehicles are rendered according to their current state: idle (blue), active (green) and repositioning (orange).

![Simulation replay](https://i.imgur.com/CVY0XLV.gif)

## Getting Started
This project was built using [Next.js](https://nextjs.org/), [Mantine](https://mantine.dev/), and [Leaflet](https://leafletjs.com/). To get started, first install the dependencies with [pnpm](https://pnpm.io/) or another tool of your choice:

```bash
pnpm i
```

Then run the development server:
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the viewer.

## Using the viewer
To load a simulation replay, select the four necessary files: `movementLog.csv`, `requestLog.csv`, `simulationLog.json` and `vehicleStatesLog.csv`. The file formats are described in the main project [DRSim](https://github.com/martin-pouls/DRSim). A small example may be found in the `example/` folder of this project.

![Import process](https://i.imgur.com/3r7xI0B.gif)

