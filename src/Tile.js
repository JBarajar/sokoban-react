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
        const tSize = (1 / this.props.levelWidth) * 100
        return <div className={`tile ${className}`} style={{width: `${tSize}%`, paddingTop: `${tSize}%`}}></div>
    }
}

export default Tile