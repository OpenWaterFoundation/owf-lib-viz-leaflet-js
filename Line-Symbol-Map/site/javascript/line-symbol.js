/**
* @fileOverview Takes geoJSON point data and a JSON format file that indicates how the data should be displayed to create a leaflet map.
*/
/* Variable called map. This is what creates the actual leaflet map */
var map = L.map('mapid', {zoomControl: false}).setView([38.99, -105.54], 7);

/* Tile Layer that is added to the map. In this case it is a mapbox streets tile layer. */
L.tileLayer('https://api.mapbox.com/styles/v1/korysam/cixur5uy7003g2sqwthpjmbxa/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia29yeXNhbSIsImEiOiJjaXd4dDRxbTQwMXRkMm9tZzd5b3BqdTBwIn0.A2EGyNrWG2Lbbd5c-I-94w', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy;<a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);
/* More info on initialization and setup of a leaflet map: 
https://leafletjs.com/examples/quick-start/ */

/* Top Left Corner of Map. Allows for a home button to reset to the default zoom. */
var zoomHome = L.Control.zoomHome();
zoomHome.addTo(map);

/* Bottom Right corner. This shows the current lat and long  of the mouse cursor. 
'º' used for the degree character when the latitude and longitude of the 
cursor is dispalyed. */
L.control.mousePosition({position: 'bottomleft',lngFormatter: function(num) {
    var direction = (num < 0) ? 'W' : 'E';
    var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
    return formatted; 
},
latFormatter: function(num) {
    var direction = (num < 0) ? 'S' : 'N';
    var formatted = Math.abs(L.Util.formatNum(num, 3)) + 'º ' + direction;
    return formatted;
}}).addTo(map);


/* Bottom Left corner. This shows the scale in km and miles of
the map. */
L.control.scale({position: 'bottomleft',imperial: true}).addTo(map);

/**
* Checks is color option is empty or not a valid color
* @param {string} strColor
* @return {boolean} true if strColor is a color, false if strColor is not a color.
*/
function isValidColor(strColor) {
    if(strColor == ""){
        return false;
    }
    var s = new Option().style;
    s.color = strColor;
    var test1 = s.color == strColor.toLowerCase();
    var test2 = /^#[0-9A-F]{6}$/i.test(strColor);
    if(test1 == true || test2 == true){
        return true;
    } else{
        return false;
    }
}

/**
* Checks is number option is empty or not a valid number
* @param {string || number} strNum
* @return {boolean} true if strNum is a number, false if strNum is not a number.
*/
function isValidNumber(strNum){
    if(strNum == ""){
        return false;
    }
    return !isNaN(strNum);
}

/**
* Checks if lineCap and lineJoin options are valid
* @param {string} str
* @return {boolean} true if str == 'round' || 'square', otherwise false.
*/
function isValidLineCap(str){
    if(str == 'round' || str == 'square')
        return true;
    return false;
}

/**
* Checks if dashArray string is valid. Example format: "20, 10"
* @param {string} strDash
* @return {boolean} true if strDash is a string of numbers seperated by commas, otherwise false.
*/
function isValidDash(strDash){
    let result = strDash.split(', ').every(function(item){
        if(isNaN(item))
            return false;
    })
    return true;
}

/**
* Checks if entry is a boolean variable
* @param {string} strPopupMouseover
* @return {boolean} true if strPopupMouseover == 'true' or 'false', otherwise false.
*/
function isValidBoolean(strPopupMouseover){
    if(strPopupMouseover == 'true' || strPopupMouseover == 'false')
        return true;
    return false;
}

/**
* Checks if entry is 'singleSymbol', 'graduated', or 'categorized'
* @param {string} strClassification
* @return {boolean} true if strClassification == 'singleSymbol', 'graduated', or 'categorized', otherwise false.
*/
function isValidClassification(strClassification){
    if(strClassification == 'singleSymbol' || strClassification == 'graduated' || strClassification == 'categorized')
        return true;
    return false;
}

/**
* Used to hold names of the data classified as 'singleSymbol'. Will be used for the map legend/key.
* @type {string[]}
*/
var singleSymbolKeyNames = [];
/**
 * Used to hold colors of the data classified as 'singleSymbol'. Will be used for the map legend/key.
 * @type {string[]}
 */
var singleSymbolKeyColors = [];
/**
 * Used to hold names of the data classified as 'categorized'. Will be used for the map legend/key.
 * @type {string[]}
 */
var categorizedKeyNames = [];
/**
 * Used to hold colors of the data classified as 'categorized'. Will be used for the map legend/key.
 * @type {string[]}
 */
var categorizedKeyColors = [];
/**
 * Used to hold the name of the data classified as 'graduated'. Will be used for the map legend/key.
 * @type {string[]}
 */
var graduatedKeyNames = [];
/**
 * Used to hold colors of the data classified as 'graduated'. Will be used for the map legend/key.
 * @type {string[]}
 */
var graduatedKeyColors = [];

/* Reads in .json file which describes the format of the map */
$.ajax({
    url: "maps/line_layers_2019-05-15.json",
    async: false,
    dataType: 'json',
    error: function(error){
        throw new Error(error);
    },
    success: function(json){
        /* Loops through the layers decribed in the .json file */
        for(var i = 0; i < (json.layers).length; i++){
            /* Set the default values */
            let layer_classification = "singleSymbol";  // used for color options. Options: singleSymbol -> use one color. graduated -> use colorRamp. categorized -> use colorTable
            let layer_classificationField = "";         // used for the color table, describes which attribute determines the color of the point
            let layer_color = 'blue';                  // color of outline
            let layer_colorRamp = "";                   // features will be shown in different shades based on values, (ex. Blues, Greens, Spectral...)
            let layer_colorRampMax = 100;               // the largest value in the classificationField. Used to determine the range of the color ramp
            let layer_colorRampMin = 0;                 // the smallest value in the classificationField. Used to determine the range of the color ramp
            let layer_colorTable = [];                  // list of colors and values associated with them ([value1, color, value2, color, value3, color...])
            let layer_dashArray = null;                 // dashed line (format example: '20, 10');
            let layer_lineCap = 'round';                // shape to be used at the end of the stroke
            let layer_lineJoin = 'round';               // shape to be used at the corners of the stroke
            let layer_opacity = 1;                      // opacity of outline
            let layer_popupMouseover = 'false';         // if true popup is on mouseover. If false popup is on click
            let layer_popupSource = "";                 // name of property in geojson file to display in the popup
            let layer_weight = 2;                       // outline width in pixels
            /* For more options see path options in https://leafletjs.com/reference-1.5.0.html#path-color */

            /* If a value is specified in the .json file, override the default value.
            Check that the value given in the .json gile is valid for the given field */

            /* lealfet 'classification' = map configuration file 'classification' */
            if(isValidClassification(json.layerViewGroups[0].layerViews[i].symbol.classification))
                layer_classification = json.layerViewGroups[0].layerViews[i].symbol.classification;
            /* leaflet 'classificationField' = map configuration file ' classificationField */
            layer_classificationField = json.layerViewGroups[0].layerViews[i].symbol.classificationField;
            /* leaflet 'color' = map configuration file 'outlineColor' */
            if(isValidColor(json.layerViewGroups[0].layerViews[i].symbol.outlineColor))
                layer_color = json.layerViewGroups[0].layerViews[i].symbol.outlineColor;
            /* leaflet 'colorRamp' = map configuration file 'colorRamp' */
            layer_colorRamp = json.layerViewGroups[0].layerViews[i].symbol.colorRamp;
            /* leaflet 'colorRampMax' = map configuration file 'colorRampMax' */
            if(isValidNumber(json.layerViewGroups[0].layerViews[i].symbol.colorRampMax))
                layer_colorRampMax = json.layerViewGroups[0].layerViews[i].symbol.colorRampMax;
            /* leaflet 'colorRampMin' = map configuration file 'colorRampMin' */
            if(isValidNumber(json.layerViewGroups[0].layerViews[i].symbol.colorRampMin))
                layer_colorRampMin = json.layerViewGroups[0].layerViews[i].symbol.colorRampMin;
            /* leaflet 'colorTable' (array) = map configuration file 'colorTable' (string) split by "{" or "}" */
            let tableHolder = json.layerViewGroups[0].layerViews[i].symbol.colorTable;
            if(tableHolder != "")
                layer_colorTable = tableHolder.substr(1, tableHolder.length - 2).split(/[\{\}]+/);
            /* leaflet 'dashArray = map configuration file 'linePattern' */
            if(isValidDash(json.layerViewGroups[0].layerViews[i].symbol.linePattern))
                layer_dashArray = json.layerViewGroups[0].layerViews[i].symbol.linePattern;
            /* leaflet 'lineCap' = map configuration file 'lineCap */
            if(isValidLineCap(json.layerViewGroups[0].layerViews[i].symbol.lineCap))
                layer_lineCap = json.layerViewGroups[0].layerViews[i].symbol.lineCap;
            /* leaflet 'lineJoin' = map configuration file 'lineJoin' */
            if(isValidLineCap(json.layerViewGroups[0].layerViews[i].symbol.lineJoin))
                layer_lineJoin = json.layerViewGroups[0].layerViews[i].symbol.lineJoin;
            /* leaflet 'opacity' = map configuration file 'opacity' */
            if(isValidNumber(json.layerViewGroups[0].layerViews[i].symbol.opacity))
                layer_opacity = json.layerViewGroups[0].layerViews[i].symbol.opacity;
            /* leaflet 'popupMouseover' = map configuration file 'popupMouseover' */
            if(isValidBoolean(json.layerViewGroups[0].layerViews[i].symbol.popupMouseover))
                layer_popupMouseover = json.layerViewGroups[0].layerViews[i].symbol.popupMouseover;
            /* leaflet 'popupSource' = map configuration file 'popupSource' */
            layer_popupSource = json.layerViewGroups[0].layerViews[i].symbol.popupSource;
            /* leaflet 'weight' = map configuration file 'lineWidth'*/
            if(isValidNumber(json.layerViewGroups[0].layerViews[i].symbol.lineWidth))
                layer_weight = json.layerViewGroups[0].layerViews[i].symbol.lineWidth;

            /* Add the name and color of the current layer to the corresponding arrays.
                    These are used for the map key */
            if(layer_classification == 'singleSymbol'){
                singleSymbolKeyNames.push(json.layers[i].displayName);
                singleSymbolKeyColors.push(layer_color);
            }
            else if(layer_classification == 'categorized'){
                categorizedKeyNames.push(json.layers[i].displayName);
                categorizedKeyColors.push(layer_colorTable);
            }
            else if(layer_classification == 'graduated'){
                graduatedKeyNames.push(json.layers[i].displayName);
            }
            
            /**
            * @param {string} strValue the layer_classificationField of the polygon used for categorized and graduated data, determines what category, for categorized data, or shade, for graduated data is assigned
            * @returns {string} the color that should be applied to the polygon. Can be in the format: rgb(0,0,0), #ff0000, or 'blue'. 
            */
            function getColor(strValue){
            /* switch statement based on the symbol classification.
            'single': one color
            'categorized': data is classified into ranges and each assigned a different color
            'graduated': features in layer will be shown in different shades of color based on values */
            switch(layer_classification){
                case 'singleSymbol':
                    return layer_color;
                    break;
                case 'categorized':
                    for(let i = 0; i < layer_colorTable.length; i++){
                        if(layer_colorTable[i] == strValue){
                            return layer_colorTable[i+1];
                        }
                    }
                    break;
                case 'graduated':
                    let colors = new Rainbow();
                    colors.setNumberRange(layer_colorRampMin, layer_colorRampMax);
                    switch(layer_colorRamp.toLowerCase()){
                        case 'blues': // white, light blue, blue
                            colors.setSpectrum('#f7fbff','#c6dbef','#6baed6','#2171b5','#08306b');
                            break;
                        case 'brbg': // brown, white, green
                            colors.setSpectrum('#a6611a','#dfc27d','#f5f5f5','#80cdc1','#018571');
                            break;
                        case 'bugn': // light blue, green
                            colors.setSpectrum('#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c');
                            break;
                        case 'bupu': // light blue, purple
                            colors.setSpectrum('#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c');
                            break;
                        case 'gnbu': // light green, blue
                            colors.setSpectrum('#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac');
                            break;
                        case 'greens': // white, light green, green
                            colors.setSpectrum('#f7fcf5','#c7e9c0','#74c476','#238b45','#00441b');
                            break;
                        case 'greys': // white, grey
                            colors.setSpectrum('#fafafa','#050505');
                            break;
                        case 'inferno': // black, purple, red, yellow
                            colors.setSpectrum('#400a67','#992766','#df5337','#fca60c','#fcffa4');
                            break;
                        case 'magma': // black, purple, orange, yellow
                            colors.setSpectrum('#000000','#390f6e','#892881','#d9466b','#fea16e','#fcfdbf');
                            break;
                        case 'oranges': // light orange, dark orange
                            colors.setSpectrum('#fff5eb','#fdd0a2','#fd8d3c','#d94801','#7f2704');
                            break;
                        case 'orrd': // light orange, red
                            colors.setSpectrum('#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000');
                            break;
                        case 'piyg': // pink, white, green
                            colors.setSpectrum('#d01c8b','#f1b6da','#f7f7f7','#b8e186','#4dac26');
                            break;
                        case 'plasma': // blue, purple, orange, yellow
                            colors.setSpectrum('#0d0887','#6900a8','#b42e8d','#e26660','#fca835', '#f0f921');
                            break;
                        case 'prgn': // purple, white, green
                            colors.setSpectrum('#0d0887','#6900a8','#b42e8d','#e26660','#fca835');
                            break;
                        case 'pubu': // white, blue
                            colors.setSpectrum('#f1eef6','#bdc9e1','#74a9cf','#2b8cbe','#045a8d');
                            break;
                        case 'pubugn': // white, blue, green
                            colors.setSpectrum('#f6eff7','#bdc9e1','#67a9cf','#1c9099','#016c59');
                            break;
                        case 'puor': // orange, white, purple
                            colors.setSpectrum('#e66101','#fdb863','#f7f7f7','#b2abd2','#5e3c99');
                            break;
                        case 'purd': // white, pink, purple
                            colors.setSpectrum('#f1eef6','#d7b5d8','#df65b0','#dd1c77','#980043');
                            break;
                        case 'purples': // white, purple
                            colors.setSpectrum('#fcfbfd','#dadaeb','#9f9bc9','#6a51a3','#3f007d');
                            break;
                        case 'rdbu': // red, white, blue
                            colors.setSpectrum('#ca0020','#f4a582','#f7f7f7','#92c5de','#0571b0');
                            break;
                        case 'rdgy': // red, white, grey
                            colors.setSpectrum('#ca0020','#f4a582','#ffffff','#bababa','#404040');
                            break;
                        case 'rdpu': // pink, purple
                            colors.setSpectrum('#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177');
                            break;
                        case 'rdylbu': // red, yellow, blue
                            colors.setSpectrum('#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6');
                            break;
                        case 'rdylgn': // red, yellow, green
                            colors.setSpectrum('#d7191c','#fdae61','#ffffc0','#a6d96a','#1a9641');
                            break;
                        case 'reds': // light red, dark red
                            colors.setSpectrum('#fff5f0','#fcbba1','#fb6a4a','#cb181d','#67000d');
                            break;
                        case 'spectral': // red, orange, yellow, green, blue
                            colors.setSpectrum('#d7191c','#fdae61','#ffffbf','#abdda4','#2b83ba');
                            break;
                        case 'viridis': // blue, light blue, green, yellow
                            colors.setSpectrum('#3a004f','#414287','#297b8e','#24aa83','#7cd250','#fde725');
                            break;
                        case 'ylgn': // yellow, blue-green
                            colors.setSpectrum('#ffffcc','#c2e699','#78c679','#31a354','#7cd250','#006837');
                            break;
                        case 'ylgnbu': // yellow, light blue, blue
                            colors.setSpectrum('#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494');
                            break;
                        case 'ylorbr': // yellow, orange, brown
                            colors.setSpectrum('#ffffd4','#fed98e','#fe9929','#d95f0e','#993404');
                            break;
                        case 'ylorrd': //yellow, orange, red
                            colors.setSpectrum('#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026');
                            break;
                        default:
                            let colorsArray = layer_colorRamp.substr(1, layer_colorRamp.length - 2).split(/[\{\}]+/);
                            for(let i = 0; i < colorsArray.length; i++){
                                if(colorsArray[i].charAt(0) == 'r'){
                                    let rgb = colorsArray[i].substr(4, colorsArray[i].length-1).split(',');
                                    let r = (+rgb[0]).toString(16);
                                    let g = (+rgb[1]).toString(16);
                                    let b = (+rgb[2]).toString(16);
                                    if(r.length == 1)
                                        r = "0" + r;
                                    if(g.length == 1)
                                        g = "0" + g;
                                    if(b.length == 1)
                                        b = "0" + b;
                                    colorsArray[i] = "#" + r + g + b;
                                }
                            }
                            colors.setSpectrum(...colorsArray);
                    }
                    /* Add the name and color of the current layer to the corresponding arrays.
                    These are used for the map key */
                    if(graduatedKeyColors[graduatedKeyNames.length * 2] == null){
                        graduatedKeyColors.push(colors.colorAt(layer_colorRampMin));
                        graduatedKeyColors.push(colors.colorAt(layer_colorRampMax));
                    }
                    return '#' + colors.colorAt(strValue);
                    break;
                }
                return layer_color;
            }

            
            /* If the entry for popupSource isn't empty, create a popup for the layer. The popup
            is opened on click if the layer_popupMouseover attribute is set to false. If it is 
            true, the popup is opened on mouseover and closed on mouseout. */
            function popupInfo(feature, layer){
                if(layer_popupSource != "" && layer_popupMouseover == 'false'){
                    layer.bindPopup(feature['properties'][layer_popupSource]);
                }
                else if(layer_popupSource != "" && layer_popupMouseover == 'true'){
                    layer.bindPopup(feature['properties'][layer_popupSource]);
                    layer.on('mouseover', function(event){
                        this.openPopup();
                    });
                    layer.on('mouseout', function (e) {
                        this.closePopup();
                    })
                }
            }

            function setStyle(feature){
                return{
                    weight: layer_weight,
                    opacity: layer_opacity,
                    color: getColor(feature['properties'][layer_classificationField]),
                    dashArray: layer_dashArray,
                    lineCap: layer_lineCap,
                    lineJoin: layer_lineJoin,
                }
            }

            /* Get the geoJSON data corresponding to the .json layer the loop is currently on
            and for each data point create a marker using the attributes above */
            $.ajaxSetup({
                async: false
            });
            $.getJSON(json.layers[i].source,function(data){
                /* L.geoJSON creates a geoJSON layer. It is passes the data from the .geojson 
                file and the style attributes that were defined above (layer_weight, 
                layer_opacity, ...) For more information on geoJSON layers go to: 
                https://leafletjs.com/examples/geojson/ */
                let geolayer = L.geoJSON(data, {style: setStyle, onEachFeature: popupInfo}).addTo(map);
            });
        }
    }
});
/* Bottom Right Corner. This shows the legend for the map */
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4>Key</h4>';

    if(singleSymbolKeyNames.length > 0){
        div.innerHTML += '<h3>Single Symbol Data:</h3>';
        for(let j = 0; j < singleSymbolKeyNames.length; j++){
            div.innerHTML += '<i style="background:' + singleSymbolKeyColors[j] + '"></i> ' + singleSymbolKeyNames[j] + "<br><br>";
        }
    }
    if(categorizedKeyNames.length > 0){
        div.innerHTML += '<h3>Categorized Data:</h3>';
        for(let j = 0; j < categorizedKeyNames.length; j++){
            if(typeof categorizedKeyColors[j] === 'object'){
                div.innerHTML += '<h4>' + categorizedKeyNames[j] + '</h4>';
                for(let k = 0; k < categorizedKeyColors[j].length; k++){
                    if((k%2) == 0)
                        div.innerHTML += '<i style="background:' + categorizedKeyColors[j][k+1] + '"></i> ' + categorizedKeyColors[j][k] + "<br><br>";
                }
            }
        }
    }
    if(graduatedKeyNames.length > 0){
        div.innerHTML += '<h3>Graduated Data:</h3>';
        for(let j = 0; j < graduatedKeyNames.length; j++){
            let k = (j*2);
            graduatedKeyColors[k] = '#' + graduatedKeyColors[k];
            graduatedKeyColors[k + 1] = '#' + graduatedKeyColors[k + 1];
            div.innerHTML += '<i style="background:' + graduatedKeyColors[k] + '"></i> ' + '<i style="background:' + graduatedKeyColors[k + 1] + '"></i> ' + graduatedKeyNames[j] + "<br><br>";
        }
    }
    return div;
};

legend.addTo(map);