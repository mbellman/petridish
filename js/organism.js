// ---------------- Data structures ----------------

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

Organism.prototype.spawn = function() {

}

Organism.prototype.reproduce = function() {

}



/* - Container object for the organism - */
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
    return bases[ Math.round(Math.random() * (bases.length-1)) ];
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
            organism.spawn();

            var identifier = randomIdentifier();

            var creature = new Creature();
            creature.is(organism).create(identifier);
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
                'top'  : 10 + Math.round( Math.random()*h ) + 'px',
                'left' : 10 + Math.round( Math.random()*w ) + 'px'
            });

            element.append( this.creatures[c].el );
        }
    }
}