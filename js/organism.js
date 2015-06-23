// ---------------- Data structures ----------------
function Genome() {

}

function Cell() {

}

function Organism() {

}

function Creature() {
    this.entity;
    this.el;
}

Creature.prototype.birth = function(_object) {
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
var Organisms = {
    // Bank of creatures in dish
    creatures : [],

    // Generate creature bank
    generate  : function(number) {
        for(var n = 0 ; n < number ; n++) {
            var creature = new Creature();
            creature.birth(new Organism()).create();
            this.creatures.push(creature);
        }
    },

    // Load all creatures from bank into an element
    // (initializing in random positions)
    place     : function(element) {
        var w = element.width();
        var h = element.height();

        for(var o = 0, t = this.creatures.length ; o < t ; o++) {
            this.creatures[o].el.css({
                'top'  : Math.round( Math.random()*h ) + 'px',
                'left' : Math.round( Math.random()*w ) + 'px'
            });

            element.append( this.creatures[o].el );
        }
    }
}