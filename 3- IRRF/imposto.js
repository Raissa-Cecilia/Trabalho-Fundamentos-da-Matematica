// Dados da tabela progressiva do IR 2025
const tabelaIR = [
    { limite: 2259.20, aliquota: 0, deducao: 169.44 },
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
];

const DEDUCAO_DEPENDENTE = 189.59;

// Função para calcular a base de cálculo
function calcularBaseCalculo(salarioBruto, numDependentes) {
    const deducaoDependentes = numDependentes * DEDUCAO_DEPENDENTE;
    return Math.max(0, salarioBruto - deducaoDependentes);
}

// Função para encontrar a faixa do IR
function encontrarFaixa(baseCalculo) {
    for (let i = 0; i < tabelaIR.length; i++) {
        if (baseCalculo <= tabelaIR[i].limite) {
            return i;
        }
    }
    return tabelaIR.length - 1;
}

// Função para calcular o IRRF (COM dedução)
function calcularIRRF(baseCalculo) {
    if (baseCalculo <= 2259.20) {
        return 0;
    }
    
    const faixaIndex = encontrarFaixa(baseCalculo);
    const faixa = tabelaIR[faixaIndex];
    
    const irrf = (baseCalculo * faixa.aliquota) - faixa.deducao;
    return Math.max(0, irrf);
}

// Função para calcular IRRF sem dedução (apenas alíquota)
function calcularIRRFSemDeducao(baseCalculo) {
    if (baseCalculo <= 2259.20) {
        return 0;
    }
    
    const faixaIndex = encontrarFaixa(baseCalculo);
    const faixa = tabelaIR[faixaIndex];
    
    return baseCalculo * faixa.aliquota;
}

// Função para gerar dados do gráfico
function gerarDadosGrafico(baseCalculoUsuario) {
    const dados = [];
    const step = 100;
    
    for (let base = 0; base <= 6000; base += step) {
        const irrf = calcularIRRF(base);
        const irrfSemDeducao = calcularIRRFSemDeducao(base);
        
        dados.push({
            base: base,
            irrf: irrf,
            irrfSemDeducao: irrfSemDeducao
        });
    }
    
    // Adicionar o ponto do usuário se existir
    if (baseCalculoUsuario > 0) {
        const pontoUsuario = {
            base: baseCalculoUsuario,
            irrf: calcularIRRF(baseCalculoUsuario),
            irrfSemDeducao: calcularIRRFSemDeducao(baseCalculoUsuario),
            destaque: true
        };
        dados.push(pontoUsuario);
        dados.sort((a, b) => a.base - b.base);
    }
    
    return dados;
}

// Função para desenhar GRÁFICO 1 (COM dedução)
function desenharGrafico1(dados, baseCalculoUsuario, irrfUsuario) {
    const canvas = document.getElementById('grafico1');
    const ctx = canvas.getContext('2d');
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configurações
    const padding = 60;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    
    // Encontrar valores máximos
    const maxBase = 6000;
    const maxIRRF = Math.max(...dados.map(d => d.irrf));
    
    // Desenhar eixos
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Labels dos eixos
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Base de Cálculo (R$)', canvas.width / 2, canvas.height - 20);
    
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('IRRF a Pagar (R$)', 0, 0);
    ctx.restore();
    
    // Função auxiliar para converter coordenadas
    function getX(base) {
        return padding + (base / maxBase) * graphWidth;
    }
    
    function getY(irrf) {
        return canvas.height - padding - (irrf / maxIRRF) * graphHeight;
    }
    
    // Desenhar linhas de grade horizontais
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        const valor = maxIRRF * (1 - i / 5);
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(valor.toFixed(0), padding - 10, y + 4);
    }
    
    // Desenhar linha do IRRF COM dedução
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    dados.forEach((d, i) => {
        const x = getX(d.base);
        const y = getY(d.irrf);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Destacar ponto do usuário
    if (baseCalculoUsuario > 0) {
        const xUser = getX(baseCalculoUsuario);
        const yUser = getY(irrfUsuario);
        
        // Linha vertical tracejada
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(xUser, canvas.height - padding);
        ctx.lineTo(xUser, yUser);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Ponto verde
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(xUser, yUser, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Borda branca no ponto
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label do valor
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`R$ ${irrfUsuario.toFixed(2)}`, xUser, yUser - 15);
    }
    
    // Legenda
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(padding + 10, padding + 10, 20, 3);
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('IRRF com Dedução', padding + 35, padding + 15);
    
    if (baseCalculoUsuario > 0) {
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(padding + 20, padding + 30, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillText('Seu cálculo', padding + 35, padding + 34);
    }
}

// Função para desenhar GRÁFICO 2 (SEM dedução)
function desenharGrafico2(dados, baseCalculoUsuario, irrfUsuarioSemDeducao) {
    const canvas = document.getElementById('grafico2');
    const ctx = canvas.getContext('2d');
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configurações
    const padding = 60;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    
    // Encontrar valores máximos
    const maxBase = 6000;
    const maxIRRF = Math.max(...dados.map(d => d.irrfSemDeducao));
    
    // Desenhar eixos
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Labels dos eixos
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Base de Cálculo (R$)', canvas.width / 2, canvas.height - 20);
    
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('IRRF a Pagar (R$)', 0, 0);
    ctx.restore();
    
    // Função auxiliar para converter coordenadas
    function getX(base) {
        return padding + (base / maxBase) * graphWidth;
    }
    
    function getY(irrf) {
        return canvas.height - padding - (irrf / maxIRRF) * graphHeight;
    }
    
    // Desenhar linhas de grade horizontais
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        const valor = maxIRRF * (1 - i / 5);
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(valor.toFixed(0), padding - 10, y + 4);
    }
    
    // Desenhar linha do IRRF SEM dedução
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 3;
    ctx.beginPath();
    dados.forEach((d, i) => {
        const x = getX(d.base);
        const y = getY(d.irrfSemDeducao);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Destacar ponto do usuário
    if (baseCalculoUsuario > 0) {
        const xUser = getX(baseCalculoUsuario);
        const yUser = getY(irrfUsuarioSemDeducao);
        
        // Linha vertical tracejada
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(xUser, canvas.height - padding);
        ctx.lineTo(xUser, yUser);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Ponto verde
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(xUser, yUser, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Borda branca no ponto
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label do valor
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`R$ ${irrfUsuarioSemDeducao.toFixed(2)}`, xUser, yUser - 15);
    }
    
    // Legenda
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(padding + 10, padding + 10, 20, 3);
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('IRRF sem Dedução (apenas alíquota)', padding + 35, padding + 15);
    
    if (baseCalculoUsuario > 0) {
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(padding + 20, padding + 30, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillText('Seu cálculo', padding + 35, padding + 34);
    }
}

// Função para formatar moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
}

// Event listener para o botão calcular
document.getElementById('calcular').addEventListener('click', function() {
    const salarioBruto = parseFloat(document.getElementById('salario').value) || 0;
    const numDependentes = parseInt(document.getElementById('dependentes').value) || 0;
    
    if (salarioBruto <= 0) {
        alert('Por favor, insira um salário válido.');
        return;
    }
    
    if (numDependentes < 0) {
        alert('Por favor, insira um número de dependentes válido.');
        return;
    }
    
    // Calcular
    const baseCalculo = calcularBaseCalculo(salarioBruto, numDependentes);
    const irrf = calcularIRRF(baseCalculo);
    const irrfSemDeducao = calcularIRRFSemDeducao(baseCalculo);
    
    // Exibir resultados
    document.getElementById('valorBase').textContent = formatarMoeda(baseCalculo);
    document.getElementById('valorRecolhido').textContent = formatarMoeda(irrf);
    
    // Gerar dados
    const dadosGrafico = gerarDadosGrafico(baseCalculo);
    
    // Desenhar ambos os gráficos
    desenharGrafico1(dadosGrafico, baseCalculo, irrf);
    desenharGrafico2(dadosGrafico, baseCalculo, irrfSemDeducao);
});