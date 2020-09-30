var range = $('.input-range'),
    value = $('.range-value');
    
    value.html(range.attr('value'));

    range.on('input', function(){
        value.html(this.value);
    });

var range1 = $('.input-range1'),
    value1 = $('.range-value1');
    
    value1.html(range1.attr('value'));

    range1.on('input', function(){
        value1.html(this.value);
    });    