/// <reference path="phaser.d.ts" />
/// <reference path="ingameState.ts" />

class FurnitureGame extends Phaser.Game {

    constructor(public itemWidth: number, public itemHeight: number) {
        super(itemWidth * 16, itemHeight * 16, Phaser.CANVAS, '');
        this.state.add('ingame', IngameState);
        this.state.start('ingame');
    }

    // make sure to always call this from the first state's preload() method
    initGraphicsSettings() {
        Phaser.Canvas.setImageRenderingCrisp(this.canvas);
        this.scale.pageAlignHorizontally = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
}
