using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace GSBWEB.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            Response.AppendHeader("Access-Control-Allow-Origin", "*");

            return View();
        }

        [AllowAnonymous]
        public ActionResult Calendar()
        {
            ViewBag.Title = "Calendar";

            Response.AppendHeader("Access-Control-Allow-Origin", "*");

            return View();
        }

        public JsonResult Upload(HttpPostedFileBase file)
        {
            SERVIF.APPRAISAL a = new SERVIF.APPRAISAL();

            var result = a.putFile(file, this.getLogonUser());

            return Json(result);
        }

        public FileContentResult tempDownload(string id)
        {
            string tmepFileName = string.Format("{0}{1}", id, ".pdf");

            SERVIF.APPRAISAL a = new SERVIF.APPRAISAL();

            System.IO.Stream fs = a.getTempFile(tmepFileName);

            using (System.IO.MemoryStream mem = new MemoryStream())
            {
                int readByte = 0;

                do
                {
                    readByte = fs.ReadByte();

                    if (readByte > -1)
                        mem.WriteByte((byte)readByte);

                } while (readByte > -1);

                string contentType = string.Format("application/{0}", System.IO.Path.GetExtension(tmepFileName).Substring(1));

                //string contentType = "application/pdf";

                var fileContentResult = new FileContentResult(mem.ToArray(), contentType);

                fileContentResult.FileDownloadName = tmepFileName;

                return fileContentResult;
            }
        }

        public FileContentResult Download(decimal id)
        {
            SERVIF.APPRAISAL a = new SERVIF.APPRAISAL();

            var result = a.getAttach(id);

            if (result != null)
            {
                System.IO.Stream fs = a.getFile(id);

                using (System.IO.MemoryStream mem = new MemoryStream())
                {
                    int readByte = 0;

                    do
                    {
                        readByte = fs.ReadByte();

                        if (readByte > -1)
                            mem.WriteByte((byte)readByte);

                    } while (readByte > -1);

                    string contentType = string.Format("application/{0}", System.IO.Path.GetExtension(result.DOC_PATH).Substring(1));

                    var fileContentResult = new FileContentResult(mem.ToArray(), contentType);

                    fileContentResult.FileDownloadName = result.DOC_NAME;

                    return fileContentResult;
                }
            }
            else
            {
                throw new Exception("file not found");
            }
        }

        public MODEL.USER getLogonUser()
        {
            SERVIF.USER user = new SERVIF.USER();

            return user.getLogonUserInfo(this.User.Identity.Name);
        }
    }
}
