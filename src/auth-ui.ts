// auth-ui.ts - Interface de Autenticação
import { AuthServiceImpl } from './auth-service.js';
import { User } from './types.js';

export class AuthUI {
  private authService: AuthServiceImpl;
  private onAuthChange?: (user: User | null) => void;

  constructor(authService: AuthServiceImpl) {
    this.authService = authService;
    this.setupAuthStateListener();
    this.createAuthUI();
  }

  public setAuthChangeCallback(callback: (user: User | null) => void): void {
    this.onAuthChange = callback;
  }

  private setupAuthStateListener(): void {
    this.authService.setAuthStateChangeCallback((user: User | null) => {
      this.updateUI(user);
      if (this.onAuthChange) {
        this.onAuthChange(user);
      }
    });
  }

  private createAuthUI(): void {
    // Criar contêiner de autenticação no topo da página
    const authContainer = document.createElement('div');
    authContainer.id = 'authContainer';
    authContainer.className = 'bg-white rounded-lg shadow p-4 mb-6';
    authContainer.innerHTML = `
      <div id="authStatus" class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div id="userInfo" class="hidden">
            <span class="text-sm text-gray-600">Logado como:</span>
            <span id="userName" class="font-medium text-gray-800"></span>
          </div>
          <div id="notAuthenticatedInfo" class="text-sm text-amber-600">
            🔐 Para usar regras seguras, faça login
          </div>
        </div>
        <div class="flex gap-2">
          <button id="anonymousLoginBtn" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            Login Anônimo
          </button>
          <button id="showLoginFormBtn" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
            Login/Cadastro
          </button>
          <button id="logoutBtn" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 hidden">
            Logout
          </button>
        </div>
      </div>

      <!-- Formulário de Login/Cadastro (inicialmente oculto) -->
      <div id="loginForm" class="hidden mt-4 p-4 bg-gray-50 rounded">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-medium mb-2">Login</h3>
            <form id="signInForm">
              <input type="email" id="signInEmail" placeholder="Email" required
                     class="w-full px-3 py-2 border rounded mb-2">
              <input type="password" id="signInPassword" placeholder="Senha" required
                     class="w-full px-3 py-2 border rounded mb-2">
              <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Entrar
              </button>
            </form>
          </div>
          <div>
            <h3 class="font-medium mb-2">Criar Conta</h3>
            <form id="signUpForm">
              <input type="email" id="signUpEmail" placeholder="Email" required
                     class="w-full px-3 py-2 border rounded mb-2">
              <input type="password" id="signUpPassword" placeholder="Senha (min. 6 chars)" required minlength="6"
                     class="w-full px-3 py-2 border rounded mb-2">
              <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Criar Conta
              </button>
            </form>
          </div>
        </div>
        <button id="hideLoginFormBtn" class="mt-3 text-sm text-gray-500 hover:text-gray-700">
          ← Voltar
        </button>
      </div>
    `;

    // Inserir no início da página, após o header
    const header = document.querySelector('header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(authContainer, header.nextSibling);
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Login anônimo
    document.getElementById('anonymousLoginBtn')?.addEventListener('click', async () => {
      try {
        await this.authService.signInAnonymously();
      } catch (error) {
        alert(`Erro no login anônimo: ${(error as Error).message}`);
      }
    });

    // Mostrar/ocultar formulário
    document.getElementById('showLoginFormBtn')?.addEventListener('click', () => {
      document.getElementById('loginForm')?.classList.remove('hidden');
    });

    document.getElementById('hideLoginFormBtn')?.addEventListener('click', () => {
      document.getElementById('loginForm')?.classList.add('hidden');
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      try {
        await this.authService.signOut();
      } catch (error) {
        alert(`Erro no logout: ${(error as Error).message}`);
      }
    });

    // Formulário de login
    document.getElementById('signInForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('signInEmail') as HTMLInputElement).value;
      const password = (document.getElementById('signInPassword') as HTMLInputElement).value;
      
      try {
        await this.authService.signInWithEmailAndPassword(email, password);
        document.getElementById('loginForm')?.classList.add('hidden');
      } catch (error) {
        alert(`Erro no login: ${(error as Error).message}`);
      }
    });

    // Formulário de cadastro
    document.getElementById('signUpForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('signUpEmail') as HTMLInputElement).value;
      const password = (document.getElementById('signUpPassword') as HTMLInputElement).value;
      
      try {
        await this.authService.createUserWithEmailAndPassword(email, password);
        document.getElementById('loginForm')?.classList.add('hidden');
      } catch (error) {
        alert(`Erro ao criar conta: ${(error as Error).message}`);
      }
    });
  }

  private updateUI(user: User | null): void {
    const userInfo = document.getElementById('userInfo');
    const notAuthenticatedInfo = document.getElementById('notAuthenticatedInfo');
    const userName = document.getElementById('userName');
    const anonymousBtn = document.getElementById('anonymousLoginBtn');
    const loginBtn = document.getElementById('showLoginFormBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
      // Usuário logado
      userInfo?.classList.remove('hidden');
      notAuthenticatedInfo?.classList.add('hidden');
      anonymousBtn?.classList.add('hidden');
      loginBtn?.classList.add('hidden');
      logoutBtn?.classList.remove('hidden');

      if (userName) {
        userName.textContent = user.displayName || user.email || `Usuário ${user.uid.slice(0, 8)}`;
      }
    } else {
      // Usuário não logado
      userInfo?.classList.add('hidden');
      notAuthenticatedInfo?.classList.remove('hidden');
      anonymousBtn?.classList.remove('hidden');
      loginBtn?.classList.remove('hidden');
      logoutBtn?.classList.add('hidden');
    }
  }
}