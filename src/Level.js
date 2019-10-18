import React from 'react'

import Tile from './Tile.js'
import './Level.css'


class Level extends React.Component {
    constructor(props) {
        //console.log(props)
        super(props)
        this.state = {
            tiles: props.levelData.original[1].level,
            goalPos: props.levelData.original[1].goalPos,
            playerPos: props.levelData.original[1].playerPos,
            levelWidth: props.levelData.original[1].width,
            numMoves: 0,
            gameOver: false,
            gameWon: false
        }

        
    }

    componentDidMount() {
        
    }

    isValidBoxMove(state, boxPos, modifier) {
        if (state.tiles[boxPos + modifier] === ' ' || state.tiles[boxPos + modifier] === '.') {
            return true
        }
        else return false
    }

    isBoxStuck(state, boxPos) {
        
        if ( (state.tiles[boxPos - 1] === '#' || state.tiles[boxPos + 1] === '#') && (state.tiles[boxPos - state.levelWidth] === '#' || state.tiles[boxPos + state.levelWidth] === '#') ) {
            if (state.tiles[boxPos] === '*') return false
            else return true
        }
        else return false
    }

    isGameWon(tiles, goalPos) {
        return goalPos.every(pos => tiles[pos] === '*')
    }

    move(state, modifier) {
        const currTile = state.tiles[state.playerPos]
        const nextPos = state.playerPos + modifier
        const nextTile = state.tiles[nextPos]

        if(nextTile === '#') return

        let newTiles = Object.assign([], state.tiles)
        
        if(nextTile === ' ') {
            newTiles[nextPos] = '@'
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            return {
                tiles: newTiles,
                playerPos: state.playerPos + modifier,
                numMoves: state.numMoves + 1,
            }
        }

        else if(nextTile === '.') {
            newTiles[nextPos] = '+'
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            return {
                tiles: newTiles,
                playerPos: state.playerPos + modifier,
                numMoves: state.numMoves + 1,
            }
        }
        
        else if ((nextTile === '$' || nextTile === '*') && this.isValidBoxMove(state, state.playerPos + modifier, modifier)) {
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            if (nextTile === '$') newTiles[state.playerPos + modifier] = '@'
            else if (nextTile === '*') newTiles[state.playerPos + modifier] = '+'

            const nextBoxPos = state.playerPos + modifier + modifier
            const nextBoxTile = newTiles[nextBoxPos]

            if(nextBoxTile === ' ') {
                newTiles[nextBoxPos] = '$'

            }
            else if (nextBoxTile === '.') {
                newTiles[nextBoxPos] = '*'
            }
            let newState =  {
                tiles: newTiles,
                goalPos: state.goalPos,
                playerPos: state.playerPos + modifier,
                levelWidth: state.levelWidth,
                numMoves: state.numMoves + 1,
                gameWon: this.isGameWon(newTiles, state.goalPos)
            }

            newState.gameOver = this.isBoxStuck(newState, nextBoxPos)
            return newState
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
            this.setState(this.state.origState)
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        this.setState({origState: Object.assign({}, this.state)})
    }

    render() {
        const newTiles = this.state.tiles.map((tile, index) => {
            return <Tile key={index} tileType={tile} levelWidth={this.state.levelWidth} />
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