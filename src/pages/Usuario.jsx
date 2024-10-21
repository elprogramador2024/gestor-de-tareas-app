import { WidthFull } from '@mui/icons-material'
import { Alert, Box, Button, Card, CardActions, CardContent, Grid2, MenuItem, Paper, Select, Stack, TextField } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToken } from '../context/TokenProvider';

const Usuario = () => {
    const [errors, setErrors] = useState([]);
    const [usuario, setUsuario] = useState({ "nombre": "", "email": "", "password": "", "rol": { "name": "Empleado" } });
    const navigate = useNavigate();
    const { token, saveToken } = useToken();

    const location = useLocation();
    const state = location.state;
    const obj = state.state;
    const action = state.action;

    useEffect(() => {
        const timer = setTimeout(() => {
            setErrors([]);
        }, 5000);

        return () => clearTimeout(timer);
    }, [errors]);

    useEffect(() => {
        setUsuario(obj);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let ope = action;
        let method = ope == "update" ? "PUT" : "POST";

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/usuario/${ope}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                },
                body: JSON.stringify(usuario),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrors(data);
            }

            if (response.ok) {
                navigate(`/main`);
            }

        } catch (error) {
            setErrors([{ "code": "Error", "description": error }]);
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
                <CardContent>
                    <TextField
                        id="filled-search"
                        label="Nombre"
                        type="search"
                        disabled={action == "update"}
                        sx={{ paddingBottom: '10px' }}
                        value={usuario.nombre}
                        onChange={(e) => { setUsuario((u) => ({ ...u, nombre: e.target.value })) }}
                    />

                    <TextField
                        id="filled-search"
                        label="Email"
                        type="email"
                        sx={{ paddingBottom: '10px' }}
                        value={usuario.email}
                        onChange={(e) => { setUsuario((u) => ({ ...u, email: e.target.value })) }}
                    />

                    <TextField
                        id="filled-search"
                        label="Password"
                        type="password"
                        disabled={action == "update"}
                        sx={{ paddingBottom: '10px' }}
                        value={usuario.password}
                        onChange={(e) => { setUsuario((u) => ({ ...u, password: e.target.value })) }}
                    />

                    <Select
                        id="simple-select"
                        value={usuario.rol.name}
                        label="Rol"
                        sx={{ paddingInline: '34px' }}
                        onChange={(e) => { setUsuario((u) => ({ ...u, rol: { "name": e.target.value } })) }}
                    >
                        <MenuItem value={"Administrador"}>Administrador</MenuItem>
                        <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
                        <MenuItem value={"Empleado"}>Empleado</MenuItem>
                    </Select>

                </CardContent>
                <CardActions>

                    <Grid2 display="flex" justifyContent="center" alignItems="center" size="grow">
                        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
                    </Grid2>


                </CardActions>

                {errors.map((e) => (<Alert severity="error">{e.description}</Alert>))}

            </Card >
        </Box>


    )
}

export default Usuario