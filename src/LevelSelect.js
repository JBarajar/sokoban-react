import React, { useState, useEffect } from 'react'
import './LevelSelect.css'

function LevelSelect(props) {
    const [curr, changeCurr] = useState(props.currLevel)
    const [value, changeValue] = useState(props.currLevel + 1);

    function handleChange(e) {
        changeValue(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.changeLevel(value - 1);
    }

    useEffect(() => {
        if(props.currLevel !== curr) {
            changeCurr(props.currLevel);
            changeValue(props.currLevel + 1);
        }
    }, [props.currLevel, curr])

    return(
        <div className='level-select'>
                <button className='prev-button' onClick={() => props.prevLevel()}>&larr;</button>

                <div className='level-field'>
                    <p className='level-label'>Level:</p>
                    <div className='number-box'>
                        <form onSubmit={handleSubmit}>
                            <input 
                                className='level-input' 
                                type='number' 
                                min='0' 
                                max={props.numLevels} 
                                value={value} 
                                onChange={handleChange}>
                            </input>
                        </form>
                        <p>/{props.numLevels}</p>
                    </div>
                </div>
  
                <button className='next-button' onClick={() => props.nextLevel()}> &rarr;</button>
            </div>
    )
}

export default LevelSelect