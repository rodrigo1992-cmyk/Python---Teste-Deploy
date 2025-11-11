import { FirebaseServiceImpl } from './firebase-service.js';
import { UIServiceImpl } from './ui-service.js';
import { AppConfig, FirebaseConfig } from './types.js';

class App {
  private firebaseService: FirebaseServiceImpl;
  private uiService: UIServiceImpl;
  private config: AppConfig;

  constructor() {
    this.config = this.getAppConfig();
    this.uiService = new UIServiceImpl();
    this.firebaseService = new FirebaseServiceImpl(this.config.firebase);
    
    this.setupFirebaseCallbacks();
    this.setupEventListeners();
  }

  private getAppConfig(): AppConfig {
    // ⚠️ CONFIGURAÇÃO SEGURA VIA GITHUB SECRETS
    // Configuração carregada de firebase-config.js (gerado via GitHub Actions)
    const firebaseConfig: FirebaseConfig = {
      apiKey: (window as any).firebaseConfig?.apiKey || "CONFIGURE_SUA_API_KEY",
      authDomain: (window as any).firebaseConfig?.authDomain || "seu-projeto.firebaseapp.com",
      projectId: (window as any).firebaseConfig?.projectId || "seu-projeto-id",
      storageBucket: (window as any).firebaseConfig?.storageBucket || "seu-projeto.firebasestorage.app",
      messagingSenderId: (window as any).firebaseConfig?.messagingSenderId || "123456789",
      appId: (window as any).firebaseConfig?.appId || "CONFIGURE_SEU_APP_ID"
    };

    return {
      firebase: firebaseConfig,
      ui: {
        collectionName: "produto",
        autoReload: true,
        debugMode: true
      }
    };
  }

  private setupFirebaseCallbacks(): void {
    this.firebaseService.setCallbacks(
      (produtos) => {
        this.uiService.displayProducts(produtos);
        this.uiService.updateStats(produtos);
      },
      (status) => {
        this.uiService.updateConnectionStatus(status);
      }
    );
  }

  private setupEventListeners(): void {
    // Form submission
    this.uiService.elements.addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleAddProduct();
    });

    // Test connection button
    this.uiService.elements.testConnectionBtn.addEventListener('click', async () => {
      await this.handleTestConnection();
    });

    // Reload button
    this.uiService.elements.reloadBtn.addEventListener('click', () => {
      this.handleReload();
    });
  }

  private async handleAddProduct(): Promise<void> {
    const formData = this.uiService.getFormData();
    
    if (!this.uiService.validateFormData(formData)) {
      return;
    }

    try {
      await this.firebaseService.addProduct(formData);
      this.uiService.clearForm();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      this.uiService.updateConnectionStatus({
        message: `❌ Erro ao adicionar produto: ${(error as Error).message}`,
        type: 'error'
      });
    }
  }

  private async handleTestConnection(): Promise<void> {
    try {
      await this.firebaseService.testConnection();
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
    }
  }

  private handleReload(): void {
    this.uiService.setLoadingIcon(true);
    setTimeout(async () => {
      try {
        await this.firebaseService.loadProducts();
      } catch (error) {
        console.error('Erro ao recarregar:', error);
        this.uiService.updateConnectionStatus({
          message: `❌ Erro ao recarregar: ${(error as Error).message}`,
          type: 'error'
        });
      } finally {
        this.uiService.setLoadingIcon(false);
      }
    }, 500);
  }

  public async initialize(): Promise<void> {
    try {
      this.uiService.showLoading(true);
      await this.firebaseService.connect();
      this.checkConfiguration();
    } catch (error) {
      console.error('Erro na inicialização:', error);
      this.uiService.showError(`Erro na inicialização: ${(error as Error).message}`);
    }
  }

  // Método para verificar se está configurado corretamente
  private checkConfiguration(): void {
    setTimeout(() => {
      if (!this.firebaseService.initialized) {
        this.uiService.updateConnectionStatus({
          message: `
            ⚠️ <strong>Configuração necessária:</strong><br>
            1. Verifique as configurações do Firebase<br>
            2. Configure as regras do Firestore para permitir leitura/escrita<br>
            3. Verifique se a coleção "produto" existe no Firestore
          `,
          type: 'error'
        });
      }
    }, 2000);
  }
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando aplicação TypeScript...');
  
  const app = new App();
  await app.initialize();
  
  console.log('✅ Aplicação inicializada');
});

// Exportar para uso global se necessário
declare global {
  interface Window {
    app: App;
  }
}

export { App };