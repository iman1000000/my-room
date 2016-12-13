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
    paintingGreen: {
        onWall: true, onFloor: false, key: 'pack', frame: 599,
        score: (data) => {
            return 75;
        }
    },
    paintingOrange: {
        onWall: true, onFloor: false, key: 'pack', frame: 600,
        score: (data) => {
            return 75;
        }
    },
    paintingBlue: {
        onWall: true, onFloor: false, key: 'pack', frame: 601,
        score: (data) => {
            return 75;
        }
    },
    doorWideLeft: {
        onWall: true, onFloor: false, key: 'pack', frame: 370,
        score: (data) => {
            let item = data.state.getAt(data.x+1, data.y);
            if (item.typeName == 'doorWideRight') {
                if (!data.firstDoor) {
                    data.firstDoor = true;
                    if (clearBelow(data)) {
                        return 200;
                    }
                    return 150;
                }
                if (clearBelow(data)) {
                    return 50;
                }
            }
            return 0;
        }
    },
    doorWideRight: {
        onWall: true, onFloor: false, key: 'pack', frame: 371,
        score: (data) => {
            let item = data.state.getAt(data.x-1, data.y);
            if (item.typeName == 'doorWideLeft') {
                if (clearBelow(data)) {
                    return 50;
                }
                return 0;
            }
            return 0;
        }
    },
    tableWideLeft: {
        onWall: false, onFloor: true, key: 'pack', frame: 197,
        score: (data) => {
            let item = data.state.getAt(data.x+1, data.y);
            if (item.typeName == 'tableWideRight') {
                return 50 + countSurrounding(data, /^chair/) * 50;
            }
            return 0;
        }
    },
    tableWideRight: {
        onWall: false, onFloor: true, key: 'pack', frame: 312,
        score: (data) => {
            let item = data.state.getAt(data.x-1, data.y);
            if (item.typeName == 'tableWideLeft') {
                return 50 + countSurrounding(data, /^chair/) * 50;
            }
            return 0;
        }
    },
    anvil: {
        onWall: false, onFloor: true, key: 'pack', frame: 15,
        score: (data) => {
            return 60;
        }
    },
    bin: {
        onWall: false, onFloor: true, key: 'pack', frame: 425,
        score: (data) => {
            return 50;
        }
    },
    mushroom: {
        onWall: false, onFloor: true, key: 'pack', frame: 276,
        score: (data) => {
            return 25;
        }
    },
    bookshelf: {
        onWall: true, onFloor: true, key: 'pack', frame: 841,
        score: (data) => {
            return clearBelow(data) * 50;
        }
    },
    banner: {
        onWall: true, onFloor: false, key: 'pack', frame: 52,
        score: (data) => {
            return 50;
        }
    },
    counter1: {
        onWall: true, onFloor: true, key: 'pack', frame: 28,
        score: (data) => {
            return scoreCounter(data);
        }
    },
    counter2: {
        onWall: true, onFloor: true, key: 'pack', frame: 29,
        score: (data) => {
            return scoreCounter(data);
        }
    },
    counter3: {
        onWall: true, onFloor: true, key: 'pack', frame: 30,
        score: (data) => {
            return scoreCounter(data);
        }
    },
    counter4: {
        onWall: true, onFloor: true, key: 'pack', frame: 31,
        score: (data) => {
            return scoreCounter(data);
        }
    },
    cupboard: {
        onWall: true, onFloor: true, key: 'pack', frame: 311,
        score: (data) => {
            return clearBelow(data) * 50;
        }
    },

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

function scoreCounter(data) {
    return 50 + countHorizontal(data, /^counter/) * 25;
}

const itemPages = [
    ['bedHorizontal', 'bedVertical', 'chairLeft', 'chairRight', 'chairUp',
        'chairDown', 'table', 'drawers'],
    ['door', 'mirrorRectangle', 'mirrorCircle', 'windowSquare',
        'windowCircle', 'torch', 'fireplace', 'banner'],
    ['doorWideLeft', 'doorWideRight', 'tableWideLeft', 'tableWideRight',
        'anvil', 'bin', 'mushroom', 'bookshelf'],
    ['counter1', 'counter2', 'counter3', 'counter4',
        'paintingGreen', 'paintingOrange', 'paintingBlue', 'cupboard']
];
