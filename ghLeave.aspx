<%@ OutputCache location="None" %>
<%@ Page Language="VB" %>
<script runat="server">

 Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)
  
  Dim sOpID As String
  sOpID = Request.QueryString("OpID")
  
  Select sOpID
  
   Case "GETLEAVECODE"
    getLeaveCode()
    
   Case "GETLEAVEDESC"
    getLeaveDescr()
    
   Case "GETEMPLOYEE"
    getEmployee()
    
   Case Else
    rtvGridData()
    
  End Select
   
 End Sub
 
 Private Sub getEmployee()

  Dim dbSQL As String
  Dim oLPPage As New LPNetApp2.Utils.LPPage
  Dim dbRs As DataTable
  Dim sPernr As String
  
  sPernr = Request.QueryString("Pernr")
  
  dbSQL = _
  "SELECT a.SapID, a.cname FROM LeaveV2..tEmployee a " + _
  "WHERE a.SapID = '" + sPernr + "'"
  
  dbRs = oLPPage.GetDataTableByConnString("DBConnLeave", dbSQL)
  
  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
    
  oEBAXml.EBAGetHandler_ProcessRecords()
    
  oEBAXml.EBAGetHandler_DefineField("xr")
  oEBAXml.EBAGetHandler_DefineField("gdxsapid")
  oEBAXml.EBAGetHandler_DefineField("gdxname")
  
  If (dbRs.Rows.Count > 0) Then
   
   oEBAXml.EBAGetHandler_CreateNewRecord("1")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", "1")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdxsapid", (dbRs.Rows(0)("SAPId")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdxname", (dbRs.Rows(0)("cname")).ToString().Trim())
   oEBAXml.EBAGetHandler_SaveRecord()
   
  End If
  
  oEBAXml.EBAGetHandler_CompleteGet()
  
 End Sub

 Private Sub getLeaveDescr()

  Dim dbSQL As String
  Dim oLPPage As New LPNetApp2.Utils.LPPage
  Dim dbRs As DataTable
  Dim sLvCode As String
  
  sLvCode = Request.QueryString("LvCode")
  
  dbSQL = _
  "SELECT a.tLeaveCodeUID, a.LvCode, a.Description FROM LeaveV2..tLeaveCode a " + _
  "WHERE a.LvCode = '" + sLvCode + "'"
  dbRs = oLPPage.GetDataTableByConnString("DBConnLeave", dbSQL)
  
  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
    
  oEBAXml.EBAGetHandler_ProcessRecords()
    
  oEBAXml.EBAGetHandler_DefineField("xr")
  oEBAXml.EBAGetHandler_DefineField("gdxlvcode")
  oEBAXml.EBAGetHandler_DefineField("gdxlvdescr")
  
  If (dbRs.Rows.Count > 0) Then
   
   oEBAXml.EBAGetHandler_CreateNewRecord("1")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", "1")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdxlvcode", (dbRs.Rows(0)("LvCode")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdxlvdescr", (dbRs.Rows(0)("Description")).ToString().Trim())
   oEBAXml.EBAGetHandler_SaveRecord()
   
  End If
  
  oEBAXml.EBAGetHandler_CompleteGet()
  
 End Sub
 
 Private Sub getLeaveCode()
  
  Dim dbSQL As String
  Dim oLPPage As New LPNetApp2.Utils.LPPage
  Dim dbRs As DataTable
  Dim sPrefix As String
  
  sPrefix = Request.QueryString("Prefix")
  
  dbSQL = _
  "SELECT a.tLeaveCodeUID, a.LvCode, a.Description FROM LeaveV2..tLeaveCode a " + _
  "WHERE a.Description LIKE '" + sPrefix + "%' " + _
  "ORDER BY a.Description"
  
  dbRs = oLPPage.GetDataTableByConnString("DBConnLeave", dbSQL)
  
  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
    
  oEBAXml.EBAGetHandler_ProcessRecords()
    
  oEBAXml.EBAGetHandler_DefineField("xr")
  oEBAXml.EBAGetHandler_DefineField("gdxleavecode")
  oEBAXml.EBAGetHandler_DefineField("gdxdescr")
  
  Dim nI As Integer
  
  For nI = 0 To dbRs.Rows.Count - 1
  
   oEBAXml.EBAGetHandler_CreateNewRecord((dbRs.Rows(nI)("tLeaveCodeUID")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", Trim(Str(nI + 1)))
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdxleavecode", (dbRs.Rows(nI)("LvCode")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdxdescr", (dbRs.Rows(nI)("Description")).ToString().Trim())
   oEBAXml.EBAGetHandler_SaveRecord()
  
  Next
  
  oEBAXml.EBAGetHandler_CompleteGet()
  
 End Sub
 
 
 Private Sub rtvGridData()
  
  Dim dbSQL As String
  Dim oLPPage As New LPNetApp2.Utils.LPPage
  Dim dbRs As DataTable
  Dim sSel As String
  
  sSel = "N"
  
  dbSQL = _
   "SELECT " + "'" + sSel + "' AS Sel, " + " a.tLeaveUID, a.LvPernr, b.cname AS LvName, a.SbPernr, c.cname AS SbName, a.LvFDate, a.LvFHour, " + _
   "a.LvTDate, a.LvTHour, a.LvCode, d.Description AS LvDescr, a.LvReason, a.LvTtl " + _
   "FROM LeaveV2..tLeave a " + _
   "LEFT JOIN LeaveV2..tEmployee b ON (a.LvPernr = b.SAPId) " + _
   "LEFT JOIN LeaveV2..tEmployee c ON (a.SbPernr = c.SAPId) " + _
   "LEFT JOIN LeaveV2..tLeaveCode d ON (a.LvCode = d.LvCode)"
   
  dbRs = oLPPage.GetDataTableByConnString("DBConnLeave", dbSQL)
  
  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
    
  oEBAXml.EBAGetHandler_ProcessRecords()
    
  oEBAXml.EBAGetHandler_DefineField("xr")
  oEBAXml.EBAGetHandler_DefineField("gdSel")
  oEBAXml.EBAGetHandler_DefineField("gdHis")
  oEBAXml.EBAGetHandler_DefineField("gdLvPernr")
  oEBAXml.EBAGetHandler_DefineField("gdLvName")
  oEBAXml.EBAGetHandler_DefineField("gdAppImg1")
  oEBAXml.EBAGetHandler_DefineField("gdSbPernr")
  oEBAXml.EBAGetHandler_DefineField("gdAppImg2")
  oEBAXml.EBAGetHandler_DefineField("gdSbName")
  oEBAXml.EBAGetHandler_DefineField("gdLvCode")
  oEBAXml.EBAGetHandler_DefineField("gdLvDescr")
  oEBAXml.EBAGetHandler_DefineField("gdLvFDate")
  oEBAXml.EBAGetHandler_DefineField("gdDtImg1")
  oEBAXml.EBAGetHandler_DefineField("gdLvFHour")
  oEBAXml.EBAGetHandler_DefineField("gdLvTDate")
  oEBAXml.EBAGetHandler_DefineField("gdDtImg2")
  oEBAXml.EBAGetHandler_DefineField("gdLvTHour")
  oEBAXml.EBAGetHandler_DefineField("gdLvTtl")
  oEBAXml.EBAGetHandler_DefineField("gdLvReason")
  
  Dim nI As Integer
  
  For nI = 0 To dbRs.Rows.Count - 1
  
   oEBAXml.EBAGetHandler_CreateNewRecord((dbRs.Rows(nI)("tLeaveUID")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("xr", Trim(Str(nI + 1)))
   
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdSel", (dbRs.Rows(nI)("Sel")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdHis", "")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvPernr", (dbRs.Rows(nI)("LvPernr")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdAppImg1", "")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvName", (dbRs.Rows(nI)("LvName")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdSbPernr", (dbRs.Rows(nI)("SbPernr")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdAppImg2", "")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdSbName", (dbRs.Rows(nI)("SbName")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvCode", (dbRs.Rows(nI)("LvCode")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvDescr", (dbRs.Rows(nI)("LvDescr")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvFDate", oLPPage.XFormatDate(dbRs.Rows(nI)("LvFDate"), "DD-MM-YYYY"))
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdDtImg1", "")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvFHour", (dbRs.Rows(nI)("LvFHour")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvTDate", oLPPage.XFormatDate(dbRs.Rows(nI)("LvTDate"), "DD-MM-YYYY"))
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdDtImg2", "")
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvTHour", (dbRs.Rows(nI)("LvTHour")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvTtl", (dbRs.Rows(nI)("LvTtl")).ToString().Trim())
   oEBAXml.EBAGetHandler_DefineRecordFieldValue("gdLvReason", (dbRs.Rows(nI)("LvReason")).ToString().Trim())
   oEBAXml.EBAGetHandler_SaveRecord()
  
  Next
  
  oEBAXml.EBAGetHandler_CompleteGet()
  
 End Sub
 
</script>
