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
                    1,1,1,1,1,1],
            playerPos: 13,
            levelWidth: 6
        }

        this.tile = [<Floor />, <Wall />, <Player />, <Box />, <Goal />]
    }

    moveRight(state) {
        if ( state.tiles[state.playerPos + 1] === 0 ) {
            let newTiles = Object.assign([], state.tiles)
            newTiles[state.playerPos] = 0
            newTiles[state.playerPos+1] = 2
            return {
                tiles: newTiles,
                playerPos: state.playerPos+1
            }
        }
    }

    moveLeft(state) {
        if ( state.tiles[state.playerPos - 1] === 0 ) {
            let newTiles = Object.assign([], state.tiles)
            newTiles[state.playerPos] = 0
            newTiles[state.playerPos-1] = 2
            return {
                tiles: newTiles,
                playerPos: state.playerPos-1
            }
        }
    }

    moveUp(state) {
        if ( state.tiles[state.playerPos - state.levelWidth] == 0 ) {
            let newTiles = Object.assign([], state.tiles)
            newTiles[state.playerPos] = 0
            newTiles[state.playerPos - state.levelWidth] = 2
            return {
                tiles: newTiles,
                playerPos: state.playerPos - state.levelWidth
            }
        }
    }

    moveDown(state) {
        if ( state.tiles[state.playerPos + state.levelWidth] == 0 ) {
            let newTiles = Object.assign([], state.tiles)
            newTiles[state.playerPos] = 0
            newTiles[state.playerPos + state.levelWidth] = 2
            return {
                tiles: newTiles,
                playerPos: state.playerPos + state.levelWidth
            }
        }
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowRight') {
            this.setState(prevState => this.moveRight(prevState))
        }
        else if (e.key === 'ArrowLeft') {
            this.setState(prevState => this.moveLeft(prevState))
        }
        else if (e.key === 'ArrowUp') {
            this.setState(prevState => this.moveUp(prevState))
        }
        else if (e.key === 'ArrowDown') {
            this.setState(prevState => this.moveDown(prevState))
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
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