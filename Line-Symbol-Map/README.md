## Line-Symbol-Map
<a href="http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Line-Symbol-Map/site/"><b>See a Live Demo of this Example</b></a>

<a href="http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Line-Symbol-Map/site/javascript/out"><b>See the JSdoc</b></a>

![](README-docs/Line-Symbol-Map.png)

This map uses [line_layers_2019-05-15.json](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Line-Symbol-Map/site/maps/line_layers_2019-05-15.json) as a map configuration file to provide information about the map configuration and [swrf-district03.geojson](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Line-Symbol-Map/site/maps/line-layers-map/swrf-district03.geojson) point layer file to provide the data.

In the [line_layers_2019-05-15.json](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Line-Symbol-Map/site/maps/line_layers_2019-05-15.json) file the property "symbol" indicates how the data should be displayed. Here is an example of the format of the JSON file:
```
"properties": {...}
"layers": [
    {
        geolayerId: "",
        name: "",
        ...
    }
    ...
]
"layerViewGroups": [
    {
        "name": "",
        "description": "",
        "layerVews": [
            {
                "layerId": "",
                "displayName": "",
                "symbol": {
                    "classification": "singleSymbol",
                    "classificationField": "",
                    "color": "",
                    "colorRamp": "",
                    "colorRampMin": "",
                    "colorRampMax": "",
                    "colorTable": "",
                    "fillOpacity": 1.0,
                    "fillPattern": "",
                    "lineCap": "round",
                    "lineJoin": "round",
                    "linePattern": "",
                    "lineWidth": "",
                    "marker": "",
                    "opacity": 0.5,
                    "outlineColor": "blue",
                    "popupMouseover": "true",
                    "popupSource": "GNIS_Name",
                    "size": "",
                    "sizeUnits": "pixels"
                }
            }
        ]
    }
]
```
For each line a geoJson layer is created. The geoJson layer has a style feature which has the attributes weight, opacity, color, ect. as shown below.
```
let geolayer = L.geoJSON(data, {
    weight: layer_weight,
    opacity: layer_opacity,
    color: layer_color,
    lineCap: layer_lineCap,
    lineJoin: layer_lineJoin,
    dashArray: layer_dashArray,
    onEachFeature: popupInfo
}).addTo(map);
```
The table shows how the [line_layers_2019-05-15.json](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Line-Symbol-Map/site/maps/line_layers_2019-05-15.json) file symbol properties are mapped to the leaflet properties.

| Map Configuration Symbol Property | Leaflet Symbol Property | Comments |
| --------------------------------- | ----------------------- | -------- |
| classification | layer_classification | Describes the way color should be applied to the data. There are three options: 'singleSymbol': data is represented with one color, use the 'color' field to determine fill color. 'categorized': data is classified into groups based on the classificationField and each assigned to a color, use the 'colorTable' field to determine fill color. 'graduated': data is shown in different shades of a color based on values obtained from classificationField, use the 'colorRamp' field  to determine fill color. Default is 'singleSymbol'. |
| classificationField | layer_classificationField | The field in the geojson file that should be used to categorize the data for a colorTable or a colorRamp. |
| color | | The color of the inside of the shape. Not implemented for lines in leaflet. |
| colorRamp | layer_colorRamp | For data classified as 'graduated'. Data will be shown in different shades depending on the value in the classificationField. Input colorRamp as a name ('Blues', 'Greens', 'Inferno'...). Any color ramps avaliable in QGIS are supported. Or input can be a list of colors {color1}{color2}{color3}... with a minimum of two colors. |
| colorRampMax | layer_colorRampMax | For data classified as 'graduated'. Used as the maximum value in the colorRamp and represented by the last color in the colorRamp. Default is 0. |
| colorRampMin | layer_colorRampMin | For data classified as 'graduated'. Used as the minimum value in the colorRamp and represented by the first color in the colorRamp. Default is 100. |
| colorTable | layer_colorTable | For data classified as 'categorized'. Data is classified into groups based on the classificationField and each assigned to a different color. Input values and colors as {value1}{color1}{value2}{color2}... |
| fillOpacity | | The opacity of the inside of the shape. Not implemented for lines in leaflet. |
| fillPattern | | Not implemented in for lines in leaflet. |
| lineCap | Set lineCap in the style function for the desired layer | A string that defines the shape to be used at the end of the stroke. Default is 'round'. |
| lineJoin | Set lineJoin in the style function for the desired layer | A string that defines the shape to be used at the corners of the stroke. Default is 'round'. |
| linePattern | Set dashArray in the style function for the desired layer | A string that defines the dash pattern for the outline. Doesn't work on Canvas powered layers in some old browsers. Default is null. |
| lineWidth | Set weight in the style function for the desired layer | The outline width in pixels. Default is 2. |
| marker | | Not implemented for lines in leaflet. |
| opacity | Set opacity in the style function for the desired layer | The opacity of the outline. The default is 1. |
| outlineColor | Set color in the style function for the desired layer | The color of the outline. The default is blue. |
| popupMouseover | marker.on('mouseover', function(e){...} ) | Boolean value, if true popups will be triggered on mouseover. If false popups will be triggered on click. Default is false. |
| popupSource | bindPopup() | A string contatining that geoJSON property name that should be accessed and displayed in the popup. Default is empty string, "" |
| size | | Not implemented for lines in leaflet. |
| sizeUnits | | The default is pixels. |
