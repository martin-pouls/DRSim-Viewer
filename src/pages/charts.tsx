import React, {ReactElement, useState} from "react";
import BaseLayout from "@/layout/BaseLayout";
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, ArcElement } from 'chart.js';
import VehicleUtilizationChart from "@/components/charts/VehicleUtilizationChart";
import {Center, Divider, Grid, Title as MantineTitle} from "@mantine/core";
import StatsFileLoader from "@/components/loading/StatsFileLoader";
import DefaultCard from "@/components/common/DefaultCard";
import RequestCharts from "@/components/charts/RequestCharts";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, ArcElement);

export default function Charts() {
    const [stats, setStats] = useState<any | undefined>(undefined);
    return (
        <>
            <StatsFileLoader setStats={setStats} />
            <Divider my="sm" />
            {stats !== undefined &&
                <Grid gutter={"xs"} columns={3}>
                    <Grid.Col span={2}>
                        <DefaultCard>
                            <Center>
                                <MantineTitle order={5}>Vehicle statistics</MantineTitle>
                            </Center>
                            <Divider my="sm"/>
                            <VehicleUtilizationChart stats={stats}/>
                        </DefaultCard>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <DefaultCard>
                            <Center>
                                <MantineTitle order={5}>Trip request statistics</MantineTitle>
                            </Center>
                            <Divider my="sm"/>
                            <RequestCharts stats={stats}/>
                        </DefaultCard>
                    </Grid.Col>
                </Grid>
            }
        </>
    )
}

Charts.getLayout = function getLayout(page: ReactElement) {
    return (
        <BaseLayout>
            {page}
        </BaseLayout>
    )
}