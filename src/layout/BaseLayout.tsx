import {
    ActionIcon,
    AppShell,
    Group,
    Header,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {ReactNode} from "react";

type BaseLayoutProps = {
    children?: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    return (
        <AppShell
            padding="md"
            header={
                <Header height={50}
                        p="xs"
                        style={colorScheme === 'dark' ? {} : {backgroundColor: theme.colors.gray[0]} }>
                    <Group sx={{ height: '100%' }} px={0} position="right" spacing="sm">
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
    )
}