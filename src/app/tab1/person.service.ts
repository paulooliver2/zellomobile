import { Injectable } from  '@angular/core';
import { HttpClient } from  '@angular/common/http';


@Injectable()

export  class  RestProvider {

baseUrl:string = "http://localhost:127.0.0.1";

constructor(private  httpClient : HttpClient) { }

// Sending a GET request to /products

public  getProducts(){

}



}