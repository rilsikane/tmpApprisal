using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GSBWEB.Controllers
{
    [Authorize]
    public class ReportsController : Controller
    {
        // GET: Reports
        public ActionResult Index(string id)
        {
            //SERVIF.R r = new SERVIF.R();

            //string file = r.test();

            return View();
        }

        
        public FileContentResult Read(decimal id)
        {
            SERVIF.APPRAISAL a = new SERVIF.APPRAISAL();

            var result = a.getAttach(id);

            if (result != null)
            {
                if (System.IO.File.Exists(result.DOC_PATH))
                {
                    using (System.IO.FileStream fs = new System.IO.FileStream(result.DOC_PATH, System.IO.FileMode.Open))
                    {
                        byte[] fileContent = new byte[fs.Length];

                        fs.Read(fileContent, 0, fileContent.Length);

                        return new FileContentResult(fileContent, "application/pdf");
                    }

                }
                else
                {
                    throw new Exception("file not found");
                }
            }
            else
            {
                throw new Exception("file not found");
            }
        }
    }
}