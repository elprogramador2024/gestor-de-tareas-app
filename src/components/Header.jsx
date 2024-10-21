import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BookIcon from '@mui/icons-material/Book';
import { useToken } from '../context/TokenProvider'
import { Link, useNavigate } from 'react-router-dom';


const pages = ['Usuarios', 'Tareas'];

function Header() {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const { token, saveToken } = useToken();
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Container maxWidth="xxl">
                <Toolbar disableGutters>
                    <BookIcon sx={{ mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={() => {
                            if (token.roles[0] == "Administrador")
                                navigate('/main')
                        }}
                        sx={{
                            mr: 2,

                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        GESTOR DE TAREAS
                    </Typography>


                    {token?.token && (
                        <>
                            <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                {token.roles[0] == "Administrador" && (
                                    <Button onClick={() => navigate('/main')} sx={{ my: 2, color: 'white', display: 'block' }}>
                                        USUARIOS
                                    </Button>
                                )}


                                <Button onClick={() => {
                                    if (token.roles[0] == "Administrador" || token.roles[0] == "Supervisor")
                                        navigate('/tareas');
                                    else
                                        navigate(`/tareas/${token.userName}`);

                                }} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    TAREAS
                                </Button>


                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title={token.userName}>
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Box
                                            component="span"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                bgcolor: 'lightgray',
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            <div>{token.userName.substring(0, 1).toUpperCase()}</div>
                                        </Box>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={() => { saveToken(null); navigate('/'); }}>
                                        <Typography sx={{ textAlign: 'center' }}>Cerrar Sesion</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </>
                    )}

                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;