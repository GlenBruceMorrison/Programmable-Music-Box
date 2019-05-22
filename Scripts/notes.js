const notes = {
    'C5': {
        note: new Howl({ src: ['PianoNotes/C5.wav'] }),
        name: 'C5'
    },
    'D5': {
        note: new Howl({ src: ['PianoNotes/D5.wav'] }),
        name: 'D5'
    },
    'E5': {
        note: new Howl({ src: ['PianoNotes/E5.wav'] }),
        name: 'E5'
    },
    'F5': {
        note: new Howl({ src: ['PianoNotes/F5.wav'] }),
        name: 'F5'
    },
    'G5': {
        note: new Howl({ src: ['PianoNotes/G5.wav'] }),
        name: 'G5'
    },
    'A5': {
        note: new Howl({ src: ['PianoNotes/A5.wav'] }),
        name: 'A5'
    },
    'B5': {
        note: new Howl({ src: ['PianoNotes/B5.wav'] }),
        name: 'B5'
    }
}

function PlayNote(noteName) {
    notes[noteName].note.play();
}
