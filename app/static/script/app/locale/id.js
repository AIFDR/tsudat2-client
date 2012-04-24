GeoExt.Lang.add("id", {

    "TsuDat2.prototype": {
        layersTabTitle: "Layers",
        legendTabTitle: "Legenda",
        step1Title: "Tahap 1. Membuat skenario simulasi tsunami",
        step2Title: "Tahap 2. Menentukan wilayah simulasi tsunami",
        step3Title: "Tahap 3. Menentukan parameter simulasi",
        step4Title: "Tahap 4. Pacu simulasi tsunami",
        errorTitle: "Ada yang salah!",
        errorMsg: "{0}: {1}",
        unknownErrorMsg: "Terdapat kesalahan pada server: {0} {1}",
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
        hazardPointLabel: "Koordinat Titik tinjau bahaya tsunami",
        hazardPointEmptyText: "Pilih koordinat titik tinjau bahaya tsunami dari peta",
        returnPeriodLabel: "Perioda ulang",
        waveHeightLabel: "Tinggi gelombang",
        sourceDescription: "<b>Informasi tambahan, definisikan sumber bahaya tsunami untuk simulasi.</b> Pilih dari beberapa pilihan berikut atau pilih sebuah segmen kecil dari peta",
        sourceLabel: "Sumber",
        eventGridInstructions: "Setelah skenario simulasi model tsunami ditentukan dan sebuah sumber gempa penyebab tsunami dipilih, tabel di bawah ini akan akan menyajikan kejadian-kejadian yang sesuai dengan parameter yang diinginkan",
        probabilityTooltip: "Probabilitas",
        waveHeightTooltip: "Tinggi gelombang tsunami",
        magnitudeTooltip: "Magnitudo",
        slipTooltip: "Slip",
        selectEventInstructions: "<b>Pilih salah satu dari {0} kejadian-kejadian berikut ini</b> sebagai skenario model tsunami:",
        loadingEventsMsg: "Sedang memuat kejadian-kejadian yang sesuai dengan parameter yang diinginkan...",
        hazardPointPopupTitle: "Wave Height versus Return Period",
        hazardPointInstructions: "<b>Define the scenario for the tsunami simulation.</b> First, select a hazard point from within the simulation area. Then, define the return period or wave height range."
    },

    "TsuDat2.SimulationArea.prototype": {
        simulationAreaInstructions: "<b>Define the area for the tsunami simulation.</b> Draw or upload the area over which to run the simulation, add and rank elevation data, then define the default mesh resolution.",
        simulationAreaLabel: "Simulation Area",
        simulationAreaDrawButtonText: "Draw",
        simulationAreaImportButtonText: "Import",
        meshResolutionLabel: "Mesh Resolution",
        meshFrictionLabel: "Mesh Friction",
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
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Tambahkan layer",
        addActionTip: "Tambahkan layer",
        addServerText: "Tambahkan server baru",
        untitledText: "Untitled",
        addLayerSourceErrorText: "Kesalahan mendapatkan kemampuan WMS ({msg}). \ nSilakan cek url dan coba lagi.",
        availableLayersText: "Layer tersedia",
        doneText: "Selesai",
        uploadText: "Unggah data"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Layers Bing",
        roadTitle: "Jalan Bing",
        aerialTitle: "Udara Bing",
        labeledAerialTitle: "Udara Bing dengan label"
    },    

    "gxp.plugins.FeatureEditor.prototype": {
        createFeatureActionTip: "Membuat sebuah fitur",
        editFeatureActionTip: "Edit fitur"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Tampilkan pada peta",
        firstPageTip: "Halaman pertama",
        previousPageTip: "Halaman sebelumnya",
        zoomPageExtentTip: "Zoom sampai batas halaman",
        nextPageTip: "Halaman berikut",
        nextPageTip: "Halaman terakhir"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Layers",
        roadmapAbstract: "Tampilkan peta jalan",
        satelliteAbstract: "Tampilkan citra satelit",
        hybridAbstract: "Tampilkan citra dengan nama jalan",
        terrainAbstract: "Tampilkan peta jalan dengan peta medan"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Properti layer",
        toolTip: "Properti layer"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Layer-layer",
        overlayNodeText: "Superimposisi",
        baseNodeText: "Layer dasar"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Tampilkan legend",
        tooltip: "Tampilkan legend"
    },

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Panjang",
        areaMenuText: "Luas",
        lengthTooltip: "Pengukuran panjang",
        areaTooltip: "Pengukuran luas",
        measureTooltip: "Pengukuran"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Pan peta",
        tooltip: "Pan peta"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom ke luas sebelumnya",
        nextMenuText: "Zoom ke luas setelahnya",
        previousTooltip: "Zoom ke luas sebelumnya",
        nextTooltip: "Zoom ke luas setelahnya"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap Layers",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Cetak peta",
        tooltip: "Cetak peta",
        previewText: "Preview cetak",
        notAllNotPrintableText: "Tidak semua layer dapat dicetak",
        nonePrintableText: "Tidak ada peta yang dapat dicetak"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Layers",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "Citra MapQuest"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Query",
        queryMenuText: "Queryable Layer",
        queryActionTip: "Query layer yang dipilih",
        queryByLocationText: "Query lokasi",
        currentTextText: "Sampai saat ini",
        queryByAttributesText: "Query atribut",
        queryMsg: "Querying...",
        cancelButtonText: "Batal",
        noFeaturesTitle: "Tidak sesuai",
        noFeaturesMessage: "Permintaan anda tidak berhasil."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Hapus layer",
        removeActionTip: "Hapus layer"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Get Feature Info",
        popupTitle: "Info fitur"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Memperbesar",
        zoomOutMenuText: "Memperkecil",
        zoomInTooltip: "Memperbesar",
        zoomOutTooltip: "Memperkecil"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Pembesaran maksimum",
        tooltip: "Pembesaran maksimum"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Pembesaran batas layer",
        tooltip: "Pembesaran batas layer"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Pembesaran batas layer",
        tooltip: "Pembesaran batas layer"
    },
    
    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Pembesaran pada fitur terpilih",
        tooltip: "Pembesaran pada fitur terpilih"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Simpan update?",
        closeMsg: "Fitur belum di simpan. Apakah ingin disimpan?",
        deleteMsgTitle: "Hapus Fitur?",
        deleteMsg: "Anda yakin untuk menghapus fitur ini?",
        editButtonText: "Edit",
        editButtonTooltip: "Jadikan fitur dapat diedit",
        deleteButtonText: "Hapus",
        deleteButtonTooltip: "Hapus fitur ini",
        cancelButtonText: "Batal",
        cancelButtonTooltip: "Berhenti mengedit, batalkan perubahan",
        saveButtonText: "Simpan",
        saveButtonTooltip: "Simpan Update"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Isikan warna",
        colorText: "Warna",
        opacityText: "Kepekatan"
    },
    
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["any", "all", "none", "not all"],
        preComboText: "Sesuai",
        postComboText: "of the following:",
        addConditionText: "tambahkan kondisi",
        addGroupText: "tambahkan grup",
        removeConditionText: "Hilangkan kondisi"
    },
    
    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText : "Nama",
        titleHeaderText : "Judul",
        queryableHeaderText : "Queryable",
        layerSelectionLabel: "Melihat data dari:",
        layerAdditionLabel: "atau tambahkan sebagai server baru.",
        expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>"
    },
    
    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "Lingkaran",
        graphicSquareText: "square",
        graphicTriangleText: "Segitiga",
        graphicStarText: "Bintang",
        graphicCrossText: "Silang",
        graphicXText: "x",
        graphicExternalText: "dari luar",
        urlText: "URL",
        opacityText: "Kepekatan",
        symbolText: "Simbol",
        sizeText: "Ukuran",
        rotationText: "Rotasi"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Query lokasi",
        currentTextText: "Sejauh ini",
        queryByAttributesText: "Query atribut",
        layerText: "Layer"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        labelFeaturesText: "Label Fitur",
        advancedText: "Tingkat lanjut",
        limitByScaleText: "Batasan oleh skala",
        limitByConditionText: "Batasan oleh kondisi",
        symbolText: "Simbol",
        nameText: "Nama"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        maxScaleLimitText: "Batas skala maksimum"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Label nilai",
        haloText: "Halo",
        sizeText: "Ukuran"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "Tentang Program",
        titleText: "Judul",
        nameText: "Nama",
        descriptionText: "Deskripsi",
        displayText: "Tampilan",
        opacityText: "Kecerahan",
        formatText: "Format",
        transparentText: "Transparent",
        cacheText: "Cache",
        cacheFieldText: "Menggunakan versi cached",
        stylesText: "Styles"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Peta anda siap dipublikasikan melalui web! Cukup salin HTML berikut untuk meletakkan peta dalam situs web Anda:",
        heightLabel: 'Tinggi',
        widthLabel: 'Lebar',
        mapSizeLabel: 'Ukuran peta',
        miniSizeLabel: 'Mini',
        smallSizeLabel: 'Kecil',
        premiumSizeLabel: 'Premium',
        largeSizeLabel: 'Besar'
    },
    
    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Tambah",
         addStyleTip: "Tambah style baru",
         deleteStyleText: "Hilangkan",
         deleteStyleTip: "Hapus style yang dipilih",
         editStyleText: "Edit",
         editStyleTip: "Edit style yang dipilih",
         duplicateStyleText: "Duplikat",
         duplicateStyleTip: "Duplikat style yang dipilih",
         addRuleText: "Tambah",
         addRuleTip: "Tambah Rule baru",
         deleteRuleText: "Hilangkan",
         deleteRuleTip: "Hapus Rule yang dipilih",
         editRuleText: "Edit",
         editRuleTip: "Edit ule yang dipilih",
         duplicateRuleText: "Duplikat",
         duplicateRuleTip: "Duplikat style yang dipilih",
         cancelText: "Batal",
         styleWindowTitle: "User Style: {0}",
         ruleWindowTitle: "Style Rule: {0}",
         stylesFieldsetTitle: "Styles",
         rulesFieldsetTitle: "Rules"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Judul",
        titleEmptyText: "Judul Layer",
        abstractLabel: "Deskripsi",
        abstractEmptyText: "Deskripsi Layer",
        fileLabel: "Data",
        fieldEmptyText: "Pencarian arsip data...",
        uploadText: "Pengisian",
        waitMsgText: "Mengisi Data anda...",
        invalidFileExtensionText: "Ekstensi file harus salah satu: ",
        optionsText: "Pilihan",
        workspaceLabel: "Ruang Kerja",
        workspaceEmptyText: "Ruang kerja Default",
        dataStoreLabel: "Penyimpanan",
        dataStoreEmptyText: "Penyimpanan data Default"
    }

});

