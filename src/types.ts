// Firebase/Firestore Types (sem imports diretos para evitar erros de build)

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface Produto {
  id?: string;
  categoria: string;
  produto: string;
  preco: string;
  timestamp?: any; // FirebaseTimestamp
}

export interface ProdutoStats {
  totalCount: number;
  categoryCount: number;
  avgPrice: number;
}

export interface ConnectionStatus {
  type: 'info' | 'success' | 'error';
  message: string;
}

// DOM Element Types
export interface DOMElements {
  productsList: HTMLElement;
  addProductForm: HTMLFormElement;
  reloadBtn: HTMLButtonElement;
  testConnectionBtn: HTMLButtonElement;
  connectionStatus: HTMLElement;
  categoriaInput: HTMLInputElement;
  produtoInput: HTMLInputElement;
  precoInput: HTMLInputElement;
  totalCount: HTMLElement;
  categoryCount: HTMLElement;
  avgPrice: HTMLElement;
  reloadIcon: HTMLElement;
}

// Firebase Service Types
export interface FirebaseService {
  db: any; // Firebase Firestore instance
  initialized: boolean;
  connect(): Promise<void>;
  loadProducts(): Promise<void>;
  addProduct(produto: Omit<Produto, 'id' | 'timestamp'>): Promise<string>;
  testConnection(): Promise<{ success: boolean; size: number; docs: Produto[] }>;
}

// UI Service Types
export interface UIService {
  elements: DOMElements;
  updateConnectionStatus(status: ConnectionStatus): void;
  displayProducts(produtos: Produto[]): void;
  updateStats(produtos: Produto[]): void;
  showLoading(show: boolean): void;
}

// App Configuration
export interface AppConfig {
  firebase: FirebaseConfig;
  ui: {
    collectionName: string;
    autoReload: boolean;
    debugMode: boolean;
  };
}