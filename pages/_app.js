import "../styles/global.scss";
import { createTheme } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux'
import store from "../components/app/store"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

import Head from "next/head";

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

const galleryAPIService = GalleryAPIServiceFactory.getInstance()

export default function App({ Component, pageProps }) {

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <Component {...pageProps} galleryAPIService={galleryAPIService} />
                </Provider>
            </ThemeProvider>
        </>
    );
}