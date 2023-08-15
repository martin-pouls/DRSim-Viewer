# DRSim-Viewer
This is a viewer for the companion project [DRSim](https://github.com/martin-pouls/DRSim). 

## Getting Started
This project was built using [Next.js](https://nextjs.org/), [Mantine](https://mantine.dev/), [Leaflet](https://leafletjs.com/), and [Chart.js](https://www.chartjs.org/). To get started, first install the dependencies with [pnpm](https://pnpm.io/) or another tool of your choice:

```bash
pnpm i
```

Then run the development server:
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the viewer.

## Running with Docker
You can also run the viewer with Docker as follows:
```bash
docker build -t drsim-viewer .
docker run -p 3000:3000 drsim-viewer
```
The viewer should now be available under [http://localhost:3000](http://localhost:3000).

## Using the viewer
The viewer supports two main functionalities:
- Replays of simulation runs
- Charts visualizing aggregated statistics

### Replay view
Select `Replay` from the main menu and load the four necessary files: `vehicleMovementReplay.csv`, `requestReplay.csv`, `simulation.json` and `vehicleStatesReplay.csv`. The file formats are described in the main project [DRSim](https://github.com/martin-pouls/DRSim). A small example may be found in the `example/replay/` folder of this project.

The replay visualizes vehicle movements on a map and displays an accompanying log of occuring events. Vehicles are rendered according to their current state: idle (blue), active (green) and repositioning (orange).

![Import process](https://i.imgur.com/DAccDWT.gif)
![Simulation replay](https://i.imgur.com/V5rDl16.gif)

### Charts view 
Select `Charts` from the main menu and load `simulationStats.json`. The file format is described in the main project [DRSim](https://github.com/martin-pouls/DRSim). A small example may be found in the `example/stats/` folder of this project.

The charts illustrate the following statistics:
- Vehicle utilization over time (stacked line chart)
- Trip request acceptance rate (doughnut chart)
- Trip request waiting times, ride rimes and delays (histograms)

![Charts view](https://i.imgur.com/REvYcDF.png)


