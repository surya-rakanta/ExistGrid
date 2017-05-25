<%@ OutputCache location="None" %>
<%@ Page Language="VB" %>
<script runat="server">
 
 Dim sqlConnection As New System.Data.SqlClient.SqlConnection()
 Dim myTrans As System.Data.SqlClient.SqlTransaction
 Dim myCommand As New System.Data.SqlClient.SqlCommand()

 Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)
  
  Dim sConn As String
  
  sConn = ConfigurationManager.ConnectionStrings("DBConnLeave").ConnectionString
  sqlConnection.ConnectionString = sConn
  sqlConnection.Open()
  myTrans = sqlConnection.BeginTransaction()
  myCommand.Connection = sqlConnection
  myCommand.Transaction = myTrans
   
  Try
   SaveData()
   myTrans.Commit()
  Catch ex As Exception
   myTrans.Rollback()
   Throw
  Finally
   sqlConnection.Close()
  End Try
   
 End Sub
 
 Private Sub SaveData()

  Dim oEBAXml As New LPNetApp2.Utils.EBAXml
  Dim oLPPage As New LPNetApp2.Utils.LPPage
  Dim nInsertCount, nUpdateCount, nDeleteCount As Integer
  Dim nI As Integer
  Dim dbSQL As String
  
  oEBAXml.EBASaveHandler_ProcessRecords()
  
  nInsertCount = oEBAXml.EBASaveHandler_ReturnInsertCount()
  nUpdateCount = oEBAXml.EBASaveHandler_ReturnUpdateCount()
  nDeleteCount = oEBAXml.EBASaveHandler_ReturnDeleteCount()
  
  For nI = 0 To nInsertCount - 1
   dbSQL = "INSERT INTO LeaveV2..tLeave (LvPernr, SbPernr, LvCode, LvFDate, LvFHour, LvTDate, LvTHour, LvReason, LvTtl, " + _
   "UpdUsr, UpdDat) " + _
   "VALUES (" + _
   "'" + Trim(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvPernr")) + "', " + _
   "'" + Trim(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdSbPernr")) + "', " + _
   "'" + Trim(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvCode")) + "', " + _
   "'" + DMY2YMD(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvFDate"), "-") + "', " + _
   "'" + Trim(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvFHour")) + "', " + _
   "'" + DMY2YMD(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvTDate"), "-") + "', " + _
   "'" + Trim(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvTHour")) + "', " + _
   "'" + Trim(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvReason")) + "', " + _
   xsetZero(oEBAXml.XEBASaveHandler_ReturnInsertField(nI, "gdLvTtl")) + ", " + _
   "'" + "myUser" + "', " + _
   "'" + oLPPage.XFormatDate(DateTime.Now, "YYYY-MM-DD HH:MM") + "')"
   'Response.Write(dbSQL)
   'Response.End()
   myCommand.CommandText = dbSQL
   myCommand.ExecuteNonQuery()
   
  Next
  
  For nI = 0 To nUpdateCount - 1
   dbSQL = "UPDATE LeaveV2..tLeave " + _
    "SET LvPernr = '" + Trim(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvPernr")) + "', " + _
    "SbPernr = '" + Trim(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdSbPernr")) + "', " + _
    "LvCode = '" + Trim(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvCode")) + "', " + _
    "LvFDate = '" + DMY2YMD(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvFDate"), "-") + "', " + _
    "LvFHour = '" + Trim(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvFHour")) + "', " + _
    "LvTDate = '" + DMY2YMD(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvTDate"), "-") + "', " + _
    "LvTHour = '" + Trim(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvTHour")) + "', " + _
    "LvReason = '" + Trim(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvReason")) + "', " + _
    "LvTtl = " + xsetZero(oEBAXml.XEBASaveHandler_ReturnUpdateField(nI, "gdLvTtl")) + ", " + _
    "UpdUsr = '" + "myUser" + "', " + _
    "UpdDat = '" + oLPPage.XFormatDate(DateTime.Now, "YYYY-MM-DD HH:MM") + "' " + _
    "WHERE tLeaveUID = " + oEBAXml.EBASaveHandler_ReturnUpdateField(nI, 0)
   myCommand.CommandText = dbSQL
   myCommand.ExecuteNonQuery()
   
  Next
  
  For nI = 0 To nDeleteCount - 1
   dbSQL = "DELETE LeaveV2..tLeave " + _
    "WHERE tLeaveUID = " + oEBAXml.EBASaveHandler_ReturnDeleteField(nI)
   myCommand.CommandText = dbSQL
   myCommand.ExecuteNonQuery()
   
  Next
  
  oEBAXml.EBASaveHandler_CompleteSave()
  
 End Sub
 
 Private Function DMY2YMD(ByVal DMY As String, ByVal sparator As String) As String
  Return Right(DMY, 4) & sparator & Mid(DMY, 4, 2) & sparator & Left(DMY, 2)
 End Function
 
 Private Function xsetZero(ByVal sqStr As String) As String
  Dim sTemp As String
  sTemp = IIf(Trim(sqStr) = "", "", Trim(sqStr))
  sTemp = Replace(sTemp, ",", ".")
  If Trim(sTemp) = "" Then
   sTemp = "0"
  End If
  xsetZero = sTemp
 End Function
 
 
 
</script>
