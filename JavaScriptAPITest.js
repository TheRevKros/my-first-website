
// Change server and analysis path. Preconfigured for the spotfire cloud server
var c_serverUrl = "https://spotfire-next.cloud.tibco.com/spotfire/wp/";
var c_analysisPath = "/Samples/Analyzing Stock Performance";
var app, doc;

window.onload = function()
{			
	document.documentElement.style.overflow = "hidden";
    
    createLayout();
    openApplication();	
};

var createLayout = function()
{
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0px";

    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;

    var controlDiv = document.createElement("div");
    controlDiv.id = "controlDiv";
    controlDiv.style.position = "absolute";
    controlDiv.style.backgroundColor = "silver";
    controlDiv.style.overflow = "auto";

    var appDiv = document.createElement("div");
    appDiv.id = "appDiv";
    appDiv.style.position = "absolute";

    var consoleDiv = document.createElement("div");
    consoleDiv.id = "consoleDiv";
    consoleDiv.style.position = "absolute";
    consoleDiv.style.backgroundColor = "#EEEEEE";
    consoleDiv.innerHTML = "";
    consoleDiv.style.overflow = "auto";
    consoleDiv.style.fontFamily = "Courier New";
    consoleDiv.style.fontSize = "11px";
    consoleDiv.style.padding = "2px";

    var consoleClearButton = document.createElement("button");
    consoleClearButton.id = "consoleClearButton";
    consoleClearButton.style.position = "absolute";
    consoleClearButton.innerHTML = "Clear";
    consoleClearButton.value = "Clear";
    consoleClearButton.style.width = "50px";
    consoleClearButton.onclick = function()
    {
        var consoleDiv = document.getElementById("consoleDiv");
        consoleDiv.innerHTML = "";
    };

    document.body.appendChild(controlDiv);
    document.body.appendChild(appDiv);
    document.body.appendChild(consoleDiv);
    document.body.appendChild(consoleClearButton);

    createControls();
    resize();
};

var openApplication = function()
{
    var customization = new spotfire.webPlayer.Customization();
    customization.showCustomizableHeader = false;
    customization.showTopHeader = false;
    customization.showClose = false;
    customization.showAnalysisInfo = false;
    customization.showToolBar = false;
    customization.showExportFile = false;
    customization.showExportVisualization = false;
    customization.showUndoRedo = false;
    customization.showDodPanel = false;
    customization.showFilterPanel = true;
    customization.showPageNavigation = true;
    customization.showStatusBar = false;

	app = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath, "", true);

    var onError = function(errorCode, description)
    {
        log('<span style="color: red;">[' + errorCode + "]: " + description + "</span>");
    };

    var onOpened = function(analysisDocument)
    {
        resize();
    };

    app.onError(onError);
    app.onOpened(onOpened);
    doc = app.openDocument("appDiv");
};

var CONTROL_WIDTH = 250;
var CONSOLE_HEIGHT = 300;

var resize = function()
{
    var appDiv = document.getElementById("appDiv");
    var controlDiv = document.getElementById("controlDiv");
    var consoleDiv = document.getElementById("consoleDiv");
    var consoleClearButton = document.getElementById("consoleClearButton");

    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;

    if (controlDiv != null)
    {
        controlDiv.style.width = CONTROL_WIDTH + "px";
        controlDiv.style.height = (height - CONSOLE_HEIGHT) + "px";
    }

    if (appDiv != null)
    {
        appDiv.style.left = CONTROL_WIDTH + "px";
        appDiv.style.width = (width - CONTROL_WIDTH) + "px";
        appDiv.style.height = (height - CONSOLE_HEIGHT) + "px";
    }

    if (consoleDiv != null)
    {
        consoleDiv.style.width = width + "px";
        consoleDiv.style.height = CONSOLE_HEIGHT + "px";
        consoleDiv.style.top = (height - CONSOLE_HEIGHT) + "px";
    }

    if (consoleClearButton != null)
    {
        consoleClearButton.style.top = (height - CONSOLE_HEIGHT + 5) + "px"
        consoleClearButton.style.right = "20px"
    }
};

window.onresize = function() 
{
    resize();
};

var log = function(message)
{
    var consoleDiv = document.getElementById("consoleDiv");
    message = String(message);
    message = message.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    message = message.replace(/^\s+|\s+$/g, "");
    
    consoleDiv.innerHTML = 
        '<span style="color: green;">[' + new Date() + ']</span>'
        + '<pre style="font-size: 11px; margin-left: 15px;">' + message + '</pre>'
        + "==================================================================================================="
        + "<br /><br />"
        + consoleDiv.innerHTML;
};

var createControls = function()
{
    var controlDiv = document.getElementById("controlDiv");
    
	//
	// Properties
	//
    var propertyLabel = document.createElement("span");
    propertyLabel.innerHTML = "Properties:";
	
	var propertyNameLabel = document.createElement("span");
    propertyNameLabel.innerHTML = "Name:";
	
	var propertyValueLabel = document.createElement("span");
    propertyValueLabel.innerHTML = "Value:";
    
    var propertyNameInput = document.createElement("input");
    propertyNameInput.type = "text";
	propertyNameInput.placeholder = "Property name";
    
    var propertyValueInput = document.createElement("input");
    propertyValueInput.type = "text";
	propertyValueInput.placeholder = "Property value";
    
    var setPropertyValueButton = document.createElement("button");
    setPropertyValueButton.innerHTML = "Set property value";
    setPropertyValueButton.value = "Set property";
    setPropertyValueButton.onclick = function()
    {		
        doc.setDocumentProperty(
            propertyNameInput.value,
            propertyValueInput.value);
        
        log("[spotfire.webPlayer.Document.setDocumentProperty]");
    };
    
    var setPropertyArrayButton = document.createElement("button");
    setPropertyArrayButton.innerHTML = "Set property array";
    setPropertyArrayButton.value = "Set property array";
    setPropertyArrayButton.onclick = function()
    {		
        doc.setDocumentProperty(
            propertyNameInput.value,
            propertyValueInput.value.split(',').map(function(item) {return item.trim();}));
            
        log("[spotfire.webPlayer.Document.setDocumentProperty]");
    };
	
	var onDocumentPropertyChangedButton = document.createElement("button");
    onDocumentPropertyChangedButton.innerHTML = "onDocumentPropertyChanged";
    onDocumentPropertyChangedButton.value = "onDocumentPropertyChanged";
    onDocumentPropertyChangedButton.onclick = function()
    {
        doc.onDocumentPropertyChanged(
            propertyNameInput.value,
            function(property)
            {
                log(dump(property, "spotfire.webPlayer.Data.DataTable.onDocumentPropertyChanged", 2));
            });
    };
    
    var getPropertyValueButton = document.createElement("button");
    getPropertyValueButton.innerHTML = "Get property value";
    getPropertyValueButton.value = "Get property value";
    getPropertyValueButton.onclick = function()
    {
        doc.getDocumentProperty(
            propertyNameInput.value,
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Document.getDocumentProperty", 2));
            });
    };
    
    var getAllPropertysButton = document.createElement("button");
    getAllPropertysButton.innerHTML = "Get all properties";
    getAllPropertysButton.value = "Get all properties";
    getAllPropertysButton.onclick = function()
    {
        doc.getDocumentProperties(
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Document.getDocumentProperties", 2));
            });
    };
	
	var getDocumentMetadataButton = document.createElement("button");
    getDocumentMetadataButton.innerHTML = "Get document metadata";
    getDocumentMetadataButton.value = "Get document metadata";
    getDocumentMetadataButton.onclick = function()
    {
        doc.getDocumentMetadata(
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Document.getDocumentMetadata", 2));
            });
    };
	
	controlDiv.appendChild(propertyLabel);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(propertyNameInput);
    controlDiv.appendChild(propertyValueInput);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(setPropertyValueButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(setPropertyArrayButton);	
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(getPropertyValueButton);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(onDocumentPropertyChangedButton);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(getAllPropertysButton);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(getDocumentMetadataButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(document.createElement('br'));
	

	//
	// Pages
	//		
    var pagesLabel = document.createElement("span");
    pagesLabel.innerHTML = "Pages:";
	
    var getActivePageButton = document.createElement("button");
    getActivePageButton.innerHTML = "Get active page";
    getActivePageButton.value = "Get active page";
    getActivePageButton.onclick = function()
    {
        doc.getActivePage(
            function(page)
            {
                log(dump(page, "spotfire.webplayer.Document.getActivePage", 2));
            });
    };
    
    var getAllPagesButton = document.createElement("button");
    getAllPagesButton.innerHTML = "Get all pages";
    getAllPagesButton.value = "Get all pages";
    getAllPagesButton.onclick = function()
    {
        doc.getPages(
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Document.getPages", 2));
            });
    };
	
    var pageValueInput = document.createElement("input");
    pageValueInput.type = "text";
	pageValueInput.placeholder = "Page name";
	
	var setPageValueButton = document.createElement("button");
    setPageValueButton.innerHTML = "Set active page";
    setPageValueButton.value = "Set active page";
    setPageValueButton.onclick = function()
    {		
        doc.setActivePage(
            pageValueInput.value);
        
        log("[spotfire.webPlayer.Document.setActivePage]");
    };

	var onActivePageChangedButton = document.createElement("button");
    onActivePageChangedButton.innerHTML = "onActivePageChanged";
    onActivePageChangedButton.value = "onActivePageChanged";
    onActivePageChangedButton.onclick = function()
	{
		doc.onActivePageChanged(
			function(page)
			{
				log(dump(page, "spotfire.webPlayer.Data.DataTable.onActivePageChanged", 2));
			});
		onActivePageChangedButton.disabled = true;
	}
			
	controlDiv.appendChild(pagesLabel);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(pageValueInput);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(setPageValueButton);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(getActivePageButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getAllPagesButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(onActivePageChangedButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(document.createElement('br'));
	
	
	//
	// Data
	// 
	var dataLabel = document.createElement("span");
    dataLabel.innerHTML = "Data:";
	
    var columnNameValueInput = document.createElement("input");
    columnNameValueInput.type = "text";
	columnNameValueInput.placeholder = "Column name";
	var getDataColumnButton = document.createElement("button");
    getDataColumnButton.innerHTML = "Get data column";
    getDataColumnButton.value = "Get data column";
    getDataColumnButton.onclick = function()
    {
		doc.data.getActiveDataTable(
            function(dataTable)
            {
                log(dump(dataTable, "spotfire.webPlayer.Data.getActiveDataTable", 2));
				
				dataTable.getDataColumn(columnNameValueInput.value,
					function(dataColumn)
					{
						log(dump(dataColumn, "spotfire.webPlayer.Data.DataTable.getDataColumn", 2));
						
						dataColumn.getDataColumnProperties(
							function(properties)
							{
								log(dump(properties, "spotfire.webPlayer.Data.DataColumn.getDataColumnProperties", 2));
							});
						
						dataColumn.getDistinctValues(0, 10,
							function(distinctValues)
							{
								log(dump(distinctValues, "spotfire.webPlayer.Data.DataColumn.getDistinctValues", 2));
							});
					});
			});
	};

    var getActiveDataTableButton = document.createElement("button");
    getActiveDataTableButton.innerHTML = "Get active data table";
    getActiveDataTableButton.value = "Get active data table";
    getActiveDataTableButton.onclick = function()
    {
        doc.data.getActiveDataTable(
            function(dataTable)
            {
                log(dump(dataTable, "spotfire.webPlayer.Data.getActiveDataTable", 2));
                
                dataTable.getDataColumns(function(dataColumns)
                {
                    log(dump(dataColumns, "spotfire.webPlayer.Data.DataTable.getDataColumns", 2));
                });
                
                dataTable.getDataTableProperties(function(properties)
                {
                    log(dump(properties, "spotfire.webPlayer.Data.DataTable.getDataTableProperties", 2));
                });
            });
    };
    
    var getAllDataTablesButton = document.createElement("button");
    getAllDataTablesButton.innerHTML = "Get all data tables";
    getAllDataTablesButton.value = "Get all data tables";
    getAllDataTablesButton.onclick = function()
    {
        doc.data.getDataTables(
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Data.getDataTables", 2));
            });
    };
	
	controlDiv.appendChild(dataLabel);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(columnNameValueInput);
	controlDiv.appendChild(getDataColumnButton);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(getActiveDataTableButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getAllDataTablesButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(document.createElement('br'));

	
	//
	// Marking
	//    
	var markingLabel = document.createElement("span");
    markingLabel.innerHTML = "Marking:";
	
    var markingColumnNamesInput = document.createElement("input");
    markingColumnNamesInput.type = "text";
	markingColumnNamesInput.placeholder = "Column names";
	
    var getMarkingButton = document.createElement("button");
    getMarkingButton.innerHTML = "Get marking";
    getMarkingButton.value = "Get marking";
    getMarkingButton.onclick = function()
    {
		doc.data.getActiveDataTable(
            function(dataTable)
            {
				doc.marking.getMarking(
					"Marking",
					dataTable.dataTableName,
					markingColumnNamesInput.value.split(',').map(function(item) {return item.trim();}),
					10,
					function(marking)
					{
						log(dump(marking, "spotfire.webPlayer.Marking.getMarking", 2));
					});
			});
    };
	
	var getMarkingNamesButton = document.createElement("button");
    getMarkingNamesButton.innerHTML = "Get marking names";
    getMarkingNamesButton.value = "Get marking names";
    getMarkingNamesButton.onclick = function()
    {
        doc.marking.getMarkingNames(
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Marking.getMarkingNames", 2));
            });
    };
	
    var onMarkingChangedButton = document.createElement("button");
    onMarkingChangedButton.innerHTML = "onMarkingChanged";
    onMarkingChangedButton.value = "onMarkingChanged";
    onMarkingChangedButton.onclick = function()
    {
		doc.data.getActiveDataTable(
            function(dataTable)
            {
				doc.marking.onChanged(
					"Marking",
					dataTable.dataTableName,
					markingColumnNamesInput.value.split(',').map(function(item) {return item.trim();}),
					10,
					function(marking)
					{
						log(dump(marking, "spotfire.webPlayer.Marking.onChanged", 2));
					});
			});
    };
	
	controlDiv.appendChild(markingLabel);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(markingColumnNamesInput);
    controlDiv.appendChild(getMarkingButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getMarkingNamesButton);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(onMarkingChangedButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(document.createElement('br'));	
	
	
	//
	// Filtering
	//    
	var filteringLabel = document.createElement("span");
    filteringLabel.innerHTML = "Filtering:";
	
    var filterColumnNameInput = document.createElement("input");
    filterColumnNameInput.type = "text";
	filterColumnNameInput.placeholder = "Column name";
	
	var filterValuesInput = document.createElement("input");
    filterValuesInput.type = "text";
	filterValuesInput.placeholder = "Filter values";
	
    var setFilterButton = document.createElement("button");
    setFilterButton.innerHTML = "Set filter";
    setFilterButton.value = "Set filter";
    setFilterButton.onclick = function()
    {
		doc.data.getActiveDataTable(
            function(dataTable)
			{
				var filterColumn = {
					filteringSchemeName: "Filtering scheme",
					dataTableName: dataTable.dataTableName,
					dataColumnName: filterColumnNameInput.value,
					filteringOperation: spotfire.webPlayer.filteringOperation.REPLACE,
					filterSettings: {
						includeEmpty: true,
						values: filterValuesInput.value.split(',').map(function(item) {return item.trim();})
					}
				};
				
				var filteringOperation = spotfire.webPlayer.filteringOperation.REPLACE;
				
				doc.filtering.setFilter(
					filterColumn,
					filteringOperation);
					
				log("[spotfire.webPlayer.Document.Filtering.setFilter]");
			});
    };
	
	var getFilterButton = document.createElement("button");
    getFilterButton.innerHTML = "Get filter column";
    getFilterButton.value = "Get filter column";
    getFilterButton.onclick = function()
    {
		doc.data.getActiveDataTable(
            function(dataTable)
			{
				doc.filtering.getFilterColumn(
					"Filtering scheme",
					dataTable.dataTableName,
					filterColumnNameInput.value,
					spotfire.webPlayer.includedFilterSettings.ALL_WITH_UNCHECKED_HIERARCHY_NODES,
					function(filterColumn)
					{
						log(dump(filterColumn, "spotfire.webPlayer.Filtering.getFilterColumn", 2));
					});
			});
    };
    
    var getActiveFilteringSchemeButton = document.createElement("button");
    getActiveFilteringSchemeButton.innerHTML = "Get active filtering scheme";
    getActiveFilteringSchemeButton.value = "Get active filtering scheme";
    getActiveFilteringSchemeButton.onclick = function()
    {
        doc.filtering.getActiveFilteringScheme(
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Filtering.getActiveFilteringScheme", 2));
                
                args.getDefaultFilterColumns(
                    spotfire.webplayer.includedFilterSettings.ALL_WITH_UNCHECKED_HIERARCHY_NODES,
                    function(args2)
                    {
                        log(dump(args2, "spotfire.webPlayer.Document.FilteringScheme.getDefaultFilterColumns", 2));
                    });
            });
    };
        
    var getFilteringSchemesButton = document.createElement("button");
    getFilteringSchemesButton.innerHTML = "Get filtering schemes";
    getFilteringSchemesButton.value = "Get filtering schemes";
    getFilteringSchemesButton.onclick = function()
    {
		doc.data.getActiveDataTable(
            function(dataTable)
            {		
				doc.filtering.getFilteringSchemes(
					function(filteringSchemes)
					{
						log(dump(filteringSchemes, "spotfire.webPlayer.Filtering.getFilteringSchemes", 2));
						
						filteringSchemes[0].getFilterColumns(
							dataTable.dataTableName,
							spotfire.webPlayer.includedFilterSettings.ALL_WITH_CHECKED_HIERARCHY_NODES,
							function(filterColumns)
							{
								log(dump(filterColumns, "spotfire.webPlayer.Filtering.FilteringScheme.getFilterColumns", 2));
							});
					});
			});
    };
    
    var getModifiedFilterColumnsButton = document.createElement("button");
    getModifiedFilterColumnsButton.innerHTML = "Get modified filter columns";
    getModifiedFilterColumnsButton.value = "Get modified filter columns";
    getModifiedFilterColumnsButton.onclick = function()
    {
        doc.filtering.getModifiedFilterColumns(
            "Filtering scheme",
            spotfire.webPlayer.includedFilterSettings.ALL_WITH_CHECKED_HIERARCHY_NODES,
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Filtering.getModifiedFilterColumns", 2));
            });
    };
	
	var resetAllFiltersButton = document.createElement("button");
    resetAllFiltersButton.innerHTML = "Reset all filters";
    resetAllFiltersButton.value = "Reset all filters";
    resetAllFiltersButton.onclick = function()
    {
        doc.filtering.resetAllFilters();

        log("[spotfire.webPlayer.Document.Filtering.resetAllFilters]");

    };
	
	controlDiv.appendChild(filteringLabel);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(filterColumnNameInput);
    controlDiv.appendChild(filterValuesInput);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(setFilterButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getFilterButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getActiveFilteringSchemeButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getFilteringSchemesButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getModifiedFilterColumnsButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(resetAllFiltersButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(document.createElement('br'));
	
	
	//
	// Bookmarks
	//
	var bookmarksLabel = document.createElement("span");
    bookmarksLabel.innerHTML = "Bookmarks:";	
	
    var bookmarkValueInput = document.createElement("input");
    bookmarkValueInput.type = "text";
	bookmarkValueInput.placeholder = "Bookmark name";
	
	var applyBookmarkButton = document.createElement("button");
    applyBookmarkButton.innerHTML = "Apply bookmark";
    applyBookmarkButton.value = "Apply bookmark";
    applyBookmarkButton.onclick = function()
    {
        doc.applyBookmark(
            bookmarkValueInput.value);
        
        log("[spotfire.webPlayer.Document.applyBookmark]");
    };
	
	var getBookmarksButton = document.createElement("button");
    getBookmarksButton.innerHTML = "Get bookmarks";
    getBookmarksButton.value = "Get bookmarks";
    getBookmarksButton.onclick = function()
    {
        doc.getBookmarkNames(
            function(args)
            {
                log(dump(args, "spotfire.webPlayer.Document.getBookmarkNames", 2));
            });
    };
	
	controlDiv.appendChild(bookmarksLabel);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(bookmarkValueInput);
    controlDiv.appendChild(document.createElement('br'));
	controlDiv.appendChild(applyBookmarkButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(getBookmarksButton);
    controlDiv.appendChild(document.createElement('br'));
    controlDiv.appendChild(document.createElement('br'));     
};


var MAX_DUMP_DEPTH = 10;
var dump = function(obj, name, indent, depth)
{
	if (depth > MAX_DUMP_DEPTH)
	{
		return indent + name + ": <Maximum Depth Reached>\n";
	}

	if (typeof(obj) == "object")
	{
		var child = null;
		var output = '<span style="color: gray;">' + "[" + name + "]</span>\n";
		indent += "\t";

		for (var item in obj)
		{
			 try
			 {
		        if (item.charAt(0) == '_') 
		        {
		            continue;
		        }
			    child = obj[item];
			}
			catch (e)
			{
				child = "<Unable to Evaluate>";
			}
			
			if (typeof child == "object")
			{
				output += dump(child, item, indent, depth + 1);
			}
			else if (typeof(child) == "function")
			{
			    var functionName = String(child);
			    functionName = functionName.substring(0, functionName.indexOf("{", 0) - 1);
			    output += "\t" + item + ": " + functionName + "\n";
			}
			else
			{
			    var value = "";
			    if (child == null) 
			    {
			        value = "[null]";
			    }
			    else
			    {
			        value = child;
			    }
			    
				output += "\t" + item + ": " + value + "\n";
			}
		}

		return output + "\n";
	}
	else
	{
		return obj;
	}
}