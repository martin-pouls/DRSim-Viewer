import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    ArcElement,
    CategoryScale,
    Filler,
    Legend,
    Tooltip, InteractionAxis, ChartDataset, ChartOptions
} from 'chart.js';
import {InteractionMode} from "chart.js/dist/types";
import dayjs from "dayjs";
import {useMantineColorScheme} from "@mantine/core";
import {colorTableauBlue, colorTableauGreen, colorTableauOrange} from './constants';
import {getFontColor} from "@/components/charts/utils";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, ArcElement, CategoryScale, Filler, Legend, Tooltip);

export type VehicleUtilizationChartProps = {
    stats: any;
}

export default function VehicleUtilizationChart({stats}: VehicleUtilizationChartProps) {
    const datasetNames = ["Active", "Idle", "Repositioning"];
    const datasetColors = [colorTableauGreen, colorTableauBlue, colorTableauOrange];
    const { colorScheme, } = useMantineColorScheme();
    const totalVehicles = stats["vehicleStats"]["totalVehicles"];

    const getDataByName = (name: string) => {
        if (name === "Active") {
            return stats["vehicleStats"]["activeCounts"];
        } else if (name === "Idle") {
            return stats["vehicleStats"]["idleCounts"];
        } else if (name === "Repositioning") {
            return stats["vehicleStats"]["repositioningCounts"];
        }
        throw Error("Invalid dataset name.")
    }

    const datasets: Array<ChartDataset<"line">> = [];
    for (let i = 0; i < datasetNames.length; i++) {
        datasets.push( {
            label: datasetNames[i],
            data: getDataByName(datasetNames[i]),
            borderColor: datasetColors[i],
            backgroundColor: datasetColors[i] + "ff",
            fill: true
        });
    }

    const getLabels = () => {
        const timeStamps: Array<string> = stats["vehicleStats"]["timeStamps"];
        const labels: Array<string> = [];
        for (let i = 0; i < timeStamps.length; i++) {
            const timeStamp = timeStamps[i];
            const date = dayjs(timeStamp);
            labels.push(date.format("HH:mm:ss"));
        }
        return labels;
    }

    const data = {
        labels: getLabels(),
        datasets: datasets
    };

    const tooltipMode: InteractionMode = "index";
    const interactionMode: InteractionMode = "nearest";
    const interactionAxis: InteractionAxis = "x";
    const options: ChartOptions = {
        color: getFontColor(colorScheme),
        responsive: true,
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                color: getFontColor(colorScheme),
                text: "Vehicle utilization"
            },
            tooltip: {
                mode: tooltipMode,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        const percentage = context.parsed.y / totalVehicles * 100.0;
                        label += context.parsed.y + ` (${percentage.toFixed(2)}%)`;
                        return label;
                    }
                }
            },
        },
        interaction: {
            mode: interactionMode,
            axis: interactionAxis,
            intersect: false
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Time of day',
                    color: getFontColor(colorScheme),
                },
                ticks: {
                    padding: 0,
                    autoSkip: false,
                    callback: function(val: string | number, index: number) {
                        return index % 36 === 0 && typeof val === 'number' ? this.getLabelForValue(val) : "";
                    },
                    color: getFontColor(colorScheme),
                }
            },
            y: {
                grid: {
                    color: getFontColor(colorScheme)
                },
                stacked: true,
                title: {
                    display: true,
                    text: 'Vehicle count',
                    color: getFontColor(colorScheme)
                },
                ticks: {
                    color: getFontColor(colorScheme)
                },
                min: 0
            }
        }
    };

    return (
        // @ts-ignore
        <Line data={data} options={options}/>
    )
}