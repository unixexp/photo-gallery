import Head from "next/head";

import Layout from "../components/layout/layout";
import Main from "../components/main/main";
import Link from "next/link";

export default function IndexPage() {

    return (
        <Layout>
            <Head>
                <title>Gallery</title>
            </Head>
            <Main>
                <Link href="/category1">
                    <a>To category #1</a>
                </Link>
            </Main>
        </Layout>
    );

}
