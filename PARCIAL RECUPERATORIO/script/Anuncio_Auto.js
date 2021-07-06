import Anuncio from "./Anuncio.js";

export default class Anuncio_Auto extends Anuncio
{
  constructor(id,titulo,transaccion,descripcion,precio,puertas,km,potencia,combustible)
  {
    super(id,titulo,transaccion,descripcion,precio);
    this.puertas = puertas;
    this.km = km;
    this.potencia = potencia;
    this.combustible = combustible
  }

}