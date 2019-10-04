import React from 'react'

import Wall from './Wall.js'
import './Level.css'

class Level extends React.Component {
    constructor() {
        super()
        this.state = {
            tiles: [1,1,1,1,1,1,
                    1,1,1,1,1,1,
                    1,1,1,1,1,1,
                    1,1,1,1,1,1,
                    1,1,1,1,1,1]
        }

        

    }

    render() {
        const newTiles = this.state.tiles.map((tile, index) => {
            if (tile == 1) return <Wall key={index}/>
        })

        return (
            <div className='level-container'>
                {newTiles}
            </div>
        )
    }
}

export default Level