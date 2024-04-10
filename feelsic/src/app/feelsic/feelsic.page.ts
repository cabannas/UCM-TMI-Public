import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-feelsic',
  templateUrl: 'feelsic.page.html',
  styleUrls: ['feelsic.page.scss']
})



export class FeelsicPage implements OnInit {
  
  constructor(private apiservice : ApiService, private route: ActivatedRoute) {
    
  }
  feelsicListServ = <any>[];
  feelsic = new Feelsic(0,"songtutuname", "artistname", 0, "lyrics", "comment", "image", "emotions", "emotions_percentage");


  ngOnInit() {
    
      const id = this.route.snapshot.paramMap.get('id');
      console.log(`id: ${id}`);

      this.feelsicListServ = this.apiservice.resolveGet();
    /*
      for (const item in this.feelsicListServ){
        console.log(item);
        console.log(this.feelsicListServ[item].songName)
      }
      */

      this.feelsic = this.feelsicListServ[`${id}`];

      console.log(this.feelsic);

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