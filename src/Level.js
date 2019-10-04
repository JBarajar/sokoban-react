import React from 'react'

import Wall from './Wall.js'
import Floor from './Floor.js'
import Player from './Player.js'
import Box from './Box.js'
import Goal from './Goal.js'
import './Level.css'

class Level extends React.Component {
    constructor() {
        super()
        this.state = {
            tiles: [1,1,1,1,1,1,
                    1,0,3,0,4,1,
                    1,2,0,0,0,1,
                    1,0,0,0,0,1,
                    1,1,1,1,1,1]
        }

        this.tile = [<Floor />, <Wall />, <Player />, <Box />, <Goal />]
    }

    render() {
        const newTiles = this.state.tiles.map((tile, index) => {
            const newTile = Object.assign({}, this.tile[tile])
            newTile.key = index
            return newTile
        })

        return (
            <div className='level-container'>
                {newTiles}
            </div>
        )
    }
}

export default Level