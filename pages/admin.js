import Layout from "../components/layout/layout"
import Container from "../components/admin/container/container"
import Toolbar from "../components/admin/toolbar/toolbar"
import PhotoEditor from "../components/admin/photo-editor/photo-editor"

import { Box, Button } from "@mui/material"

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

export default function AdminPage({ galleryAPIService, categoriesSSR, toggleTheme }) {

    return (
        <Layout>
            <Container>
                <Toolbar
                    galleryAPIService={galleryAPIService}
                    categoriesSSR={ categoriesSSR }
                />
                { renderThemeButton(toggleTheme) }
                <Box sx={{ padding: "8px"}}>
                    <PhotoEditor galleryAPIService={galleryAPIService}/>
                </Box>
            </Container>
        </Layout>
    );

}

const renderThemeButton = ({toggleTheme}) => {

    return

    return (
        <Button
            sx={{margin: "8px 8px"}}
            variant="contained"
            onClick={toggleTheme}>Theme</Button>
    )

}