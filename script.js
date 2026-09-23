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

async function main() {
    // Get the list of all songs
    let songs = await getSongs();
    console.log(songs);

    // Show all songs dynamically in the playlist UI
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    
    for (const song of songs) {
        // Decode URI and clean up the file extension for a nicer display name
        let cleanName = decodeURIComponent(song).replace(".mp3", "").replace(".m4a", "");

        songUL.innerHTML += `
            <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${cleanName}</div>
                    <div>Unknown Artist</div>
                </div>
                <img class="invert" src="play.svg" alt="">
            </li>`;
    }
}

main();