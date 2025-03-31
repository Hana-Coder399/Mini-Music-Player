document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById('gif').style.opacity = '0';
})

let songs=[
    {songTitle:'End Game',filePath:'Songs/1.opus',coverPath:'Covers/1.png'},
    {songTitle:'Gorgeous',filePath:'Songs/2.opus',coverPath:'Covers/2.png'},
    {songTitle:'Look What You Made Me Do',filePath:'Songs/3.opus',coverPath:'Covers/3.png'},
    {songTitle:'Delicate',filePath:'Songs/4.opus',coverPath:'Covers/4.png'},
    {songTitle:'I Did Something Bad',filePath:'Songs/5.opus',coverPath:'Covers/5.png'},
    {songTitle:'.....Ready for It?',filePath:'Songs/6.opus',coverPath:'Covers/6.png'}
]

let SongIndex = 0;

let audioElement = new Audio(songs[SongIndex].filePath);
let play = document.getElementById('play');
let progress = document.getElementById('progress');
let gif = document.getElementById('gif');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let songTitle = document.querySelector('.songInfo .songTitle');
let isPlaying = false;


songItems.forEach((element,index)=>{
    element.getElementsByTagName('img')[0].src=songs[index].coverPath;
    element.getElementsByClassName('songTitle')[0].innerText=songs[index].songTitle;
})

//Handle play/pause events
const makeAllPlays = ()=>{
    document.querySelectorAll('.songItemPlay').forEach((element,i)=>{
        element.classList.add('fa-circle-play');
        element.classList.remove('fa-circle-pause');
    })
}

async function PlayAudio(index, forcePlay= false) {
    let songButton = document.getElementById(index + 1);
   
    if (SongIndex !== index || forcePlay) {
        audioElement.pause(); 
        SongIndex = index;
        audioElement.src = songs[index].filePath;
        audioElement.currentTime = 0;
        play.classList.remove('fa-rotate-right');
        play.classList.add('fa-circle-play');
    }
    try {
        if (audioElement.paused || SongIndex !== index) {
            await audioElement.play().catch(error => console.warn("Playback error:", error)); // Catch errors
            gif.style.opacity = 1;
            play.classList.remove('fa-circle-play');
            play.classList.add('fa-circle-pause');
            makeAllPlays(); 
            songButton?.classList.remove('fa-circle-play');  
            songButton?.classList.add('fa-circle-pause'); 
            songTitle.innerText = songs[SongIndex].songTitle;
        } else {
            audioElement.pause();
            gif.style.opacity = 0;
            play.classList.remove('fa-circle-pause');
            play.classList.add('fa-circle-play');
            songButton?.classList.remove('fa-circle-pause');
            songButton?.classList.add('fa-circle-play');
        }
    } catch (error) {
        console.error("Playback error:", error);
    }
    console.log("Current SongIndex:", SongIndex);
 }

play.addEventListener('click',()=> PlayAudio(SongIndex));

//Seek Bar Update
progress.addEventListener('input',()=>{
    audioElement.currentTime=(progress.value * audioElement.duration)/100;
})

//Progress Bar Events
audioElement.addEventListener('timeupdate',()=>{
    
    let prog = parseInt((audioElement.currentTime/audioElement.duration)*100);
    progress.value = prog;
})


document.querySelectorAll('.songItemPlay').forEach((element,i)=>{
    element.addEventListener('click',()=>{
        PlayAudio(i);
    })
})

//Previous Song
document.getElementById('back').addEventListener('click',()=>{
    
    if(SongIndex<=0){
        SongIndex=songs.length-1;
    }
    else{
        SongIndex=SongIndex-1;
    }
    PlayAudio(SongIndex, true);
})

//Next Song
document.getElementById('next').addEventListener('click',()=>{
    
    if(SongIndex>=songs.length-1){
        SongIndex=0;
    }
    else{
        SongIndex=SongIndex+1;
    }
   PlayAudio(SongIndex, true);
})

//Replay Song
audioElement.addEventListener('ended',()=>{
    play.classList.remove('fa-circle-pause');
    play.classList.add('fa-rotate-left');
    isPlaying=false;
    gif.style.opacity = 0;
})

play.addEventListener('click',()=>{
    if(isPlaying && play.classList.contains('fa-rotate-left')){
        audioElement.currentTime = 0;
        audioElement.play();
        play.classList.remove('fa-rotate-left');
        play.classList.add('fa-circle-pause');
    }       
})