import { WidthFull } from '@mui/icons-material'
import { Alert, Box, Button, Card, CardActions, CardContent, Grid2, MenuItem, Paper, Select, Stack, TextField } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToken } from '../context/TokenProvider';

const Tarea = () => {
    const [errors, setErrors] = useState([]);
    const [tarea, setTarea] = useState({ "id": 0, "titulo": "", "descripcion": "", "fechaIni": "", "fechaFin": "", "userName": "user3", "estado": 0 });
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();
    const { token, saveToken } = useToken();

    const location = useLocation();
    const obj = location.state;

    useEffect(() => {
        const timer = setTimeout(() => {
            setErrors([]);
        }, 5000);

        return () => clearTimeout(timer);
    }, [errors]);

    useEffect(() => {
        setTarea(obj);
        getUsuarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let ope = tarea.id != 0 ? "update" : "insert";
        let method = tarea.id != 0 ? "PUT" : "POST";

        let estado = token.roles[0] != "Administrador" ? "estado" : "";

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/tarea/${ope}/${estado}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                },
                body: JSON.stringify(tarea),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrors(data);
            }

            if (response.ok) {
                const data = await response.json();
                navigate(`/tareas/${tarea.userName}`);
            }

        } catch (error) {
            setErrors([{ "code": "Error", "description": error }]);
        }
    }

    const getUsuarios = async () => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/usuario`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            }

        } catch (error) {
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
                <CardContent>
                    <TextField
                        id="filled-search"
                        label="Titulo"
                        type="search"
                        sx={{ paddingBottom: '10px' }}
                        value={tarea.titulo}
                        onChange={(e) => { setTarea((u) => ({ ...u, titulo: e.target.value })) }}
                    />

                    <TextField
                        id="filled-search"
                        label="Descripción"
                        type="search"
                        sx={{ paddingBottom: '10px' }}
                        value={tarea.descripcion}
                        onChange={(e) => { setTarea((u) => ({ ...u, descripcion: e.target.value })) }}
                    />

                    <Select
                        id="simple-select"
                        value={tarea.estado}
                        label="Estado"
                        sx={{ paddingInline: '34px', marginBottom: '10px' }}
                        onChange={(e) => { setTarea((u) => ({ ...u, estado: e.target.value })) }}
                    >
                        <MenuItem value={0}>PENDIENTE</MenuItem>
                        <MenuItem value={1}>EN PROCESO</MenuItem>
                        <MenuItem value={2}>COMPLETADA</MenuItem>
                    </Select>

                    {tarea.id == 0 && (
                        <Select
                            id="simple-select"
                            value={tarea.userName}
                            label="Estado"
                            sx={{ paddingInline: '52px' }}
                            onChange={(e) => { setTarea((u) => ({ ...u, userName: e.target.value })) }}
                        >
                            {usuarios.map((u) => <MenuItem value={u.nombre}>{u.nombre}</MenuItem>)}

                        </Select>
                    )}


                </CardContent>
                <CardActions>

                    <Grid2 display="flex" justifyContent="center" alignItems="center" size="grow">
                        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
                    </Grid2>


                </CardActions>



            </Card >
        </Box>


    )
}

export default Tarea