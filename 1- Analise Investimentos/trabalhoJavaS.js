document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcular');
    let graficoInvest;

    function calcularMontante(capital, taxa, tempo) {
        return capital * Math.pow(1 + taxa, tempo);
    }
    
    function gerarPontos(capital, taxaAplicacao, taxaIPCA, tempoTotal) {
        const pontos = [];
        
        for (let mes = 0; mes <= tempoTotal; mes++) {
            const montanteApp = calcularMontante(capital, taxaAplicacao, mes);
            const montanteIP = calcularMontante(capital, taxaIPCA, mes);
            
            pontos.push({
                mes: mes,
                montanteAplicacao: montanteApp,
                montanteIPCA: montanteIP,
                diferenca: montanteApp - montanteIP
            });
        }
        
        return pontos;
    }
        
          function desenharGrafico(pontos) {
        const ctx = document.getElementById('grafico').getContext('2d');
        

        const labels = pontos.map(p => p.mes);
        const dadosAplicacao = pontos.map(p => p.montanteAplicacao);
        const dadosIPCA = pontos.map(p => p.montanteIPCA);

       
        if (graficoInvest) {
            graficoInvest.destroy();
        }

        
        graficoInvest = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Montante com Aplicação",
                        data: dadosAplicacao,
                        borderColor: "#3498db", 
                        backgroundColor: "rgba(52, 152, 219, 0.2)",
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: "Montante com IPCA",
                        data: dadosIPCA,
                        borderColor: "#e74c3c", 
                        backgroundColor: "rgba(231, 76, 60, 0.2)",
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                    legend: {
                        position: "top"
                    },
                    title: {
                        display: true,
                        text: "Evolução do Montante ao Longo do Tempo"
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Montante (R$)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses'
                        }
                    }
                }
            }
        });
    }
    
    function atualizarInterface() {
     
        const capital = parseFloat(document.getElementById('capital').value);
        const tempo = parseInt(document.getElementById('tempo').value);
        const taxaAplicacao = parseFloat(document.getElementById('taxaAplicacao').value) / 100;
        const taxaIPCA = parseFloat(document.getElementById('taxaIPCA').value) / 100;
        
        const montanteAplicacao = calcularMontante(capital, taxaAplicacao, tempo);
        const montanteIPCA = calcularMontante(capital, taxaIPCA, tempo);
        const diferenca = montanteAplicacao - montanteIPCA;
        
        document.getElementById('montanteAplicacao').textContent = `R$ ${montanteAplicacao.toFixed(2)}`;
        document.getElementById('montanteIPCA').textContent = `R$ ${montanteIPCA.toFixed(2)}`;
        document.getElementById('diferenca').textContent = `R$ ${diferenca.toFixed(2)}`;
        
        const conclusaoElem = document.getElementById('conclusao');
        if (diferenca > 0) {
            conclusaoElem.textContent = `A aplicação superou a inflação em R$ ${diferenca.toFixed(2)}`;
            conclusaoElem.className = 'conclusion positive';
        } else if (diferenca < 0) {
            conclusaoElem.textContent = `A aplicação não acompanhou a inflação. Perda real de R$ ${Math.abs(diferenca).toFixed(2)}`;
            conclusaoElem.className = 'conclusion negative';
        } else {
            conclusaoElem.textContent = 'A aplicação apenas acompanhou a inflação.';
            conclusaoElem.className = 'conclusion neutral';
        }
        
        const pontos = gerarPontos(capital, taxaAplicacao, taxaIPCA, tempo);
        
        const tabelaDadosElem = document.getElementById('tabelaDados');
        tabelaDadosElem.innerHTML = '';
        
        pontos.forEach(ponto => {
            const linha = document.createElement('tr');
            
            const mesCell = document.createElement('td');
            mesCell.textContent = ponto.mes;
            linha.appendChild(mesCell);
            
            const aplicacaoCell = document.createElement('td');
            aplicacaoCell.textContent = `R$ ${ponto.montanteAplicacao.toFixed(2)}`;
            linha.appendChild(aplicacaoCell);
            
            const ipcaCell = document.createElement('td');
            ipcaCell.textContent = `R$ ${ponto.montanteIPCA.toFixed(2)}`;
            linha.appendChild(ipcaCell);
            
            const diferencaCell = document.createElement('td');
            diferencaCell.textContent = `R$ ${ponto.diferenca.toFixed(2)}`;
            linha.appendChild(diferencaCell);
            
            tabelaDadosElem.appendChild(linha);
        });
        
       
        desenharGrafico(pontos);
    }
    
    calcularBtn.addEventListener('click', atualizarInterface);
    

    atualizarInterface();
    
    
});