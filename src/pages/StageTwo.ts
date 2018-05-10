/**
* 游戏的第二个场景
*/

class StageTwo extends eui.UILayer {
	
    private scores:Scores;

    public setScores(scores:Scores):void{
        this.scores = scores;
    }
	
    public getScores():Scores{
        return this.scores;
    }

    private createBoomTime:number = 0;
    
    private stormBaseNum:number = 50;
    
    private deadline:number = 0;

	private scoreTexts:egret.TextField[] = [];

    private bombList:Bomb[] = [];

    private changeStage:Function = null;

    private isPause = false;

    private pauseBannerGroup:eui.Group;

    private stopBannerGroup:eui.Group;

    private passTimeGroup:eui.Group;

    private passTimer:egret.Timer = new egret.Timer(29,0);

    private passTimeMillisecond:number = 0;

    private stopBannerText:egret.TextField;

    private createBombduring:number = 2000;

    private stormCtrl:eui.Group = new eui.Group();

    public setChangeStage(fun:Function){
        this.changeStage = fun;
    }

	protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
           if(!this.contains(this.pauseBannerGroup)  && !this.contains(this.stopBannerGroup)){
                this.isPause = true;
                this.addChild(this.pauseBannerGroup);
            }
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
            if(!this.contains(this.pauseBannerGroup) && !this.contains(this.stopBannerGroup)){
                this.isPause = true;
                this.addChild(this.pauseBannerGroup);
            }
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        // let assetAdapter = new AssetAdapter();
        // egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        // egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.createGameSceneTwo();

    }

	private createGameSceneTwo(){
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.isPause = false;
        const scoreGroupW = stageW;
        const scoreGroupH = 70;

        this.createPauseBanner();
        this.createStopBanner();
        const stageBg = Tool.createBitmapByName("feidie-bg-02_jpg");
        stageBg.width = stageW;
        stageBg.height = stageH - scoreGroupH;
        this.addChild(stageBg);


        const keyBoard = this.createKeyboard(stageW,240);
        keyBoard.bottom = scoreGroupH;
        this.addChild(keyBoard);

        const scoreGroup = this.createScoreGroup(scoreGroupW,scoreGroupH);
        this.addChild(scoreGroup);

        this.deadline = Math.floor( stageH - keyBoard.$getHeight() - scoreGroup.$getHeight());

        this.createBtn('暂停',50,50,80,50,this.pauseGame);
        this.createBtn('重新开始',100,50,140,50,this.restartGame); 
        this.createBtn('返回',50,50,20,50,this.stopBannerShow);

        this.passTimeGroup = this.createBtn('抵抗时间：00:00:00:000',240,50,stageW - 260,50);
        this.startPassTimer();
    }

    private stopBannerShow(){
        this.isPause = true;
        if(!this.contains(this.stopBannerGroup)) {
            this.stopBannerText.text =  "游戏结束，您获得了" + this.scores.getScore() + "分,被炸"+ this.scores.getMiss() + "次!";
            this.addChild(this.stopBannerGroup);
        }
    }


    /**
     * 抵抗时间计时器，控制炸弹产生间隔以及炸弹下落速度
     */
    private startPassTimer():void{
        this.passTimer.addEventListener(egret.TimerEvent.TIMER,() => {
            this.passTimeMillisecond += 22;
            if(this.stage.frameRate < 60) this.stage.frameRate = Math.min(30 + Math.floor(this.passTimeMillisecond / 3000) * 10 , 60);
            if(this.createBombduring > 1000) this.createBombduring = 2000 - Math.floor(this.passTimeMillisecond / 5000) * 100
            else if(this.createBombduring > 500) this.createBombduring = 2000 - Math.floor(this.passTimeMillisecond / 15000) * 100
            else if(this.createBombduring > 300) this.createBombduring = 2000 - Math.floor(this.passTimeMillisecond / 25000) * 100
            else if(this.createBombduring > 100) this.createBombduring = 2000 - Math.floor(this.passTimeMillisecond / 30000) * 20
            this.createBombs();
            this.passTimeGroup.$children.forEach(e => {
                if(e instanceof egret.TextField) {
                    const h = Math.floor(this.passTimeMillisecond / (60 * 60 * 1000));
                    const m = Math.floor((this.passTimeMillisecond - h * (60 * 60 * 1000)) / (60 * 1000) );
                    const s = Math.floor((this.passTimeMillisecond - h * (60 * 60 * 1000) - m * (60 * 1000)) / 1000 );
                    const ms = this.passTimeMillisecond % 1000;
                    e.text = `抵抗时间：${Tool.appendTo(`${h}`,'0',2)}:${Tool.appendTo(`${m}`,'0',2)}:${Tool.appendTo(`${s}`,'0',2)}:${Tool.appendTo(`${ms}`,'0',3)}`;
                }
            })
        },this);
        this.passTimer.start();
    }

    /**
     * 暂停游戏
     */
    private pauseGame(){
        if(this.contains(this.pauseBannerGroup)) {
            this.removeChild(this.pauseBannerGroup);
            this.isPause = false;
        } else {
            this.addChild(this.pauseBannerGroup);
            this.isPause = true;
        }
    }

    /**
     * 游戏重新开始
     */
    private restartGame(){
        this.destroyStageTwo();
        this.scores.setMiss(this.scoreTexts[0],0);
        this.scores.setScore(this.scoreTexts[1],0);
        this.scores.setStorm(this.scoreTexts[2],0);
        this.stormCtrl.$children.forEach((e) => {
            if(e instanceof egret.TextField){
                e.textColor = 0x999999
            }
        })
        this.isPause = false;
        this.stage.frameRate = 30;
        this.createBombduring = 2000;
        this.passTimeMillisecond = 0;
        egret.ticker.resume();
    }

   
    /**
     * 创建炸弹
     */
    private createBombs(){
        if(this.isPause) return  egret.ticker.pause();
            if(this.createBoomTime === 0 || this.passTimeMillisecond - this.createBoomTime > this.createBombduring) {
                const bomb = new Bomb(this,[Tool.randInt(100,this.stage.$getWidth()-100 ),100],40,this.deadline,() => {
                    this.scores.setMiss(this.scoreTexts[0],this.scores.getMiss() +1)
                    this.bombList = this.bombList.filter(b => b !== bomb);
                    if(this.scores.getMiss() >= 5) {
                        this.stopBannerShow();
                    }
                },() => {
                        const oldStormComputerNum = Math.floor(this.scores.getScore() / this.stormBaseNum);
                        this.scores.setScore(this.scoreTexts[2],this.scores.getScore() + bomb.getScore());
                        this.bombList.shift();
                        const newStormComputerNum = Math.floor(this.scores.getScore() / this.stormBaseNum);
                        if(oldStormComputerNum < newStormComputerNum) {
                            this.scores.setStorm(this.scoreTexts[1],this.scores.getStorm() +1);
                            if(this.scores.getStorm() === 1){
                                this.stormCtrl.$children.forEach((e) => {
                                    if(e instanceof egret.TextField){
                                        e.textColor = 0xff0000;
                                    }
                                })
                            }
                        }
                    },3);
                this.bombList.push(bomb);
                this.createBoomTime = this.passTimeMillisecond;
            } 
           //炸弹移动
            this.bombList.map((e) => {
                e.run();
                return e;
            });
            return false;
    }

    /**
     * 底部被炸、磁暴、得分记录数据
     */
    private createScoreGroup(scoreGroupW:number,scoreGroupH:number):eui.Group{
        const scoreGroup = new eui.Group();
        scoreGroup.width = scoreGroupW;
        scoreGroup.height = scoreGroupH;
        scoreGroup.bottom = 0;
        scoreGroup.left = 0;

        const scoreGroupBg = new egret.Shape();
        scoreGroupBg.graphics.clear();
        scoreGroup.addChild(scoreGroupBg);
        scoreGroupBg.x = 3;
        scoreGroupBg.y = 3;
        scoreGroupBg.graphics.lineStyle( 3, 0x000000);
        scoreGroupBg.graphics.beginFill(0xffffff);
        scoreGroupBg.graphics.drawRect(0,0,scoreGroupW-6,scoreGroupH-6);
        scoreGroupBg.graphics.endFill();

        const scoreGroupInner = new eui.Group();
        scoreGroup.addChild(scoreGroupInner);
        scoreGroupInner.verticalCenter = 0;
        scoreGroupInner.horizontalCenter = 0;
        scoreGroupInner.width = 500;
        scoreGroupInner.height = 50;

        const scoreGroupInnerBg = new egret.Shape();
        scoreGroupInnerBg.graphics.clear();
        scoreGroupInner.addChild(scoreGroupInnerBg);
        scoreGroupInnerBg.graphics.lineStyle(1,0x000000);
        scoreGroupInnerBg.graphics.beginFill(0xeeeeee);
        scoreGroupInnerBg.graphics.drawRect(0,0,scoreGroupInner.$getWidth()-2,scoreGroupInner.$getHeight() -2);
        scoreGroupInnerBg.graphics.endFill();

        const labels = [{label:'被炸',score:'miss'},{label:'磁暴',score:'storm'},{label:'得分',score:'score'}];
        labels.forEach((e,i) => {
           const scoreTextGroup = this.createScoreTextGroup(scoreGroupInner,e.label,this.scores.get(e.score));
           scoreTextGroup.x = i* scoreGroupInner.$getWidth()/3;
        });
        return scoreGroup;
    }

    /**
     * 被炸、磁暴、得分每一个小项目的组合UI
     */
    private createScoreTextGroup(parentGroup:eui.Group,text:string,score:number):eui.Group{
        const group = new eui.Group();
        group.width = parentGroup.$getWidth()/3;
        group.height = parentGroup.$getHeight();
        parentGroup.addChild(group);
        const label = new egret.TextField();
        group.addChild(label);
        label.text = text+":";
        label.width = group.$getWidth()/2;
        label.textAlign = 'center';
        label.textColor = 0x000000;
        label.size = 24;
        label.bold = true;
        label.y = (group.$getHeight() - label.$getHeight())/2;
        const scoreText = new egret.TextField();
        group.addChild(scoreText);
        this.scoreTexts.push(scoreText);
        scoreText.text = score + '';
        scoreText.width = group.$getWidth()/2;
        scoreText.textAlign = 'center';
        scoreText.textColor = 0x000000;
        scoreText.x = label.$getWidth();
        scoreText.y = (group.$getHeight() - scoreText.$getHeight())/2;
        return group;
    }

    /**
     * 生成键盘
     */
     private createKeyboard(keyBoardW:number,keyBoardH:number):eui.Group{
        const keyBoardGroup = new eui.Group();
        keyBoardGroup.width = keyBoardW;
        keyBoardGroup.height = keyBoardH;

        const keyBoardCover = new egret.Shape();
        keyBoardGroup.addChild(keyBoardCover);
        keyBoardCover.graphics.clear();
        keyBoardCover.graphics.beginFill(0xeeeeee);
        keyBoardCover.graphics.drawRect(0,0,keyBoardW,keyBoardH);
        keyBoardCover.graphics.endFill();
        this.create27Keys(keyBoardGroup);
        return keyBoardGroup;
    }


    /**
     * 生成键盘上的26个字母 以及切换大小写的按键 还有磁暴控制按钮初始化
     */
    private create27Keys(parentGroup:eui.Group):void{
        let keyCodes = [113,119,101,114,116,121,117,105,111,112,97,115,100,102,103,104,106,107,108,122,120,99,118,98,110,109];
        const baseKeyW = Math.floor((parentGroup.$getWidth() / 12)*100)/100;
        const baseKeyH = Math.floor((parentGroup.$getHeight() / 4)*100)/100;
        const marginW = Math.floor((((parentGroup.$getWidth()/12)*2)/11)*100)/100;
        const marginH = Math.floor(((parentGroup.$getHeight() / 4)/4)*100)/100;
        const linesList:eui.Group[] = [];
        const keys26List:egret.TextField[] = [];

        // 大小写切换按键
        const upLowerGroup:eui.Group = new eui.Group();
        upLowerGroup.width = baseKeyW * 1.6;
        upLowerGroup.height = baseKeyH;
        upLowerGroup.left = marginW;
        upLowerGroup.top = 2 * (marginH + baseKeyH) + marginH;
        parentGroup.addChild(upLowerGroup);
        const upLowerCover:egret.Shape = new egret.Shape();
        upLowerCover.graphics.clear();
        upLowerCover.graphics.lineStyle(1,0xff0000);
        upLowerCover.graphics.beginFill(0xffffff);
        upLowerCover.graphics.drawRoundRect(0,0,upLowerGroup.$getWidth(),upLowerGroup.$getHeight(),Math.floor(baseKeyW/3),Math.floor(baseKeyW/3));
        upLowerCover.graphics.endFill();
        upLowerGroup.addChild(upLowerCover);
        const upLowerText:egret.TextField = new egret.TextField();
        upLowerGroup.addChild(upLowerText);
        upLowerText.size = 20;
        upLowerText.textColor = 0x000000;
        upLowerText.textAlign = 'center';
        upLowerText.text = 'upper';
        upLowerText.$setWidth(upLowerGroup.$getWidth());
        upLowerText.x = 0;
        upLowerText.y = Math.floor((baseKeyH - upLowerText.$getHeight())/2);
        
        upLowerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,(e) => {
            upLowerText.text =  upLowerText.text === 'upper' ? 'lower' :'upper';
            const tag = upLowerText.text === 'upper' ? 1 : -1;
            keys26List.forEach((e) => {
                e.text = String.fromCharCode(e.text.charCodeAt(0) + 32 * tag);
            })

        },this);

        // 生产26个字母按键
        for(let i = 0; i < 3 ; i ++){
            const lineGroup = new eui.Group();
            let keyNum = 0;
            if(i === 0) {
                keyNum = 10;
            } else if( i === 1) {
                keyNum = 9;
            } else {
                keyNum = 7;
            }
            lineGroup.width = keyNum * (baseKeyW + marginW) + marginW;
            lineGroup.height = baseKeyH;
            lineGroup.top = i * (marginH + baseKeyH) + marginH;
            lineGroup.horizontalCenter = 0;
            linesList.push(lineGroup);
            parentGroup.addChild(lineGroup);
        } 
        for(let i = 0; i < 26 ; i ++){
            const keyGroup = new eui.Group();
            keyGroup.width = baseKeyW;
            keyGroup.height = baseKeyH;
            const keyGroupBg = new egret.Shape();
            keyGroupBg.graphics.clear();
            keyGroupBg.graphics.lineStyle(1,0xff0000);
            keyGroupBg.graphics.beginFill(0xffffff);
            keyGroupBg.graphics.drawRoundRect(0,0,baseKeyW,baseKeyH,Math.floor(baseKeyW/3),Math.floor(baseKeyW/3));
            keyGroupBg.graphics.endFill();
            keyGroup.addChild(keyGroupBg);
            const text = new egret.TextField();
            keys26List.push(text);
            text.text = String.fromCharCode(keyCodes[i]);
            text.textColor = 0x000000;
            text.textAlign = 'center';
            text.width = baseKeyW;
            text.x = 0;
            text.y = Math.floor((baseKeyH - text.$getHeight())/2);
            keyGroup.addChild(text);
            if(i < 10) {
                keyGroup.left = i * (marginW + baseKeyW) + marginW;
                linesList[0].addChild(keyGroup);
            } else if(i < 19){
                keyGroup.left = (i - 10) * (marginW + baseKeyW)  + marginW;
                linesList[1].addChild(keyGroup);
            } else {
                keyGroup.left = (i - 19) * (marginW + baseKeyW)  + marginW;
                linesList[2].addChild(keyGroup);
            }

            keyGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,(e) => {
                const firstBomb = this.bombList[0];
                if(firstBomb && firstBomb.getName() === text.text) {
                    firstBomb.winScore();
                }
            },this);
        }

        // 释放磁暴按钮
        const R = baseKeyW*1.3;
        this.stormCtrl.width = R ;
        this.stormCtrl.height = R;
        this.stormCtrl.right = marginW * 2;
        this.stormCtrl.top = 2 * (marginH + baseKeyH) + marginH;
        const stormCtrlBg = new egret.Shape();
        stormCtrlBg.graphics.clear();
        stormCtrlBg.graphics.lineStyle(1,0x000000);
        stormCtrlBg.graphics.beginFill(0xffffff);
        stormCtrlBg.graphics.drawArc(R/2,R/2,R/2,0,2*Math.PI,true);
        stormCtrlBg.graphics.endFill();
        this.stormCtrl.addChild(stormCtrlBg);
        const stormCtrlText = new egret.TextField();
        stormCtrlText.textColor =this.scores.getStorm() === 0 ? 0x999999 : 0xff0000 ;
        stormCtrlText.text = "释放磁暴";
        stormCtrlText.size = 20;
        stormCtrlText.width = this.stormCtrl.$getWidth() - 20;
        stormCtrlText.textAlign = "center";
        stormCtrlText.x = 10;
        stormCtrlText.y = (this.stormCtrl.$getHeight() - stormCtrlText.$getHeight())/2;
        this.stormCtrl.addChild(stormCtrlText);
        this.stormCtrl.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
            console.log('释放磁暴');
            if(this.scores.getStorm() === 0) return false;
            this.bombList.forEach((b) => {
                this.scores.setScore(this.scoreTexts[2],this.scores.getScore() + b.getScore());
                b.destroy();
            })
            this.bombList = [];
            this.scores.setStorm(this.scoreTexts[1],this.scores.getStorm() -1);
            if(this.scores.getStorm() === 0) {
                this.stormCtrl.$children.forEach((e) => {
                    if(e instanceof egret.TextField){
                        e.textColor = 0x999999;
                    }
                })
            }
        },this);
        parentGroup.addChild(this.stormCtrl);
        
    }

    /**
     * 创建按钮 暂停或者重新开始
     */

    private createBtn(t:string,w:number,h:number,x:number,y:number,clickFun:Function = null):eui.Group{
        const btnGroup = new eui.Group();
        btnGroup.width = w;
        btnGroup.height = h;
        btnGroup.x = x;
        btnGroup.y = y;
        
        const btnBg = new egret.Shape();
        btnBg.graphics.clear();
        btnBg.graphics.lineStyle(1,0x000000);
        btnBg.graphics.beginFill(0Xeeeeee);
        btnBg.graphics.drawRoundRect(0,0,w,h,w/2,h/2);
        btnBg.graphics.endFill();
        btnGroup.addChild(btnBg);

        const btnValue = new egret.TextField();
        btnValue.text = t;
        btnValue.width = w;
        btnValue.size = 20;
        btnValue.textColor = 0x000000;
        btnValue.textAlign = 'center';
        btnValue.y = (h - btnValue.$getHeight())/2;
        btnGroup.addChild(btnValue);

        if(clickFun) btnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,clickFun,this);

        this.addChild(btnGroup);
        return btnGroup;
    }

    /**
     * 创建暂停时出现的banner
     */
    private createPauseBanner():void{
        const w = this.stage.stageWidth;
        const h = this.stage.stageHeight;
        const pauseCoverGroup = new eui.Group();
        pauseCoverGroup.width = w;
        pauseCoverGroup.height = h;
        pauseCoverGroup.x = 0;
        pauseCoverGroup.y = 0;
        console.log(365,this.stage,w,h)
        
        const coverShap = new egret.Shape();
        coverShap.graphics.clear();
        coverShap.graphics.beginFill(0x000000,0.2);
        coverShap.graphics.drawRect(0,0,w,h);
        coverShap.graphics.endFill();
        pauseCoverGroup.addChild(coverShap);

        const pauseW = w * 0.8;
        const pauseH = w * 0.5;
        const pauseGroup = new eui.Group();
        pauseGroup.width = pauseW;
        pauseGroup.height = pauseH;
        pauseGroup.verticalCenter = 0;
        pauseGroup.horizontalCenter = 0;
        pauseCoverGroup.addChild(pauseGroup);
       

        const pauseBg = new egret.Shape();
        pauseBg.graphics.clear();
        pauseBg.graphics.beginFill(0xeeeeee);
        pauseBg.graphics.drawRect(0,0,pauseW,pauseH);
        pauseBg.graphics.endFill();
        pauseGroup.addChild(pauseBg);

        const btnGroup = new eui.Group();
        btnGroup.width = pauseW;
        btnGroup.height = 80;
        btnGroup.bottom = 0;
        btnGroup.left = 0;
        pauseGroup.addChild(btnGroup);

        const closeBtn = new eui.Button();
        closeBtn.label = '继续游戏'
        closeBtn.width = 100;
        closeBtn.height = 50;
        closeBtn.verticalCenter = 0;
        closeBtn.horizontalCenter = 0;
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
            this.removeChild(this.pauseBannerGroup);
            this.isPause = false;
            egret.ticker.resume();
        },this);
        btnGroup.addChild(closeBtn)

        const bannerGroup = new eui.Group();
        bannerGroup.width = pauseW;
        bannerGroup.height = pauseH - btnGroup.$getHeight();
        bannerGroup.x = 0;
        bannerGroup.y = 0;
        pauseGroup.addChild(bannerGroup);

        const bannerText = new egret.TextField();
        bannerText.text = "游戏已暂停，是否继续？";
        bannerText.width = pauseW;
        bannerText.textAlign = "center";
        bannerText.textColor = 0x000000;
        bannerText.y = (bannerGroup.$getHeight() - bannerText.$getHeight())/2;
        bannerGroup.addChild(bannerText);
        this.pauseBannerGroup =  pauseCoverGroup;
    }

     /**
     * 创建游戏结束时出现的banner
     */
    private createStopBanner():void{
        const w = this.stage.stageWidth;
        const h = this.stage.stageHeight;
        const stopCoverGroup = new eui.Group();
        stopCoverGroup.width = w;
        stopCoverGroup.height = h;
        stopCoverGroup.x = 0;
        stopCoverGroup.y = 0;
        
        const coverShap = new egret.Shape();
        coverShap.graphics.clear();
        coverShap.graphics.beginFill(0x000000,0.2);
        coverShap.graphics.drawRect(0,0,w,h);
        coverShap.graphics.endFill();
        stopCoverGroup.addChild(coverShap);

        const pauseW = w * 0.8;
        const pauseH = w * 0.5;
        const pauseGroup = new eui.Group();
        pauseGroup.width = pauseW;
        pauseGroup.height = pauseH;
        pauseGroup.verticalCenter = 0;
        pauseGroup.horizontalCenter = 0;
        stopCoverGroup.addChild(pauseGroup);
       

        const stopBg = new egret.Shape();
        stopBg.graphics.clear();
        stopBg.graphics.beginFill(0xeeeeee);
        stopBg.graphics.drawRect(0,0,pauseW,pauseH);
        stopBg.graphics.endFill();
        pauseGroup.addChild(stopBg);

        const btnGroup = new eui.Group();
        btnGroup.width = pauseW;
        btnGroup.height = 80;
        btnGroup.bottom = 0;
        btnGroup.left = 0;
        pauseGroup.addChild(btnGroup);

        const closeBtn = new eui.Button();
        closeBtn.label = '游戏结束'
        closeBtn.width = 100;
        closeBtn.height = 50;
        closeBtn.horizontalCenter = -1 * closeBtn.width;
        closeBtn.verticalCenter = 0;
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
            egret.ticker.resume();
            this.isPause = false;
            this.passTimer.stop();
            this.changeStage("pre");
        },this);
        btnGroup.addChild(closeBtn)

        const restartBtn = new eui.Button();
        restartBtn.label = '再来一把'
        restartBtn.width = 100;
        restartBtn.height = 50;
        restartBtn.horizontalCenter = restartBtn.width;
        restartBtn.verticalCenter = 0;
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
            this.removeChild(this.stopBannerGroup);
            this.restartGame();
        },this);
        btnGroup.addChild(restartBtn)

        const bannerGroup = new eui.Group();
        bannerGroup.width = pauseW;
        bannerGroup.height = pauseH - btnGroup.$getHeight();
        bannerGroup.x = 0;
        bannerGroup.y = 0;
        pauseGroup.addChild(bannerGroup);

        const bannerText = new egret.TextField();
        bannerText.text = "游戏结束，您获得了" + this.scores.getScore() + "分,被炸"+ this.scores.getMiss() + "次!";
        bannerText.width = pauseW;
        bannerText.textAlign = "center";
        bannerText.textColor = 0x000000;
        bannerText.y = (bannerGroup.$getHeight() - bannerText.$getHeight())/2;
        bannerGroup.addChild(bannerText);
        this.stopBannerText = bannerText;
        this.stopBannerGroup =  stopCoverGroup;
    }

    public destroyStageTwo():void{
        this.bombList.forEach((e) => {
            e.destroy();
        })
        this.bombList = [];
    }
}