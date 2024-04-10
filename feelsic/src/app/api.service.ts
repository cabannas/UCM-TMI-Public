import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { error } from 'console';
import { appendFile } from 'fs';
import { ActivatedRouteSnapshot } from '@angular/router';



@Injectable({
  providedIn: 'root'
})


export class ApiService {

  constructor(private http: HttpClient) { 

  }

  feelsicListServ = <any>[];


  sendGetRequestGeniusLyrics(songid: number): Observable<any>{

    let queryParams = new HttpParams();
    queryParams = queryParams.append("id",songid);
    queryParams = queryParams.append("text_format","plain");
    
    return this.http.get(`${environment.genius.GeniusUrl}/song/lyrics/`, {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': ` ${environment.genius.GeniusXRapidAPIKey}`,
        'X-RapidAPI-Host': ` ${environment.genius.GeniusXRapidAPIHost}`
      }),
      params: queryParams
    })
  }

  sendGetRequestGeniusSong(songName: string): Observable<any>{

    let queryParams = new HttpParams();
    queryParams = queryParams.append("q", songName);
    queryParams = queryParams.append("per_page","3");
    queryParams = queryParams.append("page","1");


    return this.http.get(`${environment.genius.GeniusUrl}/search/`, {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': ` ${environment.genius.GeniusXRapidAPIKey}`,
        'X-RapidAPI-Host': ` ${environment.genius.GeniusXRapidAPIHost}`
      }),
      params: queryParams
    })
  }

  song = "./assets/song/bowie_test.MP3";

  async sendPostRequestShazam(file: Promise<Blob>): Promise<Observable<any>>{

    //let blob = await fetch(this.song).then(r => r.blob())
    
    const data = new FormData();
    data.append('file', await file);


    return this.http.post(`${environment.shazam.ShazamUrl}`,data, {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': ` ${environment.shazam.ShazamXRapidAPIKey}`,
        'X-RapidAPI-Host': ` ${environment.shazam.ShazamXRapidAPIHost}`
      })
    })
  }


  sendPostRequestEmotion(lyrics : string): Observable<any>{

    let body = new URLSearchParams();
    body.set('text', lyrics);
    // body.set('text', lyrics);

    return this.http.post(`${environment.emotion.EmotionUrl}`, body.toString(), {
      headers: new HttpHeaders({
        'content-type':`${environment.emotion.EmotionContentType}`,
        'X-RapidAPI-Key': ` ${environment.emotion.EmotionXRapidAPIKey}`,
        'X-RapidAPI-Host': ` ${environment.emotion.EmotionXRapidAPIHost}`
      })
    })
  }

  sendPostRequestChatGPT(songName : string, artistName: string, emotion: any): Observable<any>{


    console.log(emotion)


    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Hi, ChatGpt, I need you to write a short comment (about a paragraph) about the lyrics of a song, the song is ${songName} by ${artistName}, I need you to take into acount that we have evaluated this song and it has the following score. Anger : ${emotion.anger}, Disgust : ${emotion.disgust}, Fear : ${emotion.fear}, Joy : ${emotion.joy}, Sadness : ${emotion.sadness}. Surprise : ${emotion.surprise}. Although we give you a numeric score, we dont want you to refer to this score directly, but you can talk about the emotions themselves. Please, respond only with the short comment, I dont want any other explanation such as As an IA model or whatever, i neet the answer to be short cause its going directly to a description field`
        }
      ]
    }
    console.log(body);

    return this.http.post(`${environment.chatGPT2.chatGPTUrl}`, body, {
      headers: new HttpHeaders({
        'chatGPTContentType':`${environment.chatGPT2.chatGPTContentType}`,
        'Authorization':`${environment.chatGPT2.Authorization}`,
      })
    })
  }

  resolveSet(fl : any){
    this.feelsicListServ = fl;
  }

  resolveGet(){
    return this.feelsicListServ;
  }

}
