document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcular');
    let graficoRetaInstance;

    function calcularEquacao() {
        const x1 = parseFloat(document.getElementById('x1').value);
        const y1 = parseFloat(document.getElementById('y1').value);
        const x2 = parseFloat(document.getElementById('x2').value);
        const y2 = parseFloat(document.getElementById('y2').value);

        const erroElem = document.getElementById('erro');
        erroElem.style.display = 'none';

        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            erroElem.textContent = 'Por favor, insira valores numéricos válidos em todos os campos.';
            erroElem.style.display = 'block';
            return;
        }

    
        if (x1 === x2) {
            erroElem.textContent = `Erro: Reta vertical (x = ${x1.toFixed(2)}). Não é possível calcular a função y = ax + b.`;
            erroElem.style.display = 'block';
            resetarResultados();
            return;
        }

        const a = (y2 - y1) / (x2 - x1);
        const b = y1 - a * x1;
        
        const raiz = -b / a;
        const raizX = isFinite(raiz) ? raiz : 0;
        
        atualizarInterface(a, b, raizX);
        desenharGrafico(a, b, x1, y1, x2, y2, raizX);
    }
    
    function resetarResultados() {
        document.getElementById('coeficienteA').textContent = '0.00';
        document.getElementById('coeficienteB').textContent = '0.00';
        document.getElementById('equacao').textContent = 'f(x) = 0.00x + 0.00';
        document.getElementById('intersecaoX').textContent = '(0.00, 0)';
        document.getElementById('intersecaoY').textContent = '(0, 0.00)';
        if (graficoRetaInstance) {
            graficoRetaInstance.destroy();
            graficoRetaInstance = null;
        }
    }

    function atualizarInterface(a, b, raizX) {
        let equacaoStr;
        const bStr = b >= 0 ? ` + ${b.toFixed(2)}` : ` - ${Math.abs(b).toFixed(2)}`;
        
        if (a === 0) {
            equacaoStr = `f(x) = ${b.toFixed(2)}`;
        } else if (a === 1) {
            equacaoStr = `f(x) = x${bStr}`;
        } else if (a === -1) {
            equacaoStr = `f(x) = -x${bStr}`;
        } else {
            equacaoStr = `f(x) = ${a.toFixed(2)}x${bStr}`;
        }

        document.getElementById('coeficienteA').textContent = a.toFixed(2);
        document.getElementById('coeficienteB').textContent = b.toFixed(2);
        document.getElementById('equacao').textContent = equacaoStr;
        document.getElementById('intersecaoX').textContent = `(${raizX.toFixed(2)}, 0)`;
        document.getElementById('intersecaoY').textContent = `(0, ${b.toFixed(2)})`;
    }

    function desenharGrafico(a, b, x1, y1, x2, y2, raizX) {
        const ctx = document.getElementById('graficoReta').getContext('2d');
        
        if (graficoRetaInstance) {
            graficoRetaInstance.destroy();
        }

        const minX = Math.min(x1, x2, 0, raizX) - 2;
        const maxX = Math.max(x1, x2, 0, raizX) + 2;
        
        const pontosReta = [];
        const numPontos = 50;
        for (let i = 0; i <= numPontos; i++) {
            const x = minX + (maxX - minX) * i / numPontos;
            const y = a * x + b;
            pontosReta.push({x, y});
        }
        
   
        const pontosDestaque = [
            {x: x1, y: y1, label: 'P1', color: 'rgba(52, 152, 219, 1)', radius: 5},
            {x: x2, y: y2, label: 'P2', color: 'rgba(52, 152, 219, 1)', radius: 5},
            {x: raizX, y: 0, label: 'Raiz (Eixo X)', color: 'rgba(230, 126, 34, 1)', radius: 6},
            {x: 0, y: b, label: 'Eixo Y', color: 'rgba(192, 57, 43, 1)', radius: 6}
        ].filter(p => p.x >= minX && p.x <= maxX);

    
        const scatterData = pontosDestaque.map(p => ({
            x: p.x,
            y: p.y
        }));
        const scatterBackgrounds = pontosDestaque.map(p => p.color);
        const scatterRadius = pontosDestaque.map(p => p.radius);
        
        graficoRetaInstance = new Chart(ctx, {
            type: 'scatter', 
            data: {
                datasets: [
                    {
                        label: 'Equação da Reta',
                        data: pontosReta,
                        borderColor: '#2ecc71',
                        backgroundColor: '#2ecc71',
                        borderWidth: 3,
                        pointRadius: 0,
                        type: 'line',
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'Pontos de Destaque',
                        data: scatterData,
                        borderColor: 'transparent',
                        backgroundColor: scatterBackgrounds,
                        pointRadius: scatterRadius,
                        pointStyle: 'circle',
                        showLine: false,
                        pointHoverRadius: 8,
                        datalabels: {
                            display: true,
                            formatter: (value, context) => {
                                return pontosDestaque[context.dataIndex].label;
                            },
                            align: 'top',
                            offset: 10
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: `f(x) = ${a.toFixed(2)}x + ${b.toFixed(2)}`
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Eixo X'
                        },
                        grid: {
                            drawOnChartArea: true,
                            color: function(context) {
                                return context.tick.value === 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.1)';
                            },
                            lineWidth: function(context) {
                                return context.tick.value === 0 ? 2 : 1;
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Eixo Y'
                        },
                        grid: {
                            drawOnChartArea: true,
                            color: function(context) {
                                return context.tick.value === 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.1)';
                            },
                            lineWidth: function(context) {
                                return context.tick.value === 0 ? 2 : 1;
                            }
                        }
                    }
                }
            }
        });
    }

    calcularBtn.addEventListener('click', calcularEquacao);
    
    
    calcularEquacao();
});