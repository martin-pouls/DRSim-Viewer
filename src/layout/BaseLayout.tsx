import {
    ActionIcon,
    AppShell, Burger,
    Group,
    Header,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {ReactNode, useState} from "react";
import AppDrawer from "@/layout/AppDrawer";

type BaseLayoutProps = {
    children?: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
    const theme = useMantineTheme();

    return (
        <>
            <AppDrawer opened={drawerOpened} setOpened={setDrawerOpened}/>
            <AppShell
                padding="md"
                header={
                    <Header height={50}
                            p="xs"
                            style={colorScheme === 'dark' ? {} : {backgroundColor: theme.colors.gray[0]} }>
                        <Group sx={{ height: '100%' }} px={0} position="apart" spacing="sm">
                            {(drawerOpened !== undefined) && setDrawerOpened &&
                                <Burger
                                    size={"md"}
                                    opened={drawerOpened}
                                    onClick={() => setDrawerOpened((o) => !o)}
                                />
                            }
                            <ActionIcon variant="default"
                                        onClick={() => toggleColorScheme()}
                                        size={30}>
                                {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoonStars size={16} stroke={1.5} />}
                            </ActionIcon>
                        </Group>

                    </Header>}
                styles={(theme) => ({
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.white },
                })}
            >
                <main>{children}</main>
            </AppShell>
        </>
    )
}