/**
 * @require GeoExt/Lang.js
 */
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
        aboutText: "Tentang TsuDat",
        homeText: "Beranda TsuDAT",
        loginText: "masuk",
        logoutText: "Keluar",
        defaultGroupTitle: "Tampilan (optional)",
        demGroupTitle: "Model-model ketinggian (dibutuhkan)",
        backgroundGroupTitle: "Lapisan dasar",
        loginWaitMsg: "Sedang proses untuk masuk...",
        loginTitle: "Masuk ke GeoNode",
        usernameLabel: "Nama pengguna",
        passwordLabel: "Kata sandi"
    },

    "TsuDat2.GenerateSimulation.prototype": {
        scenarioNameLabel: "Nama skenario",
        areaResolutionInstructions: "<b>Pilih wilayah simulasi dan resolusi </b> dimana hasil simulasi akan disimpan?",
        simulationAreaLabel: "Wilayah simulasi",
        areaOfInterestLabel: "Wilayah yang diinginkan",
        rasterResolutionLabel: "resolusi gambar",
        chooseLayersInstructions: "<b>Choose layers to create from the simulation:</b>",
        depthLabel: "Kedalaman aliran air di darat (m)",
        stageLabel: "Tahap, tinggi muka air diatas tinggi rata-rata air laut (MSL) (m)",
        velocityLabel: "Kecepatan aliran air (m/s)",
        gaugePointsInstructions: "<b>tidak wajib, tentukan titik tinjau</b> titik tinjau ini digunakan untuk membuat time series tinggi gelombang tsunami terhadap waktu",
        addGaugePointLabel: "Add gauge point",
        gaugePointNameHeader: "Nama",
        gaugePointElevationHeader: "Ketinggian",
        gaugePointUnitHeader: "Unit",
        gaugePointRemoveActionTooltip: "Hapus titik tinjau",
        saveSimulationText: "Simpan simulasi",
        generateSimulationText: "<b>Pacu Simulasi...</b>",
        generateSimulationConfirmationTitle: "Pacu simulasi",
        generateSimulationConfirmationText: "Memastikan bahwa Anda akan menjalankan simulasi ini. Catatan, simulasi ini membutuhkan waktu, dan jika simulasi sudah selesai, Anda akan diberitahu melalui e-mail.",
        savedTitle: "Simpan skenario simulasi",
        savedMsg: "Skenario simulasi {0} berhasil disimpan.",
        queuedTitle: "Skenario yang belum diproses",
        queuedMsg: "Skenario {0} yang menunggu untuk diproses"
    },

    "TsuDat2.LayerUploadPanel.prototype": {
        baseFileEmptyText: "Pilih sebuah berkas layer",
        baseFileLabel: "Data",
        titleLabel: "Judul",
        sldEmptyText: "Pilih satu berkas (file) .sld (optional)",
        sldLabel: "SLD",
        abstractLabel: "Abstrak",
        dbfEmptyText: "Pilih satu berkas (file) .dbf",
        dbfLabel: "DBF",
        dbfInvalidText: "Berkas DBF tidak sesuai",
        shxEmptyText: "Pilih satu berkas (file) .shx",
        shxLabel: "SHX",
        shxInvalidText: "Berkas SHX tidak sesuai",
        prjEmptyText: "Pilih satu berkas (file) .prj (optional)",
        prjLabel: "PRJ",
        prjInvalidText: "Berkas PRJ tidak sesuai",
        uploadButtonText: "Mengunggah",
        waitMsg: "Sedang mengunggah data Anda...",
        errorTitle: "Ada yang salah",
        permissionsText: "Izin"
    },

    "TsuDat2.Scenario.prototype": {
        hazardPointLabel: "Koordinat Titik tinjau bahaya tsunami",
        hazardPointEmptyText: "Pilih koordinat titik tinjau bahaya tsunami dari peta",
        returnPeriodLabel: "Perioda ulang",
        waveHeightLabel: "Tinggi gelombang",
        sourceInstructions: "<b>Informasi tambahan, definisikan sumber bahaya tsunami untuk simulasi.</b> Pilih dari beberapa pilihan berikut atau pilih sebuah segmen kecil dari peta",
        sourceLabel: "Sumber",
        eventGridInstructions: "Setelah skenario simulasi model tsunami ditentukan dan sebuah sumber gempa penyebab tsunami dipilih, tabel di bawah ini akan akan menyajikan kejadian-kejadian yang sesuai dengan parameter yang diinginkan",
        probabilityTooltip: "Probabilitas",
        waveHeightTooltip: "Tinggi gelombang tsunami",
        magnitudeTooltip: "Magnitudo",
        slipTooltip: "Slip",
        selectEventInstructions: "<b>Pilih salah satu dari {0} kejadian-kejadian berikut ini</b> sebagai skenario model tsunami:",
        loadingEventsMsg: "Sedang memuat kejadian-kejadian yang sesuai dengan parameter yang diinginkan...",
        hazardPointPopupTitle: "Tinggi gelombang VS Perioda Ulanga",
        hazardPointInstructions: "<b>tentukan skenario simulasi tsunami.</b> Pertama, pilih satu titik tinjau bahaya (hazard point) pada area simulasi. Kemudian, tentukan perioda ulang atau rentang nilai tinggi gelombang."
    },

    "TsuDat2.SimulationArea.prototype": {
        simulationAreaDownloadButtonText: "Download Tsunami Waveform Data",
        simulationAreaInstructions: "<b>Menentukan wilayah simulasi tsunami.</b> Menggambar atau mengunggah wilayah yang akan disimulasikan, menambah dan menentuikan rangking data elevasi, kemudian menentukan resolusi (mesh)/grid/data batimetri standard.",
        simulationAreaLabel: "Wilayah Simulasi",
        simulationAreaDrawButtonText: "Gambar",
        simulationAreaImportButtonText: "Memasukkan",
        meshResolutionLabel: "Resolusi (mesh)/grid/data batimetri",
        meshFrictionLabel: "Gesekan mesh",
        elevationDataLabel: "Data elevasi",
        elevationDataAddButtonText: "Menambahkan data",
        elevationDataInstructions: "<b> Data elevasi merupakan kunci untuk melakukan simulasi model tsunami.</b> Pilih data elevasi yang akan digunakan untuk simulasi. Kemudian, urutkan data elevasi dari resolusi tertinggi ke resolusi terendah (berdasarkan resolusi spasial, kualitas dan tanggal) dengan cara menaruh data pada panel di sebelah kiri.",
        internalPolygonsInstructions: "<b>Tidak wajib (Optional), buat poligon-poligon internal</b> untuk area yang diinginkan atau tentukan wilayah dengan resolusi mesh yang berbeda atau nilai mesh frictions.",
        internalPolygonsDrawButtonText: "Gambar",
        internalPolygonsImportButtonText: "Memasukkan",
        internalPolygonsGridTypeHeader: "Tipe",
        internalPolygonsGridValueHeader: "Nilai",
        internalPolygonsRemoveActionTooltip: "Hapus poligon internal",
        importTitle: "Memasukkan sebuah {0}",
        importInstructions: "<b>Pilih satu dari {0} format csv yang akan diunggah.</b> Jika koordinat tidak dalam bentuk lintang dan bujur sesuai standard WGS84, juga menyediakan sistem koordinati referensi (CRS), contoh sistem EPSG.",
        importProgress: "Mengunggah {0} Anda",
        importErrorTitle: "Ada yg salah",
        importErrorMsg: "{0}: {1}",
        uploadButtonText: "Mengunggah",
        uploadFileLabel: "Berkas CSV",
        uploadCrsLabel: "CRS",
        deleteButtonText: "Hapus",
        uploadText: "Mengunggah",
        orText: "atau",
        aText: "sebuah"
    },

    "TsuDat2.SimulationParameters.prototype": { 
        defineParametersInstructions: "<b>Menentukan parameter-parameter simulasi.</b> Parameter ini termasuk pasang surut, durasi waktu simulasi, dll.",
        tideLabel: "Pasang Surut",
        startTimeLabel: "Waktu mulai",
        endTimeLabel: "Waktu berakhir",
        smoothingLabel: "Penghalusan",
        modelSetupLabel: "Pengaturan Model",
        trialLabel: "Uji coba",
        finalLabel: "Terakhir",
        secondsText: "Detik"
    },

    "TsuDat2.plugins.Language.prototype": {
        emptyText: "Pilih Bahasa"
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

