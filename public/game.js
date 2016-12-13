var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ITEM_WIDTH = 16;
var ITEM_HEIGHT = 16;
var GAME_WIDTH = 10;
var GAME_HEIGHT = 10;
var SCORE_START_X = 1;
var SCORE_END_X = 8;
var SCORE_START_Y = 0;
var SCORE_END_Y = 6;
var SCORE_TEXT_STYLE = { fontSize: 14, fontWeight: 'normal' };
var HINT_TEXT_STYLE = { fontSize: 12, fontWeight: 'bold',
    boundsAlignH: 'center', wordWrap: true, align: 'center' };
var itemTypes = {
    bedHorizontal: {
        onWall: false, onFloor: true, key: 'pack', frame: 72,
        score: function (data) {
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
        score: function (data) {
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
        score: function (data) {
            return scoreChair(data);
        }
    },
    chairRight: {
        onWall: false, onFloor: true, key: 'pack', frame: 193,
        score: function (data) {
            return scoreChair(data);
        }
    },
    chairUp: {
        onWall: false, onFloor: true, key: 'pack', frame: 190,
        score: function (data) {
            return scoreChair(data);
        }
    },
    chairDown: {
        onWall: false, onFloor: true, key: 'pack', frame: 191,
        score: function (data) {
            return scoreChair(data);
        }
    },
    table: {
        onWall: false, onFloor: true, key: 'pack', frame: 364,
        score: function (data) {
            return 50 + countSurrounding(data, /^chair/) * 50;
        }
    },
    drawers: {
        onWall: true, onFloor: true, key: 'pack', frame: 365,
        score: function (data) {
            return clearBelow(data) * 50;
        }
    },
    door: {
        onWall: true, onFloor: false, key: 'pack', frame: 33,
        score: function (data) {
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
        score: function (data) {
            return clearBelow(data) * 50;
        }
    },
    mirrorCircle: {
        onWall: true, onFloor: false, key: 'pack', frame: 480,
        score: function (data) {
            return clearBelow(data) * 50;
        }
    },
    windowSquare: {
        onWall: true, onFloor: false, key: 'pack', frame: 99,
        score: function (data) {
            return 50;
        }
    },
    windowCircle: {
        onWall: true, onFloor: false, key: 'pack', frame: 45,
        score: function (data) {
            return 50;
        }
    },
    torch: {
        onWall: true, onFloor: false, key: 'pack', frame: 473,
        score: function (data) {
            return 50;
        }
    },
    fireplace: {
        onWall: true, onFloor: false, key: 'pack', frame: 510,
        score: function (data) {
            return 50;
        }
    },
    painting: {
        onWall: true, onFloor: false, key: 'pack', frame: 601,
        score: function (data) {
            return 75;
        }
    }
};
function countSurrounding(data, regex) {
    var total = 0;
    var item = data.state.getAt(data.x - 1, data.y);
    if (regex.test(item.typeName))
        total++;
    item = data.state.getAt(data.x + 1, data.y);
    if (regex.test(item.typeName))
        total++;
    item = data.state.getAt(data.x, data.y - 1);
    if (regex.test(item.typeName))
        total++;
    item = data.state.getAt(data.x, data.y + 1);
    if (regex.test(item.typeName))
        total++;
    return total;
}
function countVertical(data, regex) {
    var total = 0;
    var item = data.state.getAt(data.x, data.y - 1);
    if (regex.test(item.typeName))
        total++;
    item = data.state.getAt(data.x, data.y + 1);
    if (regex.test(item.typeName))
        total++;
    return total;
}
function countHorizontal(data, regex) {
    var total = 0;
    var item = data.state.getAt(data.x - 1, data.y);
    if (regex.test(item.typeName))
        total++;
    item = data.state.getAt(data.x + 1, data.y);
    if (regex.test(item.typeName))
        total++;
    return total;
}
function clearBelow(data) {
    var item = data.state.getAt(data.x, data.y + 1);
    if (/^empty/.test(item.typeName))
        return 1;
    return 0;
}
function scoreChair(data) {
    if (countSurrounding(data, /^empty/)) {
        return 50;
    }
    return 0;
}
var itemPages = [
    ['bedHorizontal', 'bedVertical', 'chairLeft', 'chairRight', 'chairUp',
        'chairDown', 'table', 'drawers'],
    ['door', 'mirrorRectangle', 'mirrorCircle', 'windowSquare',
        'windowCircle', 'torch', 'fireplace', 'painting']
];
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(game, x, y, type) {
        _super.call(this, game, x, y, itemTypes[type].key, itemTypes[type].frame);
        this.state = game.state.getCurrentState();
        this.typeName = type;
        this.typeObj = itemTypes[type];
        this.inputEnabled = true;
        this.input.enableDrag(false, true);
        this.input.enableSnap(ITEM_WIDTH, ITEM_HEIGHT, false, true);
        this.events.onDragStart.add(this.onDragStart, this);
        this.events.onDragStop.add(this.onDragStop, this);
        this.state.grid[this.itemX][this.itemY] = this;
    }
    Item.prototype.onDragStart = function (sprite, pointer) {
        this.oldX = this.x;
        this.oldY = this.y;
    };
    Item.prototype.onDragStop = function (sprite, pointer) {
        if (this.canPlaceAt(this.itemX, this.itemY) &&
            ((this.itemY == 0 && this.typeObj.onWall) ||
                (this.itemY != 0 && this.typeObj.onFloor))) {
            this.state.grid[this.itemX][this.itemY] = this;
            this.state.grid[this.oldItemX][this.oldItemY] = null;
        }
        else if (this.itemY > SCORE_END_Y) {
            this.state.grid[this.oldItemX][this.oldItemY] = null;
            this.destroy();
        }
        else {
            this.x = this.oldX;
            this.y = this.oldY;
        }
        this.state.calculateScore();
        this.state.generateItems();
    };
    Item.prototype.canPlaceAt = function (placeItemX, placeItemY) {
        if (placeItemX > SCORE_END_X ||
            placeItemX < SCORE_START_X ||
            placeItemY > SCORE_END_Y ||
            placeItemY < SCORE_START_Y) {
            return false;
        }
        return this.state.grid[placeItemX][placeItemY] == null;
    };
    Object.defineProperty(Item.prototype, "itemX", {
        get: function () {
            return this.x / ITEM_WIDTH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "itemY", {
        get: function () {
            return this.y / ITEM_HEIGHT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "oldItemX", {
        get: function () {
            return this.oldX / ITEM_WIDTH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "oldItemY", {
        get: function () {
            return this.oldY / ITEM_HEIGHT;
        },
        enumerable: true,
        configurable: true
    });
    return Item;
}(Phaser.Sprite));
var HINTS_LIST = "Make sure there's clear space to get to your chairs!\nThere's no point in a bed you can't get into!\nPaintings are pretty!\nA chair is a table's best friend!\nCheck out all the pages of items!\nMake sure there's a door to get in!\nPress the green button in the bottom left to hide these messages\nDon't block the way!".split('\n');
var Hints = (function () {
    function Hints(game) {
        this.game = game;
        this.removeTimer = 0;
        this.makeTimer = 0;
        this.enabled = true;
        this.makeTimer = setTimeout(this.makeHint.bind(this), 15000);
    }
    Hints.prototype.makeHint = function () {
        var text = HINTS_LIST[Math.floor(Math.random() * HINTS_LIST.length)];
        this.hintText = this.game.add.text(0, 0, text, HINT_TEXT_STYLE);
        this.hintText.setTextBounds(0, 0, 160, 160);
        this.removeTimer = setTimeout(this.removeHint.bind(this), 5000);
        this.makeTimer = setTimeout(this.makeHint.bind(this), 45000);
    };
    Hints.prototype.removeHint = function () {
        this.hintText.destroy();
    };
    Hints.prototype.toggle = function () {
        if (this.enabled) {
            if (this.hintText)
                this.hintText.destroy();
            clearTimeout(this.makeTimer);
            clearInterval(this.removeTimer);
            this.enabled = false;
            var text = "Hints disabled!";
            this.hintText = this.game.add.text(0, 0, text, HINT_TEXT_STYLE);
            this.hintText.setTextBounds(0, 0, 160, 160);
            this.removeTimer = setTimeout(this.removeHint.bind(this), 3000);
        }
        else {
            if (this.hintText)
                this.hintText.destroy();
            clearTimeout(this.makeTimer);
            clearInterval(this.removeTimer);
            this.makeHint();
            this.enabled = true;
        }
    };
    return Hints;
}());
var IngameState = (function (_super) {
    __extends(IngameState, _super);
    function IngameState() {
        _super.apply(this, arguments);
        this.grid = [];
        this.itemPage = 0;
    }
    IngameState.prototype.preload = function () {
        this.game.initGraphicsSettings();
        this.game.load.spritesheet('pack', 'assets/roguelikeSheet_transparent.png', 16, 16, -1, 0, 1);
        this.game.load.image('bg', 'assets/testbg.png');
        this.game.load.image('roombg', 'assets/roombg.png');
    };
    IngameState.prototype.create = function () {
        var bg = this.game.add.image(0, 0, 'roombg');
        var prevButton = this.game.add.button(0, 8 * 16, 'pack', this.prevButtonCallback, this, 1650, 1650, 1648, 1650);
        var nextButton = this.game.add.button(9 * 16, 8 * 16, 'pack', this.nextButtonCallback, this, 1651, 1651, 1649, 1651);
        var hintsButton = this.game.add.button(0, 9 * 16, 'pack', this.hintsButtonCallback, this, 903, 903, 901, 903);
        this.scoreText = this.game.add.text(66, 9 * 16, "Score:", SCORE_TEXT_STYLE);
        this.initGrid();
        this.generateItems();
        this.calculateScore();
        this.hints = new Hints(this.game);
    };
    IngameState.prototype.update = function () {
    };
    IngameState.prototype.render = function () {
    };
    IngameState.prototype.initGrid = function () {
        for (var row = 0; row < this.game.itemHeight; row++) {
            this.grid.push([]);
            for (var col = 0; col < this.game.itemWidth; col++) {
                this.grid[row].push(null);
            }
        }
    };
    IngameState.prototype.getAt = function (x, y) {
        if (x < SCORE_START_X || x > SCORE_END_X ||
            y < SCORE_START_Y || y > SCORE_END_Y) {
            return { typeName: "wall", typeObj: { score: function () { return (0); } } };
        }
        if (this.grid[x][y] == null) {
            if (y == 0) {
                return { typeName: "wall", typeObj: { score: function () { return (0); } } };
            }
            return { typeName: "empty", typeObj: { score: function () { return (0); } } };
        }
        return this.grid[x][y];
    };
    IngameState.prototype.calculateScore = function () {
        var data = { state: this, score: 0, x: 0, y: 0 };
        for (var x = SCORE_START_X; x <= SCORE_END_X; x++) {
            for (var y = SCORE_START_Y; y <= SCORE_END_Y; y++) {
                data.x = x;
                data.y = y;
                data.score += this.getAt(x, y).typeObj.score(data);
            }
        }
        this.scoreText.text = "Score: " + data.score;
    };
    IngameState.prototype.generateItems = function () {
        var page = this.itemPage;
        for (var i = 0; i < 8; i++) {
            if (this.grid[i + 1][8]) {
                this.grid[i + 1][8].destroy();
            }
            this.game.add.existing(new Item(this.game, 16 + (16 * i), 16 * 8, itemPages[page][i]));
        }
    };
    IngameState.prototype.nextButtonCallback = function () {
        this.itemPage++;
        if (this.itemPage == itemPages.length) {
            this.itemPage = 0;
        }
        this.generateItems();
    };
    IngameState.prototype.prevButtonCallback = function () {
        this.itemPage--;
        if (this.itemPage < 0) {
            this.itemPage = itemPages.length - 1;
        }
        this.generateItems();
    };
    IngameState.prototype.hintsButtonCallback = function () {
        this.hints.toggle();
    };
    return IngameState;
}(Phaser.State));
;
var FurnitureGame = (function (_super) {
    __extends(FurnitureGame, _super);
    function FurnitureGame(itemWidth, itemHeight) {
        _super.call(this, itemWidth * 16, itemHeight * 16, Phaser.CANVAS, '');
        this.itemWidth = itemWidth;
        this.itemHeight = itemHeight;
        this.state.add('ingame', IngameState);
        this.state.start('ingame');
    }
    FurnitureGame.prototype.initGraphicsSettings = function () {
        Phaser.Canvas.setImageRenderingCrisp(this.canvas);
        this.scale.pageAlignHorizontally = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    };
    return FurnitureGame;
}(Phaser.Game));
var game = new FurnitureGame(GAME_WIDTH, GAME_HEIGHT);
