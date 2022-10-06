import { useSession } from "next-auth/react"

import Layout from "../components/layout/layout"
import Container from "../components/container/container"
import AdminFeatures from "../components/admin-features/admin-features"

export default function AdminPage() {

    const { data: session } = useSession();

    return (
        <Layout>
            <Container>
                <AdminFeatures />
            </Container>
        </Layout>
    );

}