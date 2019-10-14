import React from 'react'

import Tile from './Tile.js'
import './Level.css'

class Level extends React.Component {
    constructor() {
        super()
        this.state = {
            tiles: [1,1,1,1,1,1,1,
                    1,0,3,0,4,0,1,
                    1,0,0,0,0,0,1,
                    1,0,0,5,0,0,1,
                    1,1,1,1,1,1,1],
            goalPos: [11, 24],
            playerPos: 15,
            levelWidth: 7,
            numMoves: 0,
            gameOver: false,
            gameWon: false
        }

        this.origState = Object.assign({}, this.state)
    }

    isValidBoxMove(state, boxPos, modifier) {
        if (state.tiles[boxPos + modifier] === 0 || state.tiles[boxPos + modifier] === 4) {
            return true
        }
        else return false
    }

    isBoxStuck(state, boxPos) {
        if ( (state.tiles[boxPos - 1] === 1 || state.tiles[boxPos + 1] === 1) && (state.tiles[boxPos - state.levelWidth] === 1 || state.tiles[boxPos + state.levelWidth] === 1) )
            if (state.tiles[boxPos] === 5) return false
            else return true
        else return false
    }

    isGameWon(tiles, goalPos) {
        return goalPos.every(pos => tiles[pos] === 5)
    }

    move(state, modifier) {
        const nextTile = state.tiles[state.playerPos + modifier]
        if(nextTile === 0 || nextTile === 4) {
            return {
                playerPos: state.playerPos + modifier,
                numMoves: state.numMoves + 1
            }
        }
        
        else if ((nextTile === 3 || nextTile === 5) && this.isValidBoxMove(state, state.playerPos + modifier, modifier)) {
            let newTiles = Object.assign([], state.tiles)

            if (newTiles[state.playerPos + modifier] === 3) newTiles[state.playerPos + modifier] = 0
            else if (newTiles[state.playerPos + modifier] === 5) newTiles[state.playerPos + modifier] = 4

            const nextBoxTile = state.playerPos + modifier + modifier

            if(newTiles[nextBoxTile] === 0) {
                newTiles[nextBoxTile] = 3

            }
            else if (newTiles[nextBoxTile] === 4) {
                newTiles[nextBoxTile] = 5
            }
            return {
                tiles: newTiles,
                playerPos: state.playerPos + modifier,
                numMoves: state.numMoves + 1,
                gameOver: this.isBoxStuck(state, nextBoxTile),
                gameWon: this.isGameWon(newTiles, state.goalPos)
            }
        }
    }

    moveRight(state) {
        return this.move(state, 1)
    }

    moveLeft(state) {
        return this.move(state, -1)
    }

    moveUp(state) {
        return this.move(state, -state.levelWidth)
    }

    moveDown(state) {
        return this.move(state, state.levelWidth)
    }

    handleKeyDown(e) {
        if (!this.state.gameOver && !this.state.gameWon) {
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

        if(e.key === 'r' || e.key === 'R') {
            this.setState(this.origState)
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
    }

    render() {
        const newTiles = this.state.tiles.map((tile, index) => {
            return index !== this.state.playerPos ? <Tile key={index} tileType={tile} levelWidth={this.state.levelWidth} /> : <Tile key={index} tileType={2} levelWidth={this.state.levelWidth} />
        })

        return (
            <div className='game-container'>
                <div className='level-container' id='levelContainer'>
                    {newTiles}
                </div>
                <div className='stat-container'>
                    <p>Moves: {this.state.numMoves}</p>
                    {this.state.gameOver ? <p className='game-over'>Game Over, Press "R" to restart.</p> : null}
                    {this.state.gameWon ? <p className='game-won'>Game Won!</p> : null}
                </div>
            </div>
        )
    }
}

export default Level