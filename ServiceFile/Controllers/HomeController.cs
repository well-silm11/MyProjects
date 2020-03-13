using Dashboard.Models;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.Threading;
using System.Globalization;

namespace ServiceFile.Controllers
{
    public class HomeController : Controller
    {
 

        public ActionResult Index(DashboardModel model)
        {
            return View(model);
        }

        [HttpPost]
        public JsonResult VolumeCompetencia(DashboardModel model)
        {
            return Json(VolumeCompetencias(model));
        }

        public List<DashboardModel> VolumeCompetencias(DashboardModel model)
        {
            var dtInicio = Convert.ToDateTime(model.InicioSuprimento);
            var dtFim = Convert.ToDateTime(model.FimSuprimento);

            List<DashboardModel> list = new List<DashboardModel>();

            while (dtInicio <= dtFim)
            {
                //FAZENDO A LISTA DE MESES
                var ex = new DashboardModel()
                {
                    NrMes = dtInicio.Month,
                    Mes = dtInicio.ToString("MMM", CultureInfo.CurrentCulture),
                    Ano = dtInicio.Year
                };

                dtInicio = dtInicio.AddMonths(1);

                list.Add(ex);
            }

            return  list;
        }

    }
}