// ------------------ VARIABLES ------------------

var baseMutationRate = 2;       // Approximate rate of errant base transcriptions per 1000
var geneSkipRate = 1;           // Approximate rate of gene skip per 1000

// ------------------ EVENTS ---------------------
$(document).ready(function(){
    $('.dish').drag();

    Organisms.generate(30);
    Organisms.place($('.dish'));
});


// ------------------ PLUGINS --------------------
$.fn.drag = function() {
    var _ = this;

    _.on('mousedown', function(e){
        var pos = _.position();

        var mStart = { x: e.clientX, y: e.clientY };
        var pStart = { x: pos.left, y: pos.top };

        var delta = { x: 0, y: 0 };

        $('body').on('mousemove', function(e){
            delta.x = e.clientX - mStart.x;
            delta.y = e.clientY - mStart.y;

            _.css({
                'left' : pStart.x + delta.x + 'px',
                'top'  : pStart.y + delta.y + 'px'
            });
        });

        $('body').on('mouseup', function(){
            $('body').off('mouseup mousemove');
        });
    });

    return _;
}