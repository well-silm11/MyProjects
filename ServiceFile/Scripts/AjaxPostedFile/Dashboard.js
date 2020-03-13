
//declarando vetores

var ValuesConsumoOuGeracao = [];
var meses = [];
var ValuesContrato = [];
var ValuesGeracao = [];
var consumo = 0;
var contrato = 0;
var geracao = 0;

////////////////////////////////////////////AÇÕES////////////////////////////////////////////////////////////////////////
$("#reload").click(function () {
    ValuesConsumoOuGeracao = [];
    meses = [];
    ValuesContrato = [];
    ValuesGeracao = [];
    consumo = 0;
    contrato = 0;
    geracao = 0;

    location.reload();


});



$("#btn-gerar-pdf").hide();

//gerar pdf 
$("#btn-gerar-pdf").click(function () {
    $("#btn-gerar-pdf").hide();
    window.print();
    $("#btn-gerar-pdf").show();
});

$("#classe").focusout(function () {

    try {

        if ($("#classe").val() != "" && $("#nome").val() != "") {
            $("#name").hide();
            $("#addemp").append('<div class="col-md-12"><label class="c-title"style="font-size: 20px;"> Empresa: ' + $("#nome").val() + '</label></div><br/><br/><br/>  ');
            $("#addemp").show();


            $("#projetar").show();

        }
        else {
            toastr.warning("Infome o nome e a classe!");
            return;
        }
    }
    catch (Exception) {
        toastr.error("Deu ruim!!");
    }

});


$("#graphic").click(function () {

    var _ = this;

    try {
        var itens = document.getElementById('teste').getElementsByTagName("input");


        //adicionando valores ao vetor
        var a = "";
        for (i = 0; i < itens.length; i++) {
            a = itens[i].value ? itens[i].value : "0,000";

            a = a.replace(",", ".");
            ValuesConsumoOuGeracao.push(
                a = parseFloat(a)
            );
            consumo += a;
            //adicionando valores de geração ou consumo para colocar no grafico
        }
        debugger
        var itens2 = document.getElementById('testecd').getElementsByTagName("input");

        var ab = "";
        for (s = 0; s < itens2.length; s++) {
            ab = itens2[s].value ? itens2[s].value : "0,000";
            ab = ab.replace(",", ".");
            ValuesContrato.push(
                ab = parseFloat(ab)
            );
            contrato += ab;
            //adicionando valores a contrato para colocar no gráfico
        }
        if ($("#classe").val() == "Produtor" ||
            $("#classe").val() == "Independente" ||
            $("#classe").val() == "Auto") {
            var itens3 = document.getElementById('testegr').getElementsByTagName("input");

            var abt = "";
            for (c = 0; c < itens3.length; c++) {
                abt = itens3[c].value ? itens3[c].value : "0,000";
                abt = abt.replace(",", ".");
                ValuesGeracao.push(
                    abt = parseFloat(abt)
                );
                geracao += abt;
                //caso seja um desses adicionar valores ao gráfico 
            }
            ChartAutoProdutor();
        }
        else {

            ChartConsumo();
        }


    }
    catch (Exception) {
        toastr.error("Deu ruim!!");

    }

});

$("#gerar").click(function () {
    var _ = this;
    try {
        //tratando as data para fazer a requisição na controller
        var dateI = $("#InicioSuprimento").val().split("/");
        var dateII = dateI[1] + "" + dateI[0];

        var dateF = $("#FimSuprimento").val().split("/");
        var dateFf = dateF[1] + "" + dateF[0];

        if (dateF[1] > "2050" || dateI[1] < "2000") {
            toastr.error('Datas muito longe da realidade, dixa de ser pé no saco e coloque valores mais perto da atualidade');
        }

        else {

            if ($("#FimSuprimento").val().length == 7 && $("#InicioSuprimento").val().length == 7 && dateFf > dateII) {


                $I = $("#InicioSuprimento"),
                    $F = $("#FimSuprimento"),
                    inicioSuprimento = $I.val(),
                    fimSuprimento = $F.val(),


                    $(this).prop('disabled', true);
                $("#testec").show();

                dados = {
                    InicioSuprimento: inicioSuprimento,
                    FimSuprimento: fimSuprimento
                };


                volumeCompetenciaAsync(dados).done(loadVolume);

            }
            else {
                toastr.error("Data inválida ou data de inicio menor do que a início!");
            }
        }
    }
    catch (Exception) {
        toastr.error("Deu ruim!!");
    }
});


///////////////////////////////////////////////METODOS//////////////////////////////////////////////////////////////////////////////


//caso seja autoprodutor, produtor 
function ChartAutoProdutor() {
    $("#btn-gerar-pdf").show();
    //obtendo dados para obter o nome das labels
    var namegroup = document.getElementById('testecd').getElementsByTagName("label");
    var Contrato = namegroup[0].innerText;
    var namegroup2 = document.getElementById('teste').getElementsByTagName("label");
    var ConsumoOuGeracao = namegroup2[0].innerText;
    var namegroup3 = document.getElementById('testegr').getElementsByTagName("label");
    var LabelGeracao = namegroup3[0].innerText;
    var fator = geracao - consumo + contrato;
    //formatando para ter duas casas decimais
    geracao = parseFloat(geracao.toFixed(2));
    consumo = parseFloat(consumo.toFixed(2));
    contrato = parseFloat(contrato.toFixed(2));
    fator = parseFloat(fator.toFixed(2));
    $("#formularios").hide();

    var cor = "";
    if (fator >= 0) {
        cor = "green";
    }
    else {
        cor = "red";
    }
    //Colocando o calculo do balanço
    $("#balanco").append('<br/><br/><label class="c-label"style="font-size: 17px;">' + ConsumoOuGeracao + ': ' + ' </label><label class="c-title" style="font-size: 25px; color:rgb(185, 185, 185);">' + consumo + '(MWh)      ' + '</label>  <label class="c-label"style="font-size: 17px;">Contrato:  </label><label class="c-title" style="font-size: 25px; color:rgb(230, 126, 18);">' + contrato + '(MWh)      ' + '</label><label class="c-label"style="font-size: 17px;">Geração:  </label><label class="c-title" style="font-size: 25px; color:rgb(7, 105, 175);">' + geracao + '(MWh)      ' + '</label>  <label class="c-label"style="font-size: 17px;">Balnço Energético: </label><label class="c-title" style="font-size: 25px; color:' + cor + ' " >' + '  ' + fator + '(MWh)' + ' </label>');


    var ctx = document.getElementsByClassName("line-chart");

    var a = new Chart(ctx, {

        type: 'bar',

        data: {
            labels: meses,
            datasets: [{
                label: ConsumoOuGeracao + " Barra",
                data: ValuesConsumoOuGeracao,
                borderColor: 'rgb(185, 185, 185)',
                backgroundColor: 'rgb(185, 185, 185)',
            },
            {
                label: Contrato + " Barra",
                data: ValuesContrato,
                borderColor: 'rgb(230, 126, 18)',
                backgroundColor: 'rgb(230, 126, 18)',
            },
            {
                label: LabelGeracao + " Barra",
                data: ValuesGeracao,
                borderColor: 'rgb(7, 105, 175)',
                backgroundColor: 'rgb(7, 105, 175)',
            },
            {
                type: 'line',
                label: ConsumoOuGeracao + " Linha",
                data: ValuesConsumoOuGeracao,
                borderColor: 'rgb(185, 185, 185)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            },
            {
                type: 'line',
                label: Contrato + " Linha",
                data: ValuesContrato,
                borderColor: 'rgb(230, 126, 18)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            },
            {
                type: 'line',
                label: LabelGeracao + " Linha",
                data: ValuesGeracao,
                borderColor: 'rgb(7, 105, 175)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            },
            {
                type: 'line',
                label: ConsumoOuGeracao + " Area",
                data: ValuesConsumoOuGeracao,
                borderColor: 'rgb(185, 185, 185)',
                backgroundColor: 'rgba(185, 185, 185, 0.75)',
            },
            {
                type: 'line',
                label: Contrato + " Area",
                data: ValuesContrato,
                borderColor: 'rgb(230, 126, 18)',
                backgroundColor: 'rgba(230, 126, 18,0.75)',
            },
            {
                type: 'line',
                label: LabelGeracao + " Area",
                data: ValuesGeracao,
                borderColor: 'rgb(7, 105, 175)',
                backgroundColor: 'rgba(7, 105, 175, 0.68)',
            }

            ]
            //
        },
        options: {
            title: {
                display: true,
                fontStyle: 'bold',
                fontColor: 'black',
                padding: 10,
                fontSize: 25,
                text: 'Geração ' + $("#nome").val() + ' (' + $("#InicioSuprimento").val() + ' a ' + $("#FimSuprimento").val() + ')'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'MWh',
                        fontColor: 'black',
                        fontStyle: 'bold'
                    },
                    ticks: {
                        beginAtZero: true


                    }
                }],
                xAxes: [{
                    gridLines: {
                        offsetGridLines: true
                    }
                }]
            }
        }
    });
}

$(document).ready(function () {
    $("#InicioSuprimento").mask('00/0000');
    $("#FimSuprimento").mask('00/0000');
    $('.val').maskMoney({ thousands: '.', decimal: ',', allowZero: true, precision: 3 });
});

//quando for consumidor especial, livre ou gerador 
function ChartConsumo() {
    $("#btn-gerar-pdf").show();
    //obtendo dados para obter o nome das labels
    //Consumo ou geração
    var namegroup2 = document.getElementById('teste').getElementsByTagName("label");
    var LabelConsumoOUGeracao = namegroup2[0].innerText;

    //////////////contrato
    var namegroup = document.getElementById('testecd').getElementsByTagName("label");
    var LabelContrato = namegroup[0].innerText;

    var balanco = 0.0;

    //calculando o balanco
    if (LabelConsumoOUGeracao == "Geração") {
        //geracao
        balanco = consumo - contrato;
    } else {

        balanco = contrato - consumo;
    }

    consumo = parseFloat(consumo.toFixed(2));
    contrato = parseFloat(contrato.toFixed(2));
    balanco = parseFloat(balanco.toFixed(2));
    var cor = "";
    if (balanco >= 0) {
        cor = "green";
    }
    else {
        cor = "red";
    }

    $("#balanco").append('<br/><br/><label class="c-label"style="font-size: 17px;">' + LabelConsumoOUGeracao + ': ' + ' </label><label class="c-title" style="font-size: 25px; color:rgb(185, 185, 185);">' + consumo + '(MWh)      ' + '</label>  <label class="c-label"style="font-size: 17px;">Contrato:  </label><label class="c-title" style="font-size: 25px; color:rgb(230, 126, 18)">' + contrato + '(MWh)      ' + '</label> <label class="c-label"style="font-size: 17px;">Balnço Energético: </label><label class="c-title" style="font-size: 25px; color:' + cor + ' " >' + '  ' + balanco + '(MWh)' + ' </label>');


    $("#formularios").hide();
    var ctx = document.getElementsByClassName("line-chart");

    var a = new Chart(ctx, {

        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: LabelConsumoOUGeracao + " Barra",
                data: ValuesConsumoOuGeracao,
                borderColor: 'rgb(185, 185, 185)',
                backgroundColor: 'rgb(185, 185, 185)',
            },
            {
                label: LabelContrato + " Barra",
                data: ValuesContrato,
                borderColor: 'rgb(230, 126, 18)',
                backgroundColor: 'rgb(230, 126, 18)',
            },
            {
                type: 'line',
                label: LabelConsumoOUGeracao + " Linha",
                data: ValuesConsumoOuGeracao,
                borderColor: 'rgb(185, 185, 185)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            },
            {
                type: 'line',
                label: LabelContrato + " Linha",
                data: ValuesContrato,
                borderColor: 'rgb(230, 126, 18)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            },
            {
                type: 'line',
                label: LabelConsumoOUGeracao + " Area",
                data: ValuesConsumoOuGeracao,
                borderColor: 'rgb(185, 185, 185)',
                backgroundColor: 'rgba(185, 185, 185, 0.75)',
            },
            {
                type: 'line',
                label: LabelContrato + " Area",
                data: ValuesContrato,
                borderColor: 'rgb(230, 126, 18)',
                backgroundColor: 'rgba(230, 126, 18,0.75)',
            }

            ]
        },
        options: {

            legend: {

                display: true
            },

            title: {
                //titulo do grafico
                display: true,
                fontColor: 'black',
                fontStyle: 'bold',
                padding: 10,
                fontSize: 25,
                text: LabelConsumoOUGeracao + ' ' + $("#nome").val() + '(' + $("#InicioSuprimento").val() + ' a ' + $("#FimSuprimento").val() + ')'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'MWh',
                        fontColor: 'black',
                        fontStyle: 'bold'
                    },
                    ticks: {
                        display: true,

                        beginAtZero: true//contando do 0 para que possamos ver todos os graficos


                    }
                }],
                xAxes: [{
                    gridLines: {
                        offsetGridLines: true//deixando os gráficos centralizados ou não
                    }
                }]
            }
        }
    });

}


function loadVolume(list) {


    try {
        $("#projetar").hide();

        //Criando as labels para separar os inputs
        if ($("#classe").val() == "Livre" || $("#classe").val() == "Especial") {
            $('#testecd').append('<div class="col-md-12"><label class="c-title" style="font-size: 30px;">Contrato</label></div>  ');
            $('#teste').append('<div class="col-md-12"><label class="c-title"style="font-size: 30px;">Consumo</label></div>  ');
        }
        if ($("#classe").val() == "Gerador") {
            $('#testecd').append('<div class="col-md-12"><label class="c-title" style="font-size: 30px;">Contrato</label></div>  ');
            $('#teste').append('<div class="col-md-12"><label class="c-title"style="font-size: 30px;">Geração</label></div>  ');
        }
        if ($("#classe").val() == "Produtor" ||
            $("#classe").val() == "Independente" ||
            $("#classe").val() == "Auto") {
            $('#testecd').append('<div class="col-md-12"><label class="c-title" style="font-size: 30px;">Contrato</label></div>  ');
            $('#teste').append('<div class="col-md-12"><label class="c-title"style="font-size: 30px;">Consumo</label></div>  ');
            $('#testegr').append('<div class="col-md-12"><label class="c-title"style="font-size: 30px;">Geracao</label></div>  ');
        }



        for (let i = 0; i < list.length; i++) {

            let item = list[i];

            var a = i;
            if (i > 0) {

                a = i - 1;

            }
            //verificando as classes para definir seus inputs
            if (list[a].Ano != item.Ano) {
                if ($("#classe").val() == "Produtor" || $("#classe").val() == "Independente" || $("#classe").val() == "Auto") {
                    $('#teste').append('<div class="col-md-12"></div><div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text" maxlength="7"class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                    $('#testecd').append('<div class="col-md-12"></div><div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text" maxlength="7" class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                    $('#testegr').append('<div class="col-md-12"></div><div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text" maxlength="7" class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');

                }
                else {

                    $('#teste').append('<div class="col-md-12"></div><div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text"   maxlength="7" class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                    $('#testecd').append('<div class="col-md-12"></div><div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text" maxlength="7"class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                }

            }
            else {
                if ($("#classe").val() == "Produtor" || $("#classe").val() == "Independente" || $("#classe").val() == "Auto") {
                    $('#teste').append('<div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text"maxlength="7" class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                    $('#testecd').append('<div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text"maxlength="7" class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                    $('#testegr').append('<div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text"maxlength="7" class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');

                }
                else {

                    $('#teste').append('<div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text" maxlength="7" class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                    $('#testecd').append('<div class="col-md-3"><label>' + item.Mes + "/" + item.Ano + '</label><br /><input type="text" maxlength="7"  class="val" data-mes-ano="' + item.Mes + '"data-ano="' + item.Ano + '"></div>');
                }
            }

            meses.push(
                //atribuindo labels do grafico
                item.Mes + "/" + item.Ano
            );

        }
        $('.val').maskMoney({ thousands: '.', decimal: ',', allowZero: true, precision: 3 });
        $('.val').attr('placeholder', '0,000');
    }
    catch (Exception) {
        toastr.error("Deu ruim!!");
    }

}

//buscando a lista de meses
function volumeCompetenciaAsync(dados) {
    try {

        return $.ajax({
            type: "POST",
            url: `Home/VolumeCompetencia`,
            data: JSON.stringify(dados),
            contentType: 'application/json; charset=utf-8',
        });
    } catch (ex) {
        toastr.error("Deu ruim!!");
    }
}


