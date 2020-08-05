import React from 'react';
import '../Level.css'
import Tile from './Tile/Tile.js';

function TileBoard(props) {
    const newTiles = props.state.map((tile, index) => {
        return <Tile key={index} tileType={tile} />
    })
    document.documentElement.style.setProperty('--level-width', props.width)
    document.documentElement.style.setProperty('--level-height', props.height)

    return (
        <div className='level-grid'>
            {newTiles}
        </div>
    )
}

export default TileBoard