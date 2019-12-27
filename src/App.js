import React from 'react'
import Level from './Level.js'
import './App.css'
import {convertToJSON} from './LevelConverter.js'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true
        }

    }

    componentDidMount() {
        fetch('Original.txt')
            .then(res => res.text())
            .then(text => {
                this.setState( {
                    levelData: convertToJSON(text),
                    loading: false
                })
            })
    }

    render() {
        return (
            <div className='App'>
                {
                    this.state.loading ? <p>Loading...</p> : <Level levelData={this.state.levelData}/>
                }
            </div> 
        ) 
    }
}

export default App