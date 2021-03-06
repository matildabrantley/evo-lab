//Genus-Species mirrors Species-Group relationship at a higher level
import Species from './species';
const Phaser = require('phaser');



class Genus {
    constructor({speciesSelectionFreq = 100, maxSpeciesSelectionFreq = 600, deltaSelectionFreq = 50} = {}, species = []){
        this.species = species;
        this.timer = 0;
        this.speciesSelectionFreq = speciesSelectionFreq;
        this.maxSpeciesSelectionFreq = maxSpeciesSelectionFreq;
    }

    //Let's pretend "specie" is the correct singular of "species" =)
    addSpecies(specie){
        this.species.push(specie);
    }

    setupSpecies(){
        for (const specie of this.species) {
            specie.scene.physics.add.collider(specie, specie.tiles); ;
        }
    }

    update() {
        this.timer++;
        let allSpeciesFitness = [];
        for (let specie of this.species) {
            specie.update();
            allSpeciesFitness.push(specie.speciesFitness);
        }
        this.genusFitness = average(allSpeciesFitness);

        if (this.timer % this.speciesSelectionFreq == 0)
            this.speciesSelection();
    }

    // cloneGenus(clonedGenus){
    //     //Replace each species in a genus with another genus' species
    //     for (let s in this.species){
    //         this.cloneSpecies(clonedGenus.species[s]);
    //     }
    // }

    speciesSelection() {
        this.species.sort((b, a) => (a.speciesFitness > b.speciesFitness) ? 1 : -1);

          this.species[this.species.length-1].cloneSpecies(this.species[0]);

        //set mutation of mutation rate and reset fitness
        for (let s=0; s < this.species.length - 1; s++){
            this.species[s].mutMutRate = s/(this.species.length*15) + 0.02; 
            this.species[s].speciesFitness = 0;
        }
        
        if (this.speciesSelectionFreq + this.deltaSelectionFreq <= this.maxSpeciesSelectionFreq)
            this.speciesSelectionFreq += this.deltaSelectionFreq;
    }
}

export default Genus;

const total = (nums) => nums.reduce((a, b) => (a + b));
const average = (nums) => total(nums) / nums.length;
