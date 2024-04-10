import { AfterViewInit, Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Filesystem } from '@capacitor/filesystem';
import { Directory, FileInfo } from '@capacitor/filesystem/dist/esm/definitions';
import { Haptics } from '@capacitor/haptics';
import { ImpactStyle } from '@capacitor/haptics/dist/esm/definitions';
import { GestureController, LoadingController } from '@ionic/angular';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { RecordingData } from 'capacitor-voice-recorder/dist/esm/definitions';


import { getDatabase, ref, set, get } from "firebase/database";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FirebaseUploadService } from '../services/firebase-upload.service';


import * as BlobUtil from 'blob-util';
// import { saveAs } from 'file-saver';
import { ApiService } from '../api.service';
import { time } from 'console';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

class FileMP3 {
  name: string;
  file: Promise<Blob>;

  constructor(name:string, file:Promise<Blob>) {
    this.file = file;
    this.name = name;
  }
}

class Feelsic {
  id: number;
  songName: string;
  artistName: string;
  songIdGenius: number;
  lyrics: string;
  chatGPTcomment: string;
  image: string;

  emotions : {
    anger: number;
    disgust: number;
    fear: number;
    joy: number;
    sadness: number;
    surprise: number;
  };
  emotions_percentage : {
    anger: number;
    disgust: number;
    fear: number;
    joy: number;
    sadness: number;
    surprise: number;
  };

  constructor(id: number, songName: string, artistName: string, songIdGenius: number, lyrics: string, chatGPTcomment: string, image: string, emotions : any, emotions_percentage: any) {
   
    this.id = id;
    this.songName = songName;
    this.artistName = artistName;
    this.songIdGenius = songIdGenius;
    this.lyrics = lyrics;
    this.chatGPTcomment = chatGPTcomment;
    this.image = image;
    this.emotions = emotions;
    this.emotions_percentage = emotions_percentage;
  }
}

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})



export class MainPage implements OnInit {

  recording = false;
  storedFileNames : FileInfo[] = [];
  //storedFileNames = [];
  durationDisplay = '';
  duration = 0;
  @ViewChild('recordbtn', { read: ElementRef })
  recordbtn!: ElementRef;
  status = false;
  fileUploads =<any> [];
  uploads =<any> [];	
  username = sessionStorage.getItem('name');
  userID = {};
  feelsicsList = <any> {};
  iterableList =<any>  [];

  constructor(
    private gestureCtrl: GestureController,
    public afs: AngularFirestore,
    private firebaseUploadService: FirebaseUploadService,
    private apiservice : ApiService,
    private loadingCtrl : LoadingController,
    private router : Router
  ) {}

  ngOnInit(){
    this.loadFiles();

    if(sessionStorage.getItem('id') != null){
      const db = getDatabase();
      //this.feelsics = get(ref(db, "/musics/"+sessionStorage.getItem('id')));

      get(ref(db, "/musics/"+sessionStorage.getItem('id'))).then((snapshot) => {
        if (snapshot.exists()) {
          // Convertir los datos en un objeto JavaScript
          this.feelsicsList = snapshot.val().feelsicDB;
          this.iterableList = this.json2Array(this.feelsicsList);


          this.apiservice.resolveSet(this.iterableList);

        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }
    VoiceRecorder.requestAudioRecordingPermission();
  }


  json2Array(jsonObject : any){
    let listFirst: string[] = [];

    console.log("dentro de la funcion");
    console.log(jsonObject);

    // Primer nivel de la lista (feelsiclist)
    jsonObject.forEach((element: string) => {
        listFirst.push(element);
    });
    return listFirst;
  }
  /*
  ngAfterViewInit() {
    const longpress = this.gestureCtrl.create({ 
      el: this.recordbtn.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        Haptics.impact({style: ImpactStyle.Light});
        this.startRecording();
        this.calculateDuration();
      },
      onEnd: ev =>{
        Haptics.impact({style: ImpactStyle.Light});
        this.stopRecording();
      }
    }, true);

    longpress.enable();
  }
  */

  calculateDuration(){
      if(!this.recording){
        this.duration = 0;
        this.durationDisplay = '';
        return;
      }

      this.duration += 1;

      const minutes = Math.floor(this.duration / 60);
      const seconds = (this.duration % 60).toString().padStart(2, '0');
      this.durationDisplay = `${minutes}:${seconds}`;

      setTimeout (() =>{
        this.calculateDuration();
      }, 1000);

  }

  async loadFiles(){
    Filesystem.readdir({
      path:'',
      directory: Directory.Data
    }).then(result => {
      console.log(result);

      const db = getDatabase();
      set(ref(db, '/files'), {
        result
      });

      this.storedFileNames = result.files;
    });
    console.log("maintab.page.ts line 33 loadFiles()", this.storedFileNames);
  }

  startRecording(){
    if(this.recording){
      return;
    }

    this.recording = true;
    VoiceRecorder.startRecording();

  }
  stopRecording(){
    if(!this.recording){
      return;
    }
    
    this.recording = false;
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if(result.value && result.value.recordDataBase64){
        const RecordData = result.value.recordDataBase64;

        console.log("maintab.page.ts line 53 VoiceRecorder.stopRecording()", RecordData);
        const time = new Date().getTime();
        const fileName = time + '.mp3';

        const db = getDatabase();
        set(ref(db, 'audioFiles/'+time+"/"), {
          file: result.value.recordDataBase64,
        });

        const blob = this.convertBase64ToMp3(result.value.recordDataBase64, time + ".mp3");
        let file = new FileMP3(fileName, blob);
        this.fileUploads.push(file);

        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: RecordData  
        });

        this.loadFiles();
        //this.base64ToMP3(result.value.recordDataBase64, time);
        this.sendRequest(this.fileUploads[0].file);
        console.log("FileUploads");
        console.log(this.fileUploads);
        console.log("FileUploads[0]");
        console.log(this.fileUploads[0].file);

        
      }
    })
  }

  async convertBase64ToMp3(base64Data: string, filename: string) {	
    const blob = BlobUtil.base64StringToBlob(base64Data);	
    const arrayBuffer = await blob.arrayBuffer();	
    const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });	
    const audioUrl = URL.createObjectURL(audioBlob);	
    const link = document.createElement('a');	
    link.href = audioUrl;	
    link.download = 'audio.mp3';	
    //document.body.appendChild(link);	
    //link.click();	
    //document.body.removeChild(link);	
    return audioBlob;	
  }

  async playFile(fileName: any){
    const audioFile = await Filesystem.readFile({
      path: fileName,
          directory: Directory.Data
    });
    console.log("maintab.page.ts line 70 playFile()", audioFile);
    const base64Sound = audioFile.data;

    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }

  async showlog (file : Feelsic){
    console.log(file);
  }


  async sendRequest(file: Promise<Blob>){

    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present();

    
    // creamos un feelsic nuevo
    const feelsic = this.initializeFeelsic();

    feelsic.id = Object.keys(this.feelsicsList).length;
    
    // se lo enviamos a shazam y cogemos el nombre de la cancion
    (await this.apiservice.sendPostRequestShazam(file)).subscribe(res =>{
      console.log(res);
      feelsic.songName = res.track.title;
      feelsic.artistName = res.track.subtitle;
      feelsic.image = res.track.images.coverart;

        // le enviamos el nombre de la cancion a genius y cogemos el id
      this.apiservice.sendGetRequestGeniusSong(feelsic.songName).subscribe(res =>{
        console.log(res);
        feelsic.songIdGenius = res.hits[0].result.id;


        // le enviamos el id de la cancion a genius y cogemos la letra
        this.apiservice.sendGetRequestGeniusLyrics(feelsic.songIdGenius).subscribe(res =>{
          console.log(res);
          feelsic.lyrics = res.lyrics.lyrics.body.plain.replace(/\n/g,' ');

          // le enviamos la letra a emotion y cogemos el analis
          this.apiservice.sendPostRequestEmotion(feelsic.lyrics).subscribe(res =>{
            console.log(res);
            feelsic.emotions.anger = res.emotion_scores.anger;
            feelsic.emotions.disgust = res.emotion_scores.disgust;
            feelsic.emotions.fear = res.emotion_scores.fear;
            feelsic.emotions.joy = res.emotion_scores.joy;
            feelsic.emotions.sadness = res.emotion_scores.sadness;
            feelsic.emotions.surprise = res.emotion_scores.surprise;

            feelsic.emotions_percentage = this.calc_emotion_percentage(feelsic.emotions);

            // le enviamos varia info a chatgpt para que haga un comment
            this.apiservice.sendPostRequestChatGPT(feelsic.songName, feelsic.artistName, feelsic.emotions_percentage).subscribe(res =>{
              console.log(res);
              feelsic.chatGPTcomment = res.choices[0].message.content;

              console.log(feelsic);

              if(feelsic.id == 0){

                this.feelsicsList[0] = feelsic;
                console.log(this.feelsicsList);

                const db = getDatabase();
                set(ref(db, 'musics/'+sessionStorage.getItem('id')+"/feelsicDB"), {
                  0: feelsic
                });

              } else{          
                  
                  this.feelsicsList[feelsic.id] = feelsic;
                  console.log("feelsic")
                  console.log(feelsic)
                  console.log("feelsicList")
                  console.log(this.feelsicsList); 

                  // le enviamos la lista de feelsics a la vista
                  //Object.

            
                  const db = getDatabase();
                  set(ref(db, 'musics/'+sessionStorage.getItem('id')+"/"), {
                    ["feelsicDB"]: this.feelsicsList,
                  });
              }

              loading.dismiss();
              
              this.iterableList = this.json2Array(this.feelsicsList);
              this.apiservice.resolveSet(this.iterableList);

              this.router.navigateByUrl(`tabs/feelsic/${feelsic.id}`);
              
  
            });
          });
        });
      });
    });    
  }

  initializeFeelsic(){

    const emotions = {
      anger: 0,
      disgust: 0,
      fear: 0,
      joy: 0,
      sadness: 0,
      surprise: 0
    };
    const emotions_percentage = {
      anger: 0,
      disgust: 0,
      fear: 0,
      joy: 0,
      sadness: 0,
      surprise: 0
    };
    const feelsic = new Feelsic(0,"songtutuname", "artistname", 0, "lyrics", "comment", "image", emotions, emotions_percentage);
    return feelsic;
  }
  calc_emotion_percentage(emotion : any){
    
    var total = emotion.anger + emotion.disgust + emotion.fear + emotion.joy + emotion.sadness + emotion.surprise;

    if(total == 0){
      total = 1;
    }

    const emotions_percentage = {
      anger : Math.round(emotion.anger / total * 100),
      disgust: Math.round(emotion.disgust / total * 100),
      fear: Math.round(emotion.fear / total * 100),
      joy: Math.round(emotion.joy / total * 100),
      sadness: Math.round(emotion.sadness / total * 100),
      surprise: Math.round(emotion.surprise / total * 100),
    }
    return emotions_percentage;
  }


  logout() {	
    sessionStorage.removeItem("name");	
    sessionStorage.removeItem("id");
    window.location.assign('http://localhost:8100/tabs/login');	
  }	
}


