import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const RegistroForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegistroFormSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8083/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registro exitoso. Redireccionando...');
        // Simular redirección después de 2 segundos
        setTimeout(() => {
          navigate('/MedicationChart');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Error al registrar usuario. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div style={styles.container} className="mt-5">
      <div className="row">
        <div className="col-md-6">
          <div style={styles.card} className="card">
            <div className="card-body">
              <h1 style={styles.h1} className="display-6 mb-4">
                CALENDARASETAMOL - Registro
              </h1>
              <form onSubmit={handleRegistroFormSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    style={styles.input}
                    id="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    style={styles.input}
                    id="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  style={styles.button}
                  className="btn btn-primary btn-lg btn-block mt-3"
                >
                  Registrarse
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success mt-3" role="alert">
                  {success}
                </div>
              )}

              <p className="mt-4">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/" className="text-primary font-weight-bold">
                  Inicia Sesión
                </Link>
              </p>
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

export default RegistroForm;
