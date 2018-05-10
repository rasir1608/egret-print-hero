class Bomb {

	private parentGroup:eui.Group;

	private bombGroup:eui.Group = new eui.Group();

	private speed:number;

	private speedPlus:number;

	private position:number[];

	private with:number;

	private name:string;

	public getName():string{
		return this.name;
	}

	private score:number;

	public getScore():number{
		return this.score;
	}

	private deadline:number;

	private winCb:Function;

	private failCb:Function;

	public constructor(parentGroup:eui.Group,position:number[],size:number,deadline:number,failCb:Function,winCb:Function,speed:number = 2,speedPlus:number = 0) {
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

	private initState(){
		const isUpper = Tool.randInt(0,10) > 8;
		const bombW = this.with;
		const bombH = this.with * 2.5;

		this.bombGroup.width = bombW;
		this.bombGroup.height = bombH;
		this.bombGroup.x = this.position[0];
		this.bombGroup.y = this.position[1];
		
		let background:egret.Bitmap;
		
		if(isUpper){
			this.name = String.fromCharCode(Tool.randInt(65,90));
			this.score = 5;
			background = Tool.createBitmapByName('bomb-bg-upper_png');
		} else {
			this.name = String.fromCharCode(Tool.randInt(97,122));
			this.score = 1;
			background = Tool.createBitmapByName('bomb-bg-lower_png');
		}
		background.width = bombW;
		background.height = bombH;
		background.x = 0;
		background.y = 0;
		this.bombGroup.addChild(background);

		const scale = Tool.fixedFloat(1/76,8);

		const textField = new egret.TextField();
		textField.text = this.name;
		this.bombGroup.addChild(textField);
		textField.width = bombW;
		textField.size = 24;
		textField.textColor = isUpper ? 0x000000 : 0xff0000;
		textField.textAlign = "center";
		textField.y = bombH*scale*24 - textField.$getHeight()/2;

		this.parentGroup.addChild(this.bombGroup);

	}

	public run():eui.Group{
		const lastY = this.deadline - this.bombGroup.$getHeight();
		this.speed += this.speedPlus;
		this.position[1] = this.position[1] + this.speed;
		let tw = egret.Tween.get(this.bombGroup);
		tw.to({ y: this.position[1] });
		if(this.bombGroup.y > lastY){
			this.destroy();
			this.failCb(this);
		} 
		return this.bombGroup;
	}

	public winScore():eui.Group{
		this.winCb(this);
		this.destroy();
		return this.bombGroup;
	}

	public destroy():void{
		const afterBombGroup = new eui.Group();
		const size = this.with * 3
		afterBombGroup.width = size;
		afterBombGroup.height = size;
		afterBombGroup.x = this.position[0] + this.bombGroup.width / 2;
		afterBombGroup.y = this.position[1] + this.bombGroup.height / 2;
		const bg = Tool.createBitmapByName('bomb-boo-2_png');
		bg.width = size;
		bg.height = size;
		afterBombGroup.addChild(bg);

		const removeSelf = () => {
			this.parentGroup.removeChild(afterBombGroup);
		}
		if(this.bombGroup){
			this.parentGroup.removeChild(this.bombGroup);
			this.parentGroup.addChild(afterBombGroup);
			afterBombGroup.anchorOffsetX = afterBombGroup.width / 2;
			afterBombGroup.anchorOffsetY = afterBombGroup.height / 2;
			afterBombGroup.scaleX = 0.1;
			afterBombGroup.scaleY = 0.1;
			const tw = egret.Tween.get(afterBombGroup);
			tw.to({scaleX:1,scaleY:1},200).wait(200).call(removeSelf);
		}
	}
}