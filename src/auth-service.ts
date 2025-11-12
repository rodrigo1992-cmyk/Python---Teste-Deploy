// auth-service.ts - Serviço de Autenticação Firebase
import { AuthService, User } from './types.js';

declare global {
  interface Window {
    firebase: any;
  }
}

export class AuthServiceImpl implements AuthService {
  private auth: any = null;
  private currentUser: User | null = null;
  private onAuthStateChange?: (user: User | null) => void;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (!window.firebase) {
      console.error('❌ Firebase não carregado');
      return;
    }

    this.auth = window.firebase.auth();
    console.log('🔐 Firebase Auth inicializado');

    // Listener para mudanças de autenticação
    this.auth.onAuthStateChanged((user: any) => {
      if (user) {
        this.currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          photoURL: user.photoURL
        };
        console.log('✅ Usuário autenticado:', this.currentUser.email);
      } else {
        this.currentUser = null;
        console.log('❌ Usuário não autenticado');
      }

      if (this.onAuthStateChange) {
        this.onAuthStateChange(this.currentUser);
      }
    });
  }

  public setAuthStateChangeCallback(callback: (user: User | null) => void): void {
    this.onAuthStateChange = callback;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public async signInAnonymously(): Promise<User> {
    try {
      console.log('🔐 Fazendo login anônimo...');
      const result = await this.auth.signInAnonymously();
      
      const user: User = {
        uid: result.user.uid,
        email: null,
        displayName: 'Usuário Anônimo',
        photoURL: null
      };

      console.log('✅ Login anônimo realizado:', user.uid);
      return user;
    } catch (error) {
      console.error('❌ Erro no login anônimo:', error);
      throw error;
    }
  }

  public async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      console.log('🔐 Fazendo login com email/senha...');
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      
      const user: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || result.user.email,
        photoURL: result.user.photoURL
      };

      console.log('✅ Login realizado:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  public async createUserWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      console.log('📝 Criando nova conta...');
      const result = await this.auth.createUserWithEmailAndPassword(email, password);
      
      const user: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.email,
        photoURL: null
      };

      console.log('✅ Conta criada:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Erro ao criar conta:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('✅ Logout realizado');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}