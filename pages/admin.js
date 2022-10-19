import { useSession } from "next-auth/react"

import Layout from "../components/layout/layout"
import Container from "../components/container/container"
import Toolbar from "../components/admin/toolbar"
import PhotoEditor from "../components/admin/photo-editor"

// import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory"

export async function getServerSideProps(context) {
    return {
      props: {}
    }
}

export default function AdminPage() {

    return (
        <Layout>
            <Container>
                <Toolbar />
                <PhotoEditor />
            </Container>
        </Layout>
    );

}