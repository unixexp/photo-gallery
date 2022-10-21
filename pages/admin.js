import Layout from "../components/layout/layout"
import Container from "../components/container/container"
import Toolbar from "../components/admin/toolbar"
import PhotoEditor from "../components/admin/photo-editor"

import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

export async function getServerSideProps(context) {

    const galleryAPIService = GalleryAPIServiceFactory.getInstance()
    const categories = await galleryAPIService.getCategories()

    return {
      props: {
        categories: categories
      }
    }
}

export default function AdminPage({ galleryAPIService, categories }) {

    return (
        <Layout>
            <Container>
                <Toolbar
                    galleryAPIService={galleryAPIService}
                    categoriesSSR={ categories }
                />
                <PhotoEditor galleryAPIService={galleryAPIService}/>
            </Container>
        </Layout>
    );

}