import express from "express";
import mysql from "mysql";
import cors from 'cors';

function formatFechaDB(fechaDB) {
  const fecha = new Date(fechaDB);

  const options = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false // Usar formato de 24 horas
  };

  const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(fecha);
  return formattedDate;
}
// funcion para formato hora mysql
function obtenerFechaHoraActual() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Agregar un cero delante si el valor es menor que 10
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}

// fin para funcion formato hora


const app = express();
app.use(
  express.json(),
  cors()
);

const conexion = mysql.createConnection({
  host: 'mysql-gussgtz.alwaysdata.net', // Cambia "server" a "host"
  user: 'gussgtz',
  password: 'Gus_08*gc.2001',
  database: 'gussgtz_medicamentos'
});

conexion.connect(function (error) {
  if (error) {
    console.log("Error al conectar");
  } else {
    console.log("Conexion realizada exitosamente");
  }
});

// LISTAR LOS MEDICAMENTOS DE LA BD
app.get('/obtenerMedicamentos', (peticion, respuesta) => {
  const sql = "SELECT * FROM medicamento";
  conexion.query(sql, (error, resultado) => {
    if (error) return respuesta.json({ error: "Error en la consulta" });
    return respuesta.json({ medicamentos: resultado });
  });
});

// Obtener la descripción de un medicamento por nombre
app.get('/obtenerDescripcionMedicamento/:nombre', (peticion, respuesta) => {
  const nombre = peticion.params.nombre;
  const sql = "SELECT descripcion FROM medicamento WHERE nombre=?";
  conexion.query(sql, [nombre], (error, resultado) => {
    if (error) {
      return respuesta.json({ error: "Error en la consulta" });
    }
    if (resultado.length === 0) {
      return respuesta.json({ error: "Medicamento no encontrado" });
    }
    const descripcion = resultado[0].descripcion;
    return respuesta.json({ descripcion });
  });
});


// Obtener la descripción de un medicamento por nombre
/*
app.get('/obtenerSigDosis/:correo', (peticion, respuesta) => {
  let medicina = null;
  let id_user = 0;
  const nombre = peticion.params.correo;

  const sql = "SELECT * FROM usuario WHERE email=?";
  conexion.query(sql, [nombre], (error, resultado) => {
    if (error) {
      return respuesta.json({ error: "Error en la consulta" });
    }
    if (resultado.length === 0) {
      return respuesta.json({ error: "Usuario no encontrado" });
    }

    id_user = resultado[0].id; // Encontré el usuario
    
    const sqld = "SELECT * FROM usuario_medicamento WHERE id_usuario = ? ORDER BY id DESC LIMIT 0, 1";
    conexion.query(sqld, [id_user], (error, resultadod) => {
      if (error) {
        return respuesta.json({ error: "Error en la consulta de dosis" });
      }
      if (resultadod.length === 0) {
        return respuesta.json({ error: "Dosis no encontrada" });
      }
      
      medicina = resultadod[0].medicamento;
      console.log(medicina);
      console.log(id_user);
      let fh=formatFechaDB(resultadod[0].fecha_hora);
      return respuesta.json({ id_us: id_user, medicina: medicina,fecha_hora:fh,frecuencia:resultadod[0].cada_cuando });
    });
  });
});
*/
app.get('/obtenerSigDosis/:correo', (peticion, respuesta) => {
  let id_user = 0;
  const nombre = peticion.params.correo;

  const sql = "SELECT * FROM usuario WHERE email=?";
  conexion.query(sql, [nombre], (error, resultado) => {
    if (error) {
      return respuesta.json({ error: "Error en la consulta" });
    }
    if (resultado.length === 0) {
      return respuesta.json({ error: "Usuario no encontrado" });
    }

    id_user = resultado[0].id; // Encontré el usuario

    const sqld = "SELECT * FROM usuario_medicamento WHERE id_usuario = ? ";
    conexion.query(sqld, [id_user], (error, resultadod) => {
      if (error) {
        return respuesta.json({ error: "Error en la consulta de dosis" });
      }
      if (resultadod.length === 0) {
        return respuesta.json({ error: "Dosis no encontrada" });
      }

      const resultados = resultadod.map((item) => {
        return {
                 id_us: id_user,
                 medicina: item.medicamento,
                 dosis:item.dosis,
                 frecuencia: item.cada_cuando,
                 duracion: item.duracion,
                 fecha_hora: formatFechaDB(item.fecha_hora),
                 id_dosis: item.id,
                 aplicado:item.aplicado
                 
         };
     });

      respuesta.json(resultados);
    });
  });
});

// marcar como aplicado o tomado

app.post('/tomado', (peticion, respuesta) => {
    const {id_dosis,aplicado } = peticion.body;
    let marcar=0;
    if (aplicado === 0) {
	    marcar=1;
	}   
       
     const sqlUpdate = "UPDATE usuario_medicamento SET aplicado = ? where  id = ? ";
	 conexion.query(sqlUpdate, [marcar, id_dosis], (error, resultado) => {
	           if (error) {
	   			         return respuesta.json({ error: "Error al insertar en la base de datos" });
                 }
                
             
    });
     
    
    
    
    
    
    return respuesta.json({iddosis: id_dosis,ok:true});
 
});




// Obtener la descripción de un medicamento por nombre
app.post('/verificarUser', (peticion, respuesta) => {
  const { nombre, dosis, frecuencia, duracion, soloParaMalestar, correo,nombreUser } = peticion.body;
  
  let id_user=0;
  let id_dosis=0;
  let fechaHoraActual = null;
   
  console.log(correo);
  const sql = "SELECT id,nombre,email FROM usuario WHERE email=?";
  conexion.query(sql, [correo], (error, resultado) => {
  console.log(resultado); 
    if (error) {
      return respuesta.json({ error: "Error en la consulta" });
    }
    if (resultado.length === 0) {
       //respuesta.json({ error: "Usuario no encontrado e insertamos"});
       // SI NO ESTA EL USUARIO EN NUESTRA BASE DE DATOS LO INSERTAMOS
       const sqlInsert = "INSERT INTO usuario (nombre,email) VALUES (?, ?)";
	   conexion.query(sqlInsert, [nombreUser, correo], (error, resultado) => {
	           if (error) {
	   			         return respuesta.json({ error: "Error al insertar en la base de datos" });
                 }
       id_user = resultado.insertId; // Obtener el ID del usuario insertado
       //return respuesta.json({id: id_user });
        });
        // FIN RELACION A NUESTRO USUARIO.
        
        
       
       
       return 0;
    }
     if(id_user==0){
        id_user = resultado[0].id;
     }
    
    
    
    // INSERTAMOS EN LA TABLA DE USUARIO_MEDICAMENTOS (DOSIS).
           fechaHoraActual = obtenerFechaHoraActual(); 
           const sqlInsertD = "INSERT INTO usuario_medicamento (id_usuario,medicamento,fecha_hora,cada_cuando,dosis,duracion) VALUES (?, ?,?,?,?,?)";
	       conexion.query(sqlInsertD, [id_user, nombre,fechaHoraActual,frecuencia,dosis,duracion], (error, resultadod) => {
	           if (error) {
	   			         return respuesta.json({ error: "Error al insertar en la base de datos" });
                 }
            id_dosis = resultadod.insertId; // Obtener el ID del usuario insertado
           //return respuesta.json({iddosis: id_dosisr });
        });
        
        
        
        // FIN  INSERACION TABLA DOSIS
    
    
    
    
    return respuesta.json({idu:id_user,iddosis: id_dosis,fecha_hora:fechaHoraActual,frecuencia:frecuencia });
  });
});




app.listen(8082, () => {
  console.log("Servidor iniciado...");
});
