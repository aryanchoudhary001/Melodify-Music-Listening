async function getSongs() {
    let a = await fetch("songs/");
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    
    let songs = [];
    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index];
        // Check if the link points to an audio file (adjust extension if needed, e.g., .m4a or .mp3)
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

    // Show the first song or all songs in the playlist UI
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    
    for (const song of songs) {
        songUL.innerHTML += `<li>${decodeURIComponent(song)}</li>`;
    }
}

main();