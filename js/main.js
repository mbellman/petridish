// ------------------ VARIABLES ------------------

var baseMutationRate = 2;       // Approximate rate of errant base transcriptions per 1000
var geneSkipRate = 1;           // Approximate rate of gene skip per 1000

// ------------------ EVENTS ---------------------
$(document).ready(function(){
    $('.dish').drag({
        delay: 0.1
    });

    Organisms.generate(30);
    Organisms.place($('.dish'));
});


// ------------------ PLUGINS --------------------
$.fn.drag = function(params) {
    var _ = this;

    var dragTimeout;            // Drag easing start timeout
    var delayInterval;          // Easing interval for drag delay
    var delay = 0;              // Drag delay in ms

    if(!!params) {
        if(params.hasOwnProperty('delay')) {
            // Setting drag delay
            delay = params.delay*1000;
        }
    }

    _.on('mousedown', function(e){
        var pos = _.position();

        var mStart = { x: e.clientX, y: e.clientY };
        var pStart = { x: pos.left, y: pos.top };

        var delta = { x: 0, y: 0 };

        $('body').on('mousemove', function(e){
            delta.x = e.clientX - mStart.x;
            delta.y = e.clientY - mStart.y;

            if(delay == 0) {
                // Just move the element with the mouse if delay is 0
                _.css({
                    'top'  : pStart.y + delta.y + 'px',
                    'left' : pStart.x + delta.x + 'px'
                });
            } else {
                clearTimeout(dragTimeout);
                dragTimeout = setTimeout(function(){
                    // Ease element to new position
                    var goal = {
                        x : pStart.x + delta.x,
                        y : pStart.y + delta.y
                    };

                    var p = _.position();
                    var initial = {
                        x : p.left,
                        y : p.top
                    };

                    var sign = {
                        x : initial.x > goal.x ? -1 : 1,
                        y : initial.y > goal.y ? -1 : 1
                    };

                    // Restart ease interval
                    clearInterval(delayInterval);

                    // Start keeping track of update time (initial + current)
                    var it = new Date().getTime();
                    var ct = it;
                    
                    delayInterval = setInterval(function(){
                        // Check time progress
                        ct = new Date().getTime();
                        var dt = ct - it;

                        var mdt = dt * (1/delay);           // dt mapped to 0...1

                        if(mdt >= 1) {
                            // Finished ease
                            _.css({
                                'top'  : goal.y + 'px',
                                'left' : goal.x + 'px'
                            });

                            clearInterval(delayInterval);
                            return;
                        }

                        // Evaluate ease progress based on time
                        var e = Ease.quad.out( mdt );

                        // Update position
                        _.css({
                            'top'  : initial.y + e*(goal.y - initial.y) + 'px',
                            'left' : initial.x + e*(goal.x - initial.x) + 'px'
                        })
                    }, 1000/60);
                }, 16);
            }
        });

        $('body').on('mouseup', function(){
            $('body').off('mouseup mousemove');
        });
    });

    return _;
}