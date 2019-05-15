let globalSpeed = 500;
const musicBoxContainer = document.getElementById("flex-container-music-box");
const musicColumnHTML = '<div class="flex-container-note-column"><div class="note">C</div><div class="note">D</div><div class="note">E</div></div>';

const noteNames = new Array('A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5');
const noteAudioFiles = new Array(A5, B5, C5, D5, E5, F5, G5);
const numberOfNotes = noteAudioFiles.length;
const activeNoteFlags = [];

let numberOfColumns = 0;
const noteColumns = document.getElementsByClassName("flex-container-note-column");

let isPlaying = false;
let stopFlag = false;
const playControlsButton = document.getElementById("play-controls");
const clearButton = document.getElementById("clear");

function PlayNote(note) {
    note.play();
}

function PlayChord(notes) {
    for (i = 0; i < notes.length; i++) {
        PlayNote(notes[i]);
    }
}

function GetColumnNoteHTML(noteNames) {
    let columnNoteHTML = `<div class="flex-container-note-column">`;
    for (let i = 0; i < noteNames.length; i++) {
        columnNoteHTML += `<div class="note">${noteNames[i]}</div>`;
    }
    columnNoteHTML += `</div>`;
    return columnNoteHTML;
}

function AssignNotesToAllCollumns() {
    for (let i = 0; i < noteColumns.length; i++) {
        AssignNotesToColumn(i);
    }
}

function AssignNotesToColumn(columnIndex) {
    for (let i = 0; i < noteColumns[columnIndex].childElementCount; i++) {
        GetNoteButton(columnIndex, i).onclick = () => OnNoteButtonPress(columnIndex, i);
    }
}

function GetNoteButton(columnIndex, rowIndex) {
    return noteColumns[columnIndex].children[rowIndex];
}

function OnNoteButtonPress(columnIndex, rowIndex) {
    const currentVal = activeNoteFlags[columnIndex][rowIndex];

    if (!currentVal) {
        PlayNote(noteAudioFiles[rowIndex]);
    }

    AlterNoteState(columnIndex, rowIndex, !currentVal);
}

function AlterNoteState(columnIndex, rowIndex, value) {
    activeNoteFlags[columnIndex][rowIndex] = value;

    // onColor : offColor
    const colour = (value) ? "#efca08" : "#1a1423";

    GetNoteButton(columnIndex, rowIndex).style.background = colour;
}

function CreateMusicBox(columnCount) {
    numberOfColumns = columnCount;

    for (let i = 0; i < columnCount; i++) {
        musicBoxContainer.innerHTML += GetColumnNoteHTML(noteNames);
        activeNoteFlags.push([]);
        for (let j = 0; j < numberOfNotes; j++) {
            activeNoteFlags[i].push(false);
        }
    }

    AssignNotesToAllCollumns();
}

function ClearMusicBox() {
    for (let i = 0; i < numberOfColumns; i++) {
        for (let j = 0; j < numberOfNotes; j++) {
            AlterNoteState(i, j, false);
        }
    }
}

function StopMusicBox() {
    stopFlag = true;
}

function PlayMusicBox(currentColumn = -999) {
    if (stopFlag) {
        stopFlag = false;
        return;
    }
    else if (currentColumn == -999) {
        currentColumn = 0;
    }
    else if (currentColumn >= numberOfColumns) {
        return;
    }

    console.log(currentColumn + "/" + numberOfColumns);

    for (let i = 0; i < numberOfNotes; i++) {
        if (!activeNoteFlags[currentColumn][i]) {
            continue;
        }

        PlayNote(noteAudioFiles[i]);
    }

    currentColumn++;

    setTimeout(function () {
        PlayMusicBox(currentColumn);
    }, globalSpeed);
}

playControlsButton.onclick = function () {
    if (playControlsButton.innerHTML == "PLAY") {
        stopFlag = false;
        isPlaying = true;
        PlayMusicBox();
        playControlsButton.innerHTML = "STOP"
        return;
    }

    isPlaying = false;
    stopFlag = true;
    playControlsButton.innerHTML = "PLAY"
}

clearButton.onclick = function () {
    ClearMusicBox();
}

CreateMusicBox(20);