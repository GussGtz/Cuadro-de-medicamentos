const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 8083;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'medicamentos'
});

connection.connect();

// Ruta para autenticar usuarios
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Intento de inicio de sesión para el usuario:', email);

  connection.query(
    'SELECT * FROM usuario WHERE email = ? AND password = ?',
    [email, password],
    (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }

      console.log('Resultados de la consulta:', results);

      if (results.length > 0) {
        const user = results[0]; // Suponiendo que obtienes un solo usuario con esas credenciales

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: {
              userId: user.id,
              email: user.email,
              displayName: user.nombre || 'Usuario',
            },
          });
      } else {
        res.json({ success: false, message: 'Credenciales incorrectas' });
      }
    }
  );
});

// Ruta para registrar usuarios
app.post('/registro', (req, res) => {
  const { email, password } = req.body;

  // Verifica si el usuario ya existe en la base de datos
  connection.query(
    'SELECT * FROM usuario WHERE email = ?',
    [email],
    (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
      }

      if (results.length > 0) {
        // El usuario ya está registrado
        res.json({ success: false, message: 'El usuario ya está registrado' });
      } else {
        // El usuario no está registrado, procede con el registro
        connection.query(
          'INSERT INTO usuario (email, password) VALUES (?, ?)',
          [email, password],
          (error, results) => {
            if (error) {
              console.error('Error al ejecutar la consulta de registro:', error);
              throw error;
            }

            res.json({ success: true, message: 'Registro exitoso' });
          }
        );
      }
    }
  );
});


// Agrega esta nueva ruta al servidor

app.get('/usuarios', (req, res) => {
    connection.query(
      'SELECT nombre FROM usuario',
      (error, results) => {
        if (error) {
          console.error('Error al ejecutar la consulta:', error);
          return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
  
        console.log('Resultados de la consulta:', results);
  
        if (results.length > 0) {
          const nombresUsuarios = results.map(user => user.nombre);
          res.json({
            success: true,
            message: 'Nombres de usuario obtenidos exitosamente',
            users: nombresUsuarios,
          });
        } else {
          res.json({ success: false, message: 'No se encontraron nombres de usuario' });
        }
      }
    );
  });
  

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
