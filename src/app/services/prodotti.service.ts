import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { ServerResponse } from '../models/ServerResponse.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServerRequest } from '../models/ServerRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdottiService {

  constructor(private httprequest:HttpRequestService) { }

  public getProdotto(id:number):Observable<ServerResponse>{
    return this.httprequest.getRequest(environment.serverUrl + "/ProdottiServlet?id="+id);
  }

  public getProdotti(): Observable<ServerResponse>{
    return this.httprequest.getRequest(environment.serverUrl + "/ProdottiServlet");
  }

  public insertProdotti(body:ServerRequest | FormData):Observable<ServerResponse>{
    return this.httprequest.postRequest(environment.serverUrl + "/ProdottiServlet",body)
  }

  public updateProdotti(id: number, body: ServerRequest | FormData): Observable<ServerResponse> {
    return this.httprequest.putRequest(environment.serverUrl + "/ProdottiServlet?id=" + id, body);
  }

  public deleteProdotti(id: number): Observable<ServerResponse> {
    return this.httprequest.deleteRequest(environment.serverUrl + "/ProdottiServlet?id=" + id);
  }
}
