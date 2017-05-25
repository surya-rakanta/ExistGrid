<%@ OutputCache location="None" %>
<%@ Page Language="VB" %>

<script runat="server">

 Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)
  Dim sMsg As String
  
  sMsg = "Grid Test Data"
  
  Response.Write(sMsg)
  
 End Sub
 
 
</script>

<!DOCTYPE html>

<html language="en">
 <head>
  <title>myGrid Testing Page 3 v2.0 (update jQuery)</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link href="css/cobalt/jquery-wijmo.css" rel="stylesheet" type="text/css" title="rocket-jqueryui"/>
  <link href="css/jquery.wijmo.wijsuperpanel.css" rel="stylesheet" type="text/css"/>
  <link href="CALStyles/aqua/theme.css" rel="stylesheet" type="text/css"/>
  <link rel="stylesheet" href="css/test_style.css" />
  <link rel="stylesheet" href="css/bootstrap.css" />
  <link rel="stylesheet" href="css/bootstrap-dialog.css" />
  <link rel="stylesheet" href="css/dataTables.bootstrap.css" />
  <script src="js/jquery-2.2.4.js" type="text/javascript"></script>
  <script src="js/jquery-ui-1.9.1.custom.js" type="text/javascript"></script>
  <script src="js/Calendar.js" type="text/javascript"></script>
  <script src="js/Calendar-en.js" type="text/javascript"></script>
  <script src="js/Calendar-setup.js" type="text/javascript"></script>
  <script src="js/DateCheck.js" type="text/javascript"></script>
  <script src="js/bootstrap.js" type="text/javascript"></script>
  <script src="js/jambi.dataTables.js" type="text/javascript"></script>
  <script src="js/bootstrap-dialog.js" type="text/javascript"></script>
  <script src="js/dataTables.bootstrap.js" type="text/javascript"></script>
  <script type="text/javascript" src="js/jquery.lpxmlconnector.js"></script>
  <script type="text/javascript" src="js/jambi.wijmo.wijspread.js"></script>
  <script src="js/jambi.existgrid.js" type="text/javascript"></script>
  <script type="text/javascript" src="js/TestGrid3V2.js"></script>
 </head>
 <body>
  <div class="row">
   <div style="margin-left:15px;">
    <button class="btn btn-sm btn-primary gradient" onclick="btnAddRow_Click(event)">Add Row</button>
    <button class="btn btn-sm btn-primary gradient" onclick="btnDelRow_Click(event)">Delete Row</button>
    <button class="btn btn-sm btn-primary gradient" onclick="btnSave_Click(event)">Save</button>
    <button class="btn btn-sm btn-primary gradient" onclick="btnTest_Click(event)">Test</button>
   </div>
  </div>
  <div>
   <eg:grid id="myGrid1" height="200" width="1700">
    <eg:header>
     <eg:row>
      <eg:col rowspan="2" Label="Sel"></eg:col>
      <eg:col rowspan="2" label="His"></eg:col>
      <eg:col colspan="3" label="Applicant"></eg:col>
      <eg:col colspan="3" label="Substitute"></eg:col>
      <eg:col colspan="2" label="Leave"></eg:col>
      <eg:col colspan="3" label="From"></eg:col>
      <eg:col colspan="3" label="To"></eg:col>
      <eg:col rowspan="2" label="Days"></eg:col>
      <eg:col rowspan="2" label="Reason"></eg:col>
     </eg:row>
     <eg:row>
      <eg:col label="SAP Id"></eg:col>
      <eg:col label=""></eg:col>
      <eg:col label="Name"></eg:col>
      <eg:col label="SAP Id"></eg:col>
      <eg:col label=""></eg:col>
      <eg:col label="Nama"></eg:col>
      <eg:col label="Code"></eg:col>
      <eg:col label="Description"></eg:col>
      <eg:col label="Date(*)"></eg:col>
      <eg:col label=""></eg:col>
      <eg:col label="Hour"></eg:col>
      <eg:col label="Date(*)"></eg:col>
      <eg:col label=""></eg:col>
      <eg:col label="Hour"></eg:col>
     </eg:row>
    </eg:header>
    <eg:detail>
     <eg:col width="40" values="Y:Y,N:N" initial="Y" xdatafld="gdSel" type="CHECKBOX"></eg:col>
     <eg:col width="30" type="IMAGE" width="30" xdatafld="gdHis" imageurl="Images/history.gif" oncellclick="viewHistory"></eg:col>			   
     <eg:col width="60" type="TEXT" xdatafld="gdLvPernr" maxlength="8" mask="00000000" onvalidate="setApplicantNameAtRow" celldisabled="N"></eg:col>			   
     <eg:col width="23" type="IMAGE" xdatafld="gdAppImg1" imageurl="Images/lookup.gif" oncellclick="applicantFill"></eg:col>			   
     <eg:col width="170" type="TEXT" xdatafld="gdLvName" celldisabled="Y"></eg:col>			   
     <eg:col width="60" type="TEXT" xdatafld="gdSbPernr" maxlength="8" mask="00000000" onvalidate="setSubstituteNameAtRow" celldisabled="N"></eg:col>			   
     <eg:col width="23" type="IMAGE" xdatafld="gdAppImg2" imageurl="Images/lookup.gif" oncellclick="substituteFill"></eg:col>			   
     <eg:col width="170" type="TEXT" xdatafld="gdSbName" celldisabled="Y"></eg:col>			   
     <eg:col type="LOOKUP" width="35" xdatafld="gdLvCode" source="getLeaveList" select="selectLeaveCode" onvalidate="getLeaveCode" maxLength="3" celldisabled="N"></eg:col>			   
     <eg:col width="90" type="TEXT" xdatafld="gdLvDescr" celldisabled="Y"></eg:col>			   
     <eg:col type="TEXT" label="Tgl (*)" width="70" xdatafld="gdLvFDate" maxLength="10" celldisabled="N"></eg:col>			   
     <eg:col type="IMAGE" width="23" xdatafld="gdDtImg1" imageurl="Images/cal.gif" oncellclick="LeaveFrFill" celldisabled="N"></eg:col>
     <eg:col type="TEXT" width="38" xdatafld="gdLvFHour" maxLength="5" celldisabled="N" onvalidate="calcTotalDays"></eg:col>			   
     <eg:col type="TEXT" label="Tgl (*)" width="70" xdatafld="gdLvTDate" maxLength="10" celldisabled="N"></eg:col>			   
     <eg:col type="IMAGE" width="23" xdatafld="gdDtImg2" imageurl="Images/cal.gif" oncellclick="LeaveToFill"></eg:col>
     <eg:col type="NUMBER" width="38" xdatafld="gdLvTHour" maxLength="5" celldisabled="N" onvalidate="calcTotalDays"></eg:col>			   
     <eg:col type="NUMBER" width="34" xdatafld="gdLvTtl" celldisabled="Y"></eg:col>			   
     <eg:col type="TEXT" width="180" xdatafld="gdLvReason" maxLength="100" celldisabled="N"></eg:col>			   
    </eg:detail>
   </eg:grid>
  </div>
  <div>
   <div>(*) = DD-MM-YYYY</div>
   <input type="hidden" id="tmpDate1"> 
   <input type="hidden" id="tmpDate2"> 
  </div>
 </body>
</html>
