import React from 'react'
import './Tiles.css'

class Tile extends React.PureComponent {
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
        let tW = (1 / this.props.levelWidth) * 100
        let tH = (1 / this.props.levelHeight) * 100
        
        return <div className={`tile ${className}`} style={{width: `${tW}%`, height: `${tH}%`}}></div>
    }
}

export default Tile