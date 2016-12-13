/// <reference path="phaser.d.ts" />
/// <reference path="furnitureGame.ts" />
/// <reference path="item.ts" />
/// <reference path="constants.ts" />
/// <reference path="hints.ts" />

class IngameState extends Phaser.State {
    game: FurnitureGame;
    grid: Array<Array<Item|null>> = [];
    itemPage: number = 0;
    scoreText: Phaser.Text;
    hints: Hints;

    preload() {
        this.game.initGraphicsSettings();

        this.game.load.spritesheet('pack',
           'assets/roguelikeSheet_transparent.png', 16, 16, -1, 0, 1);
        this.game.load.image('roombg', 'assets/roombg.png');
    }

    create() {
        let bg = this.game.add.image(0, 0, 'roombg');
        let prevButton = this.game.add.button(0, 8*16, 'pack',
              this.prevButtonCallback, this, 1650, 1650, 1648, 1650);
        let nextButton = this.game.add.button(9*16, 8*16, 'pack',
              this.nextButtonCallback, this, 1651, 1651, 1649, 1651);
        let hintsButton = this.game.add.button(0, 9*16, 'pack',
              this.hintsButtonCallback, this, 903, 903, 901, 903);
        this.scoreText = this.game.add.text(66, 9*16, "Score:", SCORE_TEXT_STYLE)
        this.initGrid();
        this.generateItems();
        this.calculateScore();
        this.hints = new Hints(this.game);
    }

    update() {
    }

    render() {
    }

    initGrid() {
        for (let row = 0; row < this.game.itemHeight; row++) {
            this.grid.push([]);
            for (let col = 0; col < this.game.itemWidth; col++) {
                this.grid[row].push(null);
            }
        }
    }

    getAt(x: number, y:number): any {
        if (x < SCORE_START_X || x > SCORE_END_X ||
            y < SCORE_START_Y || y > SCORE_END_Y) {
                return {typeName: "wall", typeObj: {score: () => (0)}};
        }
        if (this.grid[x][y] == null) {
            if (y == 0) {
                return {typeName: "wall", typeObj: {score: () => (0)}};
            }
            return {typeName: "empty", typeObj: {score: () => (0)}};
        }
        return this.grid[x][y];
    }

    calculateScore() {
        let data = {state: this, score: 0, x:0, y:0};
        for (let x = SCORE_START_X; x <= SCORE_END_X; x++) {
            for (let y = SCORE_START_Y; y <= SCORE_END_Y; y++) {
                data.x = x;
                data.y = y;
                data.score += this.getAt(x, y).typeObj.score(data);
            }
        }

        this.scoreText.text = "Score: " + data.score;
    }

    generateItems() {
        let page = this.itemPage;
        for (let i = 0; i < 8; i++) {
            if (this.grid[i+1][8]) {
                this.grid[i+1][8].destroy();
            }
            this.game.add.existing(new Item(this.game, 16+(16*i), 16*8,
                                            itemPages[page][i]));
        }
    }

    nextButtonCallback() {
        this.itemPage++;
        if (this.itemPage == itemPages.length) {
            this.itemPage = 0;
        }
        this.generateItems();
    }

    prevButtonCallback() {
        this.itemPage--;
        if (this.itemPage < 0) {
            this.itemPage = itemPages.length-1;
        }
        this.generateItems();
    }

    hintsButtonCallback() {
        this.hints.toggle();
    }
};

