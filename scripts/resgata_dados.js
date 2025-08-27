/**
 * resgata_dados.js
 * Simula a busca de dados do servidor com valores mais realistas.
 */

async function fetchDadosRolamento() {
    console.log("Buscando dados do servidor... (simulação)");
    return gerarDadosSimulados();
}

function gerarDadosSimulados() {
    // --- Dados de Temperatura ---
    const timestamps_temp = [];
    const temperaturaData = [];
    for (let i = 0; i < 10; i++) {
        timestamps_temp.push(i * 2 + 's'); // Simula 20 segundos
        temperaturaData.push(55 + Math.random() * 10);
    }

    // --- Dados de Vibração (com amplitudes ajustadas) ---
    const nAmostras = 2048; 
    const taxaAmostragem = 5120; // Exemplo de taxa de amostragem
    const timestamps_vib = [];
    const vibracaoData = [];
    
    // Frequências que simulam uma falha
    const freq1 = 75;  // Frequência de exemplo
    const freq2 = 180; // Harmônico ou outra falha

    for (let i = 0; i < nAmostras; i++) {
        const tempo = i / taxaAmostragem;
        timestamps_vib.push(tempo.toFixed(4));
        
        // SINAL COM AMPLITUDES AJUSTADAS (ex: 0.2 + 0.1 + ruído)
        const sinal = 0.2 * Math.sin(2 * Math.PI * freq1 * tempo) +
                      0.1 * Math.sin(2 * Math.PI * freq2 * tempo) +
                      (Math.random() - 0.5) * 0.1; // Ruído de fundo reduzido                  
        vibracaoData.push(sinal);
    }
    
    // Simula um pequeno atraso de rede
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                // Dados para o Gráfico de Temperatura
                timestamps_temp: timestamps_temp,
                temperatura: temperaturaData,

                // Dados para o Gráfico de Vibração e para o cálculo da FFT
                timestamps_vib: timestamps_vib,
                vibracao: vibracaoData,
                taxaAmostragem: taxaAmostragem,
                nAmostras: nAmostras
            });
        }, 500);
    });
}