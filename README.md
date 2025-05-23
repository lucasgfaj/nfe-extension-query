# Extensão para Leitor de Chaves NFE

🔍 **Objetivo**: Extrair automaticamente chaves de NFe (Nota Fiscal Eletrônica) de arquivos PDF e preencher no site da SEFAZ para consulta.

---

## 📥 Instalação (Modo Desenvolvedor)

Siga estes passos para instalar a extensão no Chrome/Edge no modo desenvolvedor:

### Navegadores Baseados no Chromium (Chrome, Edge, Brave, etc.)

1. **Baixe os arquivos da extensão**
   - Faça download do arquivo ZIP da extensão
   - Extraia os arquivos em uma pasta no seu computador

2. **Acesse as configurações de extensão**
   - Digite na barra de URL: `chrome://extensions/`
   - Ou no Edge: `edge://extensions/`

3. **Ative o Modo Desenvolvedor**
   - No canto superior direito, ative o switch **"Modo do desenvolvedor"**

4. **Carregue a extensão**
   - Clique no botão **"Carregar sem compactação"**
   - Selecione a pasta onde extraiu os arquivos da extensão
   - Clique em **"Selecionar Pasta"**

5. **Confirme a instalação**
   - A extensão aparecerá na sua barra de extensões
   - Pode fixá-la para fácil acesso clicando no ícone de "pin"

---

## 🛠 Como Usar

1. **Acesse o site da SEFAZ**
   - Abra: [Consulta NFe](https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo)

2. **Clique no ícone da extensão**
   - Selecione o arquivo PDF da NFe
   - Aguarde o processamento

3. **Chave será preenchida automaticamente**
   - A extensão extrai a chave de 44 dígitos
   - Preenche no campo correto do site
   - Copie se necessário com o botão dedicado

---

## ⚠️ Solução de Problemas

### Erro ao carregar PDF
- Verifique se o arquivo é um PDF válido
- Confira se a chave está visível no documento

### Extensão não aparece
- Recarregue a página (`Ctrl+F5`)
- Verifique se a extensão está ativa em `chrome://extensions`

### Problemas com Worker
- Certifique-se que os arquivos `pdf.worker.min.mjs` estão na pasta `/libs/`

---
