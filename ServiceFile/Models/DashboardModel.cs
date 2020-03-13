using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dashboard.Models
{
    public class DashboardModel
    {



         

        public string nome { get; set; }    
        public string InicioSuprimento { get; set; }
        public string FimSuprimento { get; set; }
        public int NrMes{get;set;}
        public string Mes  {get;set;}
        public int Ano  {get;set;}
        public ListClass tx_classe { get; set; }
    }


    public enum ListClass
    {
        Produtor,
        Independente,
        Auto,
        Gerador,
        Livre,
        Especial
    }
}