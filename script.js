const container = document.querySelector('.container'),
  musicname = container.querySelector('.songdetails .name '),
  musicartist = container.querySelector('.songdetails .artist'),
  musicImg = container.querySelector('.img img'),
  musicaudios = container.querySelector('.musicaudio');
playbtn = container.querySelector('.play-pause');
nextbtn = container.querySelector('#next');
prevbtn = container.querySelector('#prev');
progressbar = container.querySelector('.progressbar');
bar = container.querySelector('.bar');
musicList = container.querySelector('.music-list');
showmusicbtn = container.querySelector('#moremusic');
hidemusicbtn = musicList.querySelector('#close');


let musicIndex = Math.floor((Math.random() * allmusic.length) + 1);
isMusicPaused = true;

window.addEventListener('load', () => {
  musicload(musicIndex);
  playingSong();
});
function musicload(indexnumb) {
  musicname.innerHTML = allmusic[indexnumb - 1].name;
  musicartist.innerHTML = allmusic[indexnumb - 1].artist;
  // console.log(musicartist);
  musicImg.src = `./images/${allmusic[indexnumb - 1].img}.jpeg`;
  //  console.log(musicname);
  musicaudios.src = `./songs/${allmusic[indexnumb - 1].src}.mp3`;
}

function playmusic() {
  container.classList.add('paused');
  playbtn.querySelector('i').innerText = 'pause';
  musicaudios.play();
}

function pausemusic() {
  container.classList.remove('paused');
  playbtn.querySelector('i').innerText = 'play_arrow';
  musicaudios.pause();
}
function prevmusic() {
  musicIndex--;
  // if musicIndex is less than 1 then musicindexwill be array.length so the first song will play 
  musicIndex < 1 ? musicIndex = allmusic.length : musicIndex = musicIndex;
  musicload(musicIndex);
  playmusic();
  playingSong();
}
function nextmusic() {
  musicIndex++;
  musicIndex > allmusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  musicload(musicIndex);
  playmusic();
  playingSong();
}


playbtn.addEventListener('click', () => {
  const ismusicPaused = container.classList.contains('paused');
  ismusicPaused ? pausemusic() : playmusic();
  playingSong();

});
prevbtn.addEventListener('click', () => {
  prevmusic();
});

nextbtn.addEventListener('click', () => {
  nextmusic();
});

//  update
musicaudios.addEventListener('timeupdate', (e) => {
  const CurrentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progresswidth = (CurrentTime / duration) * 100;
  progressbar.style.width = `${progresswidth}%`;


  let musicCurrentTime = container.querySelector('.current'),
    musicDuration = container.querySelector('.duration');
  musicaudios.addEventListener('loadeddata', () => {
    // update the total duration 
    let audioDuration = musicaudios.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  // update playing song current time

  let CurrentMin = Math.floor(CurrentTime / 60);
  let CurrentSec = Math.floor(CurrentTime % 60);
  if (CurrentSec < 10) {
    CurrentSec = `0${CurrentSec}`;
  }
  musicCurrentTime.innerText = `${CurrentMin}:${CurrentSec}`;
});
// update progressarea
bar.addEventListener("click", (event) => {
  let progressWidth = bar.clientWidth;
  let clickedoffSetX = event.offsetX;
  let songDuration = musicaudios.duration;

  musicaudios.CurrentTime = (clickedoffSetX / progressWidth) * songDuration;

  playmusic();
  playingSong();
});



const repeatbtn = container.querySelector('#repeat');
repeatbtn.addEventListener('click', () => {
  let getText = repeatbtn.innerText;
  switch (getText) {
    case 'repeat':
      repeatbtn.innerText = 'repeat_one';
      repeatbtn.setAttribute('title', 'song looped');
      break;
    case 'repeat_one':
      repeatbtn.innerText = 'shuffle';
      repeatbtn.setAttribute('title', 'playback shuffle');
      break;
    case 'shuffle':
      repeatbtn.innerText = 'repeat';
      repeatbtn.setAttribute('title', 'playlist looped');
      break;
  }

});
musicaudios.addEventListener('ended', () => {


  let getText = repeatbtn.innerText;
  switch (getText) {
    case 'repeat':
      nextmusic();
      break;
    case 'repeat_one':
      musicaudios.currentTime = 0;
      musicload(musicIndex);
      playmusic();
      break;
    case 'shuffle':
      let randIndex = Math.floor((Math.random() * allmusic.length) + 1);
      do {
        randIndex = Math.floor((Math.random() * allmusic.length) + 1);
      }
      while (musicIndex = randIndex);
      musicIndex = randIndex;
      musicload(musicIndex);;
      playmusic();
      playingSong();
      break;
  }
});

showmusicbtn.addEventListener('click', () => {
  musicList.classList.toggle('show');
});

hidemusicbtn.addEventListener('click', () => {
  showmusicbtn.click();
  // musicList.classList.remove();
});

const ulTag = container.querySelector('ul');
// create according to the array length
for (let i = 0; i <= allmusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
              <div class="row-row">
                  <span>${allmusic[i].name}</span>
                  <p>${allmusic[i].artist}</p>
              </div>
              <audio class="${allmusic[i].src}" src="songs/${allmusic[i].src}.mp3"></audio>
              <span id="${allmusic[i].src}" class="time">3.50 </span>
            </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allmusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allmusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

function playingSong() {
  const allLiTags = ulTag.querySelectorAll("li");
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".time")
    if (allLiTags[j].classList.contains('playing')) {
      allLiTags[j].classList.remove('playing');
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerHTML = adDuration;
    }
    if (allLiTags[j].getAttribute('li-index') == musicIndex) {
      allLiTags[j].classList.add('playing');
      audioTag.innerText = "playing";

    }
    allLiTags[j].setAttribute('onclick', 'clicked(this)');
  }
}
function clicked(element) {
  let getLiIndex = element.getAttribute('li-index');
  musicIndex = getLiIndex;
  musicload(musicIndex);
  playmusic();
  playingSong();
}








