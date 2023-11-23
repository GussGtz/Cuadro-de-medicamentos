import React, { useState, useEffect, useRef } from 'react';
import { FaSun, FaMoon, FaClock } from 'react-icons/fa';
import { MdRotateRight } from 'react-icons/md';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MedicationModal from './MedicationModal';
import './MedicationChart.css';
import NavigationBar from './Navbar';
import { useNavigate, Link } from 'react-router-dom';


function obtenerPeriodoDelDia(fechaString) {
  		const partes = fechaString.split(', '); // Dividir la fecha y hora
  		const fechaPartes = partes[0].split('/'); // Dividir la fecha en día, mes y año
  		const horaPartes = partes[1].split(':'); // Dividir la hora en horas, minutos y segundos

  		const anio = parseInt(fechaPartes[2]);
  		const mes = parseInt(fechaPartes[1]) - 1; // Restar 1 porque los meses van de 0 a 11 en JavaScript
  		const dia = parseInt(fechaPartes[0]);
  		const horas = parseInt(horaPartes[0]);

  		const fecha = new Date(anio, mes, dia, horas);

  		console.log(horas);

  		if (horas >= 0 && horas <= 12) {
  				return 'Morning';
  		} else if (horas > 12 && horas <= 13) {
  				return 'Noon';
  		} 
  		else if (horas >13 && horas <= 18) {
  				return 'Evening';
  		} 
  		else {
  				return 'Night';
  		}
}




function sumarHorasAFecha(fechaString, horasASumar) {
  		// Dividimos la cadena de fecha y hora en dos partes
  		const [fechaPart, horaPart] = fechaString.split(', ');

  		// Dividimos la parte de la fecha en día, mes y año
  		const [dia, mes, anio] = fechaPart.split('/');

  		// Dividimos la parte de la hora en horas, minutos y segundos
  		const [hora, minutos, segundos] = horaPart.split(':');

  		// Creamos un nuevo objeto Date con los componentes de fecha y hora
  		const fecha = new Date(anio, mes - 1, dia, hora, minutos, segundos);

  		// Sumamos las horas a la fecha
  		fecha.setHours(fecha.getHours() + horasASumar);

  		// Formateamos la nueva fecha según tu formato deseado
  		const options = {
  						year: 'numeric', month: '2-digit', day: '2-digit',
  						hour: '2-digit', minute: '2-digit', second: '2-digit'
  		};

  		const fechaFormateada = new Intl.DateTimeFormat('es-ES', options).format(fecha);
  		return fechaFormateada;
}



const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : null;
};


// Nodo Padre empieza

const MedicationChart = () => {
	
  	
  	const navigate = useNavigate();
  
    // traigo o leo la cokie que declare y le asigne el valor de correo cuando me loguie desde google o facebool
    const [userEmail, setUserEmail] = useState(null);
    useEffect(() => {
	         // Obtener el valor de la cookie 'userEmail'
	         const emailFromCookie = getCookie('userEmail');
	 	     if (emailFromCookie) {
	 			setUserEmail(emailFromCookie);
    	     }
     }, []);

     // llamada ala api para obtener medicamentos
/*
	 useEffect(() => {
	 				   if (userEmail) {
                              fetch(`http://localhost:8082/obtenerSigDosis/${userEmail}`)
                              .then((response) => {
                                       if (!response.ok) {
                                               throw new Error('Error al obtener la próxima dosis');
                                       }
                                       return response.json();
                              })
							  .then((data) => {
	      
							  		let sigdo=sumarHorasAFecha(data.fecha_hora, data.frecuencia); 
							  		const periodoDelDia = obtenerPeriodoDelDia(sigdo);
							  		console.log(`El período del día es: ${periodoDelDia}`);
							  		if(periodoDelDia=='maniana'){
							  			setDescripcionDosisM(data.medicina);
							  			setPeriodoDiaM(sigdo);
							  			setPriTomaM(data.fecha_hora);
							  			setFreM(data.frecuencia);
	      							}else if(periodoDelDia=='medio'){
		  								setDescripcionDosisMe(data.medicina);
		  								setPeriodoDiaMe(sigdo);
		  								setPriTomaMe(data.fecha_hora);
		  								setFreMe(data.frecuencia);
	      							} 
		  							else if(periodoDelDia=='tarde'){
		  								setDescripcionDosisT(data.medicina);
		  								setPeriodoDiaT(sigdo);
		  								setPriTomaT(data.fecha_hora);
		  								setFreT(data.frecuencia);
	      							}else if(periodoDelDia=='noche'){
		  								setDescripcionDosisN(data.medicina);
		  								setPeriodoDiaN(sigdo);
		  								setPriTomaN(data.fecha_hora);
		  								setFreN(data.frecuencia);
	      							}    
        					  })
							  .catch((error) => {
							  	console.error('Error:', error);
							  	// Manejar errores
        					});
    					}
     }, [userEmail]);
  */
 
//20231122
const handleCheckboxClick = (id,aplicado) => {
  		// Realizar la llamada a la API usando fetch para actualizar la base de datos
  		fetch(`http://localhost:8082/tomado`, {
  					method: 'POST', // Método HTTP para actualizar el registro
  					headers: {
  					'Content-Type': 'application/json', // Tipo de contenido de la solicitud
                    // Otros encabezados si es necesario
                   },
                   body: JSON.stringify({ id_dosis: id,aplicado:aplicado})
        })
         .then((response) => {
         // Manejar la respuesta de la API
        if (response.ok) {
             window.location.href = 'http://localhost:3000/MedicationChart';
        } else {
            // Hubo un problema al actualizar el registro
            // Manejar el error adecuadamente
        }
     })
      .catch((error) => {
        // Manejar errores de red u otros errores
        console.error('Error:', error);
     });
 };

// fin 20231122
 
 
  
const [dosis, setDosis] = useState({
  Morning: [],
  Noon: [],
  Evening: [],
  Night: [],
});


 useEffect(() => {
  if (userEmail) {
    fetch(`http://localhost:8082/obtenerSigDosis/${userEmail}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la próxima dosis');
        }
        return response.json();
      })
      .then((dataArray) => {
        const newData = { ...dosis };
        dataArray.forEach((data) => {
          let sigdo = sumarHorasAFecha(data.fecha_hora, data.frecuencia);
          const periodoDelDia = obtenerPeriodoDelDia(sigdo);

          console.log(`medicina: ${data.medicina}`);
          console.log(`El período del día es: ${periodoDelDia}`);
          console.log(`Sig dosis: ${sigdo}`);

          if (data.medicina && periodoDelDia) {
            const newDataItem = {
              descripcion: data.medicina,
              dosis:data.dosis,
              frecuencia: data.frecuencia,
              duracion:data.duracion,
              periodo: data.periodo,
              sigdo: sigdo,
              primerToma: data.fecha_hora,
              id_dosis:data.id_dosis,
              aplicado:data.aplicado
             
            };

            newData[periodoDelDia].push(newDataItem);
            console.log(newData);
          }
        });

        setDosis(newData);
      })
      .catch((error) => {
        console.error('Error:', error);
        // Manejar errores
      });
  }
}, [userEmail]);
  // fin consumir	
	
	const [medicamentos, setMedicamentos] = useState([]);
	const [inputValues, setInputValues] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [medicamentosOptions, setMedicamentosOptions] = useState([]);
	const [suggestedMedicamentos, setSuggestedMedicamentos] = useState([]);
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);
	const timerRef = useRef(null);
	const [selectedMedicamentos, setSelectedMedicamentos] = useState([]);
	const [descriptions, setDescriptions] = useState({});
    
    // verificar si es necesario
	const calculateHorario = (horaInicio) => {
    			if (!horaInicio) return 'Unknown';
						const [hour, minute] = horaInicio.split(':').map(Number);

				if ((hour >= 6 && (hour < 12 || (hour === 12 && minute === 0))) ) {
						return 'Morning';
    			} else if ((hour >= 12 && (hour < 16 || (hour === 16 && minute === 0))) ) {
						return 'Noon';
    			} else if ((hour >= 16 && (hour < 19 || (hour === 19 && minute === 0)))) {
						return 'Evening';
    			} else {
						return 'Night';
    			}
  	};

  	const calculateHorarioActual = () => {
    			const currentHour = new Date().getHours();

				if (currentHour >= 6 && currentHour < 12) return 'Morning';
				if (currentHour >= 12 && currentHour < 16) return 'Noon';
				if (currentHour >= 16 && currentHour < 19) return 'Evening';
				return 'Night';
  	};

  	const calculateNextDoseTime = (horaInicio, frecuencia) => {
    		if (!horaInicio || typeof horaInicio !== 'string') return null;

			const [hour, minute] = horaInicio.split(':').map(Number);

			if (isNaN(hour) || isNaN(minute)) {
				return null;
    		}

			const currentDate = new Date();
			const nextDoseTime = new Date(currentDate);
			nextDoseTime.setHours(hour);
			nextDoseTime.setMinutes(minute);

			while (nextDoseTime <= currentDate) {
				nextDoseTime.setHours(nextDoseTime.getHours() + frecuencia);
    		}

			return nextDoseTime;
  	};

  	const updateNextDoseTime = (medication, horarioActual) => {
    		if (medication) {
					const nextDoseTime = calculateNextDoseTime(
					parseInt(medication.frecuencia),
					medication.horaInicio
			);

			setMedicamentos((prevMedicamentos) => prevMedicamentos.map((med) => {
							if (med.nombre === medication.nombre) {
								const timeRemaining = nextDoseTime - new Date(); // Calculate remaining time
								return {
									     ...med,
                                         nextDoseTime,
                                         horario: calculateHorario(medication.horaInicio),
                                         timeRemaining, // Update remaining time
                                 };
                            }
                            return med;
                          })
            );

           if (nextDoseTime) {
                  const currentTime = new Date();
                  const timeUntilNextDose = nextDoseTime - currentTime;

                  if (timeUntilNextDose > 0) {
                              timerRef.current = setTimeout(() => {
                                           updateNextDoseTime(medication, horarioActual);
                                          }, timeUntilNextDose);
                  }
          }
      }
   };

  useEffect(() => {
    axios
      .get('http://localhost:8082/obtenerMedicamentos')
      .then((respuesta) => {
	       console.log("hola");
           const medicamentosData = respuesta.data.medicamentos;
           setMedicamentosOptions(medicamentosData.map((med) => med.nombre));
           const descriptionsData = {};
           medicamentosData.forEach((med) => {
                descriptionsData[med.nombre] = med.descripcion;
           });
           setDescriptions(descriptionsData);

            // Initialize medicamentos with their next dose times
        const horarioActual = calculateHorarioActual();
        const currentTime = new Date();
        const updatedMedicamentos = medicamentosData.map((medication) => {
          const nextDoseTime = calculateNextDoseTime(
            parseInt(medication.frecuencia),
            medication.horaInicio
          );
          const timeUntilNextDose = nextDoseTime - currentTime;
          if (timeUntilNextDose > 0) {
            timerRef.current = setTimeout(() => {
              updateNextDoseTime(medication, horarioActual);
            }, timeUntilNextDose);
          }
          return {
            ...medication,
            nextDoseTime,
            horario: calculateHorario(medication.horaInicio),
            timeRemaining: timeUntilNextDose, // Initialize time remaining
          };
        });

        setMedicamentos(updatedMedicamentos);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleInputChange = (event, name) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    const suggestions = medicamentosOptions || [];
    if (typeof value === "string") {
      const filteredSuggestions = suggestions.filter((med) =>
        med && med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedMedicamentos(filteredSuggestions);
    }

    const requiredFields = ['nombre', 'dosis', 'frecuencia', 'duracion', 'horaInicio'];
    const allRequiredFieldsFilled = requiredFields.every((field) => !!inputValues[field]);
    setIsSaveDisabled(!allRequiredFieldsFilled);
  };

  const calculateNextDose = (horaInicio, frecuencia) => {
    if (!horaInicio || !frecuencia) return null;
    const [hour, minute] = horaInicio.split(':').map(Number);
    const currentDate = new Date();
    const nextDoseTime = new Date(currentDate);
    nextDoseTime.setHours(hour);
    nextDoseTime.setMinutes(minute);

    while (nextDoseTime <= currentDate) {
      nextDoseTime.setHours(nextDoseTime.getHours() + frecuencia);
    }

    return nextDoseTime;
  };

  const handleToggleSelected = (medication) => {
    setSelectedMedicamentos((prevSelected) => {
      if (prevSelected.includes(medication)) {
        return prevSelected.filter((med) => med !== medication);
      }
      return [...prevSelected, medication];
    });
  };

  const handleRestartTimer = (horario) => {
    // Find the medications with the specified schedule and reset their timers
    const updatedMedicamentos = medicamentos.map((medication) => {
      if (medication.horario === horario && medication.timeRemaining !== null) {
        if (timerRef.current) {
          clearInterval(timerRef.current); // Clear the previous timer
        }
        // Calculate the new time remaining and restart the timer
        const updatedTimeRemaining = medication.frecuencia * 60 * 60 * 1000;
        startTimer(medication, updatedTimeRemaining);
        return {
          ...medication,
          timeRemaining: updatedTimeRemaining,
        };
      }
      return medication;
    });
  
    setMedicamentos(updatedMedicamentos);
  };
  
  const startTimer = (medication, timeRemaining) => {
    timerRef.current = setInterval(() => {
      setMedicamentos((prevMedicamentos) =>
        prevMedicamentos.map((med) => {
          if (med.nombre === medication.nombre) {
            const updatedTimeRemaining = med.timeRemaining - 1000;
            return {
              ...med,
              timeRemaining: updatedTimeRemaining,
            };
          }
          return med;
        })
      );
  
      if (timeRemaining <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);
  };

  const handleSaveMedication = () => {
    
        navigate('/MedicationChart');
    
  };



  const timeData = [
    { label: 'Morning', icon: <FaSun style={styles.timeIcon} />, color: '#FFDDDD' },
    { label: 'Noon', icon: <FaClock style={styles.timeIcon} />, color: '#FFE8DD' },
    { label: 'Evening', icon: <FaSun style={styles.timeIcon} />, color: '#DDF2E8' },
    { label: 'Night', icon: <FaMoon style={styles.timeIcon} />, color: '#DDE7F2' },
    { label: 'Only when I need it', icon: <MdRotateRight style={styles.rotateIcon} />, color: '#E4E4E4' },
  ];

  const formatTimeRemaining = (timeRemaining) => {
    const hours = Math.floor(timeRemaining / 3600000);
    const minutes = Math.floor((timeRemaining % 3600000) / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      <NavigationBar />
      <div className="container">
        <div className="header">CUADRO DE MEDICAMENTOS</div>
        
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Agregar Medicamento
        </Button>
        <div>&nbsp;</div>
        <div className="tableContainer">
          <table className="table">
           
            <tbody>
              {timeData.map((time) => {
			  let correspondingData = [];

			  	if (dosis.hasOwnProperty(time.label)) {
			  			correspondingData = dosis[time.label];
    				}

				return (
						<tr key={time.label}>
							<td style={{ ...styles.td, background: time.color }}>
								{time.icon}
								<span style={{ color: '#555555', fontWeight: 'bold' }}>{time.label}</span>
							</td>
							<td style={{ ...styles.td, background: time.color }}>
							{correspondingData.length > 0 && (
          <table width='100%'>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Duracion</th>
                <th>Inicio</th>
                <th>Sig.Dosis</th>
                <th>Aplicado</th>
              </tr>
            </thead>
            <tbody>
              {correspondingData.map((data, index) => (
                <tr key={index}>
                  <td>{dosis[time.label][index].descripcion}</td>
                  <td>{dosis[time.label][index].dosis}</td>
                  <td>{dosis[time.label][index].frecuencia}</td>
                  <td>{dosis[time.label][index].duracion}</td>
                  <td>{dosis[time.label][index].primerToma}</td>
                  <td>
                  {dosis[time.label][index].sigdo}
                  </td>
                  <td>
                  <input
				  	type="checkbox"
				  		checked={dosis[time.label][index].aplicado === 1}
				  			onChange={() => handleCheckboxClick(dosis[time.label][index].id_dosis,dosis[time.label][index].aplicado)}
				    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
                            </td>
                      </tr>
                  );
              })}
            </tbody>
          </table>
          
          
          
          
        
          
          
        </div>
        <MedicationModal
          showModal={showModal}
          setShowModal={setShowModal}
          inputValues={inputValues}
          suggestedMedicamentos={suggestedMedicamentos}
          isSaveDisabled={isSaveDisabled}
          handleInputChange={handleInputChange}
          handleSaveMedication={handleSaveMedication}
        />
      </div>
    </>
  );
};

const styles = {
  timeIcon: {
    marginRight: '10px',
    verticalAlign: 'middle',
  },
  rotateIcon: {
    marginRight: '10px',
    verticalAlign: 'middle',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
  },
  column: {
    marginBottom: '5px',
  },
};

export default MedicationChart;