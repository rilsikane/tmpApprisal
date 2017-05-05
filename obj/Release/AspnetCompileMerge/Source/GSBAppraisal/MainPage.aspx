<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MainPage.aspx.cs" Inherits="GSBWEB.GSBAppraisal.MainPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <script type="text/javascript">
        function callbackOpener() {
            var args = {
                graphic: [{ attributes: { Latitude: Math.random(), Longitude: Math.random() } }]
            };
            if (window.opener.selectLocationSuccess) {
                window.opener.selectLocationSuccess(args);
            }
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            Test
        </div>
        <button type="button" onclick="callbackOpener()">Test</button>
    </form>
</body>
</html>
