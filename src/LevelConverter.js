//Converts text files from http://www.sourcecode.se/sokoban/levels to JSON

function splitLevels(levels) {
    let newLevels = levels.split('\n\n')
    newLevels = newLevels.filter(string => string.length > 0)
    return newLevels
}

function splitLines(level) {
    let newLevel = level.split('\n')
    newLevel = newLevel.filter(string => string[0] !== ';')
    return newLevel
}

function findMaxWidth(lines) {
    let width = 0
    for (let line of lines) {
        if(line.length > width) width = line.length
    }
    return width
}

function convertLevel(level) {
    let lines = splitLines(level)
    
    let width = findMaxWidth(lines)
    let height = lines.length

    let newLevel = []
    let goalPos = []
    let playerPos = null
    let numLine = 0
    for (let line of lines) {
        for (let i = 0; i < width; i++) {
            if(i < line.length) {
                newLevel.push(line[i])
                if ( line[i] === '@' ) playerPos = i + (numLine * width)
                else if ( line[i] === '*' || line[i] === '.') goalPos.push(i + (numLine * width))
                else if ( line[i] === '+' ) { 
                    playerPos = i + (numLine * width)
                    goalPos.push(i + (numLine * width))
                }
            }
            else {
                newLevel.push(' ')
            }
        }
        numLine += 1
    }

    return {
        level: newLevel,
        width: width,
        height: height,
        goalPos: goalPos,
        playerPos: playerPos
    }
}

export function convertToJSON(levelData) {
    let newLevelData = {'original': []}

    let levels = splitLevels(levelData)
    let numLevels = levels.length
    
    //console.log(newLevelData)
    for( let level of levels) {
        //console.log(level)
        let newLevel = convertLevel(level)
        newLevelData.original.push(newLevel)

    }

    newLevelData.original.numLevels = numLevels

    return newLevelData
}



