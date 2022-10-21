import "../styles/global.scss";
import { Provider } from 'react-redux'
import store from "../components/app/store"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

import Head from "next/head";

const galleryAPIService = GalleryAPIServiceFactory.getInstance()

export default function App({ Component, pageProps }) {

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Provider store={store}>
                <Component {...pageProps} galleryAPIService={galleryAPIService} />
            </Provider>
        </>
    );
}