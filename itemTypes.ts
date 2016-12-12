const itemTypes = {
    bedHorizontal: {
        onWall: false, onFloor: true, key: 'pack', frame: 72,
        score: (data) => {
            if (countVertical(data, /^empty/)) {
                if (!data.firstBed) {
                    data.firstBed = true;
                    return 200;
                }
                return 50;
            }
            return 0;
        }
    },
    bedVertical: {
        onWall: false, onFloor: true, key: 'pack', frame: 186,
        score: (data) => {
            if (countHorizontal(data, /^empty/)) {
                if (!data.firstBed) {
                    data.firstBed = true;
                    return 200;
                }
                return 50;
            }
            return 0;
        }
    },
    chairLeft: {
        onWall: false, onFloor: true, key: 'pack', frame: 192,
        score: (data) => {
            return scoreChair(data);
        }
    },
    chairRight: {
        onWall: false, onFloor: true, key: 'pack', frame: 193,
        score: (data) => {
            return scoreChair(data);
        }
    },
    chairUp: {
        onWall: false, onFloor: true, key: 'pack', frame: 190,
        score: (data) => {
            return scoreChair(data);
        }
    },
    chairDown: {
        onWall: false, onFloor: true, key: 'pack', frame: 191,
        score: (data) => {
            return scoreChair(data);
        }
    },
    table: {
        onWall: false, onFloor: true, key: 'pack', frame: 364,
        score: (data) => {
            return 50 + countSurrounding(data, /^chair/) * 50;
        }
    },
    drawers: {
        onWall: true, onFloor: true, key: 'pack', frame: 365,
        score: (data) => {
            return clearBelow(data) * 50;
        }
    },
    door: {
        onWall: true, onFloor: false, key: 'pack', frame: 33,
        score: (data) => {
            if (clearBelow(data)) {
                if (!data.firstDoor) {
                    data.firstDoor = true;
                    return 200;
                }
                return 50;
            }
            return 0;
        }
    },
    mirrorRectangle: {
        onWall: true, onFloor: false, key: 'pack', frame: 423,
        score: (data) => {
            return clearBelow(data) * 50;
        }
    },
    mirrorCircle: {
        onWall: true, onFloor: false, key: 'pack', frame: 480,
        score: (data) => {
            return clearBelow(data) * 50;
        }
    },
    windowSquare: {
        onWall: true, onFloor: false, key: 'pack', frame: 99,
        score: (data) => {
            return 50;
        }
    },
    windowCircle: {
        onWall: true, onFloor: false, key: 'pack', frame: 45,
        score: (data) => {
            return 50;
        }
    },
    torch: {
        onWall: true, onFloor: false, key: 'pack', frame: 473,
        score: (data) => {
            return 50;
            // TODO symmetry bonus
        }
    },
    fireplace: {
        onWall: true, onFloor: false, key: 'pack', frame: 510,
        score: (data) => {
            return 50;
        }
    },
    painting: {
        onWall: true, onFloor: false, key: 'pack', frame: 601,
        score: (data) => {
            return 75;
        }
    }
};

function countSurrounding(data, regex) {
    let total = 0;
    let item = data.state.getAt(data.x-1, data.y);
    if (regex.test(item.typeName)) total++;
    item = data.state.getAt(data.x+1, data.y);
    if (regex.test(item.typeName)) total++;
    item = data.state.getAt(data.x, data.y-1);
    if (regex.test(item.typeName)) total++;
    item = data.state.getAt(data.x, data.y+1);
    if (regex.test(item.typeName)) total++;
    return total;
}

function countVertical(data, regex) {
    let total = 0;
    let item = data.state.getAt(data.x, data.y-1);
    if (regex.test(item.typeName)) total++;
    item = data.state.getAt(data.x, data.y+1);
    if (regex.test(item.typeName)) total++;
    return total;
}

function countHorizontal(data, regex) {
    let total = 0;
    let item = data.state.getAt(data.x-1, data.y);
    if (regex.test(item.typeName)) total++;
    item = data.state.getAt(data.x+1, data.y);
    if (regex.test(item.typeName)) total++;
    return total;
}

function clearBelow(data) {
    let item = data.state.getAt(data.x, data.y+1);
    if (/^empty/.test(item.typeName)) return 1;
    return 0;
}

function scoreChair(data) {
    if (countSurrounding(data, /^empty/)) {
        return 50
    }
    return 0;
}

const itemPages = [
    ['bedHorizontal', 'bedVertical', 'chairLeft', 'chairRight', 'chairUp',
        'chairDown', 'table', 'drawers'],
    ['door', 'mirrorRectangle', 'mirrorCircle', 'windowSquare',
        'windowCircle', 'torch', 'fireplace', 'painting']
];
