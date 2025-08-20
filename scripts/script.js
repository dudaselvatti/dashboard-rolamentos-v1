// visual.js
//logica da interface

//config de attualizacao
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-atualizar').addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Atualizando...';
        atualizarDashboard().then(() => {
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Dados';
        });
    });
    
    // add dos botoes depois
    const iconButtons = document.querySelectorAll('.card-actions button');
    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            //simulacao de clique
            this.style.backgroundColor = '#e0e0e0';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 300);
        });
    });
});