import { app } from './keyBinding'

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

export function startsWith(str: string, word: string) {
  return str.lastIndexOf(word, 0) === 0
}

export function isAddedNote(noteName: string) {
  return startsWith(noteName, '+')
}

// calculate note map depends on base C note ID
export function calNoteMap(baseCNote: number = C1_NOTE_ID + 12 * (OCTAVE - 1)) {
  let ret = {}
  Object.keys(noteMap).forEach(note => {
    ret[note] = baseCNote + noteMap[note]
  })
  return ret as { [noteName: string]: number }
}

export function calChord(noteNames: string[]): { [inversion: string]: number[] } {
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
        ADDED_NOTE_0,
        !isAddedNote(noteNames[1]) ? ORIGIN_NOTE_1 : ADDED_NOTE_1,
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
        !isAddedNote(noteNames[2]) ? SUB_NOTE_2 : ORIGIN_NOTE_2,
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

// calculate broken chord
export function calBrokenChord (notes: number[] = window.app.currentChord) {
  const baseNote = notes[0]
  const threeNote = notes[1]
  const fiveNote = notes[2]
  const brokenBaseNote = baseNote - 2 * 12 + 1
  const broken = []

  broken[1] = baseNote - 2 * 12
  broken[5] = fiveNote - 2 * 12 < broken[1] ? fiveNote - 1 * 12 : fiveNote - 2 * 12
  broken[8] = baseNote - 1 * 12
  broken[10] = threeNote - 1 * 12

  return broken
}
