import Login from './pages/Login';
import Main from './pages/Main';
import Tareas from './pages/Tareas';
import Tarea from './pages/Tarea';
import Header from './components/Header';
import Usuario from './pages/Usuario';

import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <Header />
        <Routes>             
          <Route path="/" element={<Login />} />          
          <Route path="/main" element={<Main />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/tareas/:name?" element={<Tareas />} />  
          <Route path="/tarea" element={<Tarea />} /> 
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes> 
 
      </div>
    </Router>
    
  );
}

export default App;
