
//Just a perceptron/feedforward net for now
class Net {
	constructor({isRecurrent = false, isLongTerm = false} = {}, ...layerSizes)
	{	
		//First build the memory systems
		let numOutputs = layerSizes[layerSizes.length - 1];	
		//Recurrent/Short-term Memory
		if (isRecurrent){
			//Inputs receive outputs of previous activation
			layerSizes[0] += numOutputs;
			this.shortMemory = new Array(numOutputs).fill(0);
		}
		//Long-term Memory
		if (isLongTerm){
			layerSizes[0] += numOutputs;
			this.longMemory = new Array(numOutputs).fill(0);
		}

		//Initialize all charges to zero
		this.charges = new Array(layerSizes.length);
		for (let layer = 0; layer < layerSizes.length; layer++)
		{
			this.charges[layer] = new Array(layerSizes[layer]);
			for (let neuron = 0; neuron < layerSizes[layer]; neuron++)
				this.charges[layer][neuron] = 0;
		}
		
		//Fully interconnected random weights 
		this.weights = new Array(layerSizes.length - 1);
		for (let layer = 0; layer < this.weights.length; layer++)
		{
			this.weights[layer] = new Array(layerSizes[layer]);
			for (let neuron = 0; neuron < layerSizes[layer]; neuron++)
			{
				this.weights[layer][neuron] = new Array(layerSizes[layer + 1])
				for (let w = 0; w < layerSizes[layer + 1]; w++)
					this.weights[layer][neuron][w] = randZeroCentered();
			}
		}
	}

	//Run the net, feeding charges forward based on weights
	activate(input=[]) {
		this.clearCharges();
		//set first layer to input array
		this.charges[0] = input;

		//Remember...
		if (this.shortMemory)
			this.charges[0] = this.charges[0].concat(this.shortMemory);
		if (this.longMemory)
			this.charges[0] = this.charges[0].concat(this.longMemory);
		
		//index of output layer
		const outputLayer = this.charges.length - 1;


		//set a standard net-wide threshold for both positive and negative charges
		let threshold = 0.0;

		//Propagate charges forward
		//each layer
		for (let layer = 0, nextLayer = 1; layer < outputLayer; layer++, nextLayer++) {
			//each neuron
			for (let neuron = 0; neuron < this.charges[layer].length; neuron++) {
				//absolute value of charge checked against a standard threshold
				if (layer === 0 || Math.abs(this.charges[layer][neuron]) > threshold) {
					//each weight
					for (let w = 0; w < this.charges[nextLayer].length; w++)
						this.charges[nextLayer][w] += this.charges[layer][neuron] * this.weights[layer][neuron][w];
				}
			}
			//activation function on next layer's neurons after they're all charged up
			for (let neuron = 0; neuron < this.charges[nextLayer].length; neuron++) 
				this.charges[nextLayer][neuron] = zeroCenteredCurve(this.charges[nextLayer][neuron]);
		}
	
		//squish outputs with sigmoid
		for (let neuron = 0; neuron < this.charges[outputLayer].length; neuron++)
			this.charges[outputLayer][neuron] = zeroCenteredCurve(this.charges[outputLayer][neuron]);

		if (this.shortMemory)
			this.shortMemory = [...this.charges[outputLayer]];
		if (this.longMemory){
			for (let i in this.longMemory){
				this.longMemory[i] += this.charges[outputLayer][i];
				this.longMemory[i] = zeroCenteredCurve(this.longMemory[i]);
			}
		}

		//return output layer
		return this.charges[outputLayer];
	}

	//reset charges to 0 (except input layer which gets replaced anyway)
	clearCharges() {
		for (let layer = 1; layer < this.charges.length; layer++)
			for (let neuron = 0; neuron < this.charges[layer].length; neuron++)
				this.charges[layer][neuron] = 0;
	}

	//Asexual Reproduction
	//copy over this net's weights with another net's weights, mutating in the process
	//RM: Replace and Mutate
	cloneNet (mom, mutationRate=0) { 
		//weights overwritten
		for (let layer in mom.weights) {
			for (let neuron in mom.weights[layer]) {
				for (let w in mom.weights[layer][neuron]) {	
					if (mutationRate !== 0 && mutationRate > Math.random())
						this.weights[layer][neuron][w] += randZeroCentered(0.1);
					else
						this.weights[layer][neuron][w] = mom.weights[layer][neuron][w];
				}
			}
		}
	}
	//Sexual Reproduction
	//copy over this net's weights with another net's weights, mutating in the process
	//RMC: Replace, Mutate and Crossover
	mateNets (mom, dad, mutationRate=0) { 
		//weights overwritten
		for (let layer in mom.weights) {
			for (let neuron in mom.weights[layer]) {
				for (let w in mom.weights[layer][neuron]) {	
					//50% chance to be mom or dad's gene	
					if (Math.random() > 0.5)
						this.weights[layer][neuron][w] = mom.weights[layer][neuron][w];
					else
						this.weights[layer][neuron][w] = dad.weights[layer][neuron][w];	
					//Mutate if mutation rate is greater than a random decimal
					if (mutationRate !== 0 && mutationRate > Math.random())
						this.weights[layer][neuron][w] += randZeroCentered(Math.random() * 0.2);
				}
			}
		}
	}
}

// *********
//  Helpers
// *********

//Activation functions:
//0.5-centered sigmoid (negatives cannot propagate)
const squish = (x, base = 2) => 1 / (1 + Math.pow(base, -x));
//0-centered sigmoid (negatives can propagate)
const zeroCenteredCurve = (x, base = 10) => 2 / (1 + Math.pow(base, -x)) - 1;
//ReLU for hidden layer (only positives, no max positive)
const relu = (x) => Math.max(0, x);

//Random between -1 and 1
const randZeroCentered = (scale=1) => ((Math.random() * 2 - 1) * scale);

/*
const testNet = () => {
	const net = new Net(2, 20, 2);
	console.log(net.activate([1,1]));
	console.log(net.activate([-1,-1]));
	console.log(net.activate([1,-1]));
	console.log(net.activate([-1,1]));
	console.log(net.activate([0,0]));
}
testNet() 
*/

export default Net;