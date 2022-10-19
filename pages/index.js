import Head from "next/head";
import { useState, useEffect } from "react"

import Layout from "../components/layout/layout";
import Main from "../components/main/main";
import Link from "next/link";

import { getGalleryAPIService } from "~/services/gallery-api-service-factory"

export default function IndexPage() {

    const galleryAPIService = getGalleryAPIService()

    const [categories, setCategories] = useState([])

    useEffect(() => {
        update()
    }, [])

    const update = () => {
        galleryAPIService.getCategories().then((data) => {
            setCategories(data)
        })
    }

    return (
        <Layout>
            <Head>
                <title>Gallery</title>
            </Head>
            <Main>
                <Link href="/category1">
                    <a>To category #1</a>
                </Link>
                <Link href="/admin">
                    <button>To admin</button>
                </Link>
            </Main>
            {
                categories.map(cat => {
                    return <div>{cat.name}</div>
                })
            }
        </Layout>
    );

}
