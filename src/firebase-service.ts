import { FirebaseConfig, Produto, FirebaseService, ConnectionStatus } from './types.js';

declare global {
  interface Window {
    firebase: any;
    firestoreUnsubscribe?: () => void;
  }
}

export class FirebaseServiceImpl implements FirebaseService {
  public db: any = null;
  public initialized: boolean = false;
  private config: FirebaseConfig;
  private onProductsChange?: (produtos: Produto[]) => void;
  private onStatusChange?: (status: ConnectionStatus) => void;

  constructor(config: FirebaseConfig) {
    this.config = config;
  }

  public setCallbacks(
    onProductsChange: (produtos: Produto[]) => void,
    onStatusChange: (status: ConnectionStatus) => void
  ): void {
    this.onProductsChange = onProductsChange;
    this.onStatusChange = onStatusChange;
  }

  public async connect(): Promise<void> {
    try {
      console.log('🚀 Inicializando Firebase...');
      console.log('⚙️ Configuração:', {
        projectId: this.config.projectId,
        authDomain: this.config.authDomain
      });

      // Verificar se o SDK foi carregado
      if (!window.firebase) {
        throw new Error('Firebase SDK não carregado. Verifique se os scripts Firebase estão incluídos no HTML.');
      }

      // Validar configuração básica
      if (!this.config.apiKey || this.config.apiKey === 'CONFIGURE_SUA_API_KEY') {
        throw new Error('Configuração Firebase inválida. Verifique se os GitHub Secrets estão configurados.');
      }

      if (!this.config.projectId || this.config.projectId === 'seu-projeto-id') {
        throw new Error('Project ID não configurado. Configure FIREBASE_PROJECT_ID nos GitHub Secrets.');
      }

      window.firebase.initializeApp(this.config);
      console.log('✅ Firebase App inicializado');

      this.db = window.firebase.firestore();
      console.log('✅ Firestore conectado');

      this.initialized = true;
      this.updateStatus('🔄 Conectado ao Firestore, carregando produtos...', 'info');
      
      await this.loadProducts();
    } catch (error) {
      console.error('❌ Erro na inicialização do Firebase:', error);
      
      // Mensagens específicas baseadas no tipo de erro
      let errorMessage = `❌ Erro na conexão: ${(error as Error).message}`;
      
      if ((error as Error).message.includes('GitHub Secrets')) {
        errorMessage += '<br>🔧 Consulte: https://github.com/settings/tokens';
      } else if ((error as Error).message.includes('Project ID')) {
        errorMessage += '<br>📝 Configure os secrets no repositório GitHub';
      }
      
      this.updateStatus(errorMessage, 'error');
      throw error;
    }
  }

  public async loadProducts(): Promise<void> {
    if (!this.initialized || !this.db) {
      throw new Error('Firebase não inicializado');
    }

    console.log('🔍 Iniciando carregamento de produtos...');
    console.log('📁 Coleção: "produto"');
    console.log('🔑 Project ID:', this.config.projectId);

    try {
      // Listener em tempo real
      const unsubscribe = this.db.collection("produto").onSnapshot(
        (querySnapshot: any) => {
          console.log('📊 Snapshot recebido. Tamanho:', querySnapshot.size);

          const produtos: Produto[] = [];
          querySnapshot.forEach((doc: any) => {
            console.log('📦 Documento encontrado:', doc.id, doc.data());
            produtos.push({ id: doc.id, ...doc.data() });
          });

          console.log('✅ Total de produtos carregados:', produtos.length);
          
          if (this.onProductsChange) {
            this.onProductsChange(produtos);
          }

          if (produtos.length > 0) {
            this.updateStatus(`✅ Conectado! ${produtos.length} produto(s) carregado(s)`, 'success');
          } else {
            this.updateStatus('⚠️ Conectado, mas nenhum produto encontrado na coleção "produto"', 'info');
          }
        },
        (error: any) => {
          console.error('❌ Erro no listener:', error);
          this.updateStatus(`❌ Erro ao escutar mudanças: ${error.message}`, 'error');
        }
      );

      // Armazenar unsubscribe para limpeza
      if (window.firestoreUnsubscribe) {
        window.firestoreUnsubscribe();
      }
      window.firestoreUnsubscribe = unsubscribe;

    } catch (error) {
      console.error('❌ Erro ao configurar listener:', error);
      this.updateStatus(`❌ Erro ao carregar produtos: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  public async addProduct(produto: Omit<Produto, 'id' | 'timestamp'>): Promise<string> {
    if (!this.initialized || !this.db) {
      throw new Error('Firebase não inicializado');
    }

    try {
      const docRef = await this.db.collection("produto").add({
        categoria: produto.categoria.toLowerCase(),
        produto: produto.produto,
        preco: produto.preco,
        timestamp: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      this.updateStatus(`✅ Produto "${produto.produto}" adicionado com sucesso! ID: ${docRef.id}`, 'success');
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      this.updateStatus(`❌ Erro ao adicionar produto: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  public async testConnection(): Promise<{ success: boolean; size: number; docs: Produto[] }> {
    if (!this.initialized || !this.db) {
      throw new Error('Firebase não inicializado');
    }

    console.log('🧪 Teste de conexão iniciado...');
    this.updateStatus('🧪 Testando conexão...', 'info');

    try {
      const snapshot = await this.db.collection("produto").get();
      
      console.log('📊 Resultado do teste:', {
        size: snapshot.size,
        empty: snapshot.empty,
        docs: snapshot.docs.map((doc: any) => ({ id: doc.id, data: doc.data() }))
      });

      const docs: Produto[] = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      if (snapshot.empty) {
        this.updateStatus('⚠️ Conexão OK, mas coleção "produto" está vazia', 'info');
      } else {
        this.updateStatus(`✅ Teste OK! ${snapshot.size} documento(s) encontrado(s)`, 'success');
      }

      return { success: true, size: snapshot.size, docs };
    } catch (error: any) {
      console.error('❌ Erro no teste:', error);
      this.updateStatus(`❌ Teste falhou: ${error.message}`, 'error');

      // Sugestões baseadas no tipo de erro
      if (error.code === 'permission-denied') {
        this.updateStatus(
          `❌ Acesso negado! Verifique as regras do Firestore:<br><code>allow read, write: if true;</code> na coleção "produto"`,
          'error'
        );
      } else if (error.code === 'unavailable') {
        this.updateStatus('❌ Firestore indisponível. Verifique sua conexão com a internet.', 'error');
      }

      return { success: false, size: 0, docs: [] };
    }
  }

  private updateStatus(message: string, type: 'info' | 'success' | 'error'): void {
    if (this.onStatusChange) {
      this.onStatusChange({ message, type });
    }
  }
}