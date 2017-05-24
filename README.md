# ExistGrid
ExistGrid is basically SpreadJS with additional feature and functionality. 

The grid object is created using custom tag that consists of header and detail declaration.
Sample grid and header declaration:

 

And the detail for each field properties:

 


In the generated UI, It adds another new features that is not included in the original open source SpreadJS as follows:

Adds new UI inside the cell, currently the check box, image and look up:

 

And look up which is implemented by integrating with jQuery autocomplete:
 

It supports enable and disable input. For example, the above applicant name is meant to be shown only, so, it can't be edited.

Each of the IMAGE type inside the cell has the functionality of a button. And images is retrieved from the server by this declaration:

 

As you can see from the above declaration, there's an oncellclick property that declares the Javascript function to be called when the image is clicked.

It is already integrated with bootstrap, for example, here is the bootstrap look up when the applicant name image is clicked:

 

To see how it runs, just copy the content of this project to your virtual directory in your IIS server, because it is written in ASP.NET Framework.

To setup the database, run the script.sql located in the root of this project. This sample use tEmployee, tLeaveCode and tLeave table.

The sample data is located in the data folder, it's in Excel format. You can populate it by importing it to your generated tables.

Then in your Mozilla browser fire up the link according to your setup, example as below:

 

The save button already has the implementation of data validation and save method from ExistGrid. For example, when the employee id is not exist, it will show validation error as follows:

 

Take a look at the sample TestGrid3V2.aspx page to view the full implementation of using methods inside ExistGrid, such as get row count, etc.

