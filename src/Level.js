import React from 'react'

import Tile from './Tile.js'
import './Level.css'


class Level extends React.Component {
    constructor(props) {
        //console.log(props)
        super(props)
        this.state = {
            currLevel: 0,
            tiles: props.levelData.original[0].level,
            goalPos: props.levelData.original[0].goalPos,
            playerPos: props.levelData.original[0].playerPos,
            levelWidth: props.levelData.original[0].width,
            levelHeight: props.levelData.original[0].height,
            numMoves: 0,
            gameOver: false,
            gameWon: false
        }

        
    }

    changeLevel(num) {
        this.setState({
            currLevel: num,
            tiles: this.props.levelData.original[num].level,
            goalPos: this.props.levelData.original[num].goalPos,
            playerPos: this.props.levelData.original[num].playerPos,
            levelWidth: this.props.levelData.original[num].width,
            levelHeight: this.props.levelData.original[num].height,
            numMoves: 0,
            gameOver: false,
            gameWon: false
        })
    }

    nextLevel() {
        const newLevel = this.state.currLevel + 1
        this.changeLevel(newLevel)
    }

    prevLevel() {
        const newLevel = this.state.currLevel - 1
        if (newLevel >= 0) this.changeLevel(newLevel)
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
        const result = goalPos.every(pos => tiles[pos] === '*')
        if (result) setTimeout(() => this.nextLevel(), 2000)
        return result
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
                levelHeight: state.levelHeight,
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
                e.preventDefault();
                this.setState(prevState => this.moveRight(prevState))
            }
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.setState(prevState => this.moveLeft(prevState))
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.setState(prevState => this.moveUp(prevState))
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.setState(prevState => this.moveDown(prevState))
            }
        }

        if(e.key === 'r' || e.key === 'R') {
            this.setState(this.state.origState)
        }

        if(e.key === 'e') {
            this.nextLevel()
        }

        if(e.key === 'q') {
            this.prevLevel()
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        this.setState({origState: Object.assign({}, this.state)})
    }

    render() {
        const newTiles = this.state.tiles.map((tile, index) => {
            return <Tile key={index} tileType={tile} levelWidth={this.state.levelWidth} levelHeight={this.state.levelHeight}/>
        })

        return (
            <div className='page-container'>
                <header>
                    <p>Sokoban</p>
                </header>

                <div className='game-container'>
                    <div className='level-container' id='levelContainer'>
                        {newTiles}
                    </div>
                    <div className='stat-container'>
                        <p>Moves: {this.state.numMoves}</p>
                        <p>Level: {this.state.currLevel + 1}</p>
                        {this.state.gameOver ? <p className='game-over'>Game Over, Press "R" to restart.</p> : null}
                        {this.state.gameWon ? <p className='game-won'>Game Won!</p> : null}
                    </div>
                    <div className='desc-container'>
                        <text>
                            Objective: Push the red boxes onto the yellow goals<br/><br/>
                            Controls<br/>
                            Move - Arrow Keys
                        </text>
                    </div>
                </div>

                <footer>
                    <p>Created by Joseph Barajar</p>
                </footer>
            </div>
        )
    }
}

export default Level