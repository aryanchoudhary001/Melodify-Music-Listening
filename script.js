async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    let songs = [];

    for (let index = 0; index < as.length; index++) {

        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }

    return songs;
}


async function main() {

    // Get all songs
    let songs = await getSongs();

    console.log(songs);


    // Get UL
    let songUL = document
        .querySelector(".songList")
        .getElementsByTagName("ul")[0];


    // Add songs to sidebar
    for (const song of songs) {

        let songName = decodeURIComponent(
            song.split("/").pop().replace(".mp3", "")
        );

        songUL.innerHTML += `
            <li>${songName}</li>
        `;
    }


    // Play first song
    var audio = new Audio(songs[0]);

    audio.play();


    audio.addEventListener("timeupdate", () => {

        let duration = audio.duration;

        console.log(
            audio.duration,
            audio.currentSrc,
            audio.currentTime
        );

    });
}

main();