const notes = {
    'C1': {
        note: new Howl({ src: ['PianoNotes/C1.wav'] }),
        name: 'C1'
    },
    'Cb1': {
        note: new Howl({ src: ['PianoNotes/Cb1.wav'] }),
        name: 'Cb1'
    },
    'D1': {
        note: new Howl({ src: ['PianoNotes/D1.wav'] }),
        name: 'D1'
    },
    'Db1': {
        note: new Howl({ src: ['PianoNotes/Db1.wav'] }),
        name: 'Db1'
    },
    'E1': {
        note: new Howl({ src: ['PianoNotes/E1.wav'] }),
        name: 'E1'
    },
    'F1': {
        note: new Howl({ src: ['PianoNotes/F1.wav'] }),
        name: 'F1'
    },
    'Fb1': {
        note: new Howl({ src: ['PianoNotes/Fb1.wav'] }),
        name: 'Fb1'
    },
    'G1': {
        note: new Howl({ src: ['PianoNotes/G1.wav'] }),
        name: 'G1'
    },
    'Gb1': {
        note: new Howl({ src: ['PianoNotes/Gb1.wav'] }),
        name: 'Gb1'
    },
    'A2': {
        note: new Howl({ src: ['PianoNotes/A2.wav'] }),
        name: 'A2'
    },
    'Ab2': {
        note: new Howl({ src: ['PianoNotes/Ab2.wav'] }),
        name: 'Ab2'
    },
    'B2': {
        note: new Howl({ src: ['PianoNotes/B2.wav'] }),
        name: 'B2'
    },
    'C2': {
        note: new Howl({ src: ['PianoNotes/C2.wav'] }),
        name: 'C2'
    },
    'Cb2': {
        note: new Howl({ src: ['PianoNotes/Cb2.wav'] }),
        name: 'Cb2'
    },
    'D2': {
        note: new Howl({ src: ['PianoNotes/D2.wav'] }),
        name: 'D2'
    },
    'Db2': {
        note: new Howl({ src: ['PianoNotes/Db2.wav'] }),
        name: 'Db2'
    },
    'E2': {
        note: new Howl({ src: ['PianoNotes/E2.wav'] }),
        name: 'E2'
    }
}

function PlayNote(noteName) {
    notes[noteName].note.play();
}

