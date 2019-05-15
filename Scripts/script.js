const noteNames = new Array('A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5');
const noteAudioFiles = new Array(A5, B5, C5, D5, E5, F5, G5);

function PlayNote(note) {
    note.play();
}

PlayNote(noteAudioFiles[0]);