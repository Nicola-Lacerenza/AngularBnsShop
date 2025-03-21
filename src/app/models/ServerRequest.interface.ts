import { Brand } from "./brand.interface";
import { Categoria } from "./categoria.interface";
import { Indirizzo } from "./indirizzo.interface";
import { Modello } from "./modello.interface";
import { ProdottiFull } from "./prodottiFull.interface";
import { UserLogin } from "./UserLogin.interface";
import { UserRegister } from "./UserRegister.interface";

export interface ServerRequest{
    body : UserLogin | UserRegister | Brand | Modello | Categoria | ProdottiFull | ProdottiFull[] | Indirizzo | Indirizzo[];
}