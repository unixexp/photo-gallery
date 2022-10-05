import { useSession } from "next-auth/react"

import Layout from "../components/layout/layout"
import Container from "../components/container/container"
import AdminToolbar from "../components/admin-toolbar/admin-toolbar"

export default function AdminPage() {

    const { data: session } = useSession();

    return (
        <Layout>
            <Container>
                <AdminToolbar />
            </Container>
        </Layout>
    );

}