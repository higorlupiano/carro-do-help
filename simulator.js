/* Lógica do Simulador de Etiquetas
   1mm na tela != 1mm na vida real, então usamos um fator de escala (PPI) 
   para visualização web. Vamos assumir aprox 3.78px por mm.
*/

const MM_TO_PX = 3.78;
const SCALE_FACTOR = 0.8; // Zoom out para caber na tela melhor

// Elementos DOM
const paper = document.getElementById('simulatedPaper');
const container = document.getElementById('labelsContainer');

// Função principal de atualização
function updatePreview() {
    // 1. Pegar valores da Página
    const pHeight = parseFloat(document.getElementById('pageHeight').value) || 297;
    const pWidth = parseFloat(document.getElementById('pageWidth').value) || 210;
    const mTop = parseFloat(document.getElementById('marginTop').value) || 0;
    const mLeft = parseFloat(document.getElementById('marginLeft').value) || 0;

    // 2. Aplicar tamanho ao Papel
    paper.style.width = (pWidth * MM_TO_PX * SCALE_FACTOR) + 'px';
    paper.style.height = (pHeight * MM_TO_PX * SCALE_FACTOR) + 'px';

    // 3. Pegar valores da Etiqueta
    const rows = parseInt(document.getElementById('rows').value) || 1;
    const cols = parseInt(document.getElementById('cols').value) || 1;
    const lHeight = parseFloat(document.getElementById('labelHeight').value) || 25;
    const lWidth = parseFloat(document.getElementById('labelWidth').value) || 60;
    const gapX = parseFloat(document.getElementById('labelGapX').value) || 3;

    // 4. Limpar etiquetas anteriores
    container.innerHTML = '';

    // 5. Loop para criar etiquetas
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            createLabel(r, c, mTop, mLeft, lHeight, lWidth, gapX);
        }
    }
}

function createLabel(row, col, marginTop, marginLeft, height, width, gapX) {
    const el = document.createElement('div');
    el.className = 'sim-label';

    // Cálculo de Posição (Absoluta dentro do papel)
    // Topo = MargemPagina + (Linha * AlturaEtiqueta)
    // Esquerda = MargemPagina + (Coluna * (LarguraEtiqueta + Gap))
    
    // Nota: A imagem sugere gap vertical zero ou automático, vamos assumir 0 entre linhas 
    // ou adicionar um campo 'gapY' se necessário. Assumindo 0 por enquanto.
    
    const topPos = marginTop + (row * height); 
    const leftPos = marginLeft + (col * (width + gapX));

    el.style.top = (topPos * MM_TO_PX * SCALE_FACTOR) + 'px';
    el.style.left = (leftPos * MM_TO_PX * SCALE_FACTOR) + 'px';
    el.style.height = (height * MM_TO_PX * SCALE_FACTOR) + 'px';
    el.style.width = (width * MM_TO_PX * SCALE_FACTOR) + 'px';

    // Conteúdo da Etiqueta
    addLabelContent(el);

    container.appendChild(el);
}

function addLabelContent(labelDiv) {
    // 1. Código de Barras
    const showBarcode = document.getElementById('showBarcode').checked;
    if (showBarcode) {
        const bTop = parseFloat(document.getElementById('barcodeTop').value) || 0;
        const bH = parseFloat(document.getElementById('barcodeHeight').value) || 10;
        const bW = parseFloat(document.getElementById('barcodeWidth').value) || 30;

        const bar = document.createElement('div');
        bar.className = 'sim-element sim-barcode';
        bar.style.top = (bTop * MM_TO_PX * SCALE_FACTOR) + 'px';
        bar.style.height = (bH * MM_TO_PX * SCALE_FACTOR) + 'px';
        bar.style.width = (bW * MM_TO_PX * SCALE_FACTOR) + 'px';
        labelDiv.appendChild(bar);
    }

    // 2. Textos
    addText(labelDiv, 'showCode', 'codeTop', 'codeSize', '123456');
    addText(labelDiv, 'showDesc', 'descTop', 'descSize', 'PRODUTO EXEMPLO');
    addText(labelDiv, 'showPrice', 'priceTop', 'priceSize', 'R$ 99,90');
}

function addText(container, checkId, topId, sizeId, sampleText) {
    if (document.getElementById(checkId).checked) {
        const top = parseFloat(document.getElementById(topId).value) || 0;
        const size = parseFloat(document.getElementById(sizeId).value) || 10;
        
        const txt = document.createElement('div');
        txt.className = 'sim-element';
        txt.innerText = sampleText;
        txt.style.top = (top * MM_TO_PX * SCALE_FACTOR) + 'px';
        // Ajuste fino de fonte baseado na escala
        txt.style.fontSize = (size * SCALE_FACTOR * 1.5) + 'px'; 
        
        container.appendChild(txt);
    }
}

// Lógica de presets de Papel
function updatePaper() {
    const type = document.querySelector('input[name="paperSize"]:checked').value;
    const hInput = document.getElementById('pageHeight');
    const wInput = document.getElementById('pageWidth');

    if (type === 'a4') {
        hInput.value = 297;
        wInput.value = 210;
        // Opcional: Desabilitar inputs se for A4 fixo
        // hInput.disabled = true;
        // wInput.disabled = true;
    } else {
        // hInput.disabled = false;
        // wInput.disabled = false;
    }
    updatePreview();
}

// Inicializar
window.onload = updatePreview;

// FUNÇÃO ACIONADA PELO BOTÃO "IMPRIMIR TESTE"
async function generatePDF() {
    const { jsPDF } = window.jspdf;

    // 1. Configurações da Página (Pega do formulário)
    const pWidth = parseFloat(document.getElementById('pageWidth').value) || 210;
    const pHeight = parseFloat(document.getElementById('pageHeight').value) || 297;
    
    // Define orientação baseado nas medidas (Paisagem ou Retrato)
    const orientation = pWidth > pHeight ? 'l' : 'p';

    // Cria o PDF
    const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: [pWidth, pHeight] 
    });

    // 2. Configurações da Etiqueta
    const mTop = parseFloat(document.getElementById('marginTop').value) || 0;
    const mLeft = parseFloat(document.getElementById('marginLeft').value) || 0;
    
    const rows = parseInt(document.getElementById('rows').value) || 1;
    const cols = parseInt(document.getElementById('cols').value) || 1;
    
    const lHeight = parseFloat(document.getElementById('labelHeight').value) || 25;
    const lWidth = parseFloat(document.getElementById('labelWidth').value) || 60;
    const gapX = parseFloat(document.getElementById('labelGapX').value) || 0;

    // 3. Desenhar cada etiqueta
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            
            // Posição X e Y da etiqueta atual
            const posX = mLeft + (c * (lWidth + gapX));
            const posY = mTop + (r * lHeight);

            // --- Conteúdo da Etiqueta ---
            
            // Código de Barras (Simulação visual: Retângulo Preto)
            if (document.getElementById('showBarcode').checked) {
                const bTop = parseFloat(document.getElementById('barcodeTop').value) || 0;
                const bH = parseFloat(document.getElementById('barcodeHeight').value) || 10;
                const bW = parseFloat(document.getElementById('barcodeWidth').value) || 30;
                
                // Centraliza o código na largura da etiqueta
                const bX = posX + (lWidth - bW) / 2;
                
                doc.setFillColor(0, 0, 0);
                doc.rect(bX, posY + bTop, bW, bH, 'F');
            }

            // Textos
            doc.setTextColor(0, 0, 0);
            
            // Função auxiliar para imprimir texto se o checkbox estiver marcado
            const printText = (checkId, topId, sizeId, text) => {
                if (document.getElementById(checkId).checked) {
                    const tTop = parseFloat(document.getElementById(topId).value) || 0;
                    const size = parseFloat(document.getElementById(sizeId).value) || 10;
                    
                    // Ajuste de tamanho de fonte (conversão empírica pt -> mm visual)
                    doc.setFontSize(size * 2.8); 
                    
                    // Centraliza o texto horizontalmente na etiqueta
                    doc.text(text, posX + (lWidth / 2), posY + tTop, { align: 'center' });
                }
            };

            printText('showCode', 'codeTop', 'codeSize', '123456');
            printText('showDesc', 'descTop', 'descSize', 'PRODUTO TESTE');
            printText('showPrice', 'priceTop', 'priceSize', 'R$ 99,90');
        }
    }

    // 4. Salvar arquivo
    doc.save('teste_etiquetas.pdf');
}