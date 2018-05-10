
/**
 * 得分记录
 */

class Scores {
	private miss:number;
    private storm:number;
    private score:number;
    constructor(){
        this.miss = 0;
        this.storm = 0;
        this.score = 0;
    }

    public setMiss(textfield:egret.TextField,miss:number){
        this.miss = miss;
        textfield.text = this.miss+"";
    }

    public setStorm(textfield:egret.TextField,storm:number){
        this.storm = storm;
        textfield.text = this.storm+"";
    }

    public setScore(textfield:egret.TextField,score:number){
        this.score = score;
        textfield.text = this.score+"";
    }

    public getMiss():number {
        return this.miss;
    }
    public getStorm():number {
        return this.storm;
    }
    public getScore():number {
        return this.score;
    }

    public get(name):number {
        return this[name];
    }
}