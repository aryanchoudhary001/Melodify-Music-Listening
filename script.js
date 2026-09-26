let currentSong = new Audio();
// Global variable to store the loaded playlist so it can be accessed inside click listeners
let globalSongsList = []; 

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    minutes = String(minutes).padStart(2, "0");
    remainingSeconds = String(remainingSeconds).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}

console.log(formatTime(12));   // 00:12
console.log(formatTime(72));   // 01:12
console.log(formatTime(125));  // 02:05

async function getSongs() {
    let a = await fetch("songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "pause.svg";
    
    /* 
      🛠️ FIX 1: Cleaned the display name for the playbar.
      Using decodeURIComponent() removes the '%20' markers.
      Using .replace() strips off the file extensions like .mp3 and .m4a.
    */
    let displayName = decodeURIComponent(track).replace(".mp3", "").replace(".m4a", "");
    document.querySelector(".songinfo").innerHTML = displayName;
    
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
    // Get the list of all songs and save them to the global variable
    globalSongsList = await getSongs();
    console.log(globalSongsList);

    // Show all songs dynamically in the playlist UI
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of globalSongsList) {
        let cleanName = decodeURIComponent(song)
            .replace(".mp3", "")
            .replace(".m4a", "");
        songUL.innerHTML += `
            <li data-song="${encodeURIComponent(song)}">
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${cleanName}</div>
                    <div>Aryan Choudhary</div>
                </div>
                <img class="invert" src="play.svg" alt="">
            </li>`;
    }

    // Attach event listeners to each library list item song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let song = decodeURIComponent(e.dataset.song);
            console.log(song);
            playMusic(song);
        });
    });

    // Attach an event listener to the playbar's main play button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            /* 
              🛠️ FIX 2: Check if a song has already been loaded or is currently selected.
              The logic checks if the audio element's source is empty or points to the root directory.
            */
            if (!currentSong.src || currentSong.src === window.location.href) {
                /* 
                🛠️ FIX 3: Automatically load and play the first song in your array 
                if the user clicks the playbar button before selecting a specific item.
                */
                if (globalSongsList.length > 0) {
                    playMusic(globalSongsList[0]);
                }
            } else {
                // If a song was already selected or paused mid-track, simply resume playback
                currentSong.play();
                play.src = "pause.svg";
            }
        } else {
            // Pause the music if it's currently running
            currentSong.pause();
            play.src = "play.svg";
        }
    });
    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })
    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
}

main();
