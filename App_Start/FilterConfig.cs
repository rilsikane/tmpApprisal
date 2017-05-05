using System;
using System.Web;
using System.Web.Mvc;

namespace GSBWEB
{
    public class exc : IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            throw new NotImplementedException();
        }
    }
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            //filters.Add(new exc());
        }
    }
}
