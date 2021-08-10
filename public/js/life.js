// const Cluster = require('./cluster');
// const Vector = require('./vector');
// const Matter = require('matter-js');
class Life extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y, sprite, frame, mind = new Mind())
    {
        super(scene, x, y, sprite, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.mind = mind; 
        
        this.fitness = 0;

        //for updateWithEngine
        this.setVelocity(10, 10);
        this.setAngularVelocity(6.5);
        this.setBounce(1);

        // only for fast updating (no rendering and only limited physics)
        // this.x;
        // this.y;
    }

    //for updating within update loop of Phaser or Matter
    update(goal, goal2) {
        let angle = Phaser.Math.Angle.BetweenPoints(this, goal);
        //let dist = Phaser.Math.Distance.BetweenPoints(this, goal);
        let xDiff = (this.x - goal.x) / 100;
        let yDiff = (this.y - goal.y) / 100;
        let angle2 = Phaser.Math.Angle.BetweenPoints(this, goal);
        let xDiff2 = (this.x - goal2.x) / 100;
        let yDiff2 = (this.y - goal2.y) / 100;

        let outputs = this.mind.update(xDiff, yDiff, xDiff2, yDiff2);           
        this.setVelocity(outputs[0]*500, outputs[1]*500);
        //this.setAngularVelocity(outputs[3]);
    }

    //
    updateFast() {
        let outputs = this.mind.update(1, 1);     
        
    }

    mutate() {
        
    }
}

//const squish = (x) => x * 0.01;

// module.exports = Life;