const playPauseBtn = document.getElementById('playPauseBtn');
const audioPlayer = document.getElementById('audioPlayer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const queueList = document.getElementById('queueList');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumArt = document.getElementById('albumArt');

let currentQueue = [];
let currentIndex = 0;

function playPause() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.innerText = '❚❚';
  } else {
    audioPlayer.pause();
    playPauseBtn.innerText = '▶';
  }
}

function addToQueue(song, title, artist) {
  currentQueue.push({ song, title, artist });
  const listItem = document.createElement('li');
  listItem.innerText = title;
  queueList.appendChild(listItem);
  if (currentQueue.length === 1) {
    loadSong(song, title, artist);
  }
}

function loadSong(song, title, artist) {
  audioPlayer.src = song;
  songTitle.innerText = title;
  artistName.innerText = artist;
  albumArt.src = `https://via.placeholder.com/150?text=${title}`;
  audioPlayer.play();
  playPauseBtn.innerText = '❚❚';
}

function nextSong() {
  if (currentIndex < currentQueue.length - 1) {
    currentIndex++;
    const { song, title, artist } = currentQueue[currentIndex];
    loadSong(song, title, artist);
  }
}

function prevSong() {
  if (currentIndex > 0) {
    currentIndex--;
    const { song, title, artist } = currentQueue[currentIndex];
    loadSong(song, title, artist);
  }
}

playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

audioPlayer.addEventListener('ended', nextSong);
