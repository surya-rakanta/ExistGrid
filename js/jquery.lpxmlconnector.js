/* -----------------------------------------------------------
 *
 * jQuery version of LPXmlConnector
	* 
	* Licensed under the MIT license
 * ----------------------------------------------------------------------------------
 *
 */
 
(function(window, $)
{

 LPXMLConnector = function (resolve, reject) {

  this.getHandler = "";
  this.retrievedXML = null;
  this.fieldName = null;
  this.lSuccess = false;
  this.fieldMap = new Array();
  this.errorMsg = "";
  this.arSection = new Array();
  this.count = 0;
  this.sectionCount = 0;
  this.resolve = resolve;
  this.reject = reject;
  this.URL = "";

 };

 LPXMLConnector.prototype = {

  addPage: function (sSectionName, strURL) {
   var oSection, lValid;
   oSection = this.getSection(sSectionName);
   this.URL = strURL;
   if (oSection == null) {
    oSection = new pageSection(sSectionName, this.resolve, this.reject);
    oSection.parentObject = this;
    this.arSection[this.sectionCount] = oSection;
    this.sectionCount++;
   }

   oSection.addPage(strURL);

  },

  replacePage: function (sSectionName, nPage, strURL) {
   var oSection;
   oSection = this.getSection(sSectionName);
   if (oSection == null) {
    this.errorMsg = "Section " + sSectionName + " is Not Exist.";
    return false;
   }
   lValid = oSection.replacePage(nPage, strURL);
   if (!lValid) {
    this.errorMsg = oSection.errorMsg;
    this.lSuccess = false;
   }
   else this.lSuccess = true;
   return lValid;
  },

  getPage: function(sSectionName, nPageNum) {

   var oPage = null;
   var oSection = this.getSection(sSectionName);
   if (oSection != null) {
    oPage = oSection.getPage(nPageNum);
   }
   return oPage;

  },

  getPageRowCount: function (sSectionName, nPageNum) {
   var oPage;
   var nCount = -1;
   oPage = this.getPage(sSectionName, nPageNum);
   if (oPage == null) return nCount;
   var oRoot = $(oPage).children();
   nCount = oRoot.children().length;
   return nCount;
  },

  getFieldMap: function (sSectionName) {

   var oSection = this.getSection(sSectionName);
   var oMap = oSection.fieldMap;
   return oMap;

  },

  getFieldValue: function (sSectionName, nPageNum, nRow, sFieldName) {
   var sRet = "";

   var oPage = this.getPage(sSectionName, nPageNum);
   if (oPage == null) return sRet;

   var oSection = this.getSection(sSectionName);

   var sRow = nRow.toString();
   var siFieldName = sFieldName.toLowerCase();

   var sIdx = oSection.fieldMap[siFieldName];

   if (typeof (sIdx) == "undefined") return sRet;

   var sRowIdx = oSection.fieldMap["xr"];

   //oTest = $(oXML).find('e');
   //oTest = $(oXML).find('root');

   var oNode = $(oPage).find('e[' + sRowIdx.substring(1) + '="' + sRow + '"]');

   if (!oNode) return sRet;

   sRet = oNode[0].getAttribute(sIdx.substring(1));
   return sRet;

  },

  getKey: function (sSectionName, nPageNum, nRow) {

   var sRet = "";

   var oPage = this.getPage(sSectionName, nPageNum);
   if (oPage == null) return sRet;

   var oSection = this.getSection(sSectionName);

   var sRow = nRow.toString();

   var sRowIdx = oSection.fieldMap["xr"];

   var oNode = $(oPage).find('e[' + sRowIdx.substring(1) + '="' + sRow + '"]');

   if (!oNode) return sRet;

   sRet = oNode[0].getAttribute("xk");
   return sRet;

  },

  findSection: function (sSectionName) {
   var oSection;
   var lFound;
   oSection = this.getSection(sSectionName);
   if (oSection != null) lFound = true;
   else lFound = false;
   return lFound;
  },

  getSection: function (sName) {

   var lFound = false;
   var nI = 0;
   var oSection;
   for (nI = 0; nI < this.arSection.length; nI++) {
    oSection = this.arSection[nI];
    if (oSection.name.toLowerCase() == sName.toLowerCase()) {
     lFound = true;
     break;
    }
   }
   if (lFound) return oSection;
   else return null;

  }


 };

 pageSection = function (sName, resolve, reject) {
  this.name = sName;
  this.arPages = new Array();
  this.pageCount = 0;
  this.errorMsg = "";
  this.fieldMap = new Array();
  this.fieldName = null;
  this.resolve = resolve;
  this.reject = reject;
 };

 pageSection.prototype = {

  addPage: function (strURL) {
   $.when(
    $.ajax({
     type: "GET",
     url: strURL,
     dataType: "xml"
    })
    )
   .then(this.processFinish.bind(null, this, "add", 0), this.processFailed.bind(null, this, "add", 0));

  },

  replacePage: function (nPage, strURL) {

   $.when(
    $.ajax({
     type: "GET",
     url: strURL,
     dataType: "xml"
    })
    ).then(this.processFinish.bind(null, this, "replace", nPage), this.processFailed.bind(null, this, "replace", nPage));

  },

  getPage: function (nPageNum) {
   var nAvail = this.arPages.length - 1;
   nPageNum--;
   if (nPageNum <= nAvail) return this.arPages[nPageNum];
   else return null;
  },

  processFailed: function (oParent, sAction, nPage, jqXHR, textStatus, errorThrown) {
   oParent.reject(textStatus + " " + errorThrown+" at " + oParent.parentObject.URL);
  },

  processFinish: function (oParent, sAction, nPage, oXML, textStatus, jqXHR) {

   var xFields = oXML.documentElement.getAttribute("fields");
   oParent.fieldName = xFields.split("|");

   var nI;
   var lFound = false;
   var ck = 0;
   var ck1, ck2;
   var sFn;

   for (nI = 0; nI < oParent.fieldName.length; nI++) {
    oParent.fieldName[nI] = oParent.fieldName[nI].toLowerCase();
    sFn = oParent.fieldName[nI];
    ck1 = ck % 26;
    ck2 = Math.floor(ck / 26);
    oParent.fieldMap[sFn] = "@" + (ck2 > 0 ? String.fromCharCode(96 + ck2) : "") + String.fromCharCode(97 + ck1);
    ck++;
    if (oParent.fieldName[nI] == "xr") lFound = true;
   }

   if (!lFound) {
    oParent.parentObject.errorMsg = "pageSection:No Row Indicator xr";
   } else {
    oParent.parentObject.errorMsg = "OK";
   }

   if (sAction == "add") {
    //oParent.arPages[this.pageCount] = oXML.cloneNode(true);
    oParent.arPages.push(oXML.cloneNode(true));
    oParent.pageCount++;

   } else {
    oParent.arPages[nPage - 1] = oXML.cloneNode(true);
   }
   //oParent = pageSection, parentObject = LPXMLConnector object
   oParent.resolve(oParent.parentObject);

  }

 }

})(window, jQuery);