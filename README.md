## Ionic Text Recognition App

This app has been created using ionic cordova technology

### Functionalities

- taking a picture with a smartphone camera or choosing a picture from smartphone gallery, 
- image recognition using Tesseract.js library,
- coping recognized text to the smartphone clipboard,
- 3 recognition languages available: Polish, German and English

### App presentation

![Image1](https://raw.githubusercontent.com/MateuszLempik/TesseractOcrIonic/master/gallery/picture3.png)

[Link to presentation video](https://github.com/MateuszLempik/TesseractOcrIonic/blob/master/gallery/2019-11-13_10h27_00.mp4)

### Implementation

Using Ionic client to take a picure and send it to Node.js server which is hosted on cloud application platform [Heroku](https://www.heroku.com/)

Using Node.js incl. [npm express library](https://www.npmjs.com/package/express) to get image data needed for [Tesseract.js](https://tesseract.projectnaptha.com/)

#### Recognition process

- Ionic

```js
  recognizeImage() {
    this.http.setDataSerializer("json");

    this.loadingController.create({
      message: 'Please wait...'
    }).then(loading => loading.present());

    this.http.post('https://polar-harbor-38401.herokuapp.com/', {imgDat: this.img, language: this.lang
    },{'Content-Type': 'application/json'}).then(response => {
      if(response.data){
        this.loadingController.dismiss();
        this.imageText = response.data;
        this.checkCopyButton = true;
      }
    }).catch(error => {
      this.presentAlert(error.error);
    }).finally(() => {
      this.loadingController.dismiss();
    });
  }
```

- Node.js

```js
  .post('/', (req, res) => {
    const data = req.body.imgDat;
    const language = req.body.language;

    console.log(req.body.language);
    console.log("Recognizing image...")

    const buffer = Buffer.from(data, 'base64');
    
    Tesseract.recognize(buffer, {
      lang: language
    }).progress(progress => {
      console.log(progress)
    })
    .then(result => {
      res.send(result.text)
    }).catch(error => {
      console.error(error)
    });
  })
```

