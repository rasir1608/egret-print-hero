/**
 * 得分记录
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Scores = (function () {
    function Scores() {
        this.miss = 0;
        this.storm = 0;
        this.score = 0;
    }
    Scores.prototype.setMiss = function (textfield, miss) {
        this.miss = miss;
        textfield.text = this.miss + "";
    };
    Scores.prototype.setStorm = function (textfield, storm) {
        this.storm = storm;
        textfield.text = this.storm + "";
    };
    Scores.prototype.setScore = function (textfield, score) {
        this.score = score;
        textfield.text = this.score + "";
    };
    Scores.prototype.getMiss = function () {
        return this.miss;
    };
    Scores.prototype.getStorm = function () {
        return this.storm;
    };
    Scores.prototype.getScore = function () {
        return this.score;
    };
    Scores.prototype.get = function (name) {
        return this[name];
    };
    return Scores;
}());
__reflect(Scores.prototype, "Scores");
//# sourceMappingURL=Scores.js.map