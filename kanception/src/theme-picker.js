import React from 'react'
import './theme-picker.css'
import Dark from './mode-dark.svg'
import Light from './mode-light.svg'

const ThemePicker = props => (
  <div className="theme-picker-overlay">
    <div className="theme-picker-modal">
      <h2>Choose a Theme</h2>
      <div className="choice-container">
        <div
          className="choice"
          style={{
            border: props.mode === 'light' ? "solid 1px rebeccapurple" : "none"
          }}
        >
          <img className="mode-img" src={Light} alt="Light theme" />
          <h3>Light Mode</h3>
          <button
            className="choose-btn"
            onClick={e => props.onModeChange('light')}
          >Choose</button>
        </div>
        <div
          className="choice"
          style={{
            border: props.mode === 'dark' ? "solid 1px rebeccapurple" : "none"
          }}
        >
          <img className="mode-img" src={Dark} alt="Dark theme" />
          <h3>Dark Mode</h3>
          <button
            className="choose-btn"
            onClick={e => props.onModeChange('dark')}
          >Choose</button>
        </div>
      </div>
      <button className="finish-btn" onClick={props.onResign}>Finish</button>
    </div>
  </div>
)

export default ThemePicker
