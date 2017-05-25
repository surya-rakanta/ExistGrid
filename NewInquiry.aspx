<%@ OutputCache location="None" %>
<%@ Page Language="VB" %>
<script runat="server">

 Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)
  
  Dim sSelector As String
  
  sSelector = Request.QueryString("SELECTOR")
  
  If (sSelector = "") Then
   Response.Write("Please Specify Selector ID, For Example:EMPLOYEE")
   Exit Sub
  End If
  
  Select Case sSelector
   
   Case "EMPLOYEE"
    GetEmployeeSelector()
    
   Case Else
    Response.Write("Unknown Selector ID:" + sSelector)
    
  End Select
   
 End Sub
 
 
 Private Sub GetEmployeeSelector()
  
  Dim sOpId As String
  
  sOpId = Request.QueryString("OpId")
  
  If (sOpId = "") Then
   Response.Write("Please Specify Operation ID, For Example:GETSTRUCTURE")
   Exit Sub
  End If
  
  Select Case sOpId
   
   Case "GETSTRUCTURE"
    GetEmployeeStruct()
    
   Case "GETPAGEINFO"
    GetEmployeePageInfo()

   Case "GETDATA"
    GetEmployeeData()
    
   Case Else
    Response.Write("Unknown Operation ID:" + sOpId)
    
  End Select
  
  
 End Sub
 
 Private Sub GetEmployeePageInfo()
  
  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
  Dim dbSQL As String
  Dim oLPPage As New LPNetApp2.Utils.LPPage
  Dim dbRs As DataTable
  Dim sSearch As String
  Dim sSortColumn As String
  
  sSearch = Request.QueryString("SEARCH")
  
  sSortColumn = Request.QueryString("SORTCOLUMN")
  If (sSortColumn = "") Then
   sSortColumn = "0"
  End If
  
  Dim sCriteria As String
  
  sCriteria = ""
  
  If (sSearch <> "") Then
  
   Select Case sSortColumn
    Case "0"
     sCriteria = " WHERE SapId LIKE '%" + sSearch + "%'"
    
    Case "1"
     sCriteria = " WHERE cname LIKE '%" + sSearch + "%'"
    
   End Select
   
  End If
  
  dbSQL = _
   "SELECT COUNT(*) AS RecCount FROM LeaveV2..tEmployee" + sCriteria
  dbRs = oLPPage.GetDataTableByConnString("DBConnLeave", dbSQL)
    
  oEBAXml.EBAGetHandler_ProcessRecords()
    
  oEBAXml.EBAGetHandler_DefineField("xr")
  oEBAXml.EBAGetHandler_DefineField("gdRecordCount")
  
  oEBAXml.EBAGetHandler_CreateNewRecord("100")
  oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", "1")
  oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdRecordCount", (dbRs.Rows(0)("RecCount")).ToString().Trim())
  oEBAXml.EBAGetHandler_SaveRecord()
  
  oEBAXml.EBAGetHandler_CompleteGet()
  
 End Sub
 
 
 Private Sub GetEmployeeStruct()
  
  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
    
  oEBAXml.EBAGetHandler_ProcessRecords()
    
  oEBAXml.EBAGetHandler_DefineField("xr")
  oEBAXml.EBAGetHandler_DefineField("gdHeaderName")
  
  oEBAXml.EBAGetHandler_CreateNewRecord("100")
  oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", "1")
  oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdHeaderName", "SAP Id")
  oEBAXml.EBAGetHandler_SaveRecord()
  
  oEBAXml.EBAGetHandler_CreateNewRecord("101")
  oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", "2")
  oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdHeaderName", "Emp. Name")
  oEBAXml.EBAGetHandler_SaveRecord()
  
  oEBAXml.EBAGetHandler_CompleteGet()
  
 End Sub

 Private Sub GetEmployeeData()
  
  Dim sDisplayLength As String
  sDisplayLength = Request.QueryString("DISPLAYLENGTH")
  
  Dim sDisplayStart As String
  sDisplayStart = Request.QueryString("DISPLAYSTART")
  
  Dim sSortColumn As String
  sSortColumn = Request.QueryString("SORTCOLUMN")

  Dim sSortOrder As String
  sSortOrder = Request.QueryString("SORTORDER")

  Dim sSearch As String
  sSearch = Request.QueryString("SEARCH")
  
  Dim sSort As String

  Dim sCriteria As String
  
  sCriteria = ""
  
  If (sSearch <> "") Then
  
   Select Case sSortColumn
    Case "0"
     sCriteria = " WHERE SapId LIKE '%" + sSearch + "%'"
    
    Case "1"
     sCriteria = " WHERE cname LIKE '%" + sSearch + "%'"
    
   End Select
   
  End If
  
  Select Case sSortColumn
   Case "0"
    sSort = "ORDER BY SapID " + sSortOrder
    
   Case "1"
    sSort = "ORDER BY cname " + sSortOrder
    
  End Select
  
  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
  Dim dbSQL As String
  Dim oLPPage As New LPNetApp2.Utils.LPPage
  Dim dbRs As DataTable
  
  dbSQL = _
   "SELECT TOP " + sDisplayLength + " * FROM (" + _
   " SELECT ROW_NUMBER() OVER ( " + sSort + " ) AS RowNum, SapID, Cname" + _
   " FROM LeaveV2..tEmployee" + sCriteria + " " + _
   " ) x " + _
   "WHERE RowNum>" + sDisplayStart + " " + _
   "ORDER BY RowNum"
  dbRs = oLPPage.GetDataTableByConnString("DBConnLeave", dbSQL)
  
  Dim nI As Integer
  Dim sNi As String
  
  oEBAXml.EBAGetHandler_ProcessRecords()
    
  oEBAXml.EBAGetHandler_DefineField("xr")
  oEBAXml.EBAGetHandler_DefineField("gdSapID")
  oEBAXml.EBAGetHandler_DefineField("gdcname")
  
  For nI = 0 To dbRs.Rows.Count - 1
   
   sNi = (nI + 1).ToString().Trim()
  
   oEBAXml.EBAGetHandler_CreateNewRecord(sNi)
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", sNi)
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdSapID", (dbRs.Rows(nI)("SapID")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdcname", (dbRs.Rows(nI)("cname")).ToString().Trim())
   
   oEBAXml.EBAGetHandler_SaveRecord()
  
  Next
  
  oEBAXml.EBAGetHandler_CompleteGet()
  
 End Sub
 
</script>
