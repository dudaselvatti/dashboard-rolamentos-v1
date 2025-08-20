// resgata_dados.js
/**
 * em uma aplicação real, esta função faria uma requisição (fetch)
 * para um servidor ou API para obter os dados mais recentes do sensor do rolamento.
 * por enquanto, ela retorna dados fictícios para fins de desenvolvimento.
 */

async function fetchDadosRolamento() {
    console.log("Buscando dados do servidor... (simulação)");

    // Exemplo de como buscar dados de um CSV (comentado para implementação futura)
    /*
    try {
        const response = await fetch('dados-rolamento.csv');
        if (!response.ok) {
            throw new Error('Erro ao carregar arquivo CSV');
        }
        const csvData = await response.text();
        return processarCSV(csvData);
    } catch (error) {
        console.error("Erro ao carregar dados do CSV:", error);
        // Fallback para dados simulados
        return gerarDadosSimulados();
    }
    */

    // Geração de dados simulados
    return gerarDadosSimulados();
}

// aqui ta tudo errado meu deus queria importar a biblioteca mas so consegui no python ate agora
function gerarDadosSimulados() {
    const agora = new Date();
    const timestamps = [];
    const temperaturaData = [];
    const vibracaoData = [];
    const fftFrequencias = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
    const fftData = [];

    // Gerar dados para os últimos 10 minutos
    for (let i = 9; i >= 0; i--) {
        const time = new Date(agora.getTime() - i * 60000);
        timestamps.push(time.getMinutes() + ':' + time.getSeconds().toString().padStart(2, '0'));
        
        // Temperatura com tendência de aumento
        temperaturaData.push(65 + Math.random() * 10);
        
        // Vibração com padrão oscilatório
        vibracaoData.push((Math.sin(i) + 1) * 2 + Math.random() * 0.5);
    }

    // Dados FFT com picos em frequências específicas
    for (let i = 0; i < 10; i++) {
        let valor = Math.random() * 0.5;
        // Criar picos em 30Hz, 50Hz e 80Hz
        if (i === 2) valor = 2.5 + Math.random() * 0.5; // 30Hz
        if (i === 4) valor = 3.0 + Math.random() * 0.8; // 50Hz
        if (i === 7) valor = 1.8 + Math.random() * 0.4; // 80Hz
        fftData.push(valor);
    }

    // simula um pequeno atraso de rede
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                timestamps: timestamps,
                temperatura: temperaturaData,
                vibracao: vibracaoData,
                fftFrequencias: fftFrequencias,
                fft: fftData
            });
        }, 500);
    });
}

// Função para processar CSV (para implementação futura)
function processarCSV(csvData) {
    /*
    const linhas = csvData.split('\n');
    const dados = {
        timestamps: [],
        temperatura: [],
        vibracao: [],
        fftFrequencias: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
        fft: []
    };
    
    // Pular cabeçalho e processar linhas
    for (let i = 1; i < linhas.length; i++) {
        const valores = linhas[i].split(',');
        if (valores.length >= 3) {
            dados.timestamps.push(valores[0]);
            dados.temperatura.push(parseFloat(valores[1]));
            dados.vibracao.push(parseFloat(valores[2]));
        }
    }
    
    // Processar dados FFT (última linha)
    const ultimaLinha = linhas[linhas.length - 1].split(',');
    if (ultimaLinha.length > 3) {
        for (let i = 3; i < ultimaLinha.length; i++) {
            dados.fft.push(parseFloat(ultimaLinha[i]));
        }
    }
    
    return dados;
    */
    
    // Por enquanto, retorna dados simulados
    return gerarDadosSimulados();
}