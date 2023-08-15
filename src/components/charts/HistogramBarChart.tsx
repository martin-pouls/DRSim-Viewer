import {Bar} from "react-chartjs-2";
import {
    ArcElement,
    BarElement,
    Chart as ChartJS, ChartOptions, InteractionAxis, InteractionMode,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title
} from "chart.js";
import {useMantineColorScheme} from "@mantine/core";
import {getFontColor, getGridColor} from "@/components/charts/utils";
import {colorTableauBlue} from "@/components/charts/constants";

type HistogramBarChartProps = {
    buckets: number[];
    counts: number[];
    title: string;
    xAxisTitle: string;
}

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, ArcElement, BarElement);

export default function HistogramBarChart(props: HistogramBarChartProps) {
    const {counts, buckets, title, xAxisTitle} = props;
    const { colorScheme, } = useMantineColorScheme();
    const step = buckets[1] - buckets[0];
    const total = counts.reduce((sum, current) => sum + current, 0);
    const xValues = counts.map((count, index) => (step / 2) + (step * index));
    const data = xValues.map((value, index) =>
        ({x: value, y: counts[index]}));
    const datasets = {
        datasets: [{
            label: 'Number of trip requests',
            data: data,
            backgroundColor: colorTableauBlue + "aa",
            borderColor: colorTableauBlue,
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 1,
            borderRadius: 5,
        }]
    }

    const interactionMode: InteractionMode = "nearest";
    const interactionAxis: InteractionAxis = "x";
    const options: ChartOptions= {
        scales: {
            x: {
                type: "linear",
                offset: false,
                grid: {
                    color: getGridColor(colorScheme),
                    offset: false,
                },
                ticks: {
                    stepSize: step,
                    color: getFontColor(colorScheme)
                },
                title: {
                    display: true,
                    text: xAxisTitle,
                    color: getFontColor(colorScheme)
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Number of trip requests",
                    color: getFontColor(colorScheme)
                },
                grid: {
                    offset: false,
                    color: getGridColor(colorScheme),
                },
                ticks: {
                    color: getFontColor(colorScheme)
                },
            }
        },
        interaction: {
            mode: interactionMode,
            axis: interactionAxis,
            intersect: false
        },
        plugins: {
            title: {
                display: true,
                color: getFontColor(colorScheme),
                text: title
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: (items) => {
                        if (!items.length) return '';
                        const item = items[0];
                        const min = item.parsed.x - step / 2;
                        const max = item.parsed.x + step / 2;
                        return `${min} - ${max} seconds`;
                    },
                    label: function(item) {
                        let label = item.dataset.label || '';
                        if (label) label += ': ';
                        const percentage = item.parsed.y / total * 100.0;
                        label += item.parsed.y + ` (${percentage.toFixed(2)}%)`;
                        return label;
                    }
                }
            }
        }
    }

    return (
        // @ts-ignore
        <Bar data={datasets} options={options}/>
    )
}