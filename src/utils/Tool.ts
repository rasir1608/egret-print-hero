/**
 * 静态工具
 */

class Tool {
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    public static  startAnimation(result: Array<any>,textfield:egret.TextField): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(5000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

     /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    public static createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 获取随机正整数
     */
    public static randInt(min:number,max:number){
        return Math.floor(Math.random()*(max-min) + min);
    }

    /**
     * 取小数点后几位
     */
    public static fixedFloat(floatNum:number,fixedNum:number):number{
       return Math.floor(floatNum*Math.pow(10,fixedNum))/ Math.pow(10,fixedNum);
    }

    public static appendTo(str:string,appendStr:string,num:number) {
        while(str.length < num) {
            str = `${appendStr}${str}`;
        }
        return str;
    }
}