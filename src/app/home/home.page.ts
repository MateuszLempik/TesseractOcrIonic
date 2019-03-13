import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { NgProgress } from 'ngx-progressbar';
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import * as Tesseract from 'tesseract.js'
import { Buffer } from 'buffer';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedImage: string;
  imageText: string;
  img : string;
  lang: string;
  checkStatus: boolean;
  checkStatusButton: boolean;

  constructor(public navCtrl: NavController, private http: HTTP, private camera: Camera, private actionSheetCtrl: ActionSheetController, public progress: NgProgress) {
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

  recognizeImage() {
    this.http.setDataSerializer("json");
    this.http.post('http://192.168.1.111:3000/', {imgDat: this.img, language: this.lang
    },{'Content-Type': 'application/json'}).then(response => {
      this.imageText = response.data;
    }).catch(error => {
      console.log(error)
    });
  }

}