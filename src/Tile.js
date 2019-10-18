import React from 'react'
import './Tiles.css'

class Tile extends React.Component {
    constructor() {
        super()

        this.tileTypes = {            
            '#': 'wall',
            '@': 'player',
            '+': 'playerGoal',
            '$': 'box',
            '*': 'boxGoal',
            '.': 'goal',
            ' ': 'floor'
            
        }
    }

    render() {
        const className = this.tileTypes[this.props.tileType]
        const tSize = 100 / this.props.levelWidth

        return <div className={`tile ${className}`} style={{flex: `1 1 ${tSize}%`, height: 'auto'}}></div>
    }
}

export default Tile