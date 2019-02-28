## Dynamic-Zoom-Map
<a href="http://github.openwaterfoundation.org/owf-lib-viz-leaflet-js/Dynamic-Zoom-Map/site/"><b>See a Live Demo of this Example</b></a>

![](README-docs/Dynamic-Zoom-Map.png)

This map features icons that update based on the map's zoom level.  When the map is zoomed further out, the icons become smaller to avoid stacking on top of each other and cluttering the screen.

### Summary of Zoom Feature

Different icons are loaded into variables, where the size and anchor points are set:
```
var smallIcon = L.icon({
    iconUrl: 'css/images/marker-icon-small.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 20]
})
```
Later, the mymap.on function uses the `zoomend` option to rest the icons at specific zoom levels:
```
mymap.on('zoomend', function() {
    console.log(mymap.getZoom());
    if (mymap.getZoom() > 9){
        station.eachLayer(function(layer) {
            layer.setIcon(largeIcon);
        });
    }
    else {
        station.eachLayer(function(layer) {
            layer.setIcon(smallIcon);
        });
    }
});
```
For each zoom event, if the zoom level is less than 9, the icon is set to the smaller version.
