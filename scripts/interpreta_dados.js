// interpreta_dados.js
/**
 * interpretacao de dados e diagnotiscos //ta fazendo os graficos errados ainda preciso arrumar antes tava certo
 */

let temperaturaChartInstance = null;
let frequenciaChartInstance = null;
let fftChartInstance = null;

//starta e restarta o dashboard
async function atualizarDashboard() {
    try {
        const dados = await fetchDadosRolamento(); //chama a função do outro arquivo

        
        atualizarGraficoTemperatura(dados.timestamps, dados.temperatura);
        atualizarGraficoFrequencia(dados.timestamps, dados.vibracao);
        atualizarGraficoFFT(dados.fftFrequencias, dados.fft);

        
        document.getElementById('status-rolamento').textContent = 'Monitorando';
        document.getElementById('recomendacao').textContent = 'Sistema em operação normal';

    } catch (error) {
        console.error("Erro ao atualizar o dashboard:", error);
        document.getElementById('recomendacao').textContent = "Não foi possível carregar os dados.";
    }
}

/**
 * temperatura
 */
function atualizarGraficoTemperatura(labels, data) {
    if (temperaturaChartInstance) {
        temperaturaChartInstance.data.labels = labels;
        temperaturaChartInstance.data.datasets[0].data = data;
        temperaturaChartInstance.update();
    }
}

/**
 * frequencia
 */
function atualizarGraficoFrequencia(labels, data) {
    if (frequenciaChartInstance) {
        frequenciaChartInstance.data.labels = labels;
        frequenciaChartInstance.data.datasets[0].data = data;
        frequenciaChartInstance.update();
    }
}

/**
 * FFT (ta 100% errado ainda)
 */
function atualizarGraficoFFT(labels, data) {
    if (fftChartInstance) {
        fftChartInstance.data.labels = labels;
        fftChartInstance.data.datasets[0].data = data;
        fftChartInstance.update();
    }
}

/**
 * padronizacao dos graficos
 */
function inicializarGraficos() {
    const gridOptions = {
        color: 'rgba(0, 0, 0, 0.05)'
    };

    const fontOptions = {
        family: "'Segoe UI', 'Roboto', Tahoma, Geneva, Verdana, sans-serif"
    };

    //so de temp
    const temperaturaCtx = document.getElementById('temperaturaChart').getContext('2d');
    temperaturaChartInstance = new Chart(temperaturaCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperatura (°C)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: fontOptions
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: gridOptions,
                    ticks: {
                        font: fontOptions
                    },
                    title: {
                        display: true,
                        text: 'Temperatura (°C)',
                        font: fontOptions
                    }
                },
                x: {
                    grid: gridOptions,
                    ticks: {
                        font: fontOptions
                    },
                    title: {
                        display: true,
                        text: 'Tempo',
                        font: fontOptions
                    }
                }
            }
        }
    });

    // so de frequencia
    const frequenciaCtx = document.getElementById('frequenciaChart').getContext('2d');
    frequenciaChartInstance = new Chart(frequenciaCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Amplitude de Vibração',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: fontOptions
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: gridOptions,
                    ticks: {
                        font: fontOptions
                    },
                    title: {
                        display: true,
                        text: 'Amplitude (g)',
                        font: fontOptions
                    }
                },
                x: {
                    grid: gridOptions,
                    ticks: {
                        font: fontOptions
                    },
                    title: {
                        display: true,
                        text: 'Tempo',
                        font: fontOptions
                    }
                }
            }
        }
    });

    // so de fft
    const fftCtx = document.getElementById('fftChart').getContext('2d');
    fftChartInstance = new Chart(fftCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Amplitude FFT',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: fontOptions
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: gridOptions,
                    ticks: {
                        font: fontOptions
                    },
                    title: {
                        display: true,
                        text: 'Amplitude',
                        font: fontOptions
                    }
                },
                x: {
                    grid: gridOptions,
                    ticks: {
                        font: fontOptions
                    },
                    title: {
                        display: true,
                        text: 'Frequência (Hz)',
                        font: fontOptions
                    }
                }
            }
        }
    });
}

// carregar quando inicializar e inicializar quando carregar
document.addEventListener('DOMContentLoaded', () => {
    inicializarGraficos();
    atualizarDashboard();

    // att de 5 em 5 sec (ta mudando o tempo todo por conta do random)
    setInterval(atualizarDashboard, 5000);
});