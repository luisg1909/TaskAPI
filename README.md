# TaskAPI

TaskAPI is a simple task management API built with ASP.NET Core. This guide will help you set up and run the application from scratch using a local SQL Server.

## Prerequisites

- **.NET SDK:** [Install .NET SDK](https://dotnet.microsoft.com/download)
- **SQL Server:** [Install SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **SQL Server Management Studio (SSMS):** [Install SSMS](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

## Getting Started

### 1. Create database in sql management studio

CREATE DATABASE TaskDB;
GO

USE TaskDB;
GO

CREATE TABLE Tasks (
    TaskId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Priority INT,
    DueDate DATE,
    Status NVARCHAR(50)
);
GO

### 2 Update the Connection String
Update the connection string in appsettings.json to match your local SQL Server configuration:

appsettings.json


{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TaskDB;User Id=sa;Password=YourStrong@Passw0rd;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}

Replace localhost, User Id, and Password with your SQL Server instance details.


### 4. Access the Application
open a cmd to access the TaskAPI folder
 cd TaskAPI
install entity framework in case you dont have:

dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools

in cmd run the following to run de app
dotnet build
dotnet run

### 3 The application will start, and you should see output indicating that it's listening on http://localhost:5293.

Open your web browser and navigate to http://localhost:5293/index.html to access the application.

note: if the port is different change all the ocurrences of port of js/scripts.js to new one
