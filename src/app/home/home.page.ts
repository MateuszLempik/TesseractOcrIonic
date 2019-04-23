import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { NgProgress } from 'ngx-progressbar';
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedImage: string;
  imageText: string;
  recognitionTime: number;
  img : string;
  lang: string;
  checkStatus: boolean;
  checkStatusButton: boolean;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private http: HTTP, private camera: Camera, private actionSheetCtrl: ActionSheetController, public progress: NgProgress) {
  }

  async selectSource() {    
    let actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  optionsFn($data){
    this.lang = $data.detail.value;
    if($data.detail.value){
      this.checkStatusButton = true;
    }
  }
  
  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      if(imageData){
        this.checkStatus = true;
      }
      this.selectedImage = `data:image/png;base64,${imageData}`;
      this.img = imageData;
    });
  }

  async presentAlert(error) {
    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();
  
    const alert = await alertController.create({
      header: 'Warning !',
      subHeader: 'Check your Internet connection !',
      message: error,
      buttons: ['OK']
    });
    return await alert.present();
  }

  recognizeImage() {
    const start = new Date().getTime();
    this.http.setDataSerializer("json");
    this.http.post('http://192.168.1.104:3000/', {imgDat: this.img, language: this.lang
    },{'Content-Type': 'application/json'}).then(response => {
      if(response.data){
        const end = new Date().getTime();
        console.log(end - start);
        this.imageText = response.data;
        this.recognitionTime = end - start;
      }
    }).catch(error => {
      this.presentAlert(error.error);
    });
  }
}
