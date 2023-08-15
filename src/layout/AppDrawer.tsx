import {Drawer, NavLink} from "@mantine/core";
import {Dispatch, SetStateAction} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {IconChartDots, IconMap2} from "@tabler/icons-react";

export type AppDrawerProps = {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>;
}

export default function AppDrawer(props: AppDrawerProps) {
    const {opened, setOpened} = props;
    const router = useRouter();

    const routeEquals = (route: string) => {
        return router.asPath === route;
    }

    return(
        <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            title=""
            padding="xs"
            size={"xs"}>
            <Link href="/">
                <NavLink label="Replay"
                         active={routeEquals("/")}
                         variant={"filled"}
                         onClick={() => setOpened(false)}
                         icon={<IconMap2 stroke={1.5} />}
                />
            </Link>
            <Link href="/charts">
                <NavLink label="Charts"
                         active={routeEquals("/charts")}
                         variant={"filled"}
                         onClick={() => setOpened(false)}
                         icon={<IconChartDots stroke={1.5} />}
                />
            </Link>
        </Drawer>
    )
}