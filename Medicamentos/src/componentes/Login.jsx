import React from 'react';
import { useNavigate} from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
/*
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configuración de conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'medicamentos',
});

// Conexión a MySQL
db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
  } else {
    console.log('Conexión exitosa a MySQL');
  }
});
*/
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
  },
  card: {
    width: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  h1: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const LoginForm = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    //console.log(provider);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {

        console.log(result.additionalUserInfo.profile.email); // traigo correo. 
        
        // Guardar el correo electrónico en una cookie con nombre 'userEmail'
        const userEmail = result.additionalUserInfo.profile.email;
        document.cookie = `userEmail=${userEmail}; expires=Thu, 01 Jan 2025 00:00:00 UTC; path=/`;
        const userName  = result.additionalUserInfo.profile.name;
        document.cookie = `userName=${userName}; expires=Thu, 01 Jan 2025 00:00:00 UTC; path=/`;
        
        
        //llamo api hecho en pphp para insertar.
        /*
        // consumiendo api
         const data = {
              nombre: result.additionalUserInfo.profile.name,
              correo: result.additionalUserInfo.profile.email,
          };

        // Realizar la solicitud a la API PHP
         fetch('http://localhost/api_ut/users.php', { method: 'POST',
                 headers: {
                           'Content-Type': 'application/json',
                 },
                body: JSON.stringify(data),
          })
         .then((response) => response.json())
         .then((result) => {
          console.log(result);
          // Manejar la respuesta de la API 
         })
         .catch((error) => {
          console.error('Error al enviar la solicitud:', error);
         });
        */

        // fin consumiendo


        navigate('/MedicationChart');
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error);
      });
  };


  return (
    <div style={styles.container} className="mt-5">
      <div className="row">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card">
            <div className="card-body">
              <h1 style={styles.h1} className="display-6 mb-4">
                ORGANI-MENTOS
              </h1>
              <h5 className="mt-4 text-center">Ingresa con tu cuenta de:</h5>
              <div className="text-center mt-3">
                <div>
                  <img
                    src="https://1000marcas.net/wp-content/uploads/2020/02/logo-Google.png"
                    alt="Ingresar con Google"
                    onClick={handleGoogleSignIn}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '10%',
                      width: '140px',
                      height: '80px',
                      marginRight: '10px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <img
            src="https://png.pngtree.com/png-vector/20230728/ourlarge/pngtree-medication-clipart-cartoon-smiling-medicine-bottles-with-pills-vector-png-image_6811907.png"
            alt=""
            className="w-100 h-100 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
