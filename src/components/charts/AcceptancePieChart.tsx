import {Doughnut} from "react-chartjs-2";
import React from "react";
import {
    ArcElement,
    Chart as ChartJS,
    ChartOptions,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title
} from "chart.js";
import {Center, useMantineColorScheme} from "@mantine/core";
import {
    colorTableauGreen,
    colorTableauRed
} from "@/components/charts/constants";
import {getFontColor} from "@/components/charts/utils";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, ArcElement);

export type AcceptancePieChartProps = {
    stats: any;
}

export default function AcceptancePieChart({stats}: AcceptancePieChartProps) {
    const { colorScheme, } = useMantineColorScheme();
    const totalRequests = stats["requestStats"]["acceptedRequests"] + stats["requestStats"]["rejectedRequests"];
    const data = {
        labels: [
            'Accepted',
            'Rejected'
        ],
        datasets: [{
            color: getFontColor(colorScheme),
            label: 'Number of trip requests',
            data: [stats["requestStats"]["acceptedRequests"],
                stats["requestStats"]["rejectedRequests"]],
            backgroundColor: [
                colorTableauGreen + "cc",
                colorTableauRed + "cc"
            ],
            borderColor: [
                colorTableauGreen,
                colorTableauRed
            ],
            hoverOffset: 4
        }]
    };

    const options: ChartOptions = {
        color: getFontColor(colorScheme),
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                color: getFontColor(colorScheme),
                text: "Request acceptance"
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        const percentage = context.parsed / totalRequests * 100.0;
                        label += context.parsed + ` (${percentage.toFixed(2)}%)`;
                        return label;
                    }
                }
            }
        }
    };

    return (
        <Center h={300}>
            <Doughnut data={data}
                      /*
                      // @ts-ignore */
                      options={options}/>
        </Center>
    )
}