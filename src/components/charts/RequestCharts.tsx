import { Tabs } from "@mantine/core";
import AcceptancePieChart from "@/components/charts/AcceptancePieChart";
import HistogramBarChart from "@/components/charts/HistogramBarChart";

type RequestChartsProps = {
    stats: any;
}

export default function RequestCharts({stats}: RequestChartsProps) {
    return (
        <Tabs defaultValue="acceptance">
            <Tabs.List>
                <Tabs.Tab value="acceptance">Request acceptance</Tabs.Tab>
                <Tabs.Tab value="waiting">Waiting time</Tabs.Tab>
                <Tabs.Tab value="ride">Ride time</Tabs.Tab>
                <Tabs.Tab value="delay">Delay</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="acceptance" pt="xs">
                <AcceptancePieChart stats={stats}/>
            </Tabs.Panel>

            <Tabs.Panel value="waiting" pt="xs">
                <HistogramBarChart buckets={stats["requestStats"]["waitingTime"]["buckets"]}
                                   counts={stats["requestStats"]["waitingTime"]["counts"]}
                                   title={"Waiting time"} xAxisTitle={"Waiting time [seconds]"}/>
            </Tabs.Panel>

            <Tabs.Panel value="ride" pt="xs">
                <HistogramBarChart buckets={stats["requestStats"]["rideTime"]["buckets"]}
                                   counts={stats["requestStats"]["rideTime"]["counts"]}
                                   title={"Ride time"} xAxisTitle={"Ride time [seconds]"}/>
            </Tabs.Panel>

            <Tabs.Panel value="delay" pt="xs">
                <HistogramBarChart buckets={stats["requestStats"]["delay"]["buckets"]}
                                   counts={stats["requestStats"]["delay"]["counts"]}
                                   title={"Delay"} xAxisTitle={"Delay [seconds]"}/>
            </Tabs.Panel>
        </Tabs>
    )
}