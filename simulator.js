/* ==========================================================================
   SIMULADOR DE ETIQUETAS - VERSÃO ESTÁVEL
   ========================================================================== */

const MM_TO_PX = 3.78;   
const SCALE_FACTOR = 0.9; 

// ==========================================================================
// 1. ATUALIZAÇÃO DO PAPEL (A4 / CARTA / PERSONALIZADO)
// ==========================================================================
function updatePaper() {
    const type = document.querySelector('input[name="paperSize"]:checked').value;
    const hInput = document.getElementById('pageHeight');
    const wInput = document.getElementById('pageWidth');

    if (type === 'a4') {
        wInput.value = 210.00;
        hInput.value = 297.00;
        wInput.disabled = true;
        hInput.disabled = true;
    } else if (type === 'letter') {
        wInput.value = 215.90;
        hInput.value = 279.40;
        wInput.disabled = true;
        hInput.disabled = true;
    } else {
        wInput.disabled = false;
        hInput.disabled = false;
    }
    updatePreview();
}

// ==========================================================================
// 2. PREVIEW NA TELA
// ==========================================================================
function updatePreview() {
    try {
        const paper = document.getElementById('simulatedPaper');
        const container = document.getElementById('labelsContainer');

        // Inputs de Página
        const pHeight = parseFloat(document.getElementById('pageHeight').value) || 297;
        const pWidth = parseFloat(document.getElementById('pageWidth').value) || 210;
        const mTop = parseFloat(document.getElementById('marginTop').value) || 0;
        const mLeft = parseFloat(document.getElementById('marginLeft').value) || 0;

        // Atualiza tamanho do papel
        paper.style.width = (pWidth * MM_TO_PX * SCALE_FACTOR) + 'px';
        paper.style.height = (pHeight * MM_TO_PX * SCALE_FACTOR) + 'px';

        // Inputs da Etiqueta
        const rows = parseInt(document.getElementById('rows').value) || 1;
        const cols = parseInt(document.getElementById('cols').value) || 1;
        const lHeight = parseFloat(document.getElementById('labelHeight').value) || 25;
        const lWidth = parseFloat(document.getElementById('labelWidth').value) || 60;
        const gapX = parseFloat(document.getElementById('labelGapX').value) || 0;

        // Limpa e recria
        container.innerHTML = '';

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const topPos = mTop + (r * lHeight);
                const leftPos = mLeft + (c * (lWidth + gapX));
                createVisualLabel(topPos, leftPos, lHeight, lWidth);
            }
        }
    } catch (e) {
        console.error("Erro ao atualizar preview:", e);
    }
}

function createVisualLabel(top, left, height, width) {
    const container = document.getElementById('labelsContainer');
    const el = document.createElement('div');
    el.className = 'sim-label';

    el.style.top = (top * MM_TO_PX * SCALE_FACTOR) + 'px';
    el.style.left = (left * MM_TO_PX * SCALE_FACTOR) + 'px';
    el.style.height = (height * MM_TO_PX * SCALE_FACTOR) + 'px';
    el.style.width = (width * MM_TO_PX * SCALE_FACTOR) + 'px';

    // --- CÓDIGO DE BARRAS (Centralização via JS) ---
    if (document.getElementById('showBarcode').checked) {
        const bTop = parseFloat(document.getElementById('barcodeTop').value) || 0;
        const bH = parseFloat(document.getElementById('barcodeHeight').value) || 10;
        const bW = parseFloat(document.getElementById('barcodeWidth').value) || 30;

        // CÁLCULO DA CENTRALIZAÇÃO MATEMÁTICA
        // Margem Esquerda = (Largura Etiqueta - Largura Código) / 2
        const centeredLeft = (width - bW) / 2;

        const barcodeUrl = getBarcodeDataUrl("123456789012");

        if (barcodeUrl) {
            const img = document.createElement('img');
            img.className = 'sim-element sim-barcode-img';
            img.src = barcodeUrl;
            
            // Aplica as posições calculadas
            img.style.top = (bTop * MM_TO_PX * SCALE_FACTOR) + 'px';
            img.style.left = (centeredLeft * MM_TO_PX * SCALE_FACTOR) + 'px'; // AQUI ESTÁ A MÁGICA
            img.style.height = (bH * MM_TO_PX * SCALE_FACTOR) + 'px';
            img.style.width = (bW * MM_TO_PX * SCALE_FACTOR) + 'px';
            
            el.appendChild(img);
        } else {
            // Fallback (Erro)
            const fallback = document.createElement('div');
            fallback.className = 'sim-element';
            fallback.style.backgroundColor = '#ccc';
            fallback.style.top = (bTop * MM_TO_PX * SCALE_FACTOR) + 'px';
            fallback.style.left = (centeredLeft * MM_TO_PX * SCALE_FACTOR) + 'px'; // Centraliza o fallback também
            fallback.style.height = (bH * MM_TO_PX * SCALE_FACTOR) + 'px';
            fallback.style.width = (bW * MM_TO_PX * SCALE_FACTOR) + 'px';
            el.appendChild(fallback);
        }
    }

    // --- TEXTOS ---
    addVisualText(el, 'showCode', 'codeTop', 'codeSize', '123456789012');
    addVisualText(el, 'showDesc', 'descTop', 'descSize', 'PRODUTO TESTE');
    addVisualText(el, 'showPrice', 'priceTop', 'priceSize', 'R$ 99,90');

    container.appendChild(el);
}

function addVisualText(container, checkId, topId, sizeId, textVal) {
    if (document.getElementById(checkId).checked) {
        const top = parseFloat(document.getElementById(topId).value) || 0;
        const size = parseFloat(document.getElementById(sizeId).value) || 10;
        
        const txt = document.createElement('div');
        txt.className = 'sim-element';
        txt.innerText = textVal;
        txt.style.top = (top * MM_TO_PX * SCALE_FACTOR) + 'px';
        txt.style.fontSize = (size * SCALE_FACTOR * 1.3) + 'px'; 
        container.appendChild(txt);
    }
}

// ==========================================================================
// 3. GERAR PDF
// ==========================================================================
async function generatePDF() {
    try {
        if (!window.jspdf) {
            alert("Erro: Biblioteca jsPDF não carregada.");
            return;
        }
        const { jsPDF } = window.jspdf;

        // Config Papel
        const pWidth = parseFloat(document.getElementById('pageWidth').value) || 210;
        const pHeight = parseFloat(document.getElementById('pageHeight').value) || 297;
        const orientation = pWidth > pHeight ? 'l' : 'p';

        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: [pWidth, pHeight]
        });

        // Configs
        const mTop = parseFloat(document.getElementById('marginTop').value) || 0;
        const mLeft = parseFloat(document.getElementById('marginLeft').value) || 0;
        const rows = parseInt(document.getElementById('rows').value) || 1;
        const cols = parseInt(document.getElementById('cols').value) || 1;
        const lHeight = parseFloat(document.getElementById('labelHeight').value) || 25;
        const lWidth = parseFloat(document.getElementById('labelWidth').value) || 60;
        const gapX = parseFloat(document.getElementById('labelGapX').value) || 0;

        // Prepara barcode
        const barcodeUrl = getBarcodeDataUrl("123456789012");

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const posX = mLeft + (c * (lWidth + gapX));
                const posY = mTop + (r * lHeight);

                // Imprimir Barcode
                if (document.getElementById('showBarcode').checked) {
                    const bTop = parseFloat(document.getElementById('barcodeTop').value) || 0;
                    const bH = parseFloat(document.getElementById('barcodeHeight').value) || 10;
                    const bW = parseFloat(document.getElementById('barcodeWidth').value) || 30;
                    
                    const bX = posX + ((lWidth - bW) / 2);
                    const bY = posY + bTop;

                    if (barcodeUrl) {
                        doc.addImage(barcodeUrl, 'PNG', bX, bY, bW, bH);
                    } else {
                        // Fallback no PDF: Retângulo Preto
                        doc.setFillColor(0, 0, 0);
                        doc.rect(bX, bY, bW, bH, 'F');
                    }
                }

                // Imprimir Textos
                doc.setTextColor(0, 0, 0);
                const addPdfText = (checkId, topId, sizeId, text) => {
                    if (document.getElementById(checkId).checked) {
                        const tTop = parseFloat(document.getElementById(topId).value) || 0;
                        const fSize = parseFloat(document.getElementById(sizeId).value) || 10;
                        doc.setFontSize(fSize);
                        doc.text(text, posX + (lWidth / 2), posY + tTop, { 
                            align: 'center',
                            baseline: 'top' 
                        });
                    }
                };
                addPdfText('showCode', 'codeTop', 'codeSize', '123456789012');
                addPdfText('showDesc', 'descTop', 'descSize', 'PRODUTO TESTE');
                addPdfText('showPrice', 'priceTop', 'priceSize', 'R$ 99,90');
            }
        }
        doc.save('etiquetas.pdf');

    } catch (e) {
        console.error("Erro ao gerar PDF:", e);
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console.");
    }
}

// ==========================================================================
// 4. FUNÇÃO SEGURA PARA GERAR BARCODE
// ==========================================================================
function getBarcodeDataUrl(text) {
    // Verificação de Segurança: A biblioteca existe?
    if (typeof JsBarcode === 'undefined') {
        console.warn("Aviso: Biblioteca JsBarcode não encontrada ou não carregada.");
        return null; // Retorna nulo para não travar o script
    }

    try {
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, text, {
            format: "CODE128",
            displayValue: false,
            margin: 0,
            height: 100,
            width: 2
        });
        return canvas.toDataURL("image/png");
    } catch (err) {
        console.error("Erro interno no JsBarcode:", err);
        return null;
    }
}

// Inicializar
window.onload = function() {
    updatePaper();
};