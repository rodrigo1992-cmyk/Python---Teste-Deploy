import { Produto, DOMElements, UIService, ConnectionStatus, ProdutoStats } from './types.js';

export class UIServiceImpl implements UIService {
  public elements: DOMElements;

  constructor() {
    this.elements = this.initializeElements();
  }

  private initializeElements(): DOMElements {
    const getElementById = (id: string): HTMLElement => {
      const element = document.getElementById(id);
      if (!element) {
        throw new Error(`Elemento com ID '${id}' não encontrado`);
      }
      return element;
    };

    return {
      productsList: getElementById('productsList'),
      addProductForm: getElementById('addProductForm') as HTMLFormElement,
      reloadBtn: getElementById('reloadBtn') as HTMLButtonElement,
      testConnectionBtn: getElementById('testConnectionBtn') as HTMLButtonElement,
      connectionStatus: getElementById('connectionStatus'),
      categoriaInput: getElementById('categoria') as HTMLInputElement,
      produtoInput: getElementById('produto') as HTMLInputElement,
      precoInput: getElementById('preco') as HTMLInputElement,
      totalCount: getElementById('totalCount'),
      categoryCount: getElementById('categoryCount'),
      avgPrice: getElementById('avgPrice'),
      reloadIcon: getElementById('reloadIcon')
    };
  }

  public updateConnectionStatus(status: ConnectionStatus): void {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    this.elements.connectionStatus.className = `mb-6 p-4 rounded-lg border ${colors[status.type]}`;
    this.elements.connectionStatus.innerHTML = `<p>${status.message}</p>`;
  }

  public displayProducts(produtos: Produto[]): void {
    if (produtos.length === 0) {
      this.elements.productsList.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>📦 Nenhum produto encontrado</p>
          <p class="text-sm mt-2">Adicione o primeiro produto usando o formulário abaixo</p>
        </div>
      `;
      return;
    }

    this.elements.productsList.innerHTML = produtos.map(produto => `
      <div class="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-gray-800">${produto.produto || 'Produto sem nome'}</h3>
            <p class="text-gray-600 capitalize">
              🏷️ ${produto.categoria || 'Categoria não informada'}
            </p>
            <p class="text-brand font-semibold mt-1">
              💰 R$ ${produto.preco || '0'}
            </p>
          </div>
          <div class="text-xs text-gray-400">
            ID: ${produto.id || 'N/A'}
          </div>
        </div>
      </div>
    `).join('');
  }

  public updateStats(produtos: Produto[]): void {
    const stats = this.calculateStats(produtos);
    
    this.elements.totalCount.textContent = stats.totalCount.toString();
    this.elements.categoryCount.textContent = stats.categoryCount.toString();
    this.elements.avgPrice.textContent = stats.avgPrice > 0 ? `R$ ${stats.avgPrice}` : 'R$ 0';
  }

  public showLoading(show: boolean): void {
    if (show) {
      this.elements.productsList.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>⏳ Carregando produtos...</p>
        </div>
      `;
    }
  }

  public clearForm(): void {
    this.elements.addProductForm.reset();
  }

  public getFormData(): { categoria: string; produto: string; preco: string } {
    return {
      categoria: this.elements.categoriaInput.value.trim(),
      produto: this.elements.produtoInput.value.trim(),
      preco: this.elements.precoInput.value.trim()
    };
  }

  public validateFormData(data: { categoria: string; produto: string; preco: string }): boolean {
    if (!data.categoria || !data.produto || !data.preco) {
      alert('⚠️ Preencha todos os campos');
      return false;
    }
    return true;
  }

  public setLoadingIcon(loading: boolean): void {
    this.elements.reloadIcon.textContent = loading ? '⏳' : '🔄';
  }

  public showError(message: string): void {
    this.elements.productsList.innerHTML = `
      <div class="text-center py-8 text-red-500">
        <p>❌ ${message}</p>
        <p class="text-xs mt-2 text-gray-500">Verifique o Console (F12) para mais detalhes</p>
      </div>
    `;
  }

  private calculateStats(produtos: Produto[]): ProdutoStats {
    const totalCount = produtos.length;
    const categorias = [...new Set(produtos.map(p => p.categoria).filter(Boolean))];
    const precos = produtos.map(p => parseFloat(p.preco || '0')).filter(p => p > 0);
    const avgPrice = precos.length > 0 ? 
      Math.round(precos.reduce((a, b) => a + b, 0) / precos.length) : 0;

    return {
      totalCount,
      categoryCount: categorias.length,
      avgPrice
    };
  }
}