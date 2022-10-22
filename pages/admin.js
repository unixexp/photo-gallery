import Layout from "../components/layout/layout"
import Container from "../components/container/container"
import Toolbar from "../components/admin/toolbar"
import PhotoEditor from "../components/admin/photo-editor"

import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

export async function getServerSideProps(context) {

    const galleryAPIService = GalleryAPIServiceFactory.getInstance()
    const categoriesData = await galleryAPIService.getCategories()
    let categories = []

    if (categoriesData.result === "ok")
        categories = categoriesData.response


    return {
        props: {
            categoriesSSR: categories
        }
    }

}

export default function AdminPage({ galleryAPIService, categoriesSSR }) {

    return (
        <Layout>
            <Container>
                <Toolbar
                    galleryAPIService={galleryAPIService}
                    categoriesSSR={ categoriesSSR }
                />
                <PhotoEditor galleryAPIService={galleryAPIService}/>
            </Container>
        </Layout>
    );

}