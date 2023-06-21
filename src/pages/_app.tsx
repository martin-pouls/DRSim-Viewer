import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import Head from "next/head";
import {ReactElement, ReactNode, useState} from "react";
import {GetServerSidePropsContext, NextPage} from "next";
import {getCookie, setCookie} from 'cookies-next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App(props: AppPropsWithLayout & { colorScheme: ColorScheme }) {
    const {Component, pageProps} = props;
    const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
        setColorScheme(nextColorScheme);
        setCookie('mantine-color-scheme', nextColorScheme, {maxAge: 60 * 60 * 24 * 30});
    };

    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <>
            <Head>
                <title>DRSim Viewer</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{colorScheme}}>
                    {getLayout(<Component {...pageProps} />)}
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    )
}

App.getInitialProps = ({ctx}: { ctx: GetServerSidePropsContext }) => ({
    colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});
