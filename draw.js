var form = $("#settings")[0];

function evalMath(str) {
    _func = str;
    try {
        return (function(str) {
            return eval(str);
        }).call(Math, str);
    } catch(e) {
        console.log(_e = e);
    }
    return null;
}

function plot3D(func, start, end, acc) {
    // Construct X axis
    var x = []
    for(var i = 0; i <= acc; i++) {
        var xi = start[0] + (end[0] - start[0]) * i / acc;
        var dx = []
        for(var j = 0; j <= acc; j++) {
            dx.push(xi)
        }
        x.push(dx) 
    }
    
    // Construct Y axis
    var y = []
    var dy = [];
    for(var i = 0; i <= acc; i++) {
        var yi = start[1] + (end[1] - start[1]) * i / acc;
        dy.push(yi)
    }
    for(var i = 0; i <= acc; i++) {
        y.push(dy)
    }

    // Finally construct Z axis
    var z = []
    if(typeof func == 'function') {
        for(var i = 0; i <= acc; i++) {
            var dz = []
            var xi = start[0] + (end[0] - start[0]) * i / acc;
            for(var j = 0; j <= acc; j++) {
                var yi = start[1] + (end[1] - start[1]) * j / acc;
                dz.push(func(xi, yi))
            } 
            z.push(dz)
            console.log(z)
        } 
    } else if(typeof func == 'array') {
        z = func;
    } else {
        console.log("Unknown function");
        //Notifier.error("Unknown function ", func)
    }
    return {
        x: x, 
        y: y, 
        z: z,
        type: 'surface'
    }
}


function plotOnUpdate(chartName, urlVars) {
    it=["abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp", "floor", "log", "max", "min", "pow", "random", "round", "sin", "sqrt", "tan", "PI", "E"]
    for (var i in it) {
        var attr = it[i]
        if (Math.hasOwnProperty(attr)) window[attr] =Math[attr];
    }
    function calcData(name, def) {
        if(urlVars[name] === undefined && 
                (urlVars.get === undefined || urlVars.get(name) === null))
            return def
        if(urlVars[name] != null) {
            return urlVars[name].value || urlVars[name];
        }
        return urlVars.get(name)
    }

    function num(arr) {
        for(var i = 0; i < arr.length; i++)
            arr[i] = Number.parseFloat(arr[i])
        return arr
    }


    var chart = []
    if(calcData('func')) {
        var temp = "function calc(x,y) { return "+ calcData('func') + " }  calc";
        func = evalMath(temp)
        var val1 = calcData('rnge', -1)
        var val=parseInt(val1)
        var start = [-val,-val]
        var end = [val,val]
        var acc = calcData('acc', -1)
        console.log(func,start,end,acc);
        chart = plot3D(func, start, end, acc);
    } else {
        console.log("Error");
    }
    if(chart != null) {
        var layout = {
            height: calcData('height', '600').replace('px', ''),
            width: calcData('width', '800').replace('px', ''),
            title: (calcData('title', '')),
            autosize: true,
            scene: {
                xaxis: {title: calcData('xaxis', 'X')},
                yaxis: {title: calcData('yaxis', 'Y')},
                zaxis: {title: calcData('zaxis', 'Z')}
            }
        }
        Plotly.newPlot(chartName, [ chart ], layout);
    }
}

function load_all() {
    var ind = window.location.href.indexOf('#');
    if(ind != -1) {
        if (window.location.href.substring(ind+1) !== '') {
        var pairs = window.location.href.substring(ind+1).split('&');
        for (var i = 0; i < pairs.length; i += 1) {
            var cur = pairs[i];
            var eq_index = cur.indexOf('=');
            key = (eq_index == -1) ? cur : decodeURIComponent(cur.substring(0, eq_index));
            value = (eq_index == -1) ? null : decodeURIComponent(cur.substring(eq_index+1));
            if(form.elements[key]) form.elements[key].value = value;
            else form.elements[key] = value
        }
    }
    }
    update();
}

function update() {
    plotOnUpdate('chart', form.elements)
    return false;
}
