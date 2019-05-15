const noteNames = new Array('A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5');
const noteAudioFiles = new Array(A5, B5, C5, D5, E5, F5, G5);

function PlayNote(note) {
    note.play();
}

function PlayChord(notes) {
    for (i = 0; i < notes.length; i++) {
        PlayNote(notes[i]);
    }
}

let globalSpeed = 500;
function PlaySong(song, currentIndex = -999) {
    if (currentIndex == -999) {
        currentIndex = 0;
    }
    else if (currentIndex >= song.length) {
        return;
    }

    console.log(currentIndex);

    let currentChord = song[currentIndex];

    if (currentChord.length > 0) {
        PlayChord(currentChord);
    }

    currentIndex++;

    setTimeout(function () {
        PlaySong(song, currentIndex);
    }, globalSpeed);
}

const twinkleStart = [
    [C5],
    [C5],
    [G5],
    [G5],
    [A5],
    [A5],
    [G5],
    [],
    [F5],
    [F5],
    [E5],
    [E5],
    [D5],
    [D5],
    [C5]
]

PlaySong(twinkleStart);