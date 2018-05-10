class StageOne extends eui.UILayer {

	private changeStage:Function;

	constructor(){
		super();
	}

	public setChangeStage(changeStage:Function):void{
		this.changeStage = changeStage;
	}

	protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        // let assetAdapter = new AssetAdapter();
        // egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        // egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.createGameSceneOne();

    }
	 /**
     * 创建第一个场景界面
     * Create scene interface
     */
    protected async createGameSceneOne() {
        const stageBg = Tool.createBitmapByName("feidie-bg_jpg");
        this.addChild(stageBg);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        stageBg.width = stageW;
        stageBg.height = stageH;

        const descGroup = new eui.Group();
        const descGroupW = stageW;
        const descGroupH = 200;
        this.addChild(descGroup);
        descGroup.width = descGroupW;
        descGroup.height = descGroupH;
        descGroup.bottom = 0;
        descGroup.left = 0;
        
        const descCover = new egret.Shape();
        descGroup.addChild(descCover);
        descCover.graphics.beginFill(0x000000,0.5);
        descCover.graphics.drawRect(0,0,descGroupW,descGroupH);
        descCover.graphics.endFill();

		const textfield = new egret.TextField();
        descGroup.addChild(textfield);
        textfield.width = descGroupW*0.8;
        textfield.textColor = 0xffffff;
        textfield.size = 24;
        textfield.x = descGroupW*0.1;
        textfield.y = descGroupH*0.1;

        const result = await RES.getResAsync("description_json")
        Tool.startAnimation(result,textfield);

        const titleH = 100;
        const titleW = stageW;
        const titleGroup = new eui.Group();
        this.addChild(titleGroup);
        titleGroup.width = titleW;
        titleGroup.height = titleH;
        titleGroup.x = 0;
        titleGroup.y = 0;

        let titleCover = new egret.Shape();
        titleGroup.addChild(titleCover);
        titleCover.graphics.beginFill(0x000000,0.3);
        titleCover.graphics.drawRect(0,0,titleW,titleH);
        titleCover.graphics.endFill();

        let title = new egret.TextField();
        titleGroup.addChild(title);
        title.width = stageW;
        title.size = 40;
        title.textAlign = 'center';
        title.y = (titleH-title.$getLineHeight())/2;
        title.text = "打字英豪";
        title.textColor = 0xff0000;
        title.bold = true;

        let button = new eui.Button();
        button.label = "游戏开始";
        button.bottom = descGroupH +20;
        button.horizontalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeStage, this);
    }
}