// music box controls
const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");
const clearButton = document.getElementById("clear-button");

const standardBox = new MusicBox(C5MajorScale, 70);
standardBox.create();

const globalSettings = {
    activeMusicBox: standardBox,
    noteOnColour: "#54F2F2",
    noteOffColour: "#042A2B",
    playHeadOnColor: "#54F2F2",
    playHeadOffColor: "#042A2B"
}

// music box dragging
const slider = globalSettings.activeMusicBox.container;
let mousedown = false;
let draggingMusicWindow = false;
let startX = 0;
let scrollLeftOnDown;

playButton.onclick = () => {
    if (globalSettings.activeMusicBox.isPlaying) {
        globalSettings.activeMusicBox.stop();
    }
    globalSettings.activeMusicBox.play();
};

stopButton.onclick = () => globalSettings.activeMusicBox.stop();

clearButton.onclick = () => globalSettings.activeMusicBox.clear();

window.addEventListener('mousedown', (e) => {
    startX = e.pageX;
    mousedown = true
    scrollLeftOnDown = slider.scrollLeft;

    draggingMusicWindow = false;
});

window.addEventListener('mouseup', () => {
    mousedown = false
});

standardBox.container.addEventListener('mousemove', (e) => {
    if (!mousedown) return;

    draggingMusicWindow = true;

    const diff = (e.pageX - startX);
    slider.scrollLeft = scrollLeftOnDown - diff;
});

