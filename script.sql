USE [master]
GO
/****** Object:  Database [LeaveV2]    Script Date: 5/23/2017 5:01:13 PM ******/
CREATE DATABASE [LeaveV2] ON  PRIMARY 
( NAME = N'LeaveV2', FILENAME = N'D:\Program Files (x86)\Microsoft SQL Server\MSSQL.1\MSSQL\DATA\LeaveV2.mdf' , SIZE = 16640KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'LeaveV2_log', FILENAME = N'D:\Program Files (x86)\Microsoft SQL Server\MSSQL.1\MSSQL\DATA\LeaveV2_log.ldf' , SIZE = 21128KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [LeaveV2] SET COMPATIBILITY_LEVEL = 90
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LeaveV2].[dbo].[sp_fulltext_database] @action = 'disable'
end
GO
ALTER DATABASE [LeaveV2] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LeaveV2] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LeaveV2] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LeaveV2] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LeaveV2] SET ARITHABORT OFF 
GO
ALTER DATABASE [LeaveV2] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [LeaveV2] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LeaveV2] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LeaveV2] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LeaveV2] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LeaveV2] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LeaveV2] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LeaveV2] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LeaveV2] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LeaveV2] SET  DISABLE_BROKER 
GO
ALTER DATABASE [LeaveV2] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LeaveV2] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LeaveV2] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LeaveV2] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LeaveV2] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LeaveV2] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LeaveV2] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [LeaveV2] SET  MULTI_USER 
GO
ALTER DATABASE [LeaveV2] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LeaveV2] SET DB_CHAINING OFF 
GO
USE [LeaveV2]
GO
/****** Object:  User [TTG\TTGIS4$]    Script Date: 5/23/2017 5:01:14 PM ******/
CREATE USER [TTG\TTGIS4$] FOR LOGIN [TTG\TTGIS4$] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_datareader] ADD MEMBER [TTG\TTGIS4$]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [TTG\TTGIS4$]
GO
/****** Object:  Table [dbo].[tEmployee]    Script Date: 5/23/2017 5:01:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tEmployee](
	[SAPId] [nchar](10) NULL,
	[cname] [nchar](100) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tLeave]    Script Date: 5/23/2017 5:01:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tLeave](
	[tLeaveUID] [numeric](18, 0) IDENTITY(1,1) NOT NULL,
	[TrType] [char](1) NULL CONSTRAINT [DF_tLeave_TrType]  DEFAULT ('N'),
	[SectID] [char](40) NULL,
	[co] [char](4) NULL CONSTRAINT [DF_tLeave_co]  DEFAULT ('LPTT'),
	[dept] [char](4) NULL,
	[Status] [char](2) NULL CONSTRAINT [DF_tLeave_Status]  DEFAULT ((1)),
	[LvPernr] [char](10) NULL,
	[SbPernr] [char](10) NULL,
	[LvCode] [char](3) NULL,
	[LvFDate] [smalldatetime] NULL,
	[LvFHour] [char](5) NULL,
	[LvTDate] [smalldatetime] NULL,
	[LvTHour] [char](5) NULL,
	[LvReason] [varchar](150) NULL,
	[LvTtl] [decimal](5, 2) NULL,
	[AppLevel] [smallint] NULL,
	[EmpLevel] [smallint] NULL,
	[AppMax] [smallint] NULL,
	[Approver] [char](10) NULL,
	[ApproverName] [char](50) NULL,
	[VerifyF] [char](1) NULL,
	[DayStr] [varchar](100) NULL,
	[Posted] [char](1) NULL CONSTRAINT [DF_tLeave_Posted]  DEFAULT ('N'),
	[UpdUsr] [char](20) NULL,
	[UpdDat] [smalldatetime] NULL,
	[ApvUsr] [char](20) NULL,
	[ApvDat] [smalldatetime] NULL,
	[PrcUsr] [char](20) NULL,
	[PrcDat] [smalldatetime] NULL,
	[PostUsr] [char](20) NULL,
	[PostDat] [smalldatetime] NULL,
	[AttachF] [char](1) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tLeaveCode]    Script Date: 5/23/2017 5:01:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tLeaveCode](
	[tLeaveCodeUID] [numeric](18, 0) IDENTITY(1,1) NOT NULL,
	[LvCode] [nchar](5) NULL,
	[Description] [nchar](50) NULL
) ON [PRIMARY]

GO
USE [master]
GO
ALTER DATABASE [LeaveV2] SET  READ_WRITE 
GO
