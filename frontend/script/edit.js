const URL = "http://localhost:3030/vehiculo";
let contenedor = document.getElementById("contenedor");

const datos = async () => {
  try {
    const respuesta = await fetch(URL);
    const obtenerD = await respuesta.json();
    console.log(obtenerD);
    pintarD(obtenerD);
  } catch (error) {
    console.log(error);
  }
};
datos();

function pintarD(datos) {
  console.log(datos);
  datos.forEach((datosVehiculo) => {
    console.log(datosVehiculo);
    const {id_placa, id_linea, modelo, fecha_vencimiento_seguro, fecha_vencimiento_tecnomecanica} = datosVehiculo;
    const fecha_S = fecha_vencimiento_seguro.slice(0, -14)
    const fecha_T = fecha_vencimiento_tecnomecanica.slice(0, -14)
    contenedor.innerHTML += `
<div class="col">
  <div class="card">
    
    <div class="card-body">
      <h5 class="card-title">Vehículo: ${id_placa}</h5>
      <p class="card-text">
      <ul>
      <li>Esta es la linea: ${id_linea}</li>
      <li>Este es el modelo: ${modelo}</li>
      <li>Esta es la fecha de vencimiento del seguro: ${fecha_S}</li>
      <li>Esta es la fecha de vencimiento de la tecnomecanica: ${fecha_T}</li>
      </ul>
      </p>
    </div>
  </div>
</div>


`;
  });
}


