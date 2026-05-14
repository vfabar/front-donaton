import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  // Intentamos obtener el usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); // Borramos la sesión
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold brand-logo">Donatón</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/products">Causas</Nav.Link>
            <Nav.Link as={Link} to="/MoreInfo">Más Info</Nav.Link>
          </Nav>

          <Nav className="ms-auto auth-nav">
            {user ? (
              /* Si hay usuario, mostramos el Menú de Perfil */
              <NavDropdown title={`Opciones de perfil`} id="basic-nav-dropdown" className="profile-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              /* Si NO hay usuario, mostramos Login y Register */
              <>
                <Nav.Link as={Link} to="/login" className="login-link">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register" className="register-btn-nav">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;