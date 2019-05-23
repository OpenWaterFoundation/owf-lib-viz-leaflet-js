## Polygon-Symbol-Map
<a href="http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Polygon-Symbol-Map/site/"><b>See a Live Demo of this Example</b></a>

![](README-docs/Polygon-Symbol-Map.png)

This map uses a .json format file and a .geojson file to create polygon data on a map.

In the .json file the property "symbol" determines how the data should be displayed. 
The .geojson file contains the actual data. Here is an example of the format of the .json file:
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
                    "color": "red",
                    "outlineColor": "red",
                    "size": "",
                    "sizeUnits": "pixels",
                    "marker": "",
                    "opacity": 0.5,
                    "lineWidth": "",
                    "linePattern": "",
                    "fillPattern": "",
                    "fillOpacity": 0.2
                }
            }
        ]
    }
]
```