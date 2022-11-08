import Head from "next/head";
import { useState, useEffect } from "react"

import Layout from "../components/layout/layout";
import Main from "../components/main/main";
import Link from "next/link";

export default function IndexPage({ galleryAPIService, toggleTheme }) {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        update()
    }, [])

    const update = () => {
        galleryAPIService.getCategories().then((data) => {
            if (data.result === "ok") {
                setCategories(data.response)
            }
        })
    }

    return (
        <Layout>
            <Head>
                <title>Gallery</title>
            </Head>
            <Main toggleTheme={toggleTheme}>
                <Link href="/category1">
                    <a>To category #1</a>
                </Link>
                <Link href="/admin">
                    <button>To admin</button>
                </Link>
            </Main>
            {
                categories.map(cat => {
                    return <div key={cat.name}>{cat.name}</div>
                })
            }
        </Layout>
    );

}
