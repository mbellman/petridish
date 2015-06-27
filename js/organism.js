// ---------------- Data structures ----------------
/**
 * Gene utilities
 */
var Gene = {

    // Start codons which identify a gene's actual function. Genes
    // which do not begin with any of these are effectively useless.
    codons : {
        AGT : 'CELL_COUNT',
        AGC : 'BASAL_METABOLIC_RATE',
        ATT : 'ENERGY_SOURCE',
        ACT : 'HUNGER_THRESHOLD',
        ACG : 'MOVEMENT_SPEED',
        ATC : 'OPTIMAL_ENVIRONMENT_TEMPERATURE',
        AGG : 'OPTIMAL_ENVIRONMENT_HUMIDITY',
        ACC : 'OPTIMAL_ENVIRONMENT_GAS',
        AAA : 'OPTIMAL_ENVIRONMENT_GAS_CONCENTRATION',
        GCT : 'TEMPERATURE_TOLERANCE',
        GGT : 'HUMIDITY_TOLERANCE',
        GTT : 'DRUG_RESISTANCE',
        GGC : 'VIRUS_RESISTANCE',
        GGG : 'LIFE_EXPECTANCY',
        GGG : 'SOCIABILITY'
    },

    // Generate a new gene at random from parameters
    synthesize : function(options) {
        return 'AAA';
    }
}

/**
 * Chromosome constructor + methods
 */
function Chromosome() {
    this.genes = [];
}

Chromosome.prototype.addGene = function(gene) {
    this.genes.push(gene);
}

Chromosome.prototype.getGene = function(id) {
    return this.genes[id];
}

Chromosome.prototype.editGene = function(id, gene) {
    this.genes[id] = gene;
}

Chromosome.prototype.deleteGene = function(id) {
    this.genes.splice(id, 1);
}

Chromosome.prototype.copy = function() {
    var newChromosome = new Chromosome();

    // Copying genes
    for(g in this.genes) {
        if( Math.random()*1000 > geneSkipRate ) {
            var oldGene = this.genes[g];
            var newGene = '';

            // Copy individual bases
            for(var b = 0, t = oldGene.length ; b < t ; b++) {
                if( Math.random()*1000 > baseMutationRate ) {
                    // Successful base transcription
                    newGene += oldGene.charAt(b);
                } else {
                    // Erroneous base transcription (approx. 1/3 chance of:
                    //  - Adding a random base in the current spot
                    //  - Generating an extra base
                    //  - Skipping the base completely
                    var baseTest = Math.random();

                    if( baseTest < 0.333 ) {
                        newGene += randomBase();
                    } else if ( baseTest < 0.666 ) {
                        newGene += [oldGene.charAt(b), randomBase()].join('');
                    }
                }
            }

            newChromosome.addGene(newGene);
        }
    }

    return newChromosome;
}


function Cell() {

}


/**
 * Organism constructor + methods
 */
function Organism() {
    // Biology
    this.genome = [];
    this.cells = [];

    // Status
    this.living = true;

    // All of the following will be redefined based on the
    // organism's genetic sequence, determined when it is born
    this.energy = 0;
    this.growthRate = 0;
    this.metabolism = 0;
    this.mobility = 0;
}

Organism.prototype.spawn = function(options) {
    if(!!options) {
        if(
         typeof options.type       != 'undefined' &&
         typeof options.complexity != 'undefined'
        ) {
            // Spawning a new organism based on parameters

            switch(options.type) {
                case 'single-celled':
                    break;
                case 'multi-celled':
                    break;
            }

            // Generating chromosomes (one chromosome per level of complexity)
            for(var c = 0 ; c < options.complexity ; c++) {
                var chromosome = new Chromosome();
                var geneCount  = this.complexity*3 + rand(0, this.complexity*2);

                // Generating genes for this chromosome
                // (# of genes influenced by complexity)
                for(var g = 0 ; g < geneCount ; g++) {
                    chromosome.addGene( Gene.synthesize() );
                }

                this.genome.push(chromosome);
            }
        }
    }
}

Organism.prototype.reproduce = function() {

}



/**
 * Container object for organisms
 */
function Creature() {
    this.entity;
    this.el;
}

Creature.prototype.is = function(_object) {
    this.entity = _object;
    return this;
}

Creature.prototype.create = function() {
    this.el = $('<div/>', {
        class : 'cell'
    });
    return this;
}

// ---------------- Additional methods -------------
var bases = ['A', 'G', 'T', 'C'];

function randomBase() {
    return bases[ rand(0, bases.length-1) ];
}

function randomIdentifier() {
    var ts = new Date().getTime().toString();
    var rn = Math.random().toString().split('.')[1];

    return ts+rn;
}

var Organisms = {
    // Bank of creatures in dish
    creatures : {},

    // Generate creature bank
    generate  : function(number) {
        for(var n = 0 ; n < number ; n++) {
            var organism = new Organism();
            organism.spawn({
                type       : 'single-celled',
                complexity : 1
            });

            var identifier = randomIdentifier();

            var creature = new Creature();
            creature.is( organism ).create( identifier );

            this.creatures[identifier] = creature;
        }
    },

    // Load all creatures from bank into an element
    // (initializing in random positions)
    place     : function(element) {
        var w = element.width() - 20;
        var h = element.height() - 20;

        for(c in this.creatures) {
            this.creatures[c].el.css({
                'top'  : 10 + rand(0, h) + 'px',
                'left' : 10 + rand(0, w) + 'px'
            });

            element.append( this.creatures[c].el );
        }
    }
}