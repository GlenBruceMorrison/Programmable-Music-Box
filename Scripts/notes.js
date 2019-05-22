const notes = {
    'A4': {
        note: new Howl({ src: ['PianoNotes/A4.mp3'] }),
        name: 'A4'
    },
    'B4': {
        note: new Howl({ src: ['PianoNotes/B4.mp3'] }),
        name: 'B4'
    },
    'C4': {
        note: new Howl({ src: ['PianoNotes/C4.mp3'] }),
        name: 'C4'
    },
    'D4': {
        note: new Howl({ src: ['PianoNotes/D4.mp3'] }),
        name: 'D4'
    },
    'E4': {
        note: new Howl({ src: ['PianoNotes/E4.mp3'] }),
        name: 'E4'
    },
    'F4': {
        note: new Howl({ src: ['PianoNotes/F4.mp3'] }),
        name: 'F4'
    },
    'G4': {
        note: new Howl({ src: ['PianoNotes/G4.mp3'] }),
        name: 'G4'
    }
}

function PlayNote(noteName) {
    notes[noteName].note.play();
}

