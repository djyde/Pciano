import * as MIDI from 'midi.js'
import * as keyboardJS from 'keyboardjs'

MIDI.loadPlugin({
  instrument: 'acoustic_grand_piano',
  soundfontUrl: '/static/soundfont/',
  onsuccess
})

export const DELAY = 0
export const VELOCITY = 127
export const CHANNEL = 0
export const C1_NOTE_ID = 36
export const OCTAVE = 3

export const noteMap = {
  'C': 0,
  'C#': 1,
  'D': 2,
  'D#': 3,
  'E': 4,
  'F': 5,
  'G#': 6,
  'G': 7,
  'A#': 8,
  'A': 9,
  'B#': 10,
  'B': 11
}

function startsWith(str: string, word: string) {
  return str.lastIndexOf(word, 0) === 0
}

function isAddedNote (noteName: string) {
  return startsWith(noteName, '+')
}

// calculate note map depends on base C note ID
function calNoteMap(baseCNote: number = C1_NOTE_ID + 12 * (OCTAVE - 1)) {
  let ret = {}
  Object.keys(noteMap).forEach(note => {
    ret[note] = baseCNote + noteMap[note]
  })
  return ret as { [noteName: string]: number }
}

function calChord (noteNames: string[]): { [inversion: string]: number[]} {
  const baseCNote = C1_NOTE_ID + 12 * (OCTAVE - 1)
  const addedBaseCNote = baseCNote + 12
  const addAddedBaseCNote = addedBaseCNote + 12
  const subedBaseC = baseCNote - 12
  const generatedNoteMap = calNoteMap(baseCNote)
  const generatedAddNoteMap = calNoteMap(addedBaseCNote)
  const generatedSubNoteMap = calNoteMap(subedBaseC)
  const generatedAddAddNoteMap = calNoteMap(addAddedBaseCNote)

  const ORIGIN_NOTE_0 = generatedNoteMap[noteNames[0].replace('+', '')]
  const ORIGIN_NOTE_1 = generatedNoteMap[noteNames[1].replace('+', '')]
  const ORIGIN_NOTE_2 = generatedNoteMap[noteNames[2].replace('+', '')]

  const ADDED_NOTE_0 = generatedAddNoteMap[noteNames[0].replace('+', '')]
  const ADDED_NOTE_1 = generatedAddNoteMap[noteNames[1].replace('+', '')]
  const ADD_ADDED_NOTE_1 = generatedAddAddNoteMap[noteNames[1].replace('+', '')]
  const ADDED_NOTE_2 = generatedAddNoteMap[noteNames[2].replace('+', '')]
  const ADD_ADDED_NOTE_2 = generatedAddAddNoteMap[noteNames[2].replace('+', '')]  

  const SUB_NOTE_0 = generatedSubNoteMap[noteNames[0].replace('+', '')]
  const SUB_NOTE_1 = generatedSubNoteMap[noteNames[1].replace('+', '')]
  const SUB_NOTE_2 = generatedSubNoteMap[noteNames[2].replace('+', '')]

  if (noteNames.length === 3) {
    // Triads
    return {
      '0': [
        ORIGIN_NOTE_0,
        !isAddedNote(noteNames[1]) ? ORIGIN_NOTE_1 : ADDED_NOTE_1,
        !isAddedNote(noteNames[2]) ? ORIGIN_NOTE_2 : ADDED_NOTE_2
      ],
      '1': [
        ORIGIN_NOTE_0,
        !isAddedNote(noteNames[1]) ? ADDED_NOTE_0 : ADD_ADDED_NOTE_1,
        !isAddedNote(noteNames[2]) ? ORIGIN_NOTE_2 : ADDED_NOTE_2
      ],
      '2': [
        ADDED_NOTE_0,
        !isAddedNote(noteNames[1]) ? ADDED_NOTE_1 : ADD_ADDED_NOTE_1,
        !isAddedNote(noteNames[2]) ? ORIGIN_NOTE_2 : ADDED_NOTE_2
      ],
      '-2': [
        ORIGIN_NOTE_0,
        !isAddedNote(noteNames[1]) ? ORIGIN_NOTE_1 : ADDED_NOTE_1,
        !isAddedNote(noteNames[2]) ? SUB_NOTE_2 : ORIGIN_NOTE_0,
      ]
    }
  } else if (noteNames.length === 4) {
    // Seventh chords
    const ORIGIN_NOTE_3 = generatedNoteMap[noteNames[3].replace('+', '')]
    const SUB_NOTE_3 = generatedSubNoteMap[noteNames[3].replace('+', '')]
    
    
    return {
      '0': [ORIGIN_NOTE_0, ORIGIN_NOTE_1, ORIGIN_NOTE_2, ORIGIN_NOTE_3],
      '-1': [
        ORIGIN_NOTE_0,
        !isAddedNote(noteNames[1]) ? SUB_NOTE_1 : ORIGIN_NOTE_1,
        !isAddedNote(noteNames[2]) ? SUB_NOTE_2 : ORIGIN_NOTE_2,
        !isAddedNote(noteNames[3]) ? SUB_NOTE_3 : ORIGIN_NOTE_3,
      ]
    }
    // return {
    //   '0': [generatedNoteMap[noteNames[0]], generatedNoteMap[noteNames[1]], generatedNoteMap[noteNames[2]], generatedNoteMap[noteNames[3]]
    // }
  }
}

// play a note or a chord(an array of note)
function playNote(note: number)
function playNote(note: number[])
function playNote(note: any): void {
  console.log(note)
  if (Array.isArray(note)) {
    // play chord
    note.forEach(note => {
      MIDI.noteOn(CHANNEL, note, VELOCITY, DELAY)
    })
  } else {
    MIDI.noteOn(CHANNEL, note, VELOCITY, DELAY)
  }
}

function onsuccess () {
  const C = calChord(['C', 'E', 'G'])
  const Am = calChord(['A', '+C', '+E'])
  const Em = calChord(['E', 'G', 'B'])
  const F = calChord(['F', 'A', '+C'])
  const Am7 = calChord(['A', 'C', 'E', 'G'])
  keyboardJS.bind('c', () => {
    // play C major chord - origin inversion
    playNote(C['0'])
  })

  keyboardJS.bind('c + ctrl', () => {
    // play C major chord - first inversion
    playNote(C['1'])
  })

  keyboardJS.bind('c + shift', () => {
    // play C major chord - second inversion
    playNote(C['2'])
  })

  keyboardJS.bind('c + space', () => {
    playNote(C['-2'])
  })

  keyboardJS.bind('a', () => {
    playNote(Am['0'])
  })

  keyboardJS.bind('a + ctrl', () => {
    playNote(Am['1'])
  })

  keyboardJS.bind('a + shift', () => {
    playNote(Am['2'])
  })

  keyboardJS.bind('a + space', () => {
    playNote(Am['-2'])
  })

  keyboardJS.bind('a + 7', () => {
    playNote(Am7['0'])
  })

  keyboardJS.bind('a + 7 + shift', () => {
    playNote(Am7['-1'])
  })

  keyboardJS.bind('e', () => {
    playNote(Em['0'])
  })

  keyboardJS.bind('e + ctrl', () => {
    playNote(Em['1'])
  })

  keyboardJS.bind('e + shift', () => {
    playNote(Em['2'])
  })

  keyboardJS.bind('e + space', () => {
    playNote(Em['-2'])
  })

  keyboardJS.bind('f', () => {
    playNote(F['0'])
  })
}
