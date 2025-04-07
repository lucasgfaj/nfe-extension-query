chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processarChave") {
        abrirOuFocarSiteSEFAZ(request.chave);
    }
});

async function abrirOuFocarSiteSEFAZ(chave) {
    const url = "https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=7PhJ+gAVw2g=";
    
    const tabs = await chrome.tabs.query({url: "*://www.nfe.fazenda.gov.br/*"});
    
    if (tabs.length > 0) {
        // Atualiza a aba existente e injeta o script
        await chrome.tabs.update(tabs[0].id, {active: true});
        await chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: preencherChaveNfe,
            args: [chave]
        });
    } else {
        // Cria nova aba e espera carregar
        const tab = await chrome.tabs.create({url});
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: preencherChaveNfe,
                    args: [chave]
                });
            }
        });
    }
}

function preencherChaveNfe(chave) {
    const inputField = document.getElementById('ctl00_ContentPlaceHolder1_txtChaveAcessoResumo');
    
    if (inputField) {
        inputField.value = chave;
        // Disparar eventos necessários
        const events = ['change', 'input', 'blur'];
        events.forEach(eventType => {
            inputField.dispatchEvent(new Event(eventType, {bubbles: true}));
        });
        
        // Mostrar mensagem para o usuário
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        notification.textContent = 'Chave NFe preenchida automaticamente!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    } else {
        alert('Campo da chave NFe não encontrado. Por favor, preencha manualmente.');
    }
}