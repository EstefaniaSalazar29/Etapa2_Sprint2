const URL = "http://localhost:3030/vehiculo";
let form = document.getElementById("formu");
let body = document.querySelector("body");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let placa = document.getElementById("placa").value;
  let linea = document.getElementById("linea").value;
  let modelo = document.getElementById("modelo").value;
  let v_seguro = document.getElementById("v_seguro").value;
  let v_tecnomecanica = document.getElementById("v_tecnomecanica").value;
//   let img = document.getElementById("img").value;

  let info = {
    id_placa: placa,
    id_linea: linea,
    modelo: modelo,
    fecha_vencimiento_seguro: v_seguro,
    fecha_vencimiento_tecnomecanica: v_tecnomecanica,
  };

  fetch('http://localhost:3030/vehiculo', {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(() => {
      return alert("correcto");
    })
    .catch(() => {
      alert("error");
    });
});

