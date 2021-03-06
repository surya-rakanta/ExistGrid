﻿/*! ExistGrid UI - v1.0.0 - 2017-03-24
*
* Extension to the SpreadJS spreadsheet by using custom tag
* 
* MIT License
*
*/

(function(window, $)
{

 var const_undefined = "undefined";
 var Lontar = window.Lontar;

 if (typeof Lontar === const_undefined)
  Lontar = window.Lontar = { Version: "1.0.0" };

 if (typeof Lontar.UI === const_undefined)
  Lontar.UI = {};
 var UI = Lontar.UI;

 UI.ExistGrid = function (host, elem, isParent) {
  this._init(host, elem, isParent);
 };

 //container for sheet
 UI.ExistGrid.prototype = new GrapeCity.UI.GcSpread;

 UI.EnterCellHandler = function (target, data) {
  var sheet = data.sheet;
  sheet.setHiddenTextArea(data.row, data.col);
 }

 UI.ClipboardPastingHandler = function (target, data) {

  var sheet = data.sheet;
  var oGrid = data.sheet._existgrid;
  nLastRow = sheet.getRowCount();
  var nI;

  var nRowsToAdd = data.cellRange.row + data.cellRange.rowCount - sheet.getRowCount();
  if (nRowsToAdd > 0) {
   for (nI = 1; nI <= nRowsToAdd; nI++) {
    oGrid.addRow();
   }
  }

 }

 //Universal sheet cell click handler
 UI.CellClickHandler = function (target, data) {

  var sheetArea = data.sheetArea;
  if (sheetArea != GrapeCity.UI.SheetArea.viewport) return;

  var row = data.row;
  var col = data.col;
  var sheet = data.sheet;

  var oCell = sheet.getCell(row, col);
  var oType = sheet._getCellType(row, col, sheetArea);
  var sType = oType.type;
  var vVal;
  var sValues;

  switch (sType) {

   case "CHECKBOX":
    vVal = oCell.text();
    sValues = oType.values;
    var checkedValue = sValues.split(",")[0].split(":")[1];
    var uncheckedValue = sValues.split(",")[1].split(":")[1];

    if (vVal == checkedValue) {
     oCell.value(uncheckedValue);
    } else {
     oCell.value(checkedValue);
    }
    break;

   case "IMAGE":
    var sFunction = oType.oncellclick;
    var oFunc = eval(sFunction);
    oFunc(data.currentTarget);
    break;

  } //switch

 }

 UI.EditEndHandler = function (target, data) {

  var col = data.col;
  var sheet = data.sheet;
  var oColInfo = sheet.findColumnInfo(col);
  var lSelectCalled = false;

  if (oColInfo != null) {
   var sType = oColInfo.type;
   if (sType == "LOOKUP") {
    var oLookup = $(sheet._textBox).data("ui-autocomplete");
    if (oLookup.menu.active) {
     oLookup.menu.select(null);
     lSelectCalled = true;
    }
   }

   sValidate = oColInfo.onvalidate;
   if ((sValidate != "")&&!lSelectCalled) {
    var oFunc = eval(sValidate);
    oFunc();
   }

  }

 }

 //Universal sheet edit starting handler
 UI.EditStartingHandler = function (target, data) {

  var col = data.col;
  var sheet = data.sheet;
  var oColInfo = sheet.findColumnInfo(col);

  if (oColInfo != null) {
   var sDisabled = oColInfo.celldisabled;
   var sType = oColInfo.type;

   if (sDisabled == "Y") data.cancel = true;
   if (sType == "IMAGE") data.cancel = true;

   var sMaxLen = oColInfo.maxlength;
   $(sheet._textBox).attr("maxlength", sMaxLen);

   if (sType == "LOOKUP") {

    var sSource = oColInfo.source;
    var sSelect = oColInfo.select;

    if ((sSource != "") && (sSelect != "")) {

     $(sheet._textBox).focus();
     $(sheet._textBox).autocomplete({
      source: function (request, response) {
       var oFunc = eval(sSource);
       oFunc(request, response);
      },
      select: function (e, i) {
       var oFunc = eval(sSelect);
       oFunc(e, i);
      },
      minLength: 1
     });


    }

   }

  }

 }

 /*
 * Utility -------------------------------------------------------
 */


 function Utility() { };

 Utility.getCheckBoxImage = function (sheet, lValue, callback) {

  var sChecked = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAIAAAAmzuBxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAgUlEQVR42oXPMQrCcAzF4d97uZAIQnHwDA4OHtPFxUNIKYJduvQC0hs4hP5brNoMGfKF8KK+7wBAclZE2JHdtlc4N77y5rLNmX8xMJ2xvb8dPhiwrTwQEcDuWs25PT8ntiOnSy47UR/vjDVnSS6PPU7NkiVpGF5j3CjRCmfefwy8AX8XGy5GqquoAAAAAElFTkSuQmCC";
  var sUnChecked = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAIAAAAmzuBxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQUlEQVR42rXQIRLAQAxCUfjk/ter2cOsaGwTVQTmzSDwOY8kSXSSVJKqSgJhYWDh7t+ZhXvhm22Y2TYzv19MLOkCNVQF1tUol10AAAAASUVORK5CYII=";

  if (sheet.imgChecked == null) {

   var myPromise1 =
    new Promise(function (resolve, reject) {
     var img = new Image();
     img.onload = function () {
      resolve(this);
     }
     img.src = sChecked;
    });

   var myPromise2 =
    new Promise(function (resolve, reject) {
     var img = new Image();
     img.onload = function () {
      resolve(this);
     }
     img.src = sUnChecked;
    });

   Promise.all([myPromise1, myPromise2]).then(function (results) {
    sheet.imgChecked = results[0];
    sheet.imgUnChecked = results[1];
    if (lValue) callback.call(null, sheet.imgChecked);
    else callback.call(null, sheet.imgUnChecked);
   }).catch(function (err) {
    console.log('Catch: ', err);
   });


  } else {
   if (lValue) callback.call(null, sheet.imgChecked);
   else callback.call(null, sheet.imgUnChecked);
  }

 }

 UI._Utility = Utility;

 /*
 * CHECKBOX -------------------------------------------------------
 */

 function CheckBoxCellType() { }

 CheckBoxCellType.prototype = new GrapeCity.UI._BaseCellType;

 CheckBoxCellType.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
  if (!ctx)
   return;
  ctx.save();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.beginPath();
  if (style && style.backColor) {
   ctx.fillStyle = style.backColor;
   ctx.fillRect(x, y, w, h)
  }
  else if (!GrapeCity.UI._useDoubleBuffer())
   if (style && options.visualState === GrapeCity.UI.VisualState.Selected) {
    ctx.fillStyle = "#9fa9c5";
    ctx.fillRect(x, y, w, h)
   }
   else if (style && options.visualState === GrapeCity.UI.VisualState.Active) {
    ctx.fillStyle = "#9fafc5";
    ctx.fillRect(x, y, w, h)
   }
  try {
   if (style && style.backgroundImage && style.backgroundImage !== "none")
    ctx.drawImage(style.backgroundImage, x, y, w, h)
  }
  catch (ex) { }

  if (options.sparkline)
   options.sparkline.paintSparkline(ctx, x, y, w, h);
  if (!options.cellOverflowLayout)
   this.paintValue(ctx, value, x, y, w, h, style, options);
  ctx.restore()
 };

 CheckBoxCellType.prototype.paintValue = function (ctx, value, x, y, w, h, style, options) {

  if (!ctx)
   return;
  ctx.save();

  if (options.cellOverflowLayout) {
   var layout = options.cellOverflowLayout.layout;
   if (layout) {
    ctx.rect(layout.x, layout.y, layout.width, layout.height);
    ctx.clip();
    ctx.beginPath()
   }
  }

  var conditionalForeColor = { value: null };

  var text = this.format(value, style.formatter ? style.formatter : style._autoFormatter, conditionalForeColor);

  if (text !== undefined && text !== null && text.length > 0) {

   var sValues = this.values;
   var checkedValue = sValues.split(",")[0].split(":")[0];

   var lValue = (checkedValue == value);
   var sheet = this._sheet;

   Lontar.UI._Utility.getCheckBoxImage(sheet, lValue,
    function (oParent, oImg) {

     ctx.fillStyle = "#ffffff";
     ctx.fillRect(x + 1, y + 1, w - 2, h - 2);

     if (style.foreColor)
      ctx.fillStyle = style.foreColor;
     if (conditionalForeColor.value)
      ctx.fillStyle = conditionalForeColor.value;
     if (style.font)
      ctx.font = style.font;

     var indent = 0;
     if (style.textIndent > 0)
      indent = style.textIndent * 8;

     var adjX = 20;
     adjX += indent;
     ctx.textAlign = "left";

     var adjY = 2;
     ctx.textBaseline = "top";
     ctx.fillText(text, x + adjX, y + adjY);

     ctx.lineWidth = 1;
     ctx.strokeStyle = "#1c5180";
     ctx.strokeRect(x + 3, y + 3, 12, 12);

     ctx.drawImage(oImg, x + 3, y + 3, oImg.width, oImg.height);


    }.bind(null, this)
   );

  }

  ctx.restore();
  //var dt = ctx.canvas.toDataURL();
  //$("#myImg")[0].src = dt;


 };

 UI._CheckBoxCellType = CheckBoxCellType;

 /*
 * IMAGE -------------------------------------------------------
 */

 function ImageCellType() { }

 ImageCellType.prototype = new GrapeCity.UI._BaseCellType;

 ImageCellType.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
  if (!ctx)
   return;
  ctx.save();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.beginPath();
  if (style && style.backColor) {
   ctx.fillStyle = style.backColor;
   ctx.fillRect(x, y, w, h)
  }
  else if (!GrapeCity.UI._useDoubleBuffer())
   if (style && options.visualState === GrapeCity.UI.VisualState.Selected) {
    ctx.fillStyle = "#9fa9c5";
    ctx.fillRect(x, y, w, h)
   }
   else if (style && options.visualState === GrapeCity.UI.VisualState.Active) {
    ctx.fillStyle = "#9fafc5";
    ctx.fillRect(x, y, w, h)
   }
  try {
   if (style && style.backgroundImage && style.backgroundImage !== "none")
    ctx.drawImage(style.backgroundImage, x, y, w, h)
  }
  catch (ex) { }

  if (options.sparkline)
   options.sparkline.paintSparkline(ctx, x, y, w, h);
  if (!options.cellOverflowLayout)
   this.paintValue(ctx, value, x, y, w, h, style, options);
  ctx.restore()
 };

 ImageCellType.prototype.paintValue = function (ctx, value, x, y, w, h, style, options) {

  if (!ctx)
   return;
  ctx.save();

  if (options.cellOverflowLayout) {
   var layout = options.cellOverflowLayout.layout;
   if (layout) {
    ctx.rect(layout.x, layout.y, layout.width, layout.height);
    ctx.clip();
    ctx.beginPath()
   }
  }

  var conditionalForeColor = { value: null };

  var myPromise;

  myPromise = this._promise;
  myPromise.then(function (oObj) {
   var oImg = oObj.imgData;
   ctx.drawImage(oImg, x + 3, y + 3, oImg.width, oImg.height);
   //console.log("not null now", oObj.imageurl);
  }).fail(function (err) {
   console.log('failed: ', err);
  });

  ctx.restore();

 };

 UI._ImageCellType = ImageCellType;

 //the actual sheet
 UI.ExistSheet = function (name, host) {
  this._init(name, host);
 };

 UI.ExistSheet.prototype = new GrapeCity.UI.GcSheet;

 UI.ExistSheet.prototype._setCellType = function (col, oObj) {
  this._colInfos[col].cellType = oObj;
 }

 UI.ExistGrid.prototype._init = function (host, elem, isParent) {

  if (isParent) {
   GrapeCity.UI.GcSpread.prototype._init(host, elem);
   return;
  }

  var sWidth = host.getAttribute("width");
  var sHeight = host.getAttribute("height");
  var sId = host.getAttribute("id");

  this._id = sId;
  this._width = parseInt(sWidth);
  this._height = parseInt(sHeight);
  this._host = host;
  this._elem = elem;

  var sDiv = '<div id="dv' + sId + '" style="width:' + sWidth + 'px; height:' + sHeight + 'px;">';
  elem.append(sDiv);

  var oDiv = document.getElementById("dv" + sId);

  var ss = new Lontar.UI.ExistGrid(this._id, 0, true);

  ss.useWijmoTheme = true;

  this._grid = ss;

  ss._setHost(oDiv);
  ss.tabStripVisible(false);

  this.drawHeader();
  this.setColumnWidths();

 }

 UI.ExistGrid.prototype.getSheet = function () {
  return this.sheet;
 }

 UI.ExistSheet.prototype.findColumnInfo = function (col) {

  var nCol = col + 1;
  var nColX;
  var oObj = null;

  var oColInfo = this.arColInfo;

  for (var name in oColInfo) {
   if (oColInfo.hasOwnProperty(name)) {
    nColX = oColInfo[name].col;
    if (nColX == nCol) {
     oObj = oColInfo[name];
     break;
    }
   }

  }

  return oObj;

 }

 UI.ExistSheet.prototype.setHiddenTextArea = function (nRow, nCol) {

  var row;
  if (nRow != null) {
   row = nRow;
  } else {
   row = this._activeRowIndex;
  }

  var col;
  if (nCol != null) {
   col = nCol;
  } else {
   col = this._activeColIndex;
  }

  var crect = this.getCellRect(row, col);
  var oDiv;
  var oTextArea, oTextArea1;
  var offset = this._eventHandler._getCanvasOffset();
  var nTop, nLeft;

  nTop = crect.y + offset.top - 2;
  nLeft = crect.x + offset.left - 2;

  if (typeof this._hiddenObjHolder == "undefined") {

   oDiv = document.createElement("div");
   $(oDiv).css("position", "absolute").css("overflow", "hidden").css("width", '0px').css("height", '0px');
   $(oDiv).css("top", nTop).css("left", nLeft);
   this._hiddenObjHolder = oDiv;
   document.body.insertBefore(oDiv, null);

   oTextArea = document.createElement("textarea");
   $(oTextArea).attr("gcUIElement", "gcSheetFocusInput").css("position", "absolute").css("overflow", "hidden").css("border", "none").css("resize", "none");

   oTextArea1 = document.createElement("textarea");
   $(oTextArea1).attr("gcUIElement", "gcSheetFocusInput").attr("readonly", "readonly").css("position", "absolute").css("overflow", "hidden");

   oDiv.insertBefore(oTextArea, null);
   //oDiv.insertBefore(oTextArea1, null);
   this._hiddenTextArea = oTextArea;

  } else {
   oDiv = this._hiddenObjHolder;
   oTextArea = this._hiddenTextArea;
   $(oDiv).css("top", nTop).css("left", nLeft);
  }

 }

 UI.ExistSheet.prototype.findFieldInfo = function (sFieldName) {

  var sFieldNameX, sFieldNameY;
  var oObj = null;

  var oColInfo = this.arColInfo;

  for (var name in oColInfo) {
   if (oColInfo.hasOwnProperty(name)) {
    sFieldNameX = name.toLowerCase();
    sFieldNameY = sFieldName.toLowerCase();
    if (sFieldNameX == sFieldNameY) {
     oObj = oColInfo[name];
     break;
    }
   }

  }

  return oObj;

 }

 //row is starting from 0 (zero)
 UI.ExistSheet.prototype.xsetValue = function (row, sFieldName, vVal) {

  var oColInfo = this.findFieldInfo(sFieldName);
  var col = -1;
  if (oColInfo != null) {
   col = oColInfo.col - 1;
   this.setValue(row, col, vVal);
  }

 }

 //row is starting from 0 (zero)
 UI.ExistSheet.prototype.xgetValue = function (row, sFieldName, vVal) {

  var oColInfo = this.findFieldInfo(sFieldName);
  var col = -1;
  var oRet;
  if (oColInfo != null) {
   col = oColInfo.col - 1;
   oRet = this.getText(row, col);
   return oRet;
  }

 }

 UI.ExistGrid.prototype.getHeaderColumnCount = function ()
 {
  var nRet = 0;
  var nRet1;
  var elem = this._elem[0];
  var nodes = elem.children;
  var nLen = nodes.length;
  var nI, nJ, nK;
  var nLenRow, nLenCol;

  for (nI = 0; nI < nLen; nI++) {
   //process header
   if (nodes[nI].tagName.toLowerCase() == "eg:header") {

    oHdr = nodes[nI];
    oRow = oHdr.children;
    nLenRow = oRow.length;

    for (nJ = 0; nJ < nLenRow; nJ++) {

     oCol = oRow[nJ].children;

     nLenCol = oCol.length;
     nRet1 = 0
     for (nK = 0; nK < nLenCol; nK++) {
      nRet1 += parseInt(oCol[nK].getAttribute("colspan") || "1");
     }

     if (nRet < nRet1) {
      nRet = nRet1;
     }

    } //nJ

   } //nI

  }

  return nRet;

 }

 UI.ExistGrid.prototype.getHeaderRowCount = function () {
  //Get Max Column Count for the header, looping is required because each column may have rowspan
  var nRet = 0;
  var nRet1;
  var elem = this._elem[0];
  var nodes = elem.children;
  var nLen = nodes.length;
  var nI, nJ, nK;

  for (nI = 0; nI < nLen; nI++) {
   //process header
   if (nodes[nI].tagName.toLowerCase() == "eg:header") {
    oHdr = nodes[nI];
    oRow = oHdr.children;
    nRet = oRow.length;
    break;
   } //nI

  }

  return nRet;

 }

 UI.ExistGrid.prototype._createSheet = function (sheetName, rowCount, columnCount) {
  var sheet = new Lontar.UI.ExistSheet(sheetName);
  sheet.borderWidth = 0;
  sheet.setRowCount(rowCount ? rowCount : 200);
  sheet.setColumnCount(columnCount ? columnCount : 20);
  sheet.calcService = this.calcService;
  sheet.parent = this;
  sheet.borderWidth = 0;
  return sheet
 }

 UI.ExistGrid.prototype.drawHeader = function () {
  var ss = this._grid;
  var elem = this._elem[0];
  var nodes = elem.children;
  var nLen = nodes.length;
  var nLenRow, nLenCol;
  var nI, nJ, nK;
  var oHdr, oRow, oCol, nRowSpan, nColSpan, sLabel;
  var sheet;
  var nColCnt, nHdrCnt;
  var nRPos, nCPos, nJ1, nK1, arXYPos;

  if (!this.sheet) {
   sheet = ss._createSheet(ss._getDefaultSheetName(0));
   sheet._existgrid = this;
   this.sheet = sheet;
  } else {
   sheet = this.sheet;
  }

  sheet.applyOptions({ autoGenerateColumns: false });

  sheet.isPaintSuspended(true);

  sheet.bind("CellClick", UI.CellClickHandler);

  sheet.bind("EditStarting", UI.EditStartingHandler);

  sheet.bind("EditEnd", UI.EditEndHandler);

  sheet.bind("EnterCell", UI.EnterCellHandler);

  sheet.bind("ClipboardPasting", UI.ClipboardPastingHandler);

  nColCnt = this.getHeaderColumnCount();
  nHdrCnt = this.getHeaderRowCount();

  var arMatrix = [];
  for (nI = 0; nI < nHdrCnt; nI++) {
   arMatrix[nI] = [];
   for (nJ = 0; nJ < nColCnt; nJ++) {
    arMatrix[nI][nJ] = 0;
   }
  }

  sheet.setRowCount(nHdrCnt, $.wijmo.wijspread.SheetArea.colHeader);

  sheet.setRowCount(0);
  sheet.setColumnCount(nColCnt);

  ss.addSheet(0, sheet);

  for (nI = 0; nI < nLen; nI++) {
   //process header
   if (nodes[nI].tagName.toLowerCase() == "eg:header") {

    oHdr = nodes[nI];
    oRow = oHdr.children;
    nLenRow = oRow.length;

    for (nJ = 0; nJ < nLenRow; nJ++) {

     oCol = oRow[nJ].children;
     nLenCol = oCol.length;

     for (nK = 0; nK < nLenCol; nK++) {
      nRowSpan = parseInt(oCol[nK].getAttribute("rowspan") || "1");
      nColSpan = parseInt(oCol[nK].getAttribute("colspan") || "1");
      sLabel = oCol[nK].getAttribute("label") || "";

      arXYPos = this.findPlace(arMatrix, nJ, nK, nHdrCnt, nColCnt);
      this.occupyPlace(arMatrix, arXYPos[0], arXYPos[1], nRowSpan, nColSpan);

      //draw header here based on given XY Pos
      sheet.addSpan(arXYPos[0], arXYPos[1], nRowSpan, nColSpan, $.wijmo.wijspread.SheetArea.colHeader);
      sheet.setValue(arXYPos[0], arXYPos[1], sLabel, $.wijmo.wijspread.SheetArea.colHeader);

     } //nK

    } //nJ

   } //nI

  }

 };

 $.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
  // check for conditions and support for blob / arraybuffer response type
  if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
   return {
    // create new XMLHttpRequest
    send: function (headers, callback) {
     // setup all variables
     var xhr = new XMLHttpRequest(),
     url = options.url,
     type = options.type,
     async = options.async || true,
     // blob or arraybuffer. Default is blob
     dataType = options.responseType || "blob",
     data = options.data || null,
     username = options.username || null,
     password = options.password || null;
     xhr.addEventListener('load', function () {
      var data = {};
      data[options.dataType] = xhr.response;
      // make callback and send data
      callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
     });

     xhr.open(type, url, async, username, password);
     // setup custom headers
     for (var i in headers) {
      xhr.setRequestHeader(i, headers[i]);
     }
     xhr.responseType = dataType;
     xhr.send(data);
    },
    abort: function () {
     jqXHR.abort();
    }
   };
  }
 });

 UI.ExistGrid.prototype.drawDetail = function (sURL) {

  var myId = this._id;
  var arColInfo = this.arColInfo;
  var sType;
  var sheet = this.sheet;

  var myPromise =
   new Promise(function (resolve, reject) {
    var sSect = myId;
    var strURL = sURL;
    var oXMLData = new LPXMLConnector(resolve, reject);

    if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
    else oXMLData.replacePage(sSect, 1, strURL);

   });

  myPromise.then(function (oXML) {

   var nCount = oXML.getPageRowCount(myId, 1);
   var oMap = oXML.getFieldMap(myId);
   var nI, vVar;
   var nLastRow;
   var nRow, nCol, sImgType, sMask;
   var re = /(?:\.([^.]+))?$/;
   var fileExt;
   var oObj;
   var img;
   var oModel;
   var sKey;

   for (nI = 1; nI <= nCount; nI++) {

    nRow = nI - 1;

    nLastRow = sheet.getRowCount();
    sheet.addRows(nLastRow, 1);

    for (var name in oMap) {

     if (oMap.hasOwnProperty(name)) {
      if (name != "xr") {
       vVar = oXML.getFieldValue(myId, 1, nI, name);
       sType = arColInfo[name].type;
       nCol = parseInt(arColInfo[name].col) - 1;

       if (nI == 1) {

        switch (sType) {

         case "CHECKBOX":
          oObj = arColInfo[name].cellType;
          oObj.type = sType;
          sheet._setCellType(nCol, oObj);
          break;

         case "IMAGE":
          oObj = arColInfo[name].cellType;
          oObj.type = sType;
          img = new Image();
          oObj._promise = $.Deferred();
          img.onload = function (img, oObj) {
           var promise = oObj._promise;
           oObj.imgData = img;
           promise.resolve(oObj);
          }.bind(null, img, oObj)
          img.src = arColInfo[name].imgurl;
          sheet._setCellType(nCol, oObj);
          break;

        }

       }

       sMask = arColInfo[name].mask;
       if (sMask != "") {
        sheet.getCell(nRow, nCol).formatter(new $.wijmo.wijspread.GeneralFormatter(sMask));
       }

       if (sType == "NUMBER") {
        sheet.setValue(nRow, nCol, vVar);
       }
       else {
        sheet.setText(nRow, nCol, vVar);
       }

      }

     }

    }

    oModel = sheet._getModel();
    sKey = oXML.getKey(myId, 1, nI);
    oModel.dataTable[nI - 1].key = sKey;
    oModel.dataTable[nI - 1].rs = "e";

   }

   sheet.clearPendingChanges();
   sheet.setActiveCell(0, 0);
   sheet.setHiddenTextArea();

  }).catch(function (err) {
   console.log('Catch: ', err);
  });

 };


 UI.ExistGrid.prototype.setColumnWidths = function () {
  //set columns width and initialize arColInfo array
  var elem = this._elem[0];
  var nodes = elem.children;
  var nLen = nodes.length;
  var nI, nJ, nK, nStart;
  var nLenCol;
  var sheet, nTo, sFieldName, nColSpan, nColPos, sType, sImgUrl, oCellType, sInitial, sValidate, sMaxLen;
  var sDisabled, sSource, sSelect, sMask, nMaxLen;
  var sValues;

  this.arColInfo = [];

  //sheet initialized at drawHeader
  sheet = this.sheet;

  for (nI = 0; nI < nLen; nI++) {
   //process header
   if (nodes[nI].tagName.toLowerCase() == "eg:detail") {

    oHdr = nodes[nI];
    oCol = oHdr.children;
    nLenCol = oCol.length;
    nColPos = 0;

    for (nJ = 0; nJ < nLenCol; nJ++) {

     nWidth = parseInt(oCol[nJ].getAttribute("width") || "100");
     nColSpan = parseInt(oCol[nJ].getAttribute("colspan") || "1");

     sFieldName = oCol[nJ].getAttribute("xdatafld") || "";
     sFieldName = sFieldName.toLowerCase();

     oCellType = null;

     sType = oCol[nJ].getAttribute("type") || "";
     sType = sType.toUpperCase();
     sImgUrl = oCol[nJ].getAttribute("imageurl") || "";
     sInitial = oCol[nJ].getAttribute("initial") || "";
     sDisabled = oCol[nJ].getAttribute("celldisabled") || "";
     sDisabled = sDisabled.toUpperCase();
     sSource = oCol[nJ].getAttribute("source") || "";
     sSelect = oCol[nJ].getAttribute("select") || "";
     sMask = oCol[nJ].getAttribute("mask") || "";
     sValidate = oCol[nJ].getAttribute("onvalidate") || "";
     sMaxLen = oCol[nJ].getAttribute("maxLength") || "100";
     nMaxLen = parseInt(sMaxLen);

     switch (sType) {

      case "CHECKBOX":
       oCellType = new UI._CheckBoxCellType;
       oCellType.values = oCol[nJ].getAttribute("values") || "";
       oCellType._sheet = sheet;
       break;

      case "IMAGE":
       oCellType = new UI._ImageCellType;
       oCellType.oncellclick = oCol[nJ].getAttribute("oncellclick") || "";
       oCellType._sheet = sheet;
       break;

     }

     sheet.setColumnWidth(nColPos, nWidth);
     nStart = nColPos + 1;
     nTo = nColPos + nColSpan;
     nColPos += nColSpan;

     for (nK = nStart; nK < nTo; nK++) {
      sheet.setColumnWidth(nK, 0);
     }

     this.arColInfo[sFieldName] = [];

     this.arColInfo[sFieldName] = {
      col: nColPos,
      span: nColSpan,
      type: sType,
      cellType: oCellType,
      imgurl: sImgUrl,
      initial: sInitial,
      celldisabled: sDisabled,
      source: sSource,
      select: sSelect,
      mask: sMask,
      onvalidate: sValidate,
      maxlength: sMaxLen
     };

    } //nJ

   } //nI

  }

  //propagate to sheet object
  sheet.arColInfo = this.arColInfo;

 };

 UI.ExistGrid.prototype.addRow = function () {

  //sheet initialized at drawHeader
  sheet = this.sheet;
  sheet.addRows(sheet.getRowCount(), 1);
  var nRow = sheet.getRowCount()-1;

  //set default values and masking
  var oColInfo = this.arColInfo;
  var sInitial, sType, nCol, sMask;

  for (var name in oColInfo) {
   if (oColInfo.hasOwnProperty(name)) {
    sInitial = oColInfo[name].initial;
    sType = oColInfo[name].type;
    nCol = oColInfo[name].col - 1;

    sMask = oColInfo[name].mask;
    if (sMask != "") {
     sheet.getCell(nRow, nCol).formatter(new $.wijmo.wijspread.GeneralFormatter(sMask));
    }

    if (((sType == "TEXT") || (sType == "CHECKBOX"))&&(sInitial!="")) {
     sheet.setValue(nRow, nCol, sInitial);
    }

   }

  }

 }

 UI.ExistGrid.prototype.save = function (sURL, successFunc, errorFunc) {

  //sheet initialized at drawHeader
  sheet = this.sheet;

  var oModel = sheet._getModel();
  var oDirtyNodes = oModel.dirtyNodes;
  var oDirtyCols;
  var sRs, sKey;
  var oColInfo = this.arColInfo;
  var lFirst = true;
  var sFieldList = "";
  var ck;
  var ck1, ck2;
  var col, sChr, vVal, oRec, oRoot;
  var lHasDirty;

  if (!oDirtyNodes) return;

  if (!sURL) {
   console.log("please specify save URL");
   return;
  }

  var oXML = $($.parseXML('<?xml version="1.0" encoding="utf-8" ?><root />'));
  oRoot = $('root', oXML);

  //updates and inserts
  for (var t in oDirtyNodes) {
   lHasDirty = true;
   if (oDirtyNodes.hasOwnProperty(t)) {
    sRs = oDirtyNodes[t].rs;
    if (sRs == "n") {
     oRec = $('<insert />', oXML);
     oRoot.append(oRec);
    } else {
     oRec = $('<update />', oXML);
     oRoot.append(oRec);
    }

    sKey = oDirtyNodes[t].key || "0";
    oRec.attr("xk", sKey);

    ck = 0;
    oDirtyCols = oDirtyNodes[t];

    for (var name in oColInfo) {
     if (oColInfo.hasOwnProperty(name)) {

      if (lFirst) {
       if (sFieldList=="") sFieldList = name;
       else sFieldList += "|" + name;
      } //lFirst

      ck1 = ck % 26;
      ck2 = Math.floor(ck / 26);
      sChr = (ck2 > 0 ? String.fromCharCode(96 + ck2) : "") + String.fromCharCode(97 + ck1);
      col = oColInfo[name].col - 1;
      if (oDirtyCols[col]) vVal = oDirtyCols[col].value;
      else vVal = "";
      oRec.attr(sChr, vVal);
      //console.log("the process", sChr, vVal, name);

      ck++;
     } //if

    } // oColInfo

    if (lFirst) oRoot.attr("fields", sFieldList);
    lFirst = false;

   } //if

  }

  if (!lHasDirty) {

   for (var name in oColInfo) {
    if (oColInfo.hasOwnProperty(name)) {

     if (lFirst) {
      if (sFieldList == "") sFieldList = name;
      else sFieldList += "|" + name;
     } //lFirst

    } //if

   } // oColInfo

   oRoot.attr("fields", sFieldList);

  }

  //deletes
  if (sheet.deletedRows)
   $.each(sheet.deletedRows, function (i, v) {
    oRec = $('<delete />', oXML);
    oRoot.append(oRec);
    oRec.attr("xk", v.key);
   });

  //tested on Mozilla, IE 11
  var sText = (new XMLSerializer()).serializeToString(oXML[0]);
  console.log(sText);

  //save data
  $.ajax({
   type: "POST",
   contentType: "text/xml",
   url: sURL,
   data: sText,
   success: function (msg, textStatus, jqXHR) {
    try {
     $.parseXML(msg);
     sheet.clearPendingChanges();
     if (successFunc) {
      successFunc(msg, textStatus, jqXHR);
     }
    } catch (ex) {
     errorFunc(msg);
    }
   },
   error: function (XMLHttpRequest, textStatus, errorThrown) {
    if (errorFunc) {
     errorFunc(XMLHttpRequest, textStatus, errorThrown)
    }
   }
  });

 }

 UI.ExistGrid.prototype.deleteRow = function () {

  //sheet initialized at drawHeader
  sheet = this.sheet;

  if (sheet.getActiveRowIndex() >= 0) {
   sheet.deleteRows(sheet.getActiveRowIndex(), 1);
  };

 }

 UI.ExistGrid.prototype.occupyPlace = function (arMatrix, nStRow, nStCol, nRowSpan, nColSpan) {

  //mark arMatrix x,y position as 1 (occupied) from given starting row and column
  //and allocated rowspan and colspan

  var nI, nJ, nTtlRow, nTtlCol;

  nTtlRow = arMatrix.length;
  nTtlCol = arMatrix[0].length;

  for (nI = nStRow; nI < nStRow + nRowSpan; nI++) {

   for (nJ = nStCol; nJ < nStCol + nColSpan; nJ++) {
    if ((nI < nTtlRow) && (nJ < nTtlCol)) {
     arMatrix[nI][nJ] = 1;
    }
   } //nJ
  } //nI

 }

 UI.ExistGrid.prototype.findPlace = function (arMatrix, nStRow, nStCol, nHdrCnt, nColCnt) {

  var arResult = [];
  var nI, nJ, lFound = false;
  var nTtlRow, nTtlCol;

  nTtlRow = arMatrix.length;
  nTtlCol = arMatrix[0].length;

  //find place in given matrix starting from start row and start col and returns
  //array of x,y coordinate, x = row, y = column

  for (nI = nStRow; nI < nHdrCnt; nI++) {

   for (nJ = nStCol; nJ < nColCnt; nJ++) {
    if ((nI < nTtlRow) && (nJ < nTtlCol)) {
     if (arMatrix[nI][nJ] == 0) {
      lFound = true;
      arResult.push(nI);
      arResult.push(nJ);
      break;
     }
    }

   } //nJ

   if (lFound) break;

  } //nI

  return arResult;

 }

 $.widget("jambi.existgrid", {
  options: {
   value: 0
  },
  _init: function () {

   var elem = this.element[0];

   var oGrid = new Lontar.UI.ExistGrid(elem, this.element, false);
   this.element.data("existgrid", oGrid);

  },

  existgrid: function () {
   return this.element.data("existgrid");
  }

 });

})(window, jQuery);

