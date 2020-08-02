import React from 'react'
import './Tiles.css'
import wall from './img/wall.png'
import player from './img/player.png'
import playerGoal from './img/playerGoal.png'
import box from './img/box.png'
import boxGoal from './img/boxGoal.png'
import goal from './img/goal.png'
import floor from './img/floor.png'

function Tile(props) {
    const tileTypes = {            
        '#': wall,
        '@': player,
        '+': playerGoal,
        '$': box,
        '*': boxGoal,
        '.': goal,
        ' ': floor
    }

    const className = tileTypes[props.tileType]

    return (
        <img alt='' className='tile' src={className} />
    )
}

export default Tile