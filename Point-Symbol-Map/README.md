## Point-Symbol-Map
<a href="http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/"><b>See a Live Demo of this Example</b></a>

<a href="http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/javascript/out"><b>See the JSdoc</b></a>

![](README-docs/Point-Symbol-Map.png)

This map uses [point_layers_2019-05-15.json](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point_layers_2019-05-15.json) as a map configuration file to provide information about the map configuration and [active-ditches.geojson](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point-layers-map/active-ditches.geojson) and [reservoir-levels.geojson](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point-layers-map/reservoir-levels.geojson) point layer files. Whereas Leaflet defaults to using built-in markers, this demonstration illustrates how to configure symbols using symbol properties such as shape, color, and outline color. In the [point_layers_2019-05-15.json](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point_layers_2019-05-15.json) file the property "symbol" indicates how the data should be displayed. The [active-ditches.geojson](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point-layers-map/active-ditches.geojson) and [reservoir-levels.geojson](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point-layers-map/reservoir-levels.geojson) files contains the data. Here is an example of the format of the [point_layers_2019-05-15.json](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point_layers_2019-05-15.json) file:
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
                    "classification": "classified",
                    "classificationField": "Data_Source",
                    "color": "red",
                    "colorRamp": "",
                    "colorRampMin": "",
                    "colorRampMax": "",
                    "colorTable": "{Northern Colorado Water Conservancy District}{rgb(0, 189, 189)}{Co. Division of Water Resources}{rgb(0, 189, 0)}{U.S. Geological Survey}{blue}{City of Aurora  (Station cooperator)}{black}{NCWCD/Bureau of Reclamation (Station Cooperators)}{blue}{City of Colorado Springs  (Station cooperator)}{blue}{Bureau of Reclamation (Station Cooperators)}{blue}",
                    "fillOpacity": 1.0,
                    "fillPattern": "",
                    "lineCap": "square",
                    "lineJoin": "square",
                    "linePattern": "",
                    "lineWidth": "",
                    "marker": "circle",
                    "opacity": 0.1,
                    "outlineColor": "black",
                    "popupMouseover": "false",
                    "popupSource": "Station_Name",
                    "size": 7,
                    "sizeUnits": "pixels"
                }
            }
        ]
    }
]
```

For each point a geoJson layer is created. The geoJson layer has a style feature which has the attributes weight, opacity, color, ect. as shown below.
```
let geomarker = L.shapeMarker(latlng, {
    weight: layer_weight,
    opacity: layer_opacity,
    color: layer_color,
    fillOpacity: layer_fillOpacity,
    fillColor: getColor(feature['properties'][layer_classificationField]),
    shape: layer_shape,
    radius: layer_radius,
    dashArray: layer_dashArray,
    lineCap: layer_lineCap,
    lineJoin: layer_lineJoin,
}).addTo(map);
```

The table shows how the [point_layers_2019-05-15.json](http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Point-Symbol-Map/site/maps/point_layers_2019-05-15.json) file symbol properties are mapped to the leaflet properties.

| Map Configuration Symbol Property | Leaflet Symbol Property | Comments |
| --------------------------------- | ------------------------- | -------------- |
| classification | layer_classification | Describes the way color should be applied to the data. There are three options: 'singleSymbol': data is represented with one color, use the 'color' field to determine fill color. 'categorized': data is classified into groups based on the classificationField and each assigned to a color, use the 'colorTable' field to determine fill color. 'graduated': data is shown in different shades of a color based on values obtained from classificationField, use the 'colorRamp' field  to determine fill color. Default is 'singleSymbol'. |
| classificationField | layer_classificationField | The field in the geojson file that should be used to categorize the data for a colorTable or a colorRamp. |
| color | Set fillColor in the style function for the desired layer | The color of the inside of the shape. Used for symbols classified as 'singleSymbol'. Input color as a name 'red' ([supported color names](https://www.w3schools.com/colors/colors_names.asp)), a hex color '#ff0000', or a rgb value 'rgb(255,0,0)'. Default is red. |
| colorRamp | layer_colorRamp | For data classified as 'graduated'. Data will be shown in different shades depending on the value in the classificationField. Input colorRamp as a name ('Blues', 'Greens', 'Inferno'...). Any color ramps avaliable in QGIS are supported. Or input can be a list of colors {color1}{color2}{color3}... with a minimum of two colors. |
| colorRampMax | layer_colorRampMax | For data classified as 'graduated'. Used as the maximum value in the colorRamp and represented by the last color in the colorRamp. Default is 0. |
| colorRampMin | layer_colorRampMin | For data classified as 'graduated'. Used as the minimum value in the colorRamp and represented by the first color in the colorRamp. Default is 100. |
| colorTable | layer_colorTable | For data classified as 'categorized'. Data is classified into groups based on the classificationField and each assigned to a different color. Input values and colors as {value1}{color1}{value2}{color2}... |
| fillOpacity | Set opacity in the style function for the desired layer | The opacity of the inside of the shape. Default is 0.3. |
| fillPattern | | Not implemented in leaflet. |
| lineCap | Set lineCap in the style function for the desired layer | A string that defines the shape to be used at the end of the stroke. Default is 'round'. |
| lineJoin | Set lineJoin in the style function for the desired layer | A string that defines the shape to be used at the corners of the stroke. Default is 'round'. |
| linePattern | Set dashArray in the style function for the desired layer | Option for dahsed line. Doesn't work on Canvas powered layers in some old browsers. Example formats: '20, 10', '20', '30, 5, 10'. The first number is the length of the first dash. The second number is the length of the first space and so on. Default is null. |
| lineWidth | Set weight in the style function for the desired layer | The outline width in pixels. Default is 2. |
| marker | Set shape in the style function for the desired layer | The shape of the marker. Options are: diamond, square, triangle, triangle-up, triangle-down, circle, or x. The default is diamond. |
| opacity | Set opacity in the style function for the desired layer | The opacity of the outline. The default is 1. |
| outlineColor | Set color in the style function for the desired layer | The color of the outline. Input color as a name 'red' ([supported color names](https://www.w3schools.com/colors/colors_names.asp)), a hex color '#ff0000', or a rgb value 'rgb(255,0,0)'. The default is black. |
| popupMouseover | marker.on('mouseover', function(e){...} ) | Boolean value, if true popups will be triggered on mouseover. If false popups will be triggered on click. Default is false. |
| popupSource | bindPopup() | A string contatining that geoJSON property name that should be accessed and displayed in the popup. Default is empty string, "" |
| size | Set radius in the style function for the desired layer | The size of the shape. The default is 5. |
| sizeUnits | | The default is pixels. |
| | Set stroke in the style function for the desired layer | A boolean value, set to false to disable borders on polygons. Not implemented in configuration file. Default is true. |
