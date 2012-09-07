/**
 * @require GeoExt/Lang.js
 */
GeoExt.Lang.add("en", {

    "TsuDat2.prototype": {
        layersTabTitle: "Layers",
        legendTabTitle: "Legend",
        step1Title: "Step 1. Tsunami Scenario",
        step2Title: "Step 2. Tsunami Simulation Area",
        step3Title: "Step 3. Simulation Parameters",
        step4Title: "Step 4. Generate Tsunami Simulation",
        errorTitle: "Error",
        errorMsg: "{0}: {1}",
        unknownErrorMsg: "The server returned an error: {0} {1}",
        aboutText: "About TsuDAT Simulator", 
        homeText: "TsuDAT Home",
        loginText: "Login",
        logoutText: "Logout",
        defaultGroupTitle: "Overlays (optional)",
        demGroupTitle: "Elevation Models (required)",
        backgroundGroupTitle: "Base Layers",
        loginWaitMsg: "Logging in...",
        loginTitle: "GeoNode Login",
        usernameLabel: "Username",
        passwordLabel: "Password"
    },

    "TsuDat2.GenerateSimulation.prototype": {
        scenarioNameLabel: "Scenario Name",
        areaResolutionInstructions: "<b>Choose the area and resolution</b> over which to export the results.",
        simulationAreaLabel: "Simulation Area",
        areaOfInterestLabel: "Area of Interest",
        rasterResolutionLabel: "Raster resolution",
        chooseLayersInstructions: "<b>Choose layers to create from the simulation:</b>",
        depthLabel: "Flow depth of water onland (m)",
        stageLabel: "Stage, height of the water above MSL (m)",
        velocityLabel: "Velocity of the water (m/s)",
        gaugePointsInstructions: "<b>Optionally, draw gauge points</b> to create time series showing wave heights of the tsunami over the time of the simulation.",
        addGaugePointLabel: "Add gauge point",
        gaugePointNameHeader: "Name",
        gaugePointElevationHeader: "Elevation",
        gaugePointUnitHeader: "Unit",
        gaugePointRemoveActionTooltip: "Remove gauge point",
        saveSimulationText: "Save Simulation",
        generateSimulationText: "<b>Run Simulation...</b>",
        generateSimulationConfirmationTitle: "Run Simulation",
        generateSimulationConfirmationText: "Confirm that you want to run this simulation. Note that the simulation may take a while, and you will be notified by email when it is finished.",
        savedTitle: "Scenario Saved",
        savedMsg: "Scenario {0} saved successfully.",
        queuedTitle: "Scenario Queued",
        queuedMsg: "Scenario {0} queued for processing."
    },

    "TsuDat2.LayerUploadPanel.prototype": {
        baseFileEmptyText: "Select a layer data file",
        baseFileLabel: "Data",
        titleLabel: "Title",
        sldEmptyText: "Select a .sld style file (optional)",
        sldLabel: "SLD",
        abstractLabel: "Abstract",
        dbfEmptyText: "Select a .dbf data file",
        dbfLabel: "DBF",
        dbfInvalidText: "Invalid DBF File.",
        shxEmptyText: "Select a .shx data file",
        shxLabel: "SHX",
        shxInvalidText: "Invalid SHX File.",
        prjEmptyText: "Select a .prj data file (optional)",
        prjLabel: "PRJ",
        prjInvalidText: "Invalid PRJ File.",
        uploadButtonText: "Upload",
        waitMsg: "Uploading your data...",
        errorTitle: "Error",
        permissionsText: "Permissions"
    },
    
    "TsuDat2.Scenario.prototype": {
        hazardPointLabel: "Hazard Point",
        hazardPointEmptyText: "Select from map",
        returnPeriodLabel: "Return Period",
        waveHeightLabel: "Wave Height",
        sourceInstructions: "<b>Additionally, define the hazard source for the tsunami simulation.</b> Choose from the options below or select a sub-fault from the map.",
        sourceLabel: "Source",
        eventGridInstructions: "Once the tsunami scenario has been defined and a hazard source selected, a table below will be populated with the events valid for this set of parameters.",
        probabilityTooltip: "Probability",
        waveHeightTooltip: "Wave Height",
        magnitudeTooltip: "Magnitude",
        slipTooltip: "Slip",
        selectEventInstructions: "<b>Select one of the {0} events</b> for the tsunami scenario:",
        loadingEventsMsg: "Loading the events valid for this set of parameters...",
        hazardPointPopupTitle: "Wave Height versus Return Period",
        hazardPointInstructions: "<b>Define the scenario for the tsunami simulation.</b> First, select a hazard point from within the simulation area. Then, define the return period or wave height range."
    },

    "TsuDat2.SimulationArea.prototype": {
        simulationAreaDownloadButtonText: "Download Tsunami Waveform Data",
        simulationAreaInstructions: "<b>Define the area for the tsunami simulation.</b> Draw or upload the area over which to run the simulation, add and rank elevation data, then define the default mesh resolution.",
        simulationAreaLabel: "Simulation Area",
        simulationAreaDrawButtonText: "Draw",
        simulationAreaImportButtonText: "Import",
        meshResolutionLabel: "Simulation Area Mesh Resolution",
        meshFrictionLabel: "Simulation Area Mesh Friction",
        elevationDataLabel: "Elevation Data",
        elevationDataAddButtonText: "Add data",
        elevationDataInstructions: "<b>Elevation data is the key input to generating a tsunami simulation.</b> Choose what elevation data will be used in the simulation. Then, order from highest quality to lowest (based on spatial resolution, quality and date) by dragging and dropping in layer pane on the left.",
        internalPolygonsInstructions: "<b>Optionally, create internal polygons</b> for areas of interest or to define areas with different mesh resolutions or mesh frictions.",
        internalPolygonsDrawButtonText: "Draw",
        internalPolygonsImportButtonText: "Import",
        internalPolygonsGridTypeHeader: "Type",
        internalPolygonsGridValueHeader: "Value",
        internalPolygonsRemoveActionTooltip: "Remove the internal polygon",
        importTitle: "Import a {0}",
        importInstructions: "<b>Select a {0} in csv format for uploading.</b> If the coordinates are not latitudes and longitudes in WGS84, also provide the appropriate coordinate reference system (CRS), e.g. an EPSG code.",
        importProgress: "Uploading your {0}",
        importErrorTitle: "Error",
        importErrorMsg: "{0}: {1}",
        uploadButtonText: "Upload",
        uploadFileLabel: "CSV file",
        uploadCrsLabel: "CRS",
        deleteButtonText: "Delete",
        uploadText: "Upload",
        orText: "or",
        aText: "a"
    },

    "TsuDat2.SimulationParameters.prototype": {
        defineParametersInstructions: "<b>Define parameters for the simulation.</b> These include tide, duration, etc.",
        tideLabel: "Tide",
        startTimeLabel: "Start time",
        endTimeLabel: "End time",
        smoothingLabel: "Smoothing",
        modelSetupLabel: "Model Setup",
        trialLabel: "Trial",
        finalLabel: "Final",
        secondsText: "seconds"
    },

    "TsuDat2.plugins.Language.prototype": {
        emptyText: "Select language"
    }

});
