# Catálogo de Produtos - TypeScript + Firebase

Uma aplicação moderna de catálogo de produtos desenvolvida com TypeScript, Firebase Firestore e deploy automático via GitHub Pages.

## 🔐 Configuração Segura com GitHub Secrets

### Para Deploy Automático (Produção)

Configure os seguintes secrets no GitHub:
- Vá em `Settings` → `Secrets and variables` → `Actions` 
- Adicione os 6 secrets listados abaixo:

| Secret | Descrição |
|---|---|
| `FIREBASE_API_KEY` | Sua API key do Firebase |
| `FIREBASE_AUTH_DOMAIN` | Domínio de autenticação |
| `FIREBASE_PROJECT_ID` | ID do projeto Firebase |
| `FIREBASE_STORAGE_BUCKET` | Bucket de armazenamento |
| `FIREBASE_MESSAGING_SENDER_ID` | ID do remetente de mensagens |
| `FIREBASE_APP_ID` | ID da aplicação |

### Para Desenvolvimento Local

Configure o arquivo `firebase-config.js` com suas credenciais:
```javascript
window.firebaseConfig = {
    apiKey: "sua-api-key-aqui",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    // ... outras configurações
};
```

## Estrutura do Projeto

- `index.html` - Página principal com navegação
- `produtos-firestore.html` - Versão JavaScript + Firebase
- `produtos-typescript.html` - Versão TypeScript + Firebase
- `src/` - Código TypeScript modular
- `dist/` - JavaScript compilado
- `firebase-config.js` - **Configuração local (não commitado)**

## Comandos de Build

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Compilar CSS
npm run build-css

# Build completo
npm run build-all
```

## Deploy no GitHub Pages

```powershell
git init
git add .
git commit -m "Initial commit - secure version"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/<nome-do-repositorio>.git
git push -u origin main
```

URL: `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

## Segurança

- ✅ Credenciais movidas para arquivo local
- ✅ `.gitignore` configurado
- ✅ Arquivo exemplo criado
- ❌ **API key ainda precisa ser revogada/regenerada**

---

**Status**: 🔴 Aguardando rotação de credenciais do usuário
