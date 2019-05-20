class MusicBox {
    constructor(scale, width) {
        this.container = document.getElementById("flex-container-music-box");
        this.height = scale.length;
        this.width = width;
        this.isPlaying = false;
        this.playTimeout;

        this.scale = scale;

        this.noteGrid = [[]];
        this.activeNoteFlags = [[]];
        this.playHeads = [];
    }

    getNoteDiv(columnIndex, rowIndex) {
        return this.noteGrid[columnIndex][rowIndex];
    }

    create() {
        for (let i = 0; i < this.width; i++) {
            if(i == 0){
                this.container.innerHTML += getHtmlColumn(this.scale, true);
                continue;    
            }
            this.container.innerHTML += getHtmlColumn(this.scale);
        }

        for (let i = 0; i < this.width; i++) {
            this.activeNoteFlags.push([]);
            this.noteGrid.push([]);

            for (let j = 0; j < this.height + 1; j++) {
                this.activeNoteFlags[i].push(false);

                if (j == 0) {
                    this.playHeads.push(this.container.children[i].firstChild);
                }
                else {
                    this.noteGrid[i].push(this.container.children[i].children[j]);
                }
            }
        }

        this.activeNoteFlags.pop();

        this.assignButtons();
    }

    assignButtons() {
        for (let i = 0; i < this.noteGrid.length; i++) {
            for (let j = 0; j < this.noteGrid[i].length; j++) {
                const currentNote = this.getNoteDiv(i, j);

                currentNote.onclick = () => {
                    const nextState = !this.activeNoteFlags[i][j];

                    if (nextState) {
                        this.scale[j].play();
                    }

                    const colour = (nextState) ? globalSettings.noteOnColour : globalSettings.noteOffColour;
                    currentNote.style.background = colour;

                    this.activeNoteFlags[i][j] = nextState;
                };
            }
        }
    }

    play(currentColumn = -999) {
        if (currentColumn < 0) {
            currentColumn = 0;
        }
        else if (currentColumn >= this.width) {
            this.playHeads[currentColumn - 1].style.background = globalSettings.playHeadOffColor;
            return;
        }

        this.isPlaying = true;

        if (currentColumn > 0) {
            this.playHeads[currentColumn - 1].style.background = globalSettings.playHeadOffColor;
        }
        this.playHeads[currentColumn].style.background = globalSettings.playHeadOnColor;


        for (let i = 0; i < this.height; i++) {
            if (!this.activeNoteFlags[currentColumn][i]) {
                continue;
            }

            this.scale[i].play();
        }

        currentColumn++;

        const musicBox = this;

        this.playTimeout = setTimeout(function () {
            musicBox.play(currentColumn);
        }, 400);
    }

    clear() {
        this.clearActiveNoteIndicators();
        this.clearPlayheadIndicators();

        const noteWidth = this.activeNoteFlags.length;
        const noteHeight = this.activeNoteFlags[0].length;

        for (let i = 0; i < noteWidth; i++) {
            for (let j = 0; j < noteHeight; j++) {
                this.activeNoteFlags[i][j] = false;
            }
        }

    }

    clearPlayheadIndicators() {
        for (let i = 0; i < this.width; i++) {
            this.playHeads[i].style.background = globalSettings.playHeadOffColor;
        }
    }

    clearActiveNoteIndicators() {
        const noteWidth = this.noteGrid.length - 1;
        const noteHeight = this.noteGrid[0].length;

        for (let i = 0; i < noteWidth; i++) {
            for (let j = 0; j < noteHeight; j++) {
                this.getNoteDiv(i, j).style.background = globalSettings.noteOffColour;
            }
        }
    }

    stop() {
        this.clearPlayheadIndicators();
        clearTimeout(this.playTimeout);
        this.isPlaying = false;
    }
}

class note {
    constructor(note, noteName) {
        this.note = note;
        this.noteName = noteName;
    }

    play() {
        this.note.play();
    }
}

function getHtmlColumn(scale, renderNoteNames = false) {
    let columnNoteHTML = `<div class="flex-container-note-column">`;
    columnNoteHTML += `<div class="playhead"></div>`
    for (let i = 0; i < scale.length; i++) {
        if(renderNoteNames)
        {
            columnNoteHTML += `<div class="note">${scale[i].noteName}</div>`;
            continue;
        }
        columnNoteHTML += `<div class="note"></div>`;
    }
    columnNoteHTML += `</div>`;
    return columnNoteHTML;
}
