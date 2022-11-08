import "../styles/global.scss";
import { createTheme } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux'
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

import store from "components/app/store"

import Head from "next/head";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie"

const galleryAPIService = GalleryAPIServiceFactory.getInstance()

const DARK_THEME_NAME = "dark"
const LIGHT_THEME_NAME = "light"

const darkTheme = createTheme({
    palette: {
        mode: DARK_THEME_NAME
    }
})

const lightTheme = createTheme({
    palette: {
        mode: LIGHT_THEME_NAME
    }
})

const PREFFERENCE_THEME_COOKIE = "preffered-theme"

const getThemeByName = (themeName) => {
    if (themeName === DARK_THEME_NAME) {
        return darkTheme
    } else if (themeName === LIGHT_THEME_NAME) {
        return lightTheme
    } else {
        throw new Error("Incorect theme name")
    }
}

export default function App({ Component, pageProps }) {

    const [cookieTheme, setCookieTheme] = useCookies([PREFFERENCE_THEME_COOKIE])
    const preferredTheme = cookieTheme && cookieTheme[PREFFERENCE_THEME_COOKIE]
        ? cookieTheme[PREFFERENCE_THEME_COOKIE]
        : DARK_THEME_NAME

    const [selectedTheme, setSelectedTheme] = useState(preferredTheme)
    const [activeTheme, setActiveTheme] = useState(getThemeByName(preferredTheme))

    const toggleTheme = () => {
        const desiredTheme = selectedTheme === DARK_THEME_NAME ? LIGHT_THEME_NAME : DARK_THEME_NAME
        setSelectedTheme(desiredTheme)
        setCookieTheme(PREFFERENCE_THEME_COOKIE, desiredTheme)
    }

    useEffect(() => {
        setActiveTheme(getThemeByName(selectedTheme))
    }, [selectedTheme])

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Provider store={store}>
                <ThemeProvider theme={activeTheme}>
                    <Component {...pageProps}
                        galleryAPIService={galleryAPIService}
                        toggleTheme={toggleTheme}
                    />
                </ThemeProvider>
            </Provider>
        </>
    );
}