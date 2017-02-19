import * as MIDI from 'midi.js'
import './style.css'
import * as Vue from 'vue'
import { onsuccess } from './keyBinding'

MIDI.loadPlugin({
  instrument: 'acoustic_grand_piano',
  soundfontUrl: 'static/soundfont/',
  onsuccess
})
