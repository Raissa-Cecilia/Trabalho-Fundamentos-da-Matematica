document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcular');


    function funcao(x) {
        // Exemplo: f(x) = x² - 2
        return x * x - 2;
    }

    function metodoBissecao() {
        const xInicial = parseFloat(document.getElementById('xInicial').value);
        const xFinal = parseFloat(document.getElementById('xFinal').value);
        const tolerancia = parseFloat(document.getElementById('tolerancia').value);
        const maxIteracoes = parseInt(document.getElementById('maxIteracoes').value);

        // Limpar tabela anterior
        const tabelaDados = document.getElementById('tabelaDados');
        tabelaDados.innerHTML = '';

        // Verificar se o intervalo é válido
        const fInicial = funcao(xInicial);
        const fFinal = funcao(xFinal);
        
        let statusIntervalo = document.getElementById('statusIntervalo');
        
        if (fInicial * fFinal >= 0) {
            statusIntervalo.textContent = "Intervalo inválido! f(x inicial) e f(x final) devem ter sinais opostos.";
            statusIntervalo.style.color = "red";
            return;
        } else {
            statusIntervalo.textContent = "Intervalo válido";
            statusIntervalo.style.color = "green";
        }

        let x1 = xInicial;
        let x2 = xFinal;
        let iteracao = 0;
        let toleranciaAtual = Math.abs(x2 - x1);
        let raiz = 0;

        while (iteracao < maxIteracoes && toleranciaAtual > tolerancia) {
            iteracao++;
            
            const xMedio = (x1 + x2) / 2;
            const f1 = funcao(x1);
            const fMedio = funcao(xMedio);
            const f2 = funcao(x2);
            
            toleranciaAtual = Math.abs(x2 - x1);

            // Adicionar linha na tabela
            const linha = document.createElement('tr');
            
            linha.innerHTML = `
                <td>${iteracao}</td>
                <td>${x1.toFixed(6)}</td>
                <td>${xMedio.toFixed(6)}</td>
                <td>${x2.toFixed(6)}</td>
                <td>${f1.toFixed(6)}</td>
                <td>${fMedio.toFixed(6)}</td>
                <td>${f2.toFixed(6)}</td>
                <td>${toleranciaAtual.toFixed(6)}</td>
            `;
            
            tabelaDados.appendChild(linha);

            // Atualizar intervalo
            if (f1 * fMedio < 0) {
                x2 = xMedio;
            } else {
                x1 = xMedio;
            }

            raiz = xMedio;
        }

        // Mostrar resultado final
        const resultadoFinal = document.getElementById('resultadoFinal');
        resultadoFinal.textContent = `Raiz aproximada: x = ${raiz.toFixed(6)}, f(x) = ${funcao(raiz).toFixed(6)}`;
    }

    calcularBtn.addEventListener('click', metodoBissecao);
});