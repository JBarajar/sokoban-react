import React from 'react'
import playerIcon from './player.png'
import './Player.css'

class Player extends React.Component {
    render() {
         return <img className='player' src={playerIcon} alt='player'/>
    }
}

export default Player