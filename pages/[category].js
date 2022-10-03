import { useRouter } from "next/router";

import Head from "next/head";
import Layout from "../components/layout/layout";

import { capitalize } from "../lib/util";

export async function getStaticProps(context) {

    console.log("getStaticProps always run on the server side!");

    return {
        props: {}
    }

}

export async function getStaticPaths() {

    // You can create function to load all available category/subcategory list
    // from external source and push them into 'paths' by 'map'

    const paths = [
        { params: { category: "category1" }}
    ];

    return { paths, fallback: false }

}

export default function ProductsPage(props) {

    const router = useRouter();
    const { category } = router.query;
    const title = `${capitalize(category)}`;

    return (
        <Layout>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </Layout>
    );

}
