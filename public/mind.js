// const Cluster = require('./cluster');
// const Vector = require('./vector');
// const Matter = require('matter-js');
class Mind {
    constructor(body, numInputs = 2, numOutputs = 3){
        this.inputs = new Array(numInputs);
        this.outputs = new Array(numOutputs);

        //Feedforward Neural Network
        this.cluster = new Cluster(numInputs, 5, numOutputs);
    }

    update(...inputs) {
        this.inputs = inputs;
        //TODO: Normalize inputs here if needed
        this.outputs = this.cluster.activate(inputs);

        return this.outputs;
    }
}

// module.exports = Mind;