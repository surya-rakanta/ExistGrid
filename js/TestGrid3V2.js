/*
*
* Example implementation only
*
*
*/

$(document).ready(function () {
 $("#myGrid1").existgrid();

 var oGrid1 = $("#myGrid1").existgrid("existgrid");

 Calendar.setup({
  inputField: "tmpDate1",     // id of the input field
  ifFormat: "%d-%m-%Y",      // format of the input field
  button: "tmpDate1",  // trigger for the calendar (button ID)
  align: "Bl",           // alignment (defaults to "Bl")
  singleClick: true,
  cache: true,
  onUpdate: getDateValue1
 });

 Calendar.setup({
  inputField: "tmpDate2",     // id of the input field
  ifFormat: "%d-%m-%Y",      // format of the input field
  button: "tmpDate2",  // trigger for the calendar (button ID)
  align: "Bl",           // alignment (defaults to "Bl")
  singleClick: true,
  cache: true,
  onUpdate: getDateValue2
 });


 var sURL = "ghLeave.aspx";
 oGrid1.drawDetail(sURL);

});

function LeaveFrFill(myTarget)
{
 $("#tmpDate1").css("top", myTarget.y);
 $("#tmpDate1").css("left", myTarget.x);
 $("#tmpDate1").click();
}

function getDateValue1()
{
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var row = oSheet._activeRowIndex;

 var vVal = $("#tmpDate1").val();
 oSheet.xsetValue(row, "gdLvFDate", vVal);

}

function LeaveToFill(myTarget) {
 $("#tmpDate2").css("top", myTarget.y);
 $("#tmpDate2").css("left", myTarget.x);
 $("#tmpDate2").click();
}

function getDateValue2() {
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var row = oSheet._activeRowIndex;

 var vVal = $("#tmpDate2").val();
 oSheet.xsetValue(row, "gdLvTDate", vVal);

}

function getLeaveList(request, response) {

 var sSect = "getleavelist";

 var myPromise =
  new Promise(function (resolve, reject) {
   var strURL = "ghLeave.aspx?OpID=GETLEAVECODE&Prefix=" + request.term;

   var oXMLData = new LPXMLConnector(resolve, reject);

   if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
   else oXMLData.replacePage(sSect, 1, strURL);

  });

 myPromise.then(function (oXML) {
  var nCount = oXML.getPageRowCount(sSect, 1);
  var nI;
  var sLeaveCode, sDescr;
  var aData=[];

  for (nI = 1; nI <= nCount; nI++) {
   sLeaveCode = oXML.getFieldValue(sSect, 1, nI, "gdxleavecode");
   sDescr = oXML.getFieldValue(sSect, 1, nI, "gdxdescr");
   aData.push({ label: sDescr, val: sLeaveCode });

  }

  response(aData);

 }).catch(function (err) {
  console.log('Leave Code Catch: ', err);
 });

}

function setApplicantNameAtRow()
{

 var sSect = "getapplicant";
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var row = oSheet._activeRowIndex;
 
 var sPernr = oSheet.xgetValue(row, "gdLvPernr");

 var myPromise =
  new Promise(function (resolve, reject) {

   var strURL = "ghLeave.aspx?OpID=GETEMPLOYEE&Pernr=" + sPernr;

   var oXMLData = new LPXMLConnector(resolve, reject);

   if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
   else oXMLData.replacePage(sSect, 1, strURL);

  });

 myPromise.then(function (oXML) {

  oSheet.xsetValue(row, "gdLvName", "");

  var nCount = oXML.getPageRowCount(sSect, 1);
  if (nCount <= 0) return;

  var sName = oXML.getFieldValue(sSect, 1, 1, "gdxname");
  oSheet.xsetValue(row, "gdLvName", sName);

 }).catch(function (err) {
  console.log('set applicant name Catch: ', err);
 });

}

function setSubstituteNameAtRow()
{

 var sSect = "getsubstitute";
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var row = oSheet._activeRowIndex;

 var sPernr = oSheet.xgetValue(row, "gdSbPernr");

 var myPromise =
  new Promise(function (resolve, reject) {

   var strURL = "ghLeave.aspx?OpID=GETEMPLOYEE&Pernr=" + sPernr;

   var oXMLData = new LPXMLConnector(resolve, reject);

   if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
   else oXMLData.replacePage(sSect, 1, strURL);

  });

 myPromise.then(function (oXML) {

  oSheet.xsetValue(row, "gdSbName", "");

  var nCount = oXML.getPageRowCount(sSect, 1);
  if (nCount <= 0) return;

  var sName = oXML.getFieldValue(sSect, 1, 1, "gdxname");
  oSheet.xsetValue(row, "gdSbName", sName);

 }).catch(function (err) {
  console.log('set substitute name Catch: ', err);
 });

}

function getLeaveCode()
{

 var sSect = "getleavedata";
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var row = oSheet._activeRowIndex;

 var sLvCode = oSheet.xgetValue(row, "gdLvCode");

 var myPromise =
  new Promise(function (resolve, reject) {

   var strURL = "ghLeave.aspx?OpID=GETLEAVEDESC&LvCode=" + sLvCode;

   var oXMLData = new LPXMLConnector(resolve, reject);

   if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
   else oXMLData.replacePage(sSect, 1, strURL);

  });

 myPromise.then(function (oXML) {

  oSheet.xsetValue(row, "gdLvDescr", "");

  var nCount = oXML.getPageRowCount(sSect, 1);
  if (nCount <= 0) return;

  var sLvDescr = oXML.getFieldValue(sSect, 1, 1, "gdxlvdescr");
  oSheet.xsetValue(row, "gdLvDescr", sLvDescr);

 }).catch(function (err) {
  console.log('set substitute name Catch: ', err);
 });

}

function selectLeaveCode(e, i) {
 var vVal = i.item.val;
 var vLabel = i.item.label;

 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var row = oSheet._activeRowIndex;

 oSheet.xsetValue(row, "gdLvCode", vVal);
 oSheet.xsetValue(row, "gdLvDescr", vLabel);

}

function btnAddRow_Click(event) {
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 oGrid1.addRow();
};

function btnDelRow_Click(event) {
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 oGrid1.deleteRow();
}

function btnSave_Click(event) {

 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var nRowCount = oSheet.getRowCount();
 var nI;
 var lError = false;
 var arReq = [];
 var req1;

 for (nI = 0; nI < nRowCount; nI++) {

  req1 = Promise.resolve(nI)
    .then(function (nI) {
     var sPernr = oSheet.xgetValue(nI, "gdLvPernr");
     var nRow = nI + 1;
     if (sPernr == "") return Promise.reject("Line " + nRow.toString() + " Applicant ID Must be Filled");
     else return Promise.resolve(sPernr);
    }.bind(null, nI))
    .then(function (nI, sPernr) {
     if (sPernr != "") {
      var subReq1 =
       new Promise(function (resolve, reject) {
        var strURL = "ghLeave.aspx?OpID=GETEMPLOYEE&Pernr=" + sPernr;
        var sSect = "ApplicantCheck";
        var oXMLData = new LPXMLConnector(resolve, reject);

        oXMLData.extra1 = sPernr;
        oXMLData.extra2 = sSect;

        if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
        else oXMLData.replacePage(sSect, 1, strURL);

       });

      return subReq1;

     } else {
      return Promise.resolve("Deferred");
     }

    }.bind(null, nI))
   .then(function (num, oXML) {
    if (typeof oXML == 'object') {
     var sPernr = oXML.extra1;
     var sSect = oXML.extra2;
     var nCount = oXML.getPageRowCount(sSect, 1);
     var subReq1;
     var nRow = num + 1;
     if (nCount <= 0) {
      subReq1 = Promise.reject("Line " + nRow.toString() + " Applicant Name Not Found for '" + sPernr + "'");
     }
     else {
      var sName = oXML.getFieldValue(sSect, 1, 1, "gdxname");
      oSheet.xsetValue(num, "gdLvName", sName);
      subReq1 = Promise.resolve("OK");
     }

     return subReq1;

    } else {
     return Promise.resolve("Deferred");
    }
   }.bind(null, nI))
   .then(function (nI, data) {
    var sPernr = oSheet.xgetValue(nI, "gdSbPernr");
    var nRow = nI + 1;
    if (sPernr == "") return Promise.reject("Line " + nRow.toString() + " Substitute ID Must be Filled");
    else return Promise.resolve(sPernr);

   }.bind(null, nI))
   .then(function (nI, sPernr) {

    if (sPernr != "") {
     var subReq1 =
      new Promise(function (resolve, reject) {
       var strURL = "ghLeave.aspx?OpID=GETEMPLOYEE&Pernr=" + sPernr;
       var sSect = "ApplicantCheck";
       var oXMLData = new LPXMLConnector(resolve, reject);

       oXMLData.extra1 = sPernr;
       oXMLData.extra2 = sSect;

       if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
       else oXMLData.replacePage(sSect, 1, strURL);

      });

     return subReq1;

    } else {
     return Promise.resolve("Deferred");
    }


   }.bind(null, nI))
   .then(function (num, oXML) {
    if (typeof oXML == 'object') {
     var sPernr = oXML.extra1;
     var sSect = oXML.extra2;
     var nCount = oXML.getPageRowCount(sSect, 1);
     var subReq1;
     var nRow = num + 1;
     if (nCount <= 0) {
      subReq1 = Promise.reject("Line " + nRow.toString() + " Substitute Name Not Found for '" + sPernr + "'");
     }
     else {
      var sName = oXML.getFieldValue(sSect, 1, 1, "gdxname");
      oSheet.xsetValue(num, "gdSbName", sName);
      subReq1 = Promise.resolve("OK");
     }

     return subReq1;

    } else {
     return Promise.resolve("Deferred");
    }
   }.bind(null, nI))
   .then(function (nI, data) {
    var sLvCode = oSheet.xgetValue(nI, "gdLvCode");
    var nRow = nI + 1;
    if (sLvCode == "") return Promise.reject("Line " + nRow.toString() + " Leave Code Must be Filled");
    else return Promise.resolve(sLvCode);

   }.bind(null, nI))
   .then(function (nI, sLvCode) {

    if (sLvCode != "") {
     var subReq1 =
      new Promise(function (resolve, reject) {
       var strURL = "ghLeave.aspx?OpID=GETLEAVEDESC&LvCode=" + sLvCode;
       var sSect = "LeaveCheck";
       var oXMLData = new LPXMLConnector(resolve, reject);

       oXMLData.extra1 = sLvCode;
       oXMLData.extra2 = sSect;

       if (!oXMLData.findSection(sSect)) oXMLData.addPage(sSect, strURL);
       else oXMLData.replacePage(sSect, 1, strURL);

      });

     return subReq1;

    } else {
     return Promise.resolve("Deferred");
    }


   }.bind(null, nI))
   .then(function (num, oXML) {
    if (typeof oXML == 'object') {
     var sLvCode = oXML.extra1;
     var sSect = oXML.extra2;
     var nCount = oXML.getPageRowCount(sSect, 1);
     var subReq1;
     var nRow = num + 1;
     if (nCount <= 0) {
      subReq1 = Promise.reject("Line " + nRow.toString() + " Leave Code Not Found for '" + sLvCode + "'");
     }
     else {
      var sDescr = oXML.getFieldValue(sSect, 1, 1, "gdxlvdescr");
      oSheet.xsetValue(num, "gdxlvdescr", sDescr);
      subReq1 = Promise.resolve("OK");
     }

     return subReq1;

    } else {
     return Promise.resolve("Deferred");
    }
   }.bind(null, nI))
   .then(function (nI, data) {
    var sTest = oSheet.xgetValue(nI, "gdLvFDate");
    var nRow = nI + 1;
    if (sTest == "") return Promise.reject("Line " + nRow.toString() + " Leave FROM Date Must be Filled");
    else return Promise.resolve(sTest);

   }.bind(null, nI))
   .then(function (nI, sLvFDate) {
    var nRow = nI + 1;
    if (sLvFDate != "") {
     if (!isDate(sLvFDate)) return Promise.reject("Line " + nRow.toString() + " Leave FROM Date format should be DD-MM-YYYY");
     else return Promise.resolve("OK");
    } else {
     return Promise.resolve("Deferred");
    }
   }.bind(null, nI))
   .then(function (nI, data) {
    var sTest = oSheet.xgetValue(nI, "gdLvTDate");
    var nRow = nI + 1;
    if (sTest == "") return Promise.reject("Line " + nRow.toString() + " Leave TO Date Must be Filled");
    else return Promise.resolve(sTest);

   }.bind(null, nI))
   .then(function (nI, sLvTDate) {
    var nRow = nI + 1;
    if (sLvTDate != "") {
     if (!isDate(sLvTDate)) return Promise.reject("Line " + nRow.toString() + " Leave TO Date format should be DD-MM-YYYY");
     else return Promise.resolve("OK");
    } else {
     return Promise.resolve("Deferred");
    }
   }.bind(null, nI));

  arReq.push(req1);

 }

 Promise.all(arReq).then(function (results) {
  oGrid1.save("shLeave.aspx", saveSuccess, saveError);
 }).catch(function (err) {
  BootstrapDialog.alert({
   title: 'Please Check',
   message: err,
   type: BootstrapDialog.TYPE_DANGER
  });
 });

 //if (!lError)
 // oGrid1.save("shLeave.aspx", saveSuccess, saveError);

}

function saveSuccess(msg) {
 BootstrapDialog.alert({
  title: 'Info',
  message: 'Data Saved',
  type: BootstrapDialog.TYPE_INFO
 });

}

function saveError(XMLHttpRequest, textStatus, errorThrown) {
 var oError;
 if ($.isPlainObject(XMLHttpRequest)) {
  oError = $(XMLHttpRequest.responseText);
 }
 else {
  oError = XMLHttpRequest;
 }
 BootstrapDialog.alert({
  title: 'Save Error',
  message: oError,
  type: BootstrapDialog.TYPE_DANGER
 });

}

function btnTest_Click(event) {
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 console.log("testing here");
}

function viewHistory() {
 var oGrid1 = $("#myGrid1").existgrid("existgrid");
 var oSheet = oGrid1.getSheet();
 var row = oSheet._activeRowIndex;
 console.log("view history clicked", row);
}

function applicantFill() {

 var myDialog = new BootstrapDialog({
  size: BootstrapDialog.SIZE_WIDE,
  title: 'Leave Employee Lookup',
  onshown: function (dialogRef) {

   $('#myLookup').DataTable({
    "select": true,
    "processing": true,
    "serverSide": true,
    "selector": "EMPLOYEE",
    "serverPage": "NewInquiry.aspx"
   },
   function (dialogRef, oObj) {
    var myTable = oObj.dataTable().api();

    $('#myLookup tbody').on('mouseenter', 'tr', function () {
     $(this).removeClass('selected');
     if ($(this).hasClass('highlight')) {
      $(this).removeClass('highlight');
     }
     else {
      myTable.$('tr.highlight').removeClass('highlight');
      $(this).addClass('highlight');
     }
    });

    $('#myLookup tbody').on('click', 'tr', function () {
     if ($(this).hasClass('selected')) {
      $(this).removeClass('selected');
     }
     else {
      $(this).addClass('selected');
     }
     var data = myTable.rows(this).data();
     dialogRef.setData("choosenValue", data[0]);
     dialogRef.close();
    });

   }.bind(null, dialogRef));

  },
  onhide: function (dialogRef) {
   fillApplicantData(dialogRef);
  },
  message: function (dialog) {
   var myContent =
    '<div style="margin-left: 15px; width: 700px;">' +
    '	<table id="myLookup" class="table table-striped table-bordered table-condensed" cellspacing="0" width="100%">' +
    '	</table>' +
    '</div>'

   var $content = $(myContent);
   return $content;
  },
  buttons: [
   {
    label: 'OK',
    cssClass: 'btn-primary',
    action: function (dialogItself) {
     dialogItself.close();
    }
   },
   {
    label: 'Close',
    action: function (dialogItself) {
     dialogItself.setData("choosenValue", "CANCEL");
     dialogItself.close();
    }
   }
  ]
 });

 myDialog.open();

}

function fillApplicantData(dialogRef) {
 var oData = dialogRef.getData("choosenValue");
 if (typeof oData == 'object') {
  var oGrid1 = $("#myGrid1").existgrid("existgrid");
  var oSheet = oGrid1.getSheet();
  var row = oSheet._activeRowIndex;
  oSheet.xsetValue(row, "gdLvPernr", oData[0]);
  oSheet.xsetValue(row, "gdLvName", oData[1]);
 }
}

function substituteFill() {

 var myDialog = new BootstrapDialog({
  size: BootstrapDialog.SIZE_WIDE,
  title: 'Leave Employee Lookup',
  onshown: function (dialogRef) {

   $('#myLookup').DataTable({
    "select": true,
    "processing": true,
    "serverSide": true,
    "selector": "EMPLOYEE",
    "serverPage": "NewInquiry.aspx"
   },
   function (dialogRef, oObj) {
    var myTable = oObj.dataTable().api();

    $('#myLookup tbody').on('mouseenter', 'tr', function () {
     $(this).removeClass('selected');
     if ($(this).hasClass('highlight')) {
      $(this).removeClass('highlight');
     }
     else {
      myTable.$('tr.highlight').removeClass('highlight');
      $(this).addClass('highlight');
     }
    });

    $('#myLookup tbody').on('click', 'tr', function () {
     if ($(this).hasClass('selected')) {
      $(this).removeClass('selected');
     }
     else {
      $(this).addClass('selected');
     }
     var data = myTable.rows(this).data();
     dialogRef.setData("choosenValue", data[0]);
     dialogRef.close();
    });

   }.bind(null, dialogRef));

  },
  onhide: function (dialogRef) {
   fillSubstituteData(dialogRef);
  },
  message: function (dialog) {
   var myContent =
    '<div style="margin-left: 15px; width: 700px;">' +
    '	<table id="myLookup" class="table table-striped table-bordered table-condensed" cellspacing="0" width="100%">' +
    '	</table>' +
    '</div>'

   var $content = $(myContent);
   return $content;
  },
  buttons: [
   {
    label: 'OK',
    cssClass: 'btn-primary',
    action: function (dialogItself) {
     dialogItself.close();
    }
   },
   {
    label: 'Close',
    action: function (dialogItself) {
     dialogItself.setData("choosenValue", "CANCEL");
     dialogItself.close();
    }
   }
  ]
 });

 myDialog.open();

}

function fillSubstituteData(dialogRef) {
 var oData = dialogRef.getData("choosenValue");
 if (typeof oData == 'object') {
  var oGrid1 = $("#myGrid1").existgrid("existgrid");
  var oSheet = oGrid1.getSheet();
  var row = oSheet._activeRowIndex;
  oSheet.xsetValue(row, "gdSbPernr", oData[0]);
  oSheet.xsetValue(row, "gdSbName", oData[1]);
 }
}

