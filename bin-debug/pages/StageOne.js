var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var StageOne = (function (_super) {
    __extends(StageOne, _super);
    function StageOne() {
        return _super.call(this) || this;
    }
    StageOne.prototype.setChangeStage = function (changeStage) {
        this.changeStage = changeStage;
    };
    StageOne.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        // let assetAdapter = new AssetAdapter();
        // egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        // egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.createGameSceneOne();
    };
    /**
    * 创建第一个场景界面
    * Create scene interface
    */
    StageOne.prototype.createGameSceneOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stageBg, stageW, stageH, descGroup, descGroupW, descGroupH, descCover, textfield, result, titleH, titleW, titleGroup, titleCover, title, button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stageBg = Tool.createBitmapByName("feidie-bg_jpg");
                        this.addChild(stageBg);
                        stageW = this.stage.stageWidth;
                        stageH = this.stage.stageHeight;
                        stageBg.width = stageW;
                        stageBg.height = stageH;
                        descGroup = new eui.Group();
                        descGroupW = stageW;
                        descGroupH = 200;
                        this.addChild(descGroup);
                        descGroup.width = descGroupW;
                        descGroup.height = descGroupH;
                        descGroup.bottom = 0;
                        descGroup.left = 0;
                        descCover = new egret.Shape();
                        descGroup.addChild(descCover);
                        descCover.graphics.beginFill(0x000000, 0.5);
                        descCover.graphics.drawRect(0, 0, descGroupW, descGroupH);
                        descCover.graphics.endFill();
                        textfield = new egret.TextField();
                        descGroup.addChild(textfield);
                        textfield.width = descGroupW * 0.8;
                        textfield.textColor = 0xffffff;
                        textfield.size = 24;
                        textfield.x = descGroupW * 0.1;
                        textfield.y = descGroupH * 0.1;
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 1:
                        result = _a.sent();
                        Tool.startAnimation(result, textfield);
                        titleH = 100;
                        titleW = stageW;
                        titleGroup = new eui.Group();
                        this.addChild(titleGroup);
                        titleGroup.width = titleW;
                        titleGroup.height = titleH;
                        titleGroup.x = 0;
                        titleGroup.y = 0;
                        titleCover = new egret.Shape();
                        titleGroup.addChild(titleCover);
                        titleCover.graphics.beginFill(0x000000, 0.3);
                        titleCover.graphics.drawRect(0, 0, titleW, titleH);
                        titleCover.graphics.endFill();
                        title = new egret.TextField();
                        titleGroup.addChild(title);
                        title.width = stageW;
                        title.size = 40;
                        title.textAlign = 'center';
                        title.y = (titleH - title.$getLineHeight()) / 2;
                        title.text = "程序猿拯救世界";
                        title.textColor = 0xff0000;
                        title.bold = true;
                        button = new eui.Button();
                        button.label = "游戏开始";
                        button.bottom = descGroupH + 20;
                        button.horizontalCenter = 0;
                        this.addChild(button);
                        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeStage, this);
                        return [2 /*return*/];
                }
            });
        });
    };
    return StageOne;
}(eui.UILayer));
__reflect(StageOne.prototype, "StageOne");
//# sourceMappingURL=StageOne.js.map