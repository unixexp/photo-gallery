import {
    Container,
    TextField,
    Box,
    Button,
    CssBaseline,
    Avatar,
    Typography,
    Grid,
    Link
} from "@mui/material"
import Head from "next/head"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function SignInPage() {

    const [userInfo, setUserInfo] = useState({ login: "", password: "" })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await signIn("credentials", {
            login: userInfo.login,
            password: userInfo.password,
            redirect: false
        })
    }

    return (
        <>
            <Head>
                <title>Sign in</title>
            </Head>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="login"
                            label="Login"
                            name="login"
                            autoComplete="login"
                            autoFocus
                            value={userInfo.login}
                            onChange={(e) => setUserInfo({ ...userInfo, login: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={userInfo.password}
                            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    )

}