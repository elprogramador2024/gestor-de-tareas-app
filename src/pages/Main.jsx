import { Button, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { useToken } from '../context/TokenProvider'
import { Link, useNavigate } from 'react-router-dom';


const Main = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();
    const { token } = useToken();

    useEffect(() => {
        if (token.token == null)
            navigate('/');

        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/usuario`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if (!response.ok) {
                navigate('/');
            }

            const data = await response.json();
            setUsuarios(data);

        } catch (error) {
            navigate('/');
        }
    }

    const handleDelete = async (e, usuario) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/usuario/delete`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                },
                body: JSON.stringify(usuario),
            });

            if (response.ok) {
                const data = await response.json();

                setUsuarios(usuarios.filter(u => u.nombre !== usuario.nombre));
            }

        } catch (error) {

            console.error('Error:', error);
        }
    }

    const showTareas = async (e, nombre) => {
        e.preventDefault();
        navigate(`/tareas/${nombre}`);
    }

    return (
        <div style={{ padding: '30px' }}>
            <Grid2 display="flex" justifyContent="flex-end" sx={{ paddingBottom: '12px' }}>
                <Button variant="contained" color="success" onClick={() => {
                    navigate('/usuario', { state: { state: { "nombre": "", "email": "", "password": "", "rol": { "name": "Empleado" } }, action: "insert" } })
                }}>Insertar</Button>
            </Grid2>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Rol</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((row) => (

                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.nombre}
                                </TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="right">{row.rol.name}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="warning" sx={{ marginRight: '10px' }} onClick={(e) => showTareas(e, row.nombre)}>Tareas</Button>
                                    <Button variant="contained" sx={{ marginRight: '10px' }} disabled={row.nombre == "admin"} onClick={() => {
                                        navigate('/usuario', { state: { state: row, action: "update" } })
                                    }}>Editar</Button>
                                    <Button variant="contained" color="error" disabled={row.nombre == "admin"} onClick={(e) => handleDelete(e, row)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Main