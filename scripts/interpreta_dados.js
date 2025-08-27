/**
 * interpreta_dados.js
 * VERSÃO FINAL: Inclui um algoritmo de FFT interno e gráfico de temperatura apenas com linha.
 */

// --- INÍCIO DO ALGORITMO DE FFT EMBUTIDO ---
// Este código implementa a Transformada Rápida de Fourier (FFT).
function FFT(bufferSize, sampleRate) {
  this.bufferSize = bufferSize;
  this.sampleRate = sampleRate;
  this.spectrum = new Float32Array(bufferSize / 2);
  this.real = new Float32Array(bufferSize);
  this.imag = new Float32Array(bufferSize);
  this.reverseTable = new Uint32Array(bufferSize);
  
  let limit = 1;
  let bit = bufferSize >> 1;
  while (limit < bufferSize) {
    for (let i = 0; i < limit; i++) {
      this.reverseTable[i + limit] = this.reverseTable[i] + bit;
    }
    limit = limit << 1;
    bit = bit >> 1;
  }

  this.sinTable = new Float32Array(bufferSize);
  this.cosTable = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    this.sinTable[i] = Math.sin(-Math.PI / i);
    this.cosTable[i] = Math.cos(-Math.PI / i);
  }
}

FFT.prototype.forward = function(buffer) {
  const bufferSize = this.bufferSize;
  const cosTable = this.cosTable;
  const sinTable = this.sinTable;
  const reverseTable = this.reverseTable;
  const real = this.real;
  const imag = this.imag;
  const spectrum = this.spectrum;

  if (bufferSize !== buffer.length) {
    throw new Error('Buffer size must be the same as FFT size.');
  }

  for (let i = 0; i < bufferSize; i++) {
    real[i] = buffer[reverseTable[i]];
    imag[i] = 0;
  }

  let halfSize = 1;
  while (halfSize < bufferSize) {
    const phaseShiftStepReal = cosTable[halfSize];
    const phaseShiftStepImag = sinTable[halfSize];
    let currentPhaseReal = 1;
    let currentPhaseImag = 0;

    for (let fftStep = 0; fftStep < halfSize; fftStep++) {
      let i = fftStep;
      while (i < bufferSize) {
        const off = i + halfSize;
        const tr = (currentPhaseReal * real[off]) - (currentPhaseImag * imag[off]);
        const ti = (currentPhaseReal * imag[off]) + (currentPhaseImag * real[off]);
        real[off] = real[i] - tr;
        imag[off] = imag[i] - ti;
        real[i] += tr;
        imag[i] += ti;
        i += halfSize << 1;
      }
      const tmpReal = currentPhaseReal;
      currentPhaseReal = (tmpReal * phaseShiftStepReal) - (currentPhaseImag * phaseShiftStepImag);
      currentPhaseImag = (tmpReal * phaseShiftStepImag) + (currentPhaseImag * phaseShiftStepReal);
    }
    halfSize = halfSize << 1;
  }

  for (let i = 0, N = bufferSize / 2; i < N; i++) {
    const r = real[i];
    const im = imag[i];
    spectrum[i] = (2 * Math.sqrt(r * r + im * im)) / bufferSize;
  }
};
// --- FIM DO ALGORITMO DE FFT EMBUTIDO ---


// --- LÓGICA DO DASHBOARD ---

const basePlotlyLayout = {
    height: 250,
    font: {
        family: "'Segoe UI', 'Roboto', Tahoma, Geneva, Verdana, sans-serif",
        color: '#37474f'
    },
    paper_bgcolor: 'rgba(0,0,0,0)', 
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 60, r: 20, b: 50, t: 40 },
    xaxis: { gridcolor: 'rgba(0, 0, 0, 0.05)', zeroline: false },
    yaxis: { gridcolor: 'rgba(0, 0, 0, 0.05)', zeroline: false },
    showlegend: false
};

const basePlotlyConfig = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d', 'lasso2d']
};

async function atualizarDashboard() {
    try {
        const dados = await fetchDadosRolamento();
        renderizarGraficosPlotly(dados);
        document.getElementById('status-rolamento').textContent = 'Monitorando';
        document.getElementById('recomendacao').textContent = 'Sistema em operação normal';
    } catch (error) {
        console.error("Erro ao atualizar o dashboard:", error);
        document.getElementById('recomendacao').textContent = "Não foi possível carregar os dados.";
    }
}

function renderizarGraficosPlotly(dados) {
    // 1. Gráfico de Temperatura (ALTERADO PARA APENAS LINHA)
    const temperaturaTrace = [{
        x: dados.timestamps_temp,
        y: dados.temperatura,
        type: 'scatter',
        mode: 'lines', // Alterado de 'lines+markers' para 'lines'
        // fill: 'tozeroy' foi removido
        line: { color: 'rgb(255, 99, 132)', width: 2.5 }
        // marker: { ... } foi removido
    }];
    const temperaturaLayout = {
        ...basePlotlyLayout,
        title: { text: '<b>Temperatura do Rolamento</b>' },
        yaxis: { ...basePlotlyLayout.yaxis, title: 'Temperatura (°C)' },
        xaxis: { ...basePlotlyLayout.xaxis, title: 'Tempo (s)' }
    };
    Plotly.react('temperaturaChart', temperaturaTrace, temperaturaLayout, basePlotlyConfig);

    // 2. Gráfico de Vibração
    const frequenciaTrace = [{
        x: dados.timestamps_vib,
        y: dados.vibracao,
        type: 'scatter', mode: 'lines',
        line: { color: 'rgb(54, 162, 235)', width: 1.5 }
    }];
    const frequenciaLayout = {
        ...basePlotlyLayout,
        title: { text: '<b>Vibração no Domínio do Tempo</b>' },
        yaxis: { ...basePlotlyLayout.yaxis, title: 'Amplitude (g)' },
        xaxis: { ...basePlotlyLayout.xaxis, title: 'Tempo (s)' }
    };
    Plotly.react('frequenciaChart', frequenciaTrace, frequenciaLayout, basePlotlyConfig);

    // 3. Gráfico FFT
    const fft = new FFT(dados.nAmostras, dados.taxaAmostragem);
    fft.forward(dados.vibracao);
    const magnitudes = Array.from(fft.spectrum);
    
    const frequencias = [];
    for (let i = 0; i < magnitudes.length; i++) {
        frequencias.push(i * (dados.taxaAmostragem / dados.nAmostras));
    }

    const fftTrace = [{
        x: frequencias,
        y: magnitudes,
        type: 'bar',
        marker: { color: 'rgba(75, 192, 192, 0.8)' }
    }];
    const fftLayout = {
        ...basePlotlyLayout, height: 260,
        title: { text: '<b>Análise de Frequência (FFT)</b>' },
        yaxis: { ...basePlotlyLayout.yaxis, title: 'Amplitude' },
        xaxis: { ...basePlotlyLayout.xaxis, title: 'Frequência (Hz)' }
    };
    Plotly.react('fftChart', fftTrace, fftLayout, basePlotlyConfig);
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarDashboard();
});