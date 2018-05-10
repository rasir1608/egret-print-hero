var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Bomb = (function () {
    function Bomb(parentGroup, position, size, deadline, failCb, winCb, speed, speedPlus) {
        if (speed === void 0) { speed = 2; }
        if (speedPlus === void 0) { speedPlus = 0; }
        this.bombGroup = new eui.Group();
        this.parentGroup = parentGroup;
        this.with = size;
        this.position = position;
        this.speed = speed;
        this.winCb = winCb;
        this.failCb = failCb;
        this.speedPlus = speedPlus;
        this.deadline = deadline;
        this.initState();
    }
    Bomb.prototype.getName = function () {
        return this.name;
    };
    Bomb.prototype.getScore = function () {
        return this.score;
    };
    Bomb.prototype.initState = function () {
        var isUpper = Tool.randInt(0, 10) > 8;
        var bombW = this.with;
        var bombH = this.with * 2.5;
        this.bombGroup.width = bombW;
        this.bombGroup.height = bombH;
        this.bombGroup.x = this.position[0];
        this.bombGroup.y = this.position[1];
        var background;
        if (isUpper) {
            this.name = String.fromCharCode(Tool.randInt(65, 90));
            this.score = 5;
            background = Tool.createBitmapByName('bomb-bg-upper_png');
        }
        else {
            this.name = String.fromCharCode(Tool.randInt(97, 122));
            this.score = 1;
            background = Tool.createBitmapByName('bomb-bg-lower_png');
        }
        background.width = bombW;
        background.height = bombH;
        background.x = 0;
        background.y = 0;
        this.bombGroup.addChild(background);
        var scale = Tool.fixedFloat(1 / 76, 8);
        var textField = new egret.TextField();
        textField.text = this.name;
        this.bombGroup.addChild(textField);
        textField.width = bombW;
        textField.size = 24;
        textField.textColor = isUpper ? 0x000000 : 0xff0000;
        textField.textAlign = "center";
        textField.y = bombH * scale * 24 - textField.$getHeight() / 2;
        this.parentGroup.addChild(this.bombGroup);
    };
    Bomb.prototype.run = function () {
        var lastY = this.deadline - this.bombGroup.$getHeight();
        this.speed += this.speedPlus;
        this.position[1] = this.position[1] + this.speed;
        var tw = egret.Tween.get(this.bombGroup);
        tw.to({ y: this.position[1] });
        if (this.bombGroup.y > lastY) {
            this.destroy();
            this.failCb(this);
        }
        return this.bombGroup;
    };
    Bomb.prototype.winScore = function () {
        this.winCb(this);
        this.destroy();
        return this.bombGroup;
    };
    Bomb.prototype.destroy = function () {
        var _this = this;
        var afterBombGroup = new eui.Group();
        var size = this.with * 3;
        afterBombGroup.width = size;
        afterBombGroup.height = size;
        afterBombGroup.x = this.position[0] + this.bombGroup.width / 2;
        afterBombGroup.y = this.position[1] + this.bombGroup.height / 2;
        var bg = Tool.createBitmapByName('bomb-boo-2_png');
        bg.width = size;
        bg.height = size;
        afterBombGroup.addChild(bg);
        var removeSelf = function () {
            _this.parentGroup.removeChild(afterBombGroup);
        };
        if (this.bombGroup) {
            this.parentGroup.removeChild(this.bombGroup);
            this.parentGroup.addChild(afterBombGroup);
            afterBombGroup.anchorOffsetX = afterBombGroup.width / 2;
            afterBombGroup.anchorOffsetY = afterBombGroup.height / 2;
            afterBombGroup.scaleX = 0.1;
            afterBombGroup.scaleY = 0.1;
            var tw = egret.Tween.get(afterBombGroup);
            tw.to({ scaleX: 1, scaleY: 1 }, 200).wait(200).call(removeSelf);
        }
    };
    return Bomb;
}());
__reflect(Bomb.prototype, "Bomb");
//# sourceMappingURL=Bomb.js.map