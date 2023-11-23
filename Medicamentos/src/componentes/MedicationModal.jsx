//import React from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';




const getCookie = (name) => {
                                const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                                return cookieValue ? cookieValue.pop() : null;
};
      
const MedicationModal = ({
    showModal,
    setShowModal,
    inputValues,
    suggestedMedicamentos,
    handleInputChange,
    
}) => {
     
     
     
     const navigate = useNavigate();
     // traigo o leo la cokie que declare y le asigne el valor de correo cuando me loguie desde google o facebool
     const [userEmail, setUserEmail] = useState(null);
     const [userName, setUserName] = useState(null);
	 useEffect(() => {
	 // Obtener el valor de la cookie 'userEmail'
	 const emailFromCookie = getCookie('userEmail');
	 	if (emailFromCookie) {
	 			setUserEmail(emailFromCookie);
    	}
  	 }, []);
    
     useEffect(() => {
	 // Obtener el valor de la cookie 'userEmail'
	 const nameFromCookie = getCookie('userName');
	 	if (nameFromCookie) {
	 			setUserName(nameFromCookie);
    	}
  	 }, []);
     // aca pongo codigo para que guarde en la base de datos llamando una api hecha en php o react  
     const handleSaveMedication = () => {
	            
	                
	         
	 			const dataToSend = {
	 								nombre: inputValues.nombre,
	 								dosis: inputValues.dosis,
	 								frecuencia: inputValues.frecuencia,
	 								duracion: inputValues.duracion,
	 								soloParaMalestar: inputValues.soloParaMalestar,
	 								correo: userEmail,
	 								nombreUser:userName,
    			};

				fetch(`http://localhost:8082/verificarUser`, { 
					   method: 'POST',
					   headers: {
                                  'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataToSend),
                })
                .then((response) => {
                      if (!response.ok) {
                            throw new Error('Error al guardar la medicación');
                       }
                      return response.json();
                })
                .then((data) => {
                     console.log('Medicamento guardado:', data);
                      setShowModal(false);
                       //eslint-disable-next-line react-hooks/exhaustive-deps
                      //navigate('/MedicationChart');
                      window.location.href = 'http://localhost:3000/MedicationChart';
                     
                      
                 })
                 .catch((error) => {
                       console.error('Error al guardar medicamento:', error);
                      // Puedes mostrar un mensaje de error o realizar otras acciones
                  });
     };
        
    // fin llamada para guardar receta
    
    
    
    
    const isSaveButtonDisabled = !(
        inputValues.nombre &&
        inputValues.dosis &&
        inputValues.frecuencia &&
        inputValues.duracion
    );

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Medicamento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
                <Form>
                    <Form.Group controlId="nombre">
                        <Form.Label>Nombre del Medicamento</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={inputValues.nombre || ''}
                            onChange={(event) => handleInputChange(event, 'nombre')}
                            list="medicamentos"
                        />
                        <datalist id="medicamentos">
                            {suggestedMedicamentos.map((med, index) => (
                                <option key={index} value={med} />
                            ))}
                        </datalist>
                    </Form.Group>
                    <Form.Group controlId="dosis">
                        <Form.Label>Dosis del Medicamento</Form.Label>
                        <Form.Control
                            type="number"
                            name="dosis"
                            value={inputValues.dosis || ''}
                            onChange={(event) => handleInputChange(event, 'dosis')}
                            min="1"
                        />
                    </Form.Group>
                    <Form.Group controlId="frecuencia">
                        <Form.Label>Frecuencia en que se tomará el Medicamento</Form.Label>
                        <Form.Control
                            type="number"
                            name="frecuencia"
                            value={inputValues.frecuencia || ''}
                            onChange={(event) => handleInputChange(event, 'frecuencia')}
                            min="1" // Mínimo valor permitido
                        />
                    </Form.Group>
                    <Form.Group controlId="duracion">
                        <Form.Label>Durante cuantos días</Form.Label>
                        <Form.Control
                            type="number"
                            name="duracion"
                            value={inputValues.duracion || ''}
                            onChange={(event) => handleInputChange(event, 'duracion')}
                            min="1"
                        />
                    </Form.Group>
                    <Form.Group controlId="soloParaMalestar">
                        <Form.Check
                            type="checkbox"
                            label="Solo para cuando esté mal"
                            name="soloParaMalestar"
                            checked={inputValues.soloParaMalestar || false}
                            onChange={(event) => handleInputChange(event, 'soloParaMalestar')}
                        />
                    </Form.Group>
                    <input type="hidden" name="correo" value={userEmail || ''} onChange={handleInputChange} />
                    <input type="hidden" name="nombreUser" value={userName || ''} onChange={handleInputChange} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cerrar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSaveMedication}
                    disabled={isSaveButtonDisabled}
                >
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MedicationModal;
