import { Brand } from './brand.interface';
import { Categoria } from './categoria.interface';
import { Modello } from './modello.interface';
import { Prodotti } from './prodotti.interface';
import { UserRegister } from './UserRegister.interface';

export interface ServerResponse{
    message : string | UserRegister | Brand | Brand[] | Modello | Modello[] | Categoria | Categoria[] | Prodotti | Prodotti[];
    check:boolean;
}