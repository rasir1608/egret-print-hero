/**
 * 静态工具
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Tool = (function () {
    function Tool() {
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Tool.startAnimation = function (result, textfield) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(5000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
    */
    Tool.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 获取随机正整数
     */
    Tool.randInt = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    /**
     * 取小数点后几位
     */
    Tool.fixedFloat = function (floatNum, fixedNum) {
        return Math.floor(floatNum * Math.pow(10, fixedNum)) / Math.pow(10, fixedNum);
    };
    Tool.appendTo = function (str, appendStr, num) {
        while (str.length < num) {
            str = "" + appendStr + str;
        }
        return str;
    };
    return Tool;
}());
__reflect(Tool.prototype, "Tool");
//# sourceMappingURL=Tool.js.map