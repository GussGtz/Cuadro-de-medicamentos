import React, { useState, useEffect } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Escucha los cambios en la autenticación de Firebase
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado
        setUser({
          userId: user.uid,
          email: user.email,
          displayName: user.displayName || 'Usuario',
        });
      } else {
        // No hay usuario autenticado
        setUser(null);
      }
    });

    // Limpia el efecto cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      // Cerrar sesión exitosamente, redirigir al componente de inicio de sesión
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleLoginWithEmailAndPassword = async () => {
    // Aquí puedes manejar el inicio de sesión con correo y contraseña,
    // y obtener el nombre del usuario de tu servidor
    try {
      const email = 'correo@example.com'; // Reemplaza con el correo proporcionado por el usuario
      const password = 'contraseña'; // Reemplaza con la contraseña proporcionada por el usuario

      // Llama a tu servidor para iniciar sesión y obtener la información del usuario
      const response = await fetch('http://localhost:8083/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Inicio de sesión exitoso, obtener información del usuario
        setUser({
          userId: data.user.userId,
          email: data.user.email,
          displayName: data.user.displayName || 'Usuario',
        });

        navigate('/'); // Puedes redirigir a la página principal o donde desees
      } else {
        console.error('Error al iniciar sesión:', data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>MEDICAMENTOS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        {user && (
          <>
            <span>{user.displayName}</span>
            <Button variant="outline-danger" onClick={handleLogout}>
              Cerrar Sesión.
            </Button>
          </>
        )}
        {!user && (
          <Button variant="outline-danger" onClick={handleLogout}>
            cerrar Sesión
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
