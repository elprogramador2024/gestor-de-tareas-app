import { WidthFull } from '@mui/icons-material'
import { Alert, Box, Button, Card, CardActions, CardContent, Grid2, Paper, Stack, TextField } from '@mui/material'
import AccountCircleRounded from '@mui/icons-material/AccountCircleRounded';
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useToken } from '../context/TokenProvider';

const Login = () => {
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [usuario, setUSuario] = useState({ name: "", password: "" });
    const navigate = useNavigate();
    const { token, saveToken } = useToken();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsErrorVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [isErrorVisible]);

    useEffect(() => {
        saveToken(null);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/usuario/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });

            if (!response.ok) {
                setIsErrorVisible(true);
                throw new Error('Login failed');
            }

            const data = await response.json();
            saveToken(data);

            if (data.roles[0] == "Administrador")
                navigate('/main');

            if (data.roles[0] == "Supervisor")
                navigate('/Tareas');

            if (data.roles[0] == "Empleado")
                navigate(`/tareas/${data.userName}`);

        } catch (error) {
            setIsErrorVisible(true);
            console.error('Error:', error);
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            <Card sx={{ maxWidth: 345 }}>

                <AccountCircleRounded sx={{ fontSize: 80, paddingTop: '15px', color: 'lightgray' }} />
                <CardContent>
                    <TextField
                        id="filled-search"
                        label="Usuario"
                        type="search"
                        sx={{ paddingBottom: '10px' }}
                        autoFocus
                        value={usuario.name}
                        onChange={(e) => { setUSuario((u) => ({ ...u, name: e.target.value })) }}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={usuario.password}
                        onChange={(e) => { setUSuario((u) => ({ ...u, password: e.target.value })) }}
                    />
                </CardContent>
                <CardActions>

                    <Grid2 display="flex" justifyContent="center" alignItems="center" size="grow">
                        <Button variant="contained" onClick={handleSubmit}>Login</Button>
                    </Grid2>


                </CardActions>

                {isErrorVisible && <Alert severity="error">Usuario Incorrecto.</Alert>}

            </Card >
        </Box>


    )
}

export default Login