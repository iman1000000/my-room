/// <reference path="phaser.d.ts" />
/// <reference path="constants.ts" />

const HINTS_LIST = `Make sure there's clear space to get to your chairs!
There's no point in a bed you can't get into!
Paintings are pretty!
A chair is a table's best friend!
Check out all the pages of items!
Make sure there's a door to get in!
Press the green button in the bottom left to hide these messages
Don't block the way!`.split('\n');

class Hints {
    hintText: Phaser.Text;
    removeTimer: number = 0;
    makeTimer: number = 0;
    enabled: boolean = true;

    constructor(private game: Phaser.Game) {
        this.makeTimer = setTimeout(this.makeHint.bind(this), 15000)
    }

    makeHint() {
        let text = HINTS_LIST[Math.floor(Math.random() * HINTS_LIST.length)];
        this.hintText = this.game.add.text(0, 0, text, HINT_TEXT_STYLE);
        this.hintText.setTextBounds(0, 0, 160, 160);
        this.removeTimer = setTimeout(this.removeHint.bind(this), 5000);
        this.makeTimer = setTimeout(this.makeHint.bind(this), 45000);
    }

    removeHint() {
        this.hintText.destroy();
    }

    toggle() {
        if (this.enabled) {
            if (this.hintText) this.hintText.destroy();
            clearTimeout(this.makeTimer);
            clearInterval(this.removeTimer);
            this.enabled = false;
            let text = "Hints disabled!";
            this.hintText = this.game.add.text(0, 0, text, HINT_TEXT_STYLE);
            this.hintText.setTextBounds(0, 0, 160, 160);
            this.removeTimer = setTimeout(this.removeHint.bind(this), 3000);

        } else {
            if (this.hintText) this.hintText.destroy();
            clearTimeout(this.makeTimer);
            clearInterval(this.removeTimer);
            this.makeHint();
            this.enabled = true;
        }
    }
}
