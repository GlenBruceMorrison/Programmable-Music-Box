const globalSettings = {
    activeMusicBox: null,
    draggingMusicWindow: false,
    playSpeed: 300,
    defaultWidth: 30,
    defaultScale: scales.FullScale,
    previousSaveName: "New Song",
    maximumColumns: 200
}

const theme = {
    current: null,
    light: {
        background: '#fafafa',
        border: '#212121',
        textDefault: '#212121',
        accent: '#3E363F',
        textAccent: '#b2dfdb',
        contrast: '#FF715B'
    },
    dark: {
        background: '#212121',
        border: '#464545',
        textDefault: '#efebe9',
        accent: '#212121',
        textAccent: '#ffffff',
        contrast: '#ffeb3b'
    },
    change: (newTheme) => {
        if (theme.current == newTheme) return;

        theme.current = newTheme;
        document.body.style.setProperty('--color-background', newTheme.background);
        document.body.style.setProperty('--color-border', newTheme.border);
        document.body.style.setProperty('--color-text-default', newTheme.textDefault);
        document.body.style.setProperty('--color-accent', newTheme.accent);
        document.body.style.setProperty('--color-text-accent', newTheme.textAccent);
        document.body.style.setProperty('--color-contrast', newTheme.contrast);
    }
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

        this.musicNoteIndicators = document.getElementById("music-note-indicators");
    }

    create(width) {
        this.width = 0;
        for (let i = 0; i < width; i++) {
            this.addNoteColumn();
        }

        this.activeNoteFlags.pop();
        this.noteGrid.pop();

        this.assignNoteIndicators();
    }

    logState() {
        console.log(this.noteGrid);
        console.log(this.playHeads);
        console.log(this.activeNoteFlags);
        console.log(this.noteColumns);
    }

    changeScale(scale) {
        const newHeight = scale.length;
        if (newHeight === this.height) {
            return;
        }

        this.scale = scale;

        const diff = Math.abs(this.height - newHeight);

        if (newHeight > this.height) {
            for (let i = 0; i < diff; i++) {
                this.addRow();
            }
        }
        else {
            for (let i = 0; i < diff; i++) {
                this.removeRow();
            }
        }

        this.assignNoteIndicators();
        this.assignNoteNames();
    }

    assignNoteNames() {
        for (let i = 0; i < this.noteGrid.length; i++) {
            for (let j = 0; j < this.noteGrid[i].length; j++) {
                this.noteGrid[i][j].innerHTML = this.scale[j];
            }
        }
    }

    assignNoteIndicators() {
        this.clearNoteIndicators();
        for (let i = 0; i < this.height; i++) {
            const currentColumn = this.musicNoteIndicators;
            const newNote = this.getHtmlNote(this.scale[i]);
            currentColumn.appendChild(newNote);
        }
    }

    clearNoteIndicators() {
        const childCount = this.musicNoteIndicators.children.length;
        while (this.musicNoteIndicators.firstChild) {
            this.musicNoteIndicators.removeChild(this.musicNoteIndicators.firstChild);
        }
    }

    addRow() {
        const newHeight = this.height + 1;
        for (let i = 0; i < this.width; i++) {
            const currentColumn = this.noteColumns[i];
            const newNote = this.getHtmlNote(this.scale[this.height]);
            currentColumn.appendChild(newNote);

            const newNoteDiv = currentColumn.children[newHeight];
            this.noteGrid[i].push(newNoteDiv);

            this.activeNoteFlags[i].push(false);

            this.assignButton(i, this.height);
        }

        this.height++;
    }

    removeRow() {
        for (let i = 0; i < this.width; i++) {
            this.noteColumns[i].lastChild.remove();

            this.activeNoteFlags[i].pop();

            this.noteGrid[i].pop();
        }
        this.height--;
    }

    resize(width) {
        if (this.width == width) {
            return;
        }

        const diff = Math.abs(this.width - width);

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
        if (this.width >= globalSettings.maximumColumns) {
            return;
        }

        const newMusicColumn = this.getHtmlColumn(this.scale, true);

        this.container.appendChild(newMusicColumn);

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
        if (this.width <= 1) {
            return;
        }
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

            if (currentNote.classList.contains('off')) {
                currentNote.className = 'note on';
            }
            else {
                currentNote.className = 'note off';
            }

            this.activeNoteFlags[column][row] = nextState;
        };
    }

    play(currentColumn = -999) {
        if (currentColumn < 0) {
            currentColumn = 0;
        }
        else if (currentColumn >= this.width) {
            this.playHeads[currentColumn - 1].style.background = theme.current.contrast;
            return;
        }

        this.isPlaying = true;

        if (currentColumn > 0) {
            this.playHeads[currentColumn - 1].style.background = theme.current.accent;
        }
        this.playHeads[currentColumn].style.background = theme.current.contrast;


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
        }, globalSettings.playSpeed);
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
                const currentNote = this.noteGrid[i][j];
                const state = this.activeNoteFlags[i][j];

                if (state) {
                    currentNote.className = 'note on';
                }
                else {
                    currentNote.className = 'note off';
                }
            }
        }
    }

    clearPlayheadIndicators() {
        for (let i = 0; i < this.width; i++) {
            this.playHeads[i].style.background = theme.current.accent;
        }
    }

    clearActiveNoteIndicators() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.noteGrid[i][j].className = 'note off';
            }
        }
    }

    stop() {
        this.clearPlayheadIndicators();
        clearTimeout(this.playTimeout);
        this.isPlaying = false;
    }

    save(songName) {
        const songData = {
            width: this.width,
            scale: this.scale,
            activeNoteFlags: this.activeNoteFlags
        }

        localStorage.setItem(songName, JSON.stringify(songData));
    }

    load(songName) {
        const songData = JSON.parse(localStorage.getItem(songName));

        console.log(localStorage.getItem(songName))

        this.stop();

        this.resize(songData.width);
        this.changeScale(songData.scale);
        this.activeNoteFlags = songData.activeNoteFlags;

        this.drawActiveNoteIndicators();
    }

    loadJsonString(jsonString) {
        const data = JSON.parse(jsonString);
        this.stop();
        this.resize(data.width);
        this.changeScale(data.scale);
        this.activeNoteFlags = data.activeNoteFlags;

        this.drawActiveNoteIndicators();
    }

    getHtmlSavedIndex(songName) {
        const saveList = document.getElementById("saved-songs");
        const newSongElement = document.createElement('option');

        newSongElement.setAttribute('value', songName);
        newSongElement.innerHTML = songName;

        saveList.appendChild(newSongElement);

        return newSongElement;
    }

    getHtmlNote(noteName) {
        const note = document.createElement('div');
        note.setAttribute('class', 'note off');
        note.innerHTML = noteName;
        return note;
    }

    getHtmlColumn(scale, renderNoteNames = false) {
        const musicColumn = document.createElement('div');
        musicColumn.setAttribute('class', 'flex-container-note-column');

        const playhead = document.createElement('div');
        playhead.setAttribute('class', 'playhead');

        musicColumn.appendChild(playhead);

        for (let i = 0; i < scale.length; i++) {
            const note = this.getHtmlNote(scale[i]);
            musicColumn.appendChild(note);
        }

        return musicColumn;
    }
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
    constructor() { }

    bind(musicBox) {
        document.getElementById("play-button").onclick = () => this.playButton(musicBox);
        document.getElementById("load-button").onclick = () => this.loadButton(musicBox);
        document.getElementById("save-button").onclick = () => this.saveButton(musicBox);
        document.getElementById("stop-button").onclick = () => musicBox.stop();
        document.getElementById("clear-button").onclick = () => musicBox.clear();
        document.getElementById("add-button").onclick = () => musicBox.addNoteColumn();
        document.getElementById("remove-button").onclick = () => musicBox.removeNoteColumn();
        document.getElementById("set-speed-button").onclick = () => this.setSpeedButton();
        document.getElementById("toggle-theme-button").onclick = () => this.themeSwitcherButton();
    }

    playButton(musicBox) {
        if (musicBox.isPlaying) {
            musicBox.stop();
        }
        musicBox.play();
    }

    setSpeedButton() {
        const newSpeed = window.prompt("Enter a speed [100, 1000].", 500);

        if (newSpeed < 100 || newSpeed > 1000) return;

        globalSettings.activeMusicBox.stop();
        globalSettings.playSpeed = newSpeed;
    }

    saveButton(musicBox) {
        const previousName = globalSettings.previousSaveName;
        const songName = window.prompt("Enter a song name to save it.", previousName);
        globalSettings.previousSaveName = songName;
        globalSettings.activeMusicBox.save(songName);
    }

    loadButton(musicBox) {
        const previousName = globalSettings.previousSaveName;
        const songName = window.prompt("Enter a song name to load it.", previousName);
        globalSettings.activeMusicBox.load(songName);
    }

    themeSwitcherButton() {
        const newTheme = (theme.current == theme.light) ? theme.dark : theme.light;
        theme.change(newTheme);
    }
}

window.addEventListener('load', () => {
    theme.change(theme.light);

    const standardBox = new MusicBox(globalSettings.defaultScale);
    standardBox.create(globalSettings.defaultWidth);
    globalSettings.activeMusicBox = standardBox;

    const sliderControls = new SliderControls();
    sliderControls.bind(globalSettings.activeMusicBox);

    const musicBoxControls = new MusicBoxControls();
    musicBoxControls.bind(globalSettings.activeMusicBox);

    const d = JSON.parse(defaultSongs.PachelbelCannon);
    globalSettings.activeMusicBox.loadJsonString(defaultSongs.PachelbelCannon);
});

/*
    POSSIBLE FUTURE FEATURES:
    * Download/Load songs as JSON files
    * Multiple tabs for multiple music boxes (coded to already support this)
    * Users can create thier own scales (coded to already support this)
    * Print out song as a music box strip
*/
