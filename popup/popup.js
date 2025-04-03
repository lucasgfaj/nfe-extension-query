document.getElementById('extrairBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdfInput');
    const resultadoDiv = document.getElementById('resultado');
    const extrairBtn = document.getElementById('extrairBtn');
    
    if (fileInput.files.length === 0) {
        resultadoDiv.textContent = "Por favor, selecione um arquivo PDF.";
        resultadoDiv.className = 'error';
        return;
    }

    extrairBtn.disabled = true;
    resultadoDiv.textContent = "Processando PDF...";
    resultadoDiv.className = '';
    
    try {
        const file = fileInput.files[0];
        
        if (file.type !== 'application/pdf') {
            throw new Error("O arquivo selecionado não é um PDF válido.");
        }

        const pdfjsLib = await import(chrome.runtime.getURL('/libs/pdf.min.mjs'));
        pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('/libs/pdf.worker.min.mjs');
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        
        // Extrair texto das páginas (limitado a 5 páginas para performance)
        let fullText = '';
        const maxPages = Math.min(pdf.numPages, 5);
        
        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ');
        }
        
        const chaveNFeRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;

        const match = fullText.match(chaveNFeRegex);
        
        console.log("Texto extraído:", fullText);
        console.log("Resultado da regex:", match);

      if (match) {
    const chaveNFe = match[0].replace(/[^0-9]/g, ''); // Pega a primeira ocorrência

    if (chaveNFe.length === 44) {
        resultadoDiv.innerHTML = `
            <div class="success-message">
                <strong>Chave encontrada:</strong>
                <div class="chave-nfe">${formatarChaveNFe(chaveNFe)}</div>
                <button id="copiarChave" class="copy-btn">Copiar</button>
            </div>
        `;
        resultadoDiv.className = 'success';

        document.getElementById('copiarChave').addEventListener('click', () => {
            navigator.clipboard.writeText(chaveNFe);
            const btn = document.getElementById('copiarChave');
            btn.textContent = 'Copiado!';
            setTimeout(() => btn.textContent = 'Copiar', 2000);
        });

        chrome.runtime.sendMessage({
            action: "processarChave",
            chave: chaveNFe
        });
    } else {
        throw new Error(`Chave NFE inválida (${chaveNFe.length} dígitos): ${chaveNFe}`);
    }
} else {
    throw new Error("Chave NFE não encontrada no documento.");
}
    } catch (error) {
        console.error("Erro ao processar PDF:", error);
        resultadoDiv.textContent = error.message;
        resultadoDiv.className = 'error';
    } finally {
        extrairBtn.disabled = false;
    }
});

// Formatação melhorada da chave
function formatarChaveNFe(chave) {
    // Garante que só tem números
    const nums = chave.replace(/\D/g, '');
    if (nums.length !== 44) return chave; // Retorna original se inválida
    
    return nums.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, 
        '$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11');
}