/**
 * Shared JavaScript Logic for NFC-e Tools
 * Centralized Navigation & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    renderNavigation();
    initMobileMenu();
});

// --- CONFIGURAÇÃO DO MENU ---
const menuConfig = [
    { label: 'Início', href: 'index.html' },
    { label: 'NFC-e por Estado', href: 'mapa_nfce_consulta.html' },
    { label: 'Análise de XML', href: 'analise_xml.html' },
    { label: 'Limpar XML', href: 'xml_cleaner.html' },
    { label: 'Simulador Etiquetas', href: 'simulador_etiquetas.html' },
    {
        label: 'Links úteis',
        isDropdown: true,
        directLinks: [
            { label: 'Cidade Homologada NFS-e', href: 'https://cidades.tecnospeed.com.br/' },
            { label: 'Consultar CNPJ', href: 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_solicitacao.asp' },
            { label: 'Consultar NCM', href: 'https://portalunico.siscomex.gov.br/classif/#/sumario?perfil=publico' },
            { label: 'Consultar NF-e', href: 'https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx' },
            { label: 'Lista de Serviços', href: 'https://www.gov.br/nfse/pt-br/mei-e-demais-empresas/codigos-de-tributacao-nacional-nbs' },
            { label: 'Monitor Sefaz', href: 'https://monitor.tecnospeed.com.br/?&filter-type-chart=bar' },
            { label: 'Portal Nacional NF-e', href: 'https://www.nfe.fazenda.gov.br/' },
            { label: 'Sintegra', href: 'http://www.sintegra.gov.br/' },
            { label: 'Tabela CEST', href: 'https://www.codigocest.com.br/' }
        ]
    }
];

function renderNavigation() {
    const navContainer = document.getElementById('main-navigation');
    if (!navContainer) return;

    const currentPath = window.location.pathname;
    let html = '';

    menuConfig.forEach(item => {
        if (!item.isDropdown) {
            const isActive = (currentPath.includes(item.href) && item.href !== 'index.html') ||
                ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && item.href === 'index.html');

            html += `<a href="${item.href}" class="nav-link cardhover ${isActive ? 'active' : ''}">${item.label}</a>`;
        } else {
            // Ordena os links diretos alfabeticamente por label antes de renderizar
            const sortedLinks = (item.directLinks || [])
                .slice()
                .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

            html += `
                <div class="dropdown-container">
                    <button class="nav-link dropdown-trigger">
                        ${item.label}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="dropdown-menu">
                        ${sortedLinks.map(link => `
                            <a href="${link.href}" target="_blank" class="dropdown-item direct-link">${link.label}</a>
                        `).join('')}
                    </div>
                </div>`;
        }
    });

    navContainer.innerHTML = html;
}

function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.onclick = () => navLinks.classList.toggle('active');
    }
}



