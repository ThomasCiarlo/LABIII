import Anuncio_Auto from "./Anuncio_Auto.js";

const Anuncios=JSON.parse(localStorage.getItem("lista")) || []


window.addEventListener("DOMContentLoaded",()=>{

    document.forms[0].addEventListener("submit",handlerSubmit);

   document.addEventListener("click",handlerClick);

    if(Anuncios.length > 0)
    {
      handlerLoadList(Anuncios);
    }
});

function limpiarFormulario(frm){

  frm.reset();
  for (let i = 0; i < 3; i++) {
      document.forms[0].combustible[i].checked = false;          
}
  document.getElementById("btnEliminar").classList.add("oculto");
  document.getElementById("Alerta").classList.add("oculto");
  document.getElementById("btnGuardar").value = "Alta Anuncio";
  document.forms[0].id.value = "";

}

function handlerSubmit(e)
{
  e.preventDefault();

  const frm = e.target;

  if(frm.id.value)
  { 

    const Titulo = frm.Titulo.value;
    const Transaccion = frm.Transaccion.value;
    const Descripcion = frm.Descripcion.value;
    const Precio = frm.Precio.value;
    const Puertas = frm.Puertas.value;
    const KMS = frm.KMS.value;
    const Potencia = frm.Potencia.value;
    let combustible = [];
    document.querySelectorAll('input[name="combustible"]').forEach(function(el) {

      if (el.checked) {
      combustible.push(el.value);
      }
    })

    agregarSpinner();
    setTimeout(() => {
    const AnuncioEditado = new Anuncio_Auto(frm.id.value,Titulo,Transaccion,Descripcion,Precio,Puertas,KMS,Potencia,combustible);
    if(confirm("confirma modificacion")){
      modificarAnuncio(AnuncioEditado);
      almacernaDatos(Anuncios);
      limpiarFormulario(frm);
      } 
    eliminarSpinner()},2000)
    
  
   
   }
    else{

      let falta = false;
      const listaCampos = [];
      console.log("Dando de alta");

      const Titulo = frm.Titulo.value;
      const Descripcion = frm.Descripcion.value;
      const Precio = frm.Precio.value;
      const Puertas = frm.Puertas.value;
      const KMS = frm.KMS.value;
      const Potencia = frm.Potencia.value;

      listaCampos.push(Titulo);
      listaCampos.push(Descripcion);
      listaCampos.push(Precio);
      listaCampos.push(Puertas);
      listaCampos.push(KMS);
      listaCampos.push(Potencia);

      falta = ValidarCampo(listaCampos);

      const Transaccion = frm.Transaccion.value;
      let combustible = [];
  

      document.querySelectorAll('input[name="combustible"]').forEach(function(el) {

      if (el.checked) {
      combustible.push(el.value);
      }
    })
      
    agregarSpinner();
    setTimeout(() => {
      if(!falta){
        if(confirm("confirma Inserccion")){
      const nuevoAnuncio = new Anuncio_Auto(Date.now(),Titulo,Transaccion,Descripcion,Precio,Puertas,KMS,Potencia,combustible);     
      altaAnuncio(nuevoAnuncio);
      limpiarFormulario(frm);
        }
      }
       eliminarSpinner()},2000)
}
}

function altaAnuncio(p)
{
  Anuncios.push(p);
  almacernaDatos(Anuncios);
}

function modificarAnuncio(p){

  let index = Anuncios.findIndex((per)=>{
    return per.id == p.id;
  });
  console.log(index);
  Anuncios.splice(index,1,p);

}



function almacernaDatos(data){
    localStorage.setItem("lista",JSON.stringify(data));
    handlerLoadList();
  }

function agregarSpinner(){

  let spinner = document.createElement("img");
  spinner.setAttribute("src","./images/spinner.PNG");
  spinner.setAttribute("alt","imagen spinner");

  document.getElementById("spinner-container").appendChild(spinner);

}

function handlerLoadList(e)
{
    renderizarLista(crearTabla(Anuncios),document.getElementById("Tabla"));
}

function renderizarLista(lista, contenedor) {
    while (contenedor.hasChildNodes()) {
      contenedor.removeChild(contenedor.firstChild);
    }
    if(lista)
    {
       contenedor.appendChild(lista);
    }
    
  }

  
function crearTabla(items)
{
  const tabla = document.createElement("table");

  tabla.appendChild(crearThead(items[0]));
  tabla.appendChild(crearTBody(items));

  return tabla;
}

function crearThead(item)
{
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  tr.style.backgroundColor = "blue";
  for(const key in item)
  {

    const th = document.createElement("th");
    th.textContent = key;
    tr.appendChild(th);
    
  };
  thead.appendChild(tr);
  return thead;
}

function crearTBody(items)
{
  const Tbody = document.createElement("tbody");

    items.forEach((element) => {
    const tr = document.createElement("tr");   
    for(const key in element)
    {
      
      const td = document.createElement("td");
      td.textContent = element[key];     
      tr.appendChild(td);  

      if(key === "id")
      {
        tr.setAttribute("data-id",element[key]);
      }
 
    }
    Tbody.appendChild(tr);  
  }); 
  return Tbody;
}

function handlerClick(e)
{
  if(e.target.matches("td")){
  let id = e.target.parentNode.dataset.id;
  console.log(id);
  cargarFormulario(id);
  }
  else if(e.target.matches("#btnEliminar"))
  {
     let id = parseInt(document.forms[0].id.value);

     if(confirm("Confimar Eliminacion")){
      agregarSpinner();
      setTimeout(() => {
        let indice = Anuncios.findIndex(el=> el.id == id);
        Anuncios.splice(indice,1);
        almacernaDatos(Anuncios);
        limpiarFormulario(document.forms[0]);
        eliminarSpinner();
      }, 2000);
     }
  }
}

function cargarFormulario(id){
  
  let anuncio = Anuncios.filter(n=>n.id == id)[0];
  console.log(anuncio);
  document.forms[0].id.value = anuncio.id;
  document.forms[0].Titulo.value = anuncio.titulo;
  document.forms[0].Transaccion.value = anuncio.transaccion;
  document.forms[0].Descripcion.value = anuncio.descripcion;
  document.forms[0].Precio.value = anuncio.precio;
  document.forms[0].Puertas.value = anuncio.puertas;
  document.forms[0].KMS.value = anuncio.km;
  document.forms[0].Potencia.value = anuncio.potencia;

  for (let index = 0; index < 3; index++) {
      for (let i = 0; i < anuncio.combustible.length; i++) {
        if(document.forms[0].combustible[index].value == anuncio.combustible[i])
        {
        document.forms[0].combustible[index].checked = true;       
        }      
    }
    
  }


  document.getElementById("btnGuardar").value = "Modificar";
  document.getElementById("btnEliminar").classList.remove("oculto");
}

function eliminarSpinner(){

  document.getElementById("spinner-container").innerHTML="";

}

function ValidarCampo(valor)
{
  const todoOk = false;

  for (let index = 0; index < valor.length; index++) {
        
        if(valor[index] === "")
        {
          alert("Completar todos los campos");
          return true;
        }
    
    }

    return false;
}