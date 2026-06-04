import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.idUserType?.userType?.toLowerCase() === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm">
      <Container>
        <Navbar.Brand
          as={Link}
          to={isAdmin ? "/admin/dashboard" : "/"}
          className="fw-bold brand-logo"
        >
          Donatón
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">

          {/* MENÚ PRINCIPAL */}
          <Nav className="me-auto">

            {/* MENÚ USUARIO */}
            {!isAdmin && (
              <>
                <Nav.Link as={Link} to="/">
                  Inicio
                </Nav.Link>

                <Nav.Link as={Link} to="/products">
                  Causas
                </Nav.Link>

                <Nav.Link as={Link} to="/MoreInfo">
                  Más Info
                </Nav.Link>
              </>
            )}

            {/* MENÚ ADMIN */}
            {isAdmin && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">
                  Dashboard
                </Nav.Link>

                <Nav.Link as={Link} to="/admin/users">
                  Usuarios
                </Nav.Link>

                <Nav.Link as={Link} to="/admin/DonationManagement">
                  Donaciones
                </Nav.Link>
              </>
            )}

          </Nav>

          {/* PERFIL / LOGIN */}
          <Nav className="ms-auto auth-nav">

            {user ? (
              <NavDropdown
                title={`Opciones de perfil`}
                id="basic-nav-dropdown"
                className="profile-dropdown"
              >
                {!isAdmin && (
                  <NavDropdown.Item as={Link} to="/profile">
                    Mi Perfil
                  </NavDropdown.Item>
                )}

                {isAdmin && (
                  <>
                    <NavDropdown.Item as={Link} to="/profile">
                      Panel de Administración
                    </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Divider />

                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Cerrar Sesión
                </NavDropdown.Item>

              </NavDropdown>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="login-link"
                >
                  Iniciar Sesión
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/register"
                  className="register-btn-nav"
                >
                  Registrarse
                </Nav.Link>
              </>
            )}

          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;