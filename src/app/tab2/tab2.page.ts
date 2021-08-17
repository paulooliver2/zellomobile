import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private formBuilder: FormBuilder, 
    private rest: HttpClient,
    public alertController: AlertController) {{

    this.form = this.formBuilder.group({
      'id': [null],
			'name': [null, Validators.compose([Validators.required])],
			'bundle_id': [null, Validators.compose([Validators.required, Validators.maxLength(100)])]
		});
    this.listAll();
  }
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
        this.showAlert('Cadastrada com sucesso');
        this.listAll();
        this.resetForm();
      },
      erro => {
        this.showAlert('Falha no cadastro');
        console.log(erro);
      }
    );
  }

  update(params:any) {
    this.rest.put(this.baseUrl + '/apps/'+ params.id, params, this.options)
    .subscribe(
      resultado => { 
        this.showAlert('Alterada com sucesso');
        this.listAll();
        this.resetForm();
    },
      erro => {
        this.showAlert('Falha na alteração');
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
  delete(apps: any) {
    this.showPrompt('Deseja excluir?', () => {
      this.rest.delete(this.baseUrl + '/apps/' + apps.id, this.options)
      .subscribe(
        (resultado: any) => {
          this.showAlert('Excluido com sucesso');
          this.listAll();
      },
        erro => {
          this.showAlert('Falha na exclusão');
          console.log(erro);
        }
      )
    });
  }

  getProfile(apps: number) {
    return this.apps[apps];
  }

  resetForm() {
    this.form.get('id').setValue(null);
    this.form.get('name').setValue(null);
    this.form.get('cpf').setValue(null);
    this.form.get('rg').setValue(null);
    this.form.get('birthdate').setValue(null);
    this.form.get('profile').patchValue(null);
  }

  async showAlert(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: '',
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  showPrompt(mensagem: string, action: CallableFunction) {
    this.alertController.create({
      header: 'Confirmação',
      subHeader: '',
      message: mensagem,
      buttons: [
        {
          text: 'Cancelar',
          handler: (data: any) => {
            return;
          }
        },
        {
          text: 'Confirmar',
          handler: (data: any) => {
            action();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
}
