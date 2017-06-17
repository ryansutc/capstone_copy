//Below code handles web map widget and related for elements

$(document).ready(function(){
    var floorMarkers = [];
    //Make Show Building Floors button invisible by default
    $('#mapmenuleft').hide();
    $('#mapmenu').hide();

    $('#campus').prop("disabled", false);
    $('#building').prop("disabled", false);

    var floorMode = false;
    var floorFeaturesAreVisible = false;
    var roomList = []; //array list of all room codes

    //click Step Into/Step Out of Building toggles layer switch
    $('#buildingToggle').on("click", function( event ) {
        event.preventDefault();
        event.stopPropagation();
        //Step into Building

        if(this.text == 'Step Into Building') {
            floorMode = true;
            map.setStyle('mapbox://styles/ryansutc/cizmrlzl7001j2sp8909nbwel');
        }
        else {
            floorMode = false;
            //mapbox://styles/ryansutc/cj1gnlx79000l2rmifdq4a0it
            map.setStyle('mapbox://styles/ryansutc/cj1gnlx79000l2rmifdq4a0it');//mapbox://styles/mapbox/streets-v9'
            $('#mapmenu').hide(); //hide the floor option buttons
        }
    });

    //Initial load of the map element
    mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnN1dGMiLCJhIjoiY2l5MGhpZHBpMDA3eTJxbzl1cjI2aTNuZCJ9.vdbwWHcBIJmFQ383dVstXg';
    if (!mapboxgl.supported()) {
        $('#map').html('<h4>No WebGL Support</h4><p>Sorry your browser is old and does not support WebGL</p>');
    }
    else {
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [-63.28, 45.359], // starting position
            zoom: 6 // starting zoom
        });

        map.on('load', function () {

        });
        
        map.on('style.load', function () {
            if ($('#building').val() == "ITC") {
                if ($('#buildingToggle').text() == 'Step Into Building') {
                    loadFloorData(); //load the campus data layeers, zoom, pan, etc.
                    loadFloorButtons(); // zoom in and load the floors buttons and load ability to toggle layer via click
                    $('#mapmenu').show();
                    $('#buildingToggle').text('Step out of Building');


                    $("#campus").prop("disabled", true);
                    $("#building").prop("disabled", true);
                    map.off("click", ShowCampusDetails);
                    //map.off("mousemove", HoverBuildings);
                    map.on("zoomend", redrawMarkers) //turn on and off markers based on zoom scale
                    map.on("mousemove", HoverFeatures); //{ floor: visibleFloor }
                    map.on("click", ShowAttributes);
                    map.on("mouseout", UnHoverFeatures);
                    loadFloorMarkersData();
                    floorFeaturesAreVisible = false;
                    redrawMarkers(); // added markers

                }
                else {
                    loadCampusData(); //load campuses and zoom to
                    $("#campus").prop("disabled", false);
                    $("#building").prop("disabled", false);
                    map.off("zoomend");
                    map.off("mousemove", HoverFeatures);
                    map.off("mouseout", UnHoverFeatures);
                    map.off("click", ShowAttributes);

                    //map.on("mousemove", HoverBuildings);
                    map.on("click", ShowCampusDetails);
                    //alert(map.isSourceLoaded('ITCampus_f3'));
                    panMap();
                    $('#buildingToggle').text('Step Into Building');
                }
            }
            else {
                loadCampusData(); //load campuses and zoom to (happen also if NOT INSTI campus!)
                map.on("click", ShowCampusDetails);
                //map.on("mousemove", HoverBuildings);
            }
        });
    }


    /*
     Function to get coordinates of selected building.
     Takes a building value as a parameter and returns
     the coordinates of the building.

     Makes a call to the geoJSON data file via ajax
     and then sorts through the data client side to get
     the coordinates it needs.

     [todo] This will later be optimized to be a server side request
     [todo] to a database which will return coordinates.

    */
    function getBuildingCoordinates(building){
        $coords = "";
        jQuery.ajaxSetup({async:false});
        $.get("/Locate/CampusJSON", function(data) {
            var $buildingsObj = JSON.parse(data);
            $.each($buildingsObj.features, function() {
                if(this.properties.BUILDING == building) {
                    $coords = this.geometry.coordinates;
                    return false;
                }
            });
        });
        jQuery.ajaxSetup({async:true});
        return $coords;

    }

    /*
    Function to pan the map to the updated building.
    Called by both campus and building dropdown
    change events
     */
    function panMap(){
        $zoom = 14;
        var $featureCoords = getBuildingCoordinates($('#building').val());
        /*
         var selectedCampusFeature = map.querySourceFeatures('campuses', {
         filter: ['==', 'BUILDING', $('#campus').val()]
         });

         //$('#feature').html = '';
         if (selectedCampusFeature[0] == null){
         alert("could not find record with Building = " + $('#campus').val());
         }
         var $feature = $.parseJSON(JSON.stringify(selectedCampusFeature[0]));
         var $featureCoords = $feature.geometry.coordinates;

         document.getElementById('feature').innerHTML = JSON.stringify(selectedCampusFeature[0], null,2);
         */
        if($featureCoords == '') {
            $featureCoords = [-62.7826,45.1313];
            $zoom = 6;
        }
        map.flyTo({
            // These options control the ending camera position: centered at
            // the target, at zoom level 9, and north up.
            center: $featureCoords,
            zoom: $zoom,
            bearing: 0,

            // These options control the flight curve, making it move
            // slowly and zoom out almost completely before starting
            // to pan.
            speed: 0.7, // make the flying slowish
            curve: 1, // change the speed at which it zooms out

            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            easing: function (t) {
                return t;
            }
        });
    }

    function loadCampusData() {
        // disable map rotation using right click + drag
        map.dragRotate.enable();
        // disable map rotation using touch rotation gesture
        map.touchZoomRotate.enableRotation();
        map.setMinZoom(5);
        var bounds = [
            [-68.09, 42.40], // Southwest coordinates
            [-59.46, 47.40]  // Northeast coordinates
        ];
        map.setMaxBounds(bounds);
        map.loadImage('./img/icons/School.png', function (error, image) {
            if (error) {
                alert("could not load school icons");
            }

            map.addImage('school', image);

            map.addSource('campuses', {
                type: 'vector',
                url: 'mapbox://ryansutc.bokyiufq'
            });

            map.addLayer({
                'id': 'campuses', //Actually it is buildings!
                'type': 'symbol',
                'source': 'campuses',
                "layout": {
                    "icon-image": 'school',
                    "icon-size": 0.75

                },
                'source-layer': 'Campuses-2hqb70',
                //'filter': ['==', 'Room', '##'],
                "maxzoom": 15
            });
        });
    }
    /*
    Load the floor layers, set zoom, center and bounds
     */
    function loadFloorData() {
        //zoom in a bit and restrict panning map to area
        map.dragRotate.disable();
        // disable map rotation using touch rotation gesture
        map.touchZoomRotate.disableRotation();

        var bounds = [
            [-63.616,44.664], // Southwest coordinates
            [-63.611, 44.68]  // Northeast coordinates
        ];
        map.setMinZoom(13);
        map.zoomTo(14.5);
        map.setMaxBounds(bounds);
        map.setCenter([-63.614, 44.6697]);
        map.rotateTo(-45, {duration:3000});

        //temporarily suspend user interaction until rotate done
        map.boxZoom.disable();
        map.dragPan.disable();
        map.doubleClickZoom.disable();

        //reinstate user interaction, enforce rotation if not already done
        setTimeout(function(){
            map.boxZoom.enable();
            map.dragPan.enable();
            map.doubleClickZoom.enable();
            map.setBearing(-45);
        }, 1700);



        //reinstate user interaction, except rotate

        // disable map rotation using right click + drag


        map.addSource('ITCampus_footprint', {
            type: 'vector',
            url: 'mapbox://ryansutc.c68yf2tl'
        });

        map.addSource('ITCampus_f3', {
            type: 'vector',
            url: 'mapbox://ryansutc.74v4z534'
        });

        map.addSource('ITCampus_f2', {
            type: 'vector',
            url: 'mapbox://ryansutc.87s8r2jj'
        });

        map.addSource('ITCampus_f1', {
            type: 'vector',
            url: 'mapbox://ryansutc.be3w2hls'
        });

        //NEW Added Floor features

        map.addSource('ITCampus_f3_Features', {
           type: 'vector',
           url: 'mapbox://ryansutc.b25owry1'
        });

        map.addSource('ITCampus_f2_Features', {
            type: 'vector',
            url: 'mapbox://ryansutc.d50gxvlh'
        });

        map.addSource('ITCampus_f1_Features', {
            type: 'vector',
            url: 'mapbox://ryansutc.be3w2hls'
        });

        //New: Add Room Labels
        map.addSource('ITCampus_f3_RoomLabels', {
            type: 'vector',
            url: 'mapbox://ryansutc.0jn3hoj7'
        });

        map.addSource('ITCampus_f2_RoomLabels', {
            type: 'vector',
            url: 'mapbox://ryansutc.d50gxvlh'
        });

        map.addSource('ITCampus_f1_RoomLabels', {
            type: 'vector',
            url: 'mapbox://ryansutc.8pmct31m'
        });

        map.addLayer({
            'id': 'Footprint',
            'type': 'fill',
            'source': 'ITCampus_footprint',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-outline-color': 'rgba(255,255,255,1)',
                'fill-color': 'rgba(255,255,255,0.6)'
            },
            'source-layer': 'footprint-4p7dyq'
        })

        map.addLayer({
            'id': 'Floor 3 Selection-Hover',
            'type': 'fill',
            'source': 'ITCampus_f3',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-outline-color': 'rgba(255,0,0,2.5)',
                'fill-color': 'rgba(233,109,118,0.5)'
            },
            'source-layer': 'Floor3-abu27v',
            'filter': ['==', 'Room', '##']
        });

        map.addLayer({
            'id': 'Floor 3 Selection',
            'type': 'fill',
            'source': 'ITCampus_f3',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-outline-color': 'rgba(54,0,0,2.5)',
                'fill-color': 'rgba(255,0,0,0.2)'
            },
            'source-layer': 'Floor3-abu27v'
        });

        map.addLayer({
            'id': 'Floor 3 Hall',
            'type': 'fill',
            'source': 'ITCampus_f3',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-outline-color': 'rgba(230,230,0,1)',
                'fill-color': 'rgba(255,255,153,0.4)'
            },
            'source-layer': 'Floor3-abu27v',
            'filter': ['==', 'Room', 'Hall']
        });

        map.addLayer({
            'id': 'Floor 3',
            'type': 'fill',
            'source': 'ITCampus_f3',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-outline-color': 'rgba(40,40,40,1)',
                'fill-color': 'rgba(80,80,80,0.2)'
            },
            'source-layer': 'Floor3-abu27v'

        });

        map.addLayer({
            'id': 'Floor 2 Selection-Hover',
            'type': 'fill',
            'source': 'ITCampus_f2',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(255,0,0,2.5)',
                'fill-color': 'rgba(233,109,118,0.5)'
            },
            'source-layer': 'Floor2-4f0e42'
        });

        map.addLayer({
            'id': 'Floor 2 Selection',
            'type': 'fill',
            'source': 'ITCampus_f2',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(54,0,0,2.5)',
                'fill-color': 'rgba(255,0,0,0.2)'
            },
            'source-layer': 'Floor2-4f0e42'
        });

        map.addLayer({
            'id': 'Floor 2 Hall',
            'type': 'fill',
            'source': 'ITCampus_f2',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(230,230,0,1)',
                'fill-color': 'rgba(255,255,153,0.4)'
            },
            'source-layer': 'Floor2-4f0e42',
            'filter': ['==', 'Room', 'Hall']
        });

        map.addLayer({
            'id': 'Floor 2',
            'type': 'fill',
            'source': 'ITCampus_f2',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(40,40,40,1)',
                'fill-color': 'rgba(80,80,80,0.2)'
            },
            'source-layer': 'Floor2-4f0e42'
        });

        map.addLayer({
            'id': 'Floor 1 Selection-Hover',
            'type': 'fill',
            'source': 'ITCampus_f1',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(255,0,0,2.5)',
                'fill-color': 'rgba(233,109,118,0.5)'
            },
            'source-layer': 'Floor1-8dqbwx'
        });

        map.addLayer({
            'id': 'Floor 1 Selection',
            'type': 'fill',
            'source': 'ITCampus_f1',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(54,0,0,2.5)',
                'fill-color': 'rgba(255,0,0,0.2)'
            },
            'source-layer': 'Floor1-8dqbwx'
        });

        map.addLayer({
            'id': 'Floor 1 Hall',
            'type': 'fill',
            'source': 'ITCampus_f1',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(230,230,0,1)',
                'fill-color': 'rgba(255,255,153,0.4)'
            },
            'source-layer': 'Floor1-8dqbwx',
            'filter': ['==', 'Room', 'Hall']
        });

        map.addLayer({
            'id': 'Floor 1',
            'type': 'fill',
            'source': 'ITCampus_f1',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-outline-color': 'rgba(40,40,40,1)',
                'fill-color': 'rgba(80,80,80,0.2)'
            },
            'source-layer': 'Floor1-8dqbwx'
        });

        //NEW LABEL Layers
        map.addLayer({
            'id': 'Floor 3 RoomLabels',
            'type': 'symbol',
            'source': 'ITCampus_f3_RoomLabels',
            'layout': {
                'visibility': 'visible',
                "text-field": "{Room}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-size": 10,
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
            'source-layer': 'Floor3_RoomNames_WGS-b4dex3',
            'filter': ['==', 'Room', '##'],
            "minzoom": 17.5
        })

        map.addLayer({
            'id': 'Floor 2 RoomLabels',
            'type': 'symbol',
            'source': 'ITCampus_f2_RoomLabels',
            'layout': {
                'visibility': 'none',
                "text-field": "{Room}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-size": 10,
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
            'source-layer': 'Floor2_RoomNames_WGS-5emrxt',
            'filter': ['==', 'Room', '##'],
            "minzoom": 17.5
        })

        map.addLayer({
            'id': 'Floor 1 RoomLabels',
            'type': 'symbol',
            'source': 'ITCampus_f1_RoomLabels',
            'layout': {
                'visibility': 'none',
                "text-field": "{Room}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-size": 10,
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
            'source-layer': 'Floor1_RoomNames_WGS-azguv9',
            'filter': ['==', 'Room', '##'],
            "minzoom": 17.5
        })

        //Filter Floor data
        map.setFilter('Floor 1 Selection', ['in', 'Room'].concat(roomList));
        map.setFilter('Floor 2 Selection', ['in', 'Room'].concat(roomList));
        map.setFilter('Floor 3 Selection', ['in', 'Room'].concat(roomList));
        //map.setBearing(-45);
    } // end add Floor Data
    function formElementChange(){

        var $roomType = "";
        if($('#building').val() == "ITC"){
            if($('#roomtype').val() != 0){
                $roomType = $('#roomtype').val();
            }
            //FreeRoomUntil/roomData/{campus}/{building}/{fromTime}/{onDayStr}/{roomType?}
            $.get("/FreeRoomOnUntil/roomData/" + $('#campus').val() + "/" + $('#building').val() +
                "/" + $('#timepicker').val() + "/" +
                new Date() + "/" + $roomType,
                function(result) {

                var $roomsObj = JSON.parse(result);
                roomList = []
                $.each($roomsObj, function() {
                    roomList.push(this.Room);
                });
                //IF WE ARE ALREADY IN FLOOR VIEW, Update building
                if($('#buildingToggle').text() == 'Step out of Building') {
                    //alert("we are already in floor view");

                    map.setFilter('Floor 1 Selection', ['in', 'Room'].concat(roomList));
                    map.setFilter('Floor 2 Selection', ['in', 'Room'].concat(roomList));
                    map.setFilter('Floor 3 Selection', ['in', 'Room'].concat(roomList));
                }
            });
            loadBuildingToggle(true);

        }
        else {
            loadBuildingToggle(false); //hide show building view button
        }
    }

    $('#building').change(function(){
        panMap();
        formElementChange();

    });
    $('#campus').change(function(){
        panMap();
        formElementChange();
    });

    $('#roomtype').change(function(){
        formElementChange();
    });

    /*
    Load the Floor Buttons and set a click listener to change
    visible floor
     */
    function loadFloorButtons() {


        var toggleableLayerIds = ['Floor 3', 'Floor 2', 'Floor 1'];
        $('#mapmenu').html('');
        for (var i = 0; i < toggleableLayerIds.length; i++) {
            var id = toggleableLayerIds[i];

            var link = document.createElement('a');
            link.href = '#';
            link.className = ' ';
            link.textContent = id;

            if (i == 0) {
                link.className = 'active';
            }

            link.onclick = function (e) {
                var floorJSON;
                var clickedLayer = this.textContent;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                if (visibility === 'visible') {
                    //alert("already visible");
                } else {
                    this.className = 'active';
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    map.setLayoutProperty(clickedLayer + " Hall", 'visibility', 'visible');
                    map.setLayoutProperty(clickedLayer + ' Selection', 'visibility', 'visible');
                    map.setLayoutProperty(clickedLayer + ' Selection-Hover', 'visibility', 'visible');
                    map.setLayoutProperty(clickedLayer + ' RoomLabels', 'visibility', 'visible');

                    for (var i = 0; i < toggleableLayerIds.length; i++) {
                        if (toggleableLayerIds[i] != clickedLayer) {
                            map.setLayoutProperty(toggleableLayerIds[i], 'visibility', 'none');
                            map.setLayoutProperty(toggleableLayerIds[i] + ' Hall', 'visibility', 'none');
                            map.setLayoutProperty(toggleableLayerIds[i] + " Selection", 'visibility', 'none');
                            map.setLayoutProperty(toggleableLayerIds[i] + " Selection-Hover", 'visibility', 'none');
                            map.setLayoutProperty(toggleableLayerIds[i] + ' RoomLabels', 'visibility', 'none');
                            $('#mapmenu').children('a').each(function () {

                                if (this.text == toggleableLayerIds[i]) {
                                    this.className = '';
                                }
                            });
                        }
                    }

                    loadFloorMarkersData(); //load the Floor Marker Symbols data

                }
            };

            var layers = document.getElementById('mapmenu');
            layers.appendChild(link);

        }

    }//end loadFloors Function

    /*
    This loads the "Step into Building" button
    that is toggled in map when user has panned
    to a campus building that has a mapped floor plan
     */
    function loadBuildingToggle(avail){
        if(avail){
            $('#mapmenuleft').show();
        }
        else {
            $('#mapmenuleft').hide();
        }

    } // loadBuildingToggle

    /*
    Return the visible floor layer.
    Used as a helper for other methods.

    Assumes that there is only one visible floor and returns the first
    one that it finds.
     */
    function getVisibleFloor(){
        var toggleableLayerIds = [ 'Floor 3', 'Floor 2', 'Floor 1' ];
        for (var i = 0; i < toggleableLayerIds.length; i++) {
            var id = toggleableLayerIds[i];
            var visibility = map.getLayoutProperty(id, 'visibility');
            if (visibility == "visible"){
                return id;
            }
        }
    }


    function HoverBuildings(event){
        var features = map.queryRenderedFeatures(event.point, { layers: ['campuses'] });
        if (features.length) {
            //make icon slightly larger
            //setStyle
            alert(features[0].properties.Notes);
            //There are issues getting the features from the responsible geoJSON data
        }
    }
    // When the user moves their mouse over the page, look for features
    // at the mouse position (e.point) and within the states layer (states-fill).
    // If a feature is found, then we'll update the filter in the state-fills-hover
    // layer to only show that state, thus making a hover effect.
    //map.on("mousemove", function(e) {
    function HoverFeatures(event){
        var floor = getVisibleFloor();
        var floorSelection = floor + " Selection";
        //alert(floor);
        var features = map.queryRenderedFeatures(event.point, { layers: [floorSelection] });
        if (features.length) {
            map.setFilter(floorSelection + "-Hover", ["==", "Room", features[0].properties.Room]);
            map.setFilter(floor + " RoomLabels", ["==", "Room", features[0].properties.Room]);
            //$('#RoomSelect').html(features[0].properties.Room);
        } else {
            map.setFilter(floorSelection + "-Hover", ["==", "Room", "##"]);
            map.setFilter(floor + " RoomLabels", ["==", "Room", "##"]);
            //nothing selected
            //$('#RoomSelect').html("");
        }

    }
    function UnHoverFeatures(e) {
        map.setFilter("Floor 1 Selection-Hover", ["==", "Room", "##"]);
        map.setFilter("Floor 2 Selection-Hover", ["==", "Room", "##"]);
        map.setFilter("Floor 3 Selection-Hover", ["==", "Room", "##"]);

        map.setFilter("Floor 1 RoomLabels", ["==", "Room", "##"]);
        map.setFilter("Floor 2 RoomLabels", ["==", "Room", "##"]);
        map.setFilter("Floor 3 RoomLabels", ["==", "Room", "##"]);
        $('#RoomSelect').html("");
    }
    // Reset the state-fills-hover layer's filter when the mouse leaves the map

    /*
    Show Room Attributes in a Pop up Box
    This function is bound to a click even when
    the Floor View in the map is enabled

    It Pans to the selected feature also.
     */
    function ShowAttributes(event) {
        var floor = getVisibleFloor();
        floor = floor + " Selection";
        var features = map.queryRenderedFeatures(event.point, { layers: [floor] });

        if (features.length) {
            map.flyTo({center: polylabel(features[0].geometry.coordinates, 1.0)});
            var $myTime = ConvertTimeformat("24", $('#timepicker1').val());
            var $roomsWUntilObj;
            $.get("FreeRoomUntil/" + features[0].properties.Room + "/" + "Today" + "/" + $myTime, function(result) {
                var $roomAvail;
                $roomsWUntilObj = JSON.parse(result)[0].AvailUntil;
                if($roomsWUntilObj != null){
                    $roomAvail = "Room available until " + $roomsWUntilObj;
                }
                else {
                    $roomAvail = "Room Available rest of day";
                }

                var popup = new mapboxgl.Popup({ offset: [0, -15] })
                    .setLngLat(polylabel(features[0].geometry.coordinates, 1.0))
                    .setHTML('<p>' + features[0].properties.Room + '</p>' +
                        '<p>' + $roomAvail + '</p>' +
                        '<p><a href="' + '/RoomSchedule/' + features[0].properties.Room +
                        '">Schedule</a></p>')
                    //.setLngLat(feature.geometry.coordinates)
                    .addTo(map);
            });

            // Get coordinates from the symbol and center the map on those coordinates
            //alert(features[0].geometry.coordinates);

            //alert(polylabel(features[0].geometry.coordinates, 1.0));

        }

    }

    //handles campus/building icon onclick
    function ShowCampusDetails(event){
        var features = map.queryRenderedFeatures(event.point, { layers: ['campuses']});

        if (features.length) {
            if(map.getZoom() < 11){
                map.flyTo({
                    center: features[0].geometry.coordinates,
                    zoom: 13,
                    speed: 0.6
                });
            }
            else {
                var $link = "/img/buildings/" + features[0].properties.BUILDING + ".jpg";
                var $note;
                if(features[0].properties.BUILDING != 'ITC'){
                    $note = '<p>Sorry a floor plan is not yet <br/> available for this building</p>'
                }
                else {
                    $note = "<p>Select the Building from the dropdown <br/> to view floor plan and rooms</p>";
                }
                var popup = new mapboxgl.Popup({ offset: [0, -15] })
                    .setLngLat(features[0].geometry.coordinates)
                    .setHTML('<img src="' + $link + '" alt="Campus"/> <br/>' + features[0].properties.CAMPUS +
                        '<p>' + features[0].properties.NOTES + '</p>' +
                            $note
                        )
                    //.setLngLat(feature.geometry.coordinates)
                    .addTo(map);
                
            }
        }
    }

    function loadFloorMarkersData(){
        if (floorMarkers.length){ //if already data, delete it
            for (i = 0; i < floorMarkers.length; i++) {
                //alert(floorMarker.properties.FeatureTyp);
                floorMarkers[i].remove();
            }
            floorMarkers = [];
        }

        //new add floor features (hack to use raster images)
        var visibleFloor = getVisibleFloor();
        var activeFloor = "/media/floor" + visibleFloor[visibleFloor.length - 1] + "_features.txt"; //Hack to get current floor
        $.get(activeFloor, function (data) {
            floorJSON = JSON.parse(data);

            floorJSON.features.forEach(function (marker) {

                var el = document.createElement('div');
                el.className = 'marker';
                if (marker.properties.FeatureTyp == 'Elevator') {
                    el.style.backgroundImage = 'url(/img/icons/Elevator.png)';
                }
                else if (marker.properties.FeatureTyp == 'Stairs') {
                    el.style.backgroundImage = 'url(/img/icons/Stairs.png)';
                }
                else if (marker.properties.FeatureTyp == 'Mens Washroom') {
                    el.style.backgroundImage = 'url(/img/icons/MensWashroom.png)';
                }
                else if (marker.properties.FeatureTyp == 'Womens Washroom') {
                    el.style.backgroundImage = 'url(/img/icons/WomensWashroom.png)';
                }
                else if (marker.properties.FeatureTyp == 'Entrance') {
                    el.style.backgroundImage = 'url(/img/icons/Entrance.png)';
                }
                else if (marker.properties.FeatureTyp == 'Information') {
                    el.style.backgroundImage = 'url(/img/icons/Information.png)';
                }

                el.style.width = '25px'//marker.properties.iconSize[0] + 'px';
                el.style.height = '25px' //marker.properties.iconSize[1] + 'px';


                // add marker to map
                var floorMarker = new mapboxgl.Marker(el); //{offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]}
                floorMarker.setLngLat(marker.geometry.coordinates);

                floorMarkers.push(floorMarker);
                floorFeaturesAreVisible = false;
                redrawMarkers();

            });
        });
    } //End loadFloorMarkerData
    /*
    Function handles map.zoomend event
    A function that rescales and redraws Floor Feature markers
    based on a zoom event. Zoom out hides them, zoom in makes them
    larger
     */
    function redrawMarkers(){
        //alert(map.getZoom());

        if(map.getZoom() > 18){
            //draw features
            if (floorMarkers.length && floorFeaturesAreVisible == false){
                for (i = 0; i < floorMarkers.length; i++) {
                    floorMarkers[i].addTo(map);
                }
            }
            floorFeaturesAreVisible = true;
        }
        else {
            if (floorMarkers.length && floorFeaturesAreVisible == true){
                for (i = 0; i < floorMarkers.length; i++) {
                    //alert(floorMarker.properties.FeatureTyp);
                    floorMarkers[i].remove();
                }

                floorFeaturesAreVisible = false;
            }
        }

    }

    //#############################
    //POLY LABEL IMPORT: https://github.com/mapbox/polylabel/blob/master/polylabel.js
    var Queue = TinyQueue;

    function polylabel(polygon, precision, debug) {
        precision = precision || 1.0;

        // find the bounding box of the outer ring
        var minX, minY, maxX, maxY;
        for (var i = 0; i < polygon[0].length; i++) {
            var p = polygon[0][i];
            if (!i || p[0] < minX) minX = p[0];
            if (!i || p[1] < minY) minY = p[1];
            if (!i || p[0] > maxX) maxX = p[0];
            if (!i || p[1] > maxY) maxY = p[1];
        }

        var width = maxX - minX;
        var height = maxY - minY;
        var cellSize = Math.min(width, height);
        var h = cellSize / 2;

        // a priority queue of cells in order of their "potential" (max distance to polygon)
        var cellQueue = new Queue(null, compareMax);

        if (cellSize === 0) return [minX, minY];

        // cover polygon with initial cells
        for (var x = minX; x < maxX; x += cellSize) {
            for (var y = minY; y < maxY; y += cellSize) {
                cellQueue.push(new Cell(x + h, y + h, h, polygon));
            }
        }

        // take centroid as the first best guess
        var bestCell = getCentroidCell(polygon);

        // special case for rectangular polygons
        var bboxCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);
        if (bboxCell.d > bestCell.d) bestCell = bboxCell;

        var numProbes = cellQueue.length;

        while (cellQueue.length) {
            // pick the most promising cell from the queue
            var cell = cellQueue.pop();

            // update the best cell if we found a better one
            if (cell.d > bestCell.d) {
                bestCell = cell;
                if (debug) console.log('found best %d after %d probes', Math.round(1e4 * cell.d) / 1e4, numProbes);
            }

            // do not drill down further if there's no chance of a better solution
            if (cell.max - bestCell.d <= precision) continue;

            // split the cell into four cells
            h = cell.h / 2;
            cellQueue.push(new Cell(cell.x - h, cell.y - h, h, polygon));
            cellQueue.push(new Cell(cell.x + h, cell.y - h, h, polygon));
            cellQueue.push(new Cell(cell.x - h, cell.y + h, h, polygon));
            cellQueue.push(new Cell(cell.x + h, cell.y + h, h, polygon));
            numProbes += 4;
        }

        if (debug) {
            console.log('num probes: ' + numProbes);
            console.log('best distance: ' + bestCell.d);
        }

        return [bestCell.x, bestCell.y];
    }

    function compareMax(a, b) {
        return b.max - a.max;
    }

    function Cell(x, y, h, polygon) {
        this.x = x; // cell center x
        this.y = y; // cell center y
        this.h = h; // half the cell size
        this.d = pointToPolygonDist(x, y, polygon); // distance from cell center to polygon
        this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell
    }

// signed distance from point to polygon outline (negative if point is outside)
    function pointToPolygonDist(x, y, polygon) {
        var inside = false;
        var minDistSq = Infinity;

        for (var k = 0; k < polygon.length; k++) {
            var ring = polygon[k];

            for (var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
                var a = ring[i];
                var b = ring[j];

                if ((a[1] > y !== b[1] > y) &&
                    (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside;

                minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));
            }
        }

        return (inside ? 1 : -1) * Math.sqrt(minDistSq);
    }

// get polygon centroid
    function getCentroidCell(polygon) {
        var area = 0;
        var x = 0;
        var y = 0;
        var points = polygon[0];

        for (var i = 0, len = points.length, j = len - 1; i < len; j = i++) {
            var a = points[i];
            var b = points[j];
            var f = a[0] * b[1] - b[0] * a[1];
            x += (a[0] + b[0]) * f;
            y += (a[1] + b[1]) * f;
            area += f * 3;
        }
        if (area === 0) return new Cell(points[0][0], points[0][1], 0, polygon);
        return new Cell(x / area, y / area, 0, polygon);
    }

// get squared distance from a point to a segment
    function getSegDistSq(px, py, a, b) {

        var x = a[0];
        var y = a[1];
        var dx = b[0] - x;
        var dy = b[1] - y;

        if (dx !== 0 || dy !== 0) {

            var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = b[0];
                y = b[1];

            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = px - x;
        dy = py - y;

        return dx * dx + dy * dy;
    }


    //#######################################################
    // TinyQueue Import: https://github.com/mourner/tinyqueue/blob/master/index.js
    //

    function TinyQueue(data, compare) {
        if (!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

        this.data = data || [];
        this.length = this.data.length;
        this.compare = compare || defaultCompare;

        if (data) for (var i = Math.floor(this.length / 2); i >= 0; i--) this._down(i);
    }

    function defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    TinyQueue.prototype = {

        push: function (item) {
            this.data.push(item);
            this.length++;
            this._up(this.length - 1);
        },

        pop: function () {
            var top = this.data[0];
            this.data[0] = this.data[this.length - 1];
            this.length--;
            this.data.pop();
            this._down(0);
            return top;
        },

        peek: function () {
            return this.data[0];
        },

        _up: function (pos) {
            var data = this.data,
                compare = this.compare;

            while (pos > 0) {
                var parent = Math.floor((pos - 1) / 2);
                if (compare(data[pos], data[parent]) < 0) {
                    swap(data, parent, pos);
                    pos = parent;

                } else break;
            }
        },

        _down: function (pos) {
            var data = this.data,
                compare = this.compare,
                len = this.length;

            while (true) {
                var left = 2 * pos + 1,
                    right = left + 1,
                    min = pos;

                if (left < len && compare(data[left], data[min]) < 0) min = left;
                if (right < len && compare(data[right], data[min]) < 0) min = right;

                if (min === pos) return;

                swap(data, min, pos);
                pos = min;
            }
        }
    };

    function swap(data, i, j) {
        var tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
    }
    //This IS A DUPLICATE OF APPUI> NEEDS REfactoring [ToDo]
    //Parse time to 24 hours: http://stackoverflow.com/questions/15083548/convert-12-hour-hhmm-am-pm-to-24-hour-hhmm
    function ConvertTimeformat(format, str) {
        var time = str;
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) hours = hours + 12;
        if (AMPM == "AM" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return (sHours + "" + sMinutes);
    }

    //this is also a duplicate. Quick hack until I figure out imports
    function getDayofWeek(time){
        var $day = time.getDay();
        //return "Wednesday";
        if($day === 0){
            return "Sunday";
        }
        else if($day === 1){
            return "Monday";
        }
        else if($day === 2){
            return "Tuesday";
        }
        else if($day === 3){
            return "Wednesday";
        }
        else if($day === 4){
            return "Thursday";
        }
        else if($day === 5){
            return "Friday";
        }
        else if($day === 6){
            return "Saturday";
        }
        else {
            return null;
        }
    }
});
