import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from  '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  form: FormGroup;
  apps = [];
  baseUrl:string = "http://localhost:8000/api";
  httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache'
  });    
  options = {
    headers: this.httpHeaders
  };      

  constructor(private formBuilder: FormBuilder, private rest: HttpClient) {

    this.form = this.formBuilder.group({
      'id': [null],
			'name': [null, Validators.compose([Validators.required])],
			'bundle_id': [null, Validators.compose([Validators.required, Validators.maxLength(100)])]
		});
    this.listAll();
  }

  save() {
    let params = this.form.getRawValue();
    
    if (!!params.id) {
      return this.update(params);
    }

    this.create(params);
  }

  create(params:any) {
    this.rest.post(this.baseUrl + '/apps/', params, this.options)
    .subscribe(
      resultado => { 
        this.listAll();
        console.log(resultado);
      },
      erro => {
        console.log(erro);
      }
    );
  }

  update(params:any) {
    this.rest.put(this.baseUrl + '/apps/'+ params.id, params, this.options)
    .subscribe(
      resultado => { 
        this.listAll();
        this.form.get('id').setValue(null);
        this.form.get('name').setValue(null);
        this.form.get('bundle_id').setValue(null);
      },
      erro => {
        console.log(erro);
      }
    );
  }

  listAll() {
    this.rest.get(this.baseUrl + '/apps/', this.options)
    .subscribe(
      (resultado: any) => { 
        this.apps = resultado;
      },
      erro => {
        console.log(erro);
      }
    );
  }

  get(app: any) {
    this.rest.get(this.baseUrl + '/apps/' + app.id, this.options)
    .subscribe(
      (resultado: any) => {
        this.form.get('id').setValue(resultado.id);
        this.form.get('name').setValue(resultado.name);
        this.form.get('bundle_id').setValue(resultado.bundle_id);
      },
      erro => {
        console.log(erro);
      }
    
    )
  }

  delete(app: any) {
    console.log(app);
  }

}
