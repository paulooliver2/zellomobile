import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AlertController } from '@ionic/angular';

interface Profile {
  id: number;
  name: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  profiles: Profile[] = [
    {
      id: 1,
      name: "Usuário"
    },
    {
      id: 2,
      name: 'Gestor'
    },
    {
      id: 3,
      name: 'Administrador'
    }
  ];

  profile = {
    1: "Usuário",
    2: "Gestor",
    3: "Administrador"
  };

  form: FormGroup;
  persons: [];
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
    public alertController: AlertController) {

    this.form = this.formBuilder.group({
			'id': [null],
      'name': [null, Validators.compose([Validators.required])],
			'cpf': [null, Validators.compose([Validators.required, Validators.minLength(11)])],
      'rg': [null, Validators.compose([Validators.required, Validators.maxLength(30)])],
      'birthdate': [null, Validators.compose([Validators.required])],
      'profile': [null, Validators.compose([Validators.required])]
		});

    this.listAll();
  }

  save() {
    let params = this.form.getRawValue();
    params.profile = params.profile.id;
    params.birthdate = params.birthdate.split("T")[0];
    
    if (!!params.id) {
      return this.update(params);
    }

    this.create(params);
  }

  create(params:any) {
    this.rest.post(this.baseUrl + '/person/', params, this.options)
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
    this.rest.put(this.baseUrl + '/person/'+ params.id, params, this.options)
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

  get(person: any) {
    this.rest.get(this.baseUrl + '/person/' + person.id, this.options)
    .subscribe(
      (resultado: any) => {
        this.form.get('id').setValue(resultado.id);
        this.form.get('name').setValue(resultado.name);
        this.form.get('cpf').setValue(resultado.cpf);
        this.form.get('rg').setValue(resultado.rg);
        this.form.get('birthdate').setValue(resultado.birthdate);
        this.form.get('profile').patchValue(resultado.profile);
    },
      erro => {
        console.log(erro);
      }
    )
  }

  delete(person: any) {
    this.showPrompt('Deseja excluir?', () => {
      this.rest.delete(this.baseUrl + '/person/' + person.id, this.options)
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

  getProfile(profileId: number) {
    return this.profile[profileId];
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
