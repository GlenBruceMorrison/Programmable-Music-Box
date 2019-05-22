const globalSettings = {
    activeMusicBox: null,
    noteOnColour: "#54F2F2",
    noteOffColour: "#042A2B",
    playHeadOnColor: "#54F2F2",
    playHeadOffColor: "#042A2B",
    draggingMusicWindow: false
}

class MusicBox {
    constructor(scale) {
        this.container = document.getElementById("flex-container-music-box");
        this.height = scale.length;
        this.isPlaying = false;
        this.playTimeout;

        this.scale = scale;

        this.noteColumns = [];
        this.noteGrid = [[]];
        this.activeNoteFlags = [[]];
        this.playHeads = [];
    }

    create(width) {
        this.width = 0;
        for (let i = 0; i < width; i++) {
            this.addNoteColumn();
        }

        this.activeNoteFlags.pop();
        this.noteGrid.pop();
    }

    resize(width) {
        if (this.width == width) {
            return;
        }

        const diff = Math.abs(this.width - width);

        console.log(diff);

        if (width > this.width) {
            for (let i = 0; i < diff; i++) {
                this.addNoteColumn();
            }
            return;
        }

        for (let i = 0; i < diff; i++) {
            this.removeNoteColumn();
        }
    }

    addNoteColumn() {
        const newMusicColumn = getHtmlColumn(this.scale, true);

        this.noteColumns.push(newMusicColumn);
        this.container.appendChild(newMusicColumn);

        const newIndex = this.container.childElementCount - 1;

        this.noteGrid.push([]);
        this.playHeads.push([]);
        this.activeNoteFlags.push([]);

        this.playHeads[newIndex] = newMusicColumn.firstChild;

        for (let i = 0; i < this.height; i++) {
            this.noteGrid[newIndex].push(newMusicColumn.children[i + 1]);
            this.activeNoteFlags[newIndex].push(false);
            this.assignButton(newIndex, i);
        }

        this.width++;
    }

    removeNoteColumn() {
        const removedColumn = this.noteColumns.pop();
        this.container.removeChild(removedColumn);

        this.activeNoteFlags.pop();
        this.noteGrid.pop();
        this.playHeads.pop();

        this.width--;
    }

    assignButton(column, row) {
        const currentNote = this.noteGrid[column][row];

        currentNote.onclick = () => {
            if (globalSettings.draggingMusicWindow) return;

            const nextState = !this.activeNoteFlags[column][row];

            if (nextState) {
                PlayNote(this.scale[row]);
            }

            const colour = (nextState) ? globalSettings.noteOnColour : globalSettings.noteOffColour;
            currentNote.style.background = colour;

            this.activeNoteFlags[column][row] = nextState;
        };
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

            PlayNote(this.scale[i]);
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

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.activeNoteFlags[i][j] = false;
            }
        }

    }

    drawActiveNoteIndicators() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                console.log(i + " " + j);
                const currentNote = this.noteGrid[i][j];
                const state = this.activeNoteFlags[i][j];

                const colour = (state) ? globalSettings.noteOnColour : globalSettings.noteOffColour;
                currentNote.style.background = colour;
            }
        }
    }

    clearPlayheadIndicators() {
        for (let i = 0; i < this.width; i++) {
            this.playHeads[i].style.background = globalSettings.playHeadOffColor;
        }
    }

    clearActiveNoteIndicators() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.noteGrid[i][j].style.background = globalSettings.noteOffColour;
            }
        }
    }

    stop() {
        this.clearPlayheadIndicators();
        clearTimeout(this.playTimeout);
        this.isPlaying = false;
    }

    save(songName) {
        const saveData = {
            scale: this.scale,
            width: this.width,
            activeNoteFlags: this.activeNoteFlags
        }

        localStorage.setItem(songName, JSON.stringify(saveData));
    }

    load(songName) {
        stop();

        const data = JSON.parse(localStorage.getItem(songName));

        console.log(data);

        this.resize(data.width);

        this.scale = data.scale;

        this.activeNoteFlags = data.activeNoteFlags;
        this.drawActiveNoteIndicators();
    }
}

function getHtmlColumn(scale, renderNoteNames = false) {

    const musicBox = document.getElementById('flex-container-music-box');

    const musicColumn = document.createElement('div');
    musicColumn.setAttribute('class', 'flex-container-note-column');

    const playhead = document.createElement('div');
    playhead.setAttribute('class', 'playhead');

    musicColumn.appendChild(playhead);

    for (let i = 0; i < scale.length; i++) {
        const note = document.createElement('div');
        note.setAttribute('class', 'note');

        musicColumn.appendChild(note);
    }

    musicBox.appendChild(musicColumn);

    return musicColumn;
}

class SliderControls {
    constructor() {
        this.slider = null;
        this.mousedown = false;
        this.draggingMusicWindow = false;
        this.startX = 0;
        this.scrollLeftOnDown = null;
    }

    bind(musicBox) {
        this.slider = musicBox.container;

        window.addEventListener('mousedown', (e) => {
            this.startX = e.pageX;
            this.mousedown = true
            this.scrollLeftOnDown = this.slider.scrollLeft;

            globalSettings.draggingMusicWindow = false;
        });

        window.addEventListener('mouseup', () => {
            this.mousedown = false
        });

        musicBox.container.addEventListener('mousemove', (e) => {
            if (!this.mousedown) return;

            const diff = (e.pageX - this.startX);

            globalSettings.draggingMusicWindow = true;

            this.slider.scrollLeft = this.scrollLeftOnDown - diff;
        });
    }
}

class MusicBoxControls {
    constructor() {
        this.playButton = document.getElementById("play-button");
        this.stopButton = document.getElementById("stop-button");
        this.clearButton = document.getElementById("clear-button");
    }

    bind(musicBox) {

        this.playButton.onclick = () => {
            if (musicBox.isPlaying) {
                musicBox.stop();
            }
            musicBox.play();
        };

        this.stopButton.onclick = () => musicBox.stop();

        this.clearButton.onclick = () => musicBox.clear();

        document.getElementById("add-button").onclick = () => musicBox.addNoteColumn();
        document.getElementById("remove-button").onclick = () => musicBox.removeNoteColumn();

        document.getElementById("load-button").onclick = () => musicBox.load("Song_One");

        document.getElementById("save-button").onclick = () => musicBox.save("Song_One");

    }
}


window.addEventListener('load', () => {
    const standardBox = new MusicBox(scales.C5MajorScale);
    standardBox.create(5);

    globalSettings.activeMusicBox = standardBox;

    const sliderControls = new SliderControls();
    sliderControls.bind(globalSettings.activeMusicBox);

    const musicBoxControls = new MusicBoxControls();
    musicBoxControls.bind(globalSettings.activeMusicBox);
});
