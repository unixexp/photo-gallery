import { useSession } from "next-auth/react"

import Layout from "../components/layout/layout"
import Container from "../components/container/container"
import Toolbar from "../components/admin/toolbar"

export async function getServerSideProps(context) {
    return {
      props: {}
    }
}

export default function AdminPage() {

    const { data: session } = useSession();

    return (
        <Layout>
            <Container>
                <Toolbar />
            </Container>
        </Layout>
    );

}