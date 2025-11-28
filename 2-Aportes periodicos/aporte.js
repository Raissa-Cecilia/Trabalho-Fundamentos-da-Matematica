document.getElementById("calcular").addEventListener("click", () => {
  
    const capital = parseFloat(document.getElementById("capital").value);
    const aporte = parseFloat(document.getElementById("aporte").value);
    const tempo = parseInt(document.getElementById("tempo").value);
    const taxaAplicacao = parseFloat(document.getElementById("taxa").value) / 100;
    const taxaIPCA = parseFloat(document.getElementById("ipca").value) / 100;

    let montanteAplicacao = capital;
    let montanteIPCA = capital;

    const pontosTempo = 10;
    const intervalo = Math.floor(tempo / pontosTempo);

    let labels = [];
    let dadosAplicacao = [];
    let dadosIPCA = [];

    
    const tabela = document.getElementById("tabelaDados");
    tabela.innerHTML = "";

    for (let mes = 1; mes <= tempo; mes++) {

      
        montanteAplicacao = montanteAplicacao * (1 + taxaAplicacao) + aporte;
        montanteIPCA = montanteIPCA * (1 + taxaIPCA) + aporte;

        
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${mes}</td>
            <td>R$ ${montanteAplicacao.toFixed(2)}</td>
            <td>R$ ${montanteIPCA.toFixed(2)}</td>
            <td>R$ ${(montanteAplicacao - montanteIPCA).toFixed(2)}</td>
        `;
        tabela.appendChild(linha);

       
        if (mes % intervalo === 0 || mes === tempo) {
            labels.push(`${mes}º`);
            dadosAplicacao.push(montanteAplicacao);
            dadosIPCA.push(montanteIPCA);
        }
    }

    const diferenca = montanteAplicacao - montanteIPCA;

   
    document.getElementById("montanteAplicacao").textContent = `R$ ${montanteAplicacao.toFixed(2)}`;
    document.getElementById("montanteIPCA").textContent = `R$ ${montanteIPCA.toFixed(2)}`;
    document.getElementById("diferenca").textContent = `R$ ${diferenca.toFixed(2)}`;

    const ctx = document.getElementById("grafico").getContext("2d");

    
    if (window.graficoInvest) {
        window.graficoInvest.destroy();
    }

    
    window.graficoInvest = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Com Aplicação",
                    data: dadosAplicacao,
                    borderColor: "#2196F3",
                    backgroundColor: "rgba(33,150,243,0.2)",
                    borderWidth: 2,
                    tension: 0.2
                },
                {
                    label: "IPCA",
                    data: dadosIPCA,
                    borderColor: "#F44336",
                    backgroundColor: "rgba(244,67,54,0.2)",
                    borderWidth: 2,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });

});

