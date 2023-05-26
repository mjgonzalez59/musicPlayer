const wrapper  = document.querySelector(".wrapper");
const songImage = wrapper.querySelector(".img-area img");
const songName = wrapper.querySelector(".song-details .name");
const songArtist = wrapper.querySelector(".song-details .artist");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const mainAudio = wrapper.querySelector("#main-audio");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = wrapper.querySelector(".progress-bar");
const musicList = wrapper.querySelector(".music-list");
const moreMusicBtn = wrapper.querySelector("#more-music");
const closeMoreMusic = wrapper.querySelector("#close");
const repeatBtn = wrapper.querySelector("#repeat-plist");
const favoriteBtn = wrapper.querySelector("#favorite");
const expandBtn = wrapper.querySelector("#expand-more");
const imagArea = wrapper.querySelector(".img-area");

let songIndex = Math.floor((Math.random() * allSongs.length) + 1 );
let isSongPaused = true;
let shuffleArray = [];

window.addEventListener("load", () => {
  loadSong(songIndex);
  playingSong();
});


const loadSong = function(indexNumber){
  songName.innerText = allSongs[indexNumber - 1].name;
  songArtist.innerText = allSongs[indexNumber -1 ].artist;
  songImage.src = `images/${allSongs[indexNumber - 1].src}.jpg`
  mainAudio.src = `songs/${allSongs[indexNumber -1 ].src}.mp3`
}

const playSong = function(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play()
}

const pauseSong = function(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow"
  mainAudio.pause();
}

const playPrevSong = function(){
  songIndex--;
  songIndex < 1 ? songIndex = allSongs.length : songIndex = songIndex;
  loadSong(songIndex);
  playSong();
  playingSong();
}

const playNextSong = function(){
  const repeatBtnText = repeatBtn.innerText;
  repeatBtnText == "shuffle" ? playShuffleSong() : songIndex++;
  songIndex > allSongs.length ? songIndex = 1 : songIndex = songIndex;
  loadSong(songIndex);
  playSong();
  playingSong();
}

//CONTROL BUTTONS EVENTS
//Play or Pause button event
playPauseBtn.addEventListener("click", () => {
  const isSongPlaying = wrapper.classList.contains("paused");
  isSongPlaying ? pauseSong() : playSong();
  playingSong();
});

//Play previous song button event
prevBtn.addEventListener("click", () => {
  playPrevSong();
});

//Play next song button event
nextBtn.addEventListener("click", () => {
  playNextSong();
});

//PROGRESS-AREA EVENTS
mainAudio.addEventListener("timeupdate", (event) => {
  const currentTime = event.target.currentTime;
  const duration = event.target.duration;

  //Update the progress-bar % according to curent time
  let progressWidth = (currentTime / duration ) * 100;
  progressBar.style.width = `${progressWidth}%`;

  //Update the current-time  
  let songCurrentTime = wrapper.querySelector(".current-time");
  let currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if(currentSeconds < 10){
    currentSeconds = `0${currentSeconds}`
  }
  songCurrentTime.innerText = `${currentMinutes}:${currentSeconds}`;

  //Update the max-duration
  let songDuration = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    let mainSongDuration = mainAudio.duration;
    let totalMinutes = Math.floor(mainSongDuration / 60);
    let totalSeconds = Math.floor(mainSongDuration % 60);
    if(totalSeconds < 10){
      totalSeconds = `0${totalSeconds}`;
    }
    songDuration.innerText = `${totalMinutes}:${totalSeconds}`;
  });
});

//Update the progress-bar %
progressArea.addEventListener("click", (event) => {
  let progressTotalWidth = progressArea.clientWidth; //Totak width of the progress area (in pixels)
  let clickedOffSetX = event.offsetX; //Mouse clicked (position in pixels)
  let songDuration = mainAudio.duration; //Total duration (in seconds)

  mainAudio.currentTime = ( clickedOffSetX / progressTotalWidth) * songDuration ;
  playSong();
  playingSong();
});

//Repeat or Shuffle button
repeatBtn.addEventListener("click", (event) => {
  let repeatBtnText = repeatBtn.innerText;
  switch(repeatBtnText){
    case "repeat": 
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback Shuffle");
      shuffleArray = createSongsPositionArray();
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat"
      repeatBtn.setAttribute("title", "Playlist Looped");
      break;
  }
});

// Playing when the song has ended
const createSongsPositionArray = function(){
  let shuffleSongsArray = allSongs.map(song => {
    return{
      name: song.name,
      artist: song.artist,
      img: song.img,
      src: song.src,
    }
  });
  return shuffleSongsArray;
}

const existSongShuffleArray = function(randomIndex){
  const song = shuffleArray.find(song => JSON.stringify(song) == JSON.stringify(allSongs[randomIndex - 1]));
  song == undefined ? existInShuffleArray = false : existInShuffleArray = true;
  shuffleArray.length == 0 ? shuffleArray = createSongsPositionArray() : shuffleArray;
  return existInShuffleArray;
}

const deleteSongInShuffleArray = function(randomSong){
  const indexSong = shuffleArray.findIndex(song => JSON.stringify(song) === JSON.stringify(randomSong));
  shuffleArray.splice(indexSong, 1);
}

const playShuffleSong = function(){
  let randomIndex = Math.floor((Math.random() * allSongs.length) + 1);
  let existInShuffleArray = true;
  do{
    randomIndex = Math.floor((Math.random() * allSongs.length) + 1);
    existInShuffleArray = existSongShuffleArray(randomIndex);
  }while(!existInShuffleArray);
  deleteSongInShuffleArray(allSongs[randomIndex - 1]);
  songIndex = randomIndex;
}

mainAudio.addEventListener("ended", () => {
  let repeatBtnText = repeatBtn.innerText;
  console.log(repeatBtnText);
  switch (repeatBtnText){
    case "repeat":
      playNextSong();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadSong(songIndex);
      playSong();
      break;
    case "shuffle":
      playShuffleSong();
      loadSong(songIndex);
      playSong();
      playingSong();
      break;
  }
});

//Show Music List onclick - Icon
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for(let i = 0; i < allSongs.length; i++){
  let liTag = `
  <li li-index="${i + 1}">
    <div class="row">
      <span>${allSongs[i].name}</span>
      <p>${allSongs[i].artist}</p>
    </div>
    <span id="${allSongs[i].src}" class="audio-duration">3:40</span>
    <audio class="${allSongs[i].src}" src="songs/${allSongs[i].src}.mp3"></audio>
  </li>
  `;
  ulTag.insertAdjacentHTML("beforeend", liTag);
  
  let liAudioDurationTag = ulTag.querySelector(`#${allSongs[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allSongs[i].src}`);
  
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration/60);
    let totalSec = Math.floor(duration%60);
    if(totalSec < 10){
      totalSec = `0${totalSec}`;
    }
    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

const playingSong = function(){
  const allLiTags = ulTag.querySelectorAll("li");
  for(let i = 0; i < allLiTags.length; i++){
    let audioTag = allLiTags[i].querySelector(".audio-duration");
    
    if(allLiTags[i].classList.contains("playing")){
      allLiTags[i].classList.remove("playing");
      let addDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = addDuration;
    }

    if(allLiTags[i].getAttribute("li-index") == songIndex){
      allLiTags[i].classList.add("playing");
      audioTag.innerText = "Playing"
    }

    allLiTags[i].setAttribute("onclick", "liClicked(this)");
  }
}

const liClicked = function(element){
  let liIndex = element.getAttribute("li-index");
  songIndex = liIndex;
  loadSong(songIndex);
  playSong();
  playingSong();
}

favoriteBtn.addEventListener("click", () => {
  if(favoriteBtn.classList.contains("favorited")){
    favoriteBtn.classList.remove("favorited");
    favoriteBtn.innerText = "favorite_outline";
    favoriteBtn.setAttribute("title", "Add to favorites");
  }else {
    favoriteBtn.classList.add("favorited");
    favoriteBtn.innerText = "favorite"
    favoriteBtn.setAttribute("title", "Remove from favorites");
  }
});

expandBtn.addEventListener("mouseover", () => {
  imagArea.classList.toggle("expanded");
});

expandBtn.addEventListener("mouseout", () => {
  imagArea.classList.toggle("expanded");
});