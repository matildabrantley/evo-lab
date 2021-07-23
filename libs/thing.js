const Net = require('./net');

class Thing {
    constructor(room, vector, color = 0xffffff){
        this.room = room;
        this.color = color;
        this.position = vector.getCopy();
        this.velocity = new Vector(0, 0, -3, 3);
        this.accel = new Vector(0, 0, -0.1, 0.1);

        //Feedforward Neural Network
        this.net = new Net(2, 5, 2);
    }

    draw() {
        //(this.position.x + this.room.originX, this.position.y + this.room.originY, 1);
    }

    update() {
        //console.log(this.network);

        //get this room's size and its red dot
        var roomSize = this.room.size;
        
        //normalize positions by room size (for NN inputs)
        var input = [1,1];
        var output = this.net.activate(input);

        //the vector to be changed by output, such as velocity or accel
        var changing = this.velocity; 

        //update creature's acceleration from output
        changing.x = output[0] - 0.5;
        changing.y = output[1] - 0.5;
        
        outOfBoundsCheck();

        //add acceleration to velocity
        this.velocity.add(this.accel);
        //add velocity to position
        this.position.add(this.velocity);

        this.draw();
    }

    replace() {}

    outOfBoundsCheck() {
        var rebound = 5;
        if (this.position.x > this.room.size-rebound){
            this.velocity.x = -this.velocity.x;
            this.position.x -= rebound;
        }
        if (this.position.y > this.room.size-rebound){
            this.velocity.y = -this.velocity.y;
            this.position.y -= rebound;
        }
        if (this.position.x < rebound){
            this.velocity.x  = -this.velocity.x;
            this.position.x += rebound;
        }
        if (this.position.y < rebound){
            this.velocity.y = -this.velocity.y;
            this.position.y += rebound;
    }
    }
}

module.exports = Thing;