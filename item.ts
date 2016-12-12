/// <reference path="phaser.d.ts" />
/// <reference path="ingameState.ts" />
/// <reference path="furnitureGame.ts" />
/// <reference path="constants.ts" />
/// <reference path="itemTypes.ts" />



class Item extends Phaser.Sprite {
    state: IngameState;
    oldX: number;
    oldY: number;
    game: FurnitureGame;
    typeName: string;
    typeObj: any;

    constructor(game: Phaser.Game, x: number, y: number, type: string) {
        super(game, x, y, itemTypes[type].key, itemTypes[type].frame);
        this.state = <IngameState>game.state.getCurrentState();
        this.typeName = type;
        this.typeObj = itemTypes[type];

        // set up dragging
        this.inputEnabled = true;

        // don't autocenter because onDragStart logs the current location
        // bring to top so that we drag over other objects
        this.input.enableDrag(false, true);

        // snap on drop, not drag
        this.input.enableSnap(ITEM_WIDTH, ITEM_HEIGHT, false, true);

        this.events.onDragStart.add(this.onDragStart, this);
        this.events.onDragStop.add(this.onDragStop, this);

        // add to the grid
        this.state.grid[this.itemX][this.itemY] = this;
    }

    onDragStart(sprite, pointer) {
        this.oldX = this.x;
        this.oldY = this.y;
    }

    onDragStop(sprite, pointer) {
        if (this.canPlaceAt(this.itemX, this.itemY) &&
           ( (this.itemY == 0 && this.typeObj.onWall) ||
           (this.itemY != 0 && this.typeObj.onFloor))) {
            this.state.grid[this.itemX][this.itemY] = this;
            this.state.grid[this.oldItemX][this.oldItemY] = null;
        } else if (this.itemY > SCORE_END_Y) {
            // destroy when dropped on the tool bar
            this.state.grid[this.oldItemX][this.oldItemY] = null;
            this.destroy();
        } else {
            this.x = this.oldX;
            this.y = this.oldY;
        }

        this.state.calculateScore();

        // regenerate the item page in case we came from there
        this.state.generateItems();
    }

    canPlaceAt(placeItemX, placeItemY): boolean {
        if (placeItemX > SCORE_END_X ||
                placeItemX < SCORE_START_X ||
                placeItemY > SCORE_END_Y ||
                placeItemY < SCORE_START_Y) {
            return false;
        }
        return this.state.grid[placeItemX][placeItemY] == null;
    }

    get itemX(): number {
        return this.x / ITEM_WIDTH;
    }

    get itemY(): number {
        return this.y / ITEM_HEIGHT;
    }

    get oldItemX(): number {
        return this.oldX / ITEM_WIDTH;
    }

    get oldItemY(): number {
        return this.oldY / ITEM_HEIGHT;
    }
}
