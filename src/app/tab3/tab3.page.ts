import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AlertController } from '@ionic/angular';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  form: FormGroup;
  personApps = [];
  persons = [];
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
      'person_id': [null, Validators.compose([Validators.required])],
			'apps_id': [null, Validators.compose([Validators.required])]
		});

    this.listAllPerson();
    this.listAllApps();
  }
}

  save() {
    if (!this.form.valid) {
      this.showAlert('Favor preencher os campos obrigatórios');
      return;
    }
    let params = this.form.getRawValue();
    this.create(params);
  }

  create(params:any) {
    this.rest.post(this.baseUrl + '/person/' + params.person_id + '/apps', params, this.options)
    .subscribe(
      resultado => { 
        this.showAlert('Cadastrada com sucesso');
        this.listAll(params);
      },
      erro => {
        this.showAlert('Falha no cadastro');
        console.log(erro);
      }
    );
  }

  listAllPerson() {
    this.rest.get(this.baseUrl + '/person/', this.options)
    .subscribe(
      (resultado: any) => { 
        this.persons = resultado;
      },
      erro => {
        console.log(erro);
      }
    );
  }

  listAllApps() {
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

  listAll(personapp: any) {
    if (!personapp.person_id) {
      return;
    }

    this.rest.get(this.baseUrl + '/person/' + personapp.person_id + '/apps', this.options)
    .subscribe(
      (resultado: any) => {
        this.personApps = resultado;
      },
      erro => {
        console.log(erro);
      }
    
    )
  }

  delete(personApp: any) {
    this.showPrompt('Deseja excluir?', () => {
      this.rest.delete(this.baseUrl + '/person/' + personApp.person_id + '/apps/' + personApp.id, this.options)
      .subscribe(
        (resultado: any) => {
          this.showAlert('Excluido com sucesso');
          this.listAll(personApp);
      },
        erro => {
          this.showAlert('Falha na exclusão');
          console.log(erro);
        }
      )
    });
  }

  resetForm() {
    this.form.get('person_id').setValue(null);
    this.form.get('apps_id').setValue(null);
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
