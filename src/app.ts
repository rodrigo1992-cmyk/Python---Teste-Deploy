import { FirebaseServiceImpl } from './firebase-service.js';
import { UIServiceImpl } from './ui-service.js';
import { AuthServiceImpl } from './auth-service.js';
import { AuthUI } from './auth-ui.js';
import { AppConfig, FirebaseConfig, User } from './types.js';

class App {
  private firebaseService: FirebaseServiceImpl;
  private uiService: UIServiceImpl;
  private authService: AuthServiceImpl;
  private authUI: AuthUI;
  private config: AppConfig;

  constructor() {
    this.config = this.getAppConfig();
    this.uiService = new UIServiceImpl();
    this.firebaseService = new FirebaseServiceImpl(this.config.firebase);
    this.authService = new AuthServiceImpl();
    this.authUI = new AuthUI(this.authService);
    
    this.setupFirebaseCallbacks();
    this.setupAuthCallbacks();
    this.setupEventListeners();
  }

  private getAppConfig(): AppConfig {
    // ⚠️ CONFIGURAÇÃO SEGURA VIA GITHUB SECRETS
    // Configuração carregada de firebase-config.js (gerado via GitHub Actions)
    
    // Verificar se o arquivo de configuração foi carregado
    if (!(window as any).firebaseConfig) {
      console.error('❌ Arquivo firebase-config.js não encontrado!');
      console.log('📝 Para resolver:');
      console.log('1. Configure os GitHub Secrets no repositório');
      console.log('2. Faça push para ativar GitHub Actions'); 
      console.log('3. Verifique se o deploy foi executado com sucesso');
    }

    // Verificar status da configuração
    const configStatus = (window as any).configStatus;
    if (configStatus) {
      console.log('📊 Status da configuração:', configStatus.message);
      if (configStatus.serviceAccountAvailable && !configStatus.webSdkComplete) {
        console.warn('⚠️ Service Account configurado, mas Web SDK secrets estão incompletos');
        console.log('🔧 Para funcionalidade completa, adicione estes GitHub Secrets:');
        console.log('• FIREBASE_API_KEY (Web API Key do Firebase Console)');
        console.log('• FIREBASE_MESSAGING_SENDER_ID (Sender ID do Firebase Console)');
        console.log('• FIREBASE_APP_ID (App ID do Firebase Console)');
      }
    }

    const firebaseConfig: FirebaseConfig = {
      apiKey: (window as any).firebaseConfig?.apiKey || "CONFIGURE_SUA_API_KEY",
      authDomain: (window as any).firebaseConfig?.authDomain || "seu-projeto.firebaseapp.com",
      projectId: (window as any).firebaseConfig?.projectId || "seu-projeto-id",
      storageBucket: (window as any).firebaseConfig?.storageBucket || "seu-projeto.firebasestorage.app",
      messagingSenderId: (window as any).firebaseConfig?.messagingSenderId || "123456789",
      appId: (window as any).firebaseConfig?.appId || "CONFIGURE_SEU_APP_ID"
    };

    // Validar se as configurações são válidas
    const pendingCredentials = firebaseConfig.apiKey === "WEB_API_KEY_PENDENTE" ||
                              firebaseConfig.messagingSenderId === "SENDER_ID_PENDENTE" ||
                              firebaseConfig.appId === "APP_ID_PENDENTE";

    const invalidCredentials = firebaseConfig.apiKey === "CONFIGURE_SUA_API_KEY" ||
                              firebaseConfig.projectId === "seu-projeto-id" ||
                              firebaseConfig.appId === "CONFIGURE_SEU_APP_ID";

    const hasValidWebSdk = firebaseConfig.apiKey && 
                          firebaseConfig.apiKey !== "WEB_API_KEY_PENDENTE" && 
                          firebaseConfig.apiKey !== "CONFIGURE_SUA_API_KEY" &&
                          firebaseConfig.appId && 
                          firebaseConfig.appId !== "APP_ID_PENDENTE" && 
                          firebaseConfig.appId !== "CONFIGURE_SEU_APP_ID";

    if (hasValidWebSdk && configStatus?.webSdkComplete) {
      console.log('🎉 Configuração Firebase completa detectada!');
      console.log('✅ Web SDK + Service Account configurados');
      console.log('🚀 Aplicação pronta para uso completo');
    } else if (pendingCredentials) {
      console.warn('⏳ Usando configuração temporária com Service Account');
      console.log('🔧 Para funcionalidade completa do frontend, adicione Web SDK secrets');
    } else if (invalidCredentials) {
      console.warn('⚠️ Configurações Firebase parecem ser placeholders!');
      console.log('🔧 Verifique se os GitHub Secrets estão configurados corretamente');
    }

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

  private setupAuthCallbacks(): void {
    this.authUI.setAuthChangeCallback((user: User | null) => {
      if (user) {
        console.log('✅ Usuário autenticado, tentando conectar ao Firebase...');
        this.connectToFirebase();
      } else {
        console.log('❌ Usuário não autenticado');
        this.uiService.updateConnectionStatus({
          message: '🔐 Faça login para acessar os dados com regras seguras',
          type: 'info'
        });
      }
    });
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

  private async connectToFirebase(): Promise<void> {
    try {
      this.uiService.showLoading(true);
      await this.firebaseService.connect();
      this.checkConfiguration();
    } catch (error) {
      console.error('Erro na conexão Firebase:', error);
      this.uiService.updateConnectionStatus({
        message: `❌ Erro na conexão: ${(error as Error).message}`,
        type: 'error'
      });
    } finally {
      this.uiService.showLoading(false);
    }
  }

  public async initialize(): Promise<void> {
    console.log('🚀 Inicializando aplicação...');
    
    // Para regras seguras (request.auth != null), aguarda autenticação
    // Para regras abertas (if true), conecta imediatamente
    
    if (this.authService.isAuthenticated()) {
      console.log('✅ Usuário já autenticado, conectando...');
      await this.connectToFirebase();
    } else {
      console.log('⏳ Aguardando autenticação...');
      this.uiService.updateConnectionStatus({
        message: '🔐 Faça login para acessar os dados (regras seguras ativadas)',
        type: 'info'
      });
    }
    
    this.checkConfiguration();
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