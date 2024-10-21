import { Box, Button, FormControl, Grid2, Input, InputAdornment, InputBase, InputLabel, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React from 'react'
import { useState, useEffect } from 'react'
import { useToken } from '../context/TokenProvider'
import { Link, useNavigate, useParams } from 'react-router-dom';

const Tareas = () => {
    const [tareas, setTareas] = useState({});
    const [showTareas, setShowTareas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { token } = useToken();
    const { name } = useParams();

    useEffect(() => {
        if (token == null)
            navigate('/');

        getTareas(1, 5);
    }, []);

    const getTareas = async (pgnum, pgsize) => {
        try {
            let addpath = '?';
            if (name)
                addpath = `/byuser?username=${name}&`;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/tarea${addpath}pgnum=${pgnum}&pgsize=${pgsize}`, {
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
            setTareas(data);
            setShowTareas(data.tareas)

        } catch (error) {
            navigate('/');
        }
    }

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/tarea/delete?id=${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            if (response.ok) {
                getTareas(page, 5)
            }

        } catch (error) {

            console.error('Error:', error);
        }
    }

    return (
        <div style={{ padding: '30px' }}>
            <Grid2 display="flex" justifyContent="flex-end" sx={{ paddingBottom: '12px' }}>

                <div style={{ paddingRight: '20px' }}>
                    <FormControl >
                        <InputLabel>Buscar</InputLabel>
                        <Input
                            type='text'
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setShowTareas(tareas.tareas.filter(item => item.titulo.toUpperCase().trim().includes(e.target.value.toUpperCase().trim())));
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>

                <Button variant="contained" color="success" disabled={token.roles[0] == "Empleado"} onClick={() => {
                    navigate('/tarea', { state: { "id": 0, "titulo": "", "descripcion": "", "fechaIni": new Date().toISOString(), "fechaFin": new Date().toISOString(), "userName": name, "estado": 0 } })
                }}>Insertar</Button>
            </Grid2 >

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Titulo</TableCell>
                            <TableCell align="right">Descripción</TableCell>
                            <TableCell align="right">User Name</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {showTareas?.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.titulo}
                                </TableCell>
                                <TableCell align="right">{row.descripcion}</TableCell>
                                <TableCell align="right">{row.userName}</TableCell>
                                <TableCell align="right">{row.estadoString}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" sx={{ marginRight: '10px' }} onClick={() => {
                                        navigate('/tarea', { state: row })
                                    }}>Editar</Button>
                                    <Button variant="contained" color="error" disabled={token.roles[0] != "Administrador"} onClick={(e) => handleDelete(e, row.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '15px'
            }}>
                <Pagination count={tareas.totpages} page={page} onChange={(e, value) => { setPage(value); getTareas(value, 5) }} />
            </Box>
        </div >
    )
}

export default Tareas