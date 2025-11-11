# Projeto HTML + TypeScript + Firebase

## ⚠️ IMPORTANTE - CONFIGURAÇÃO DE SEGURANÇA

### API Key Leaked - Ação Necessária

1. **Revogue a API key comprometida** no Google Cloud Console:
   - Acesse: https://console.cloud.google.com/apis/credentials
   - Localize a key: `AIzaSyDGfp7mVx5xvwg6iRPVQL2Y5naPiYzFwT0`
   - Delete ou restrinja o acesso

2. **Gere uma nova API key** no Firebase Console:
   - https://console.firebase.google.com/
   - Project Settings > General > Web apps
   - Copie as novas credenciais

3. **Configure o arquivo local** (NÃO commitado):
   ```bash
   cp firebase-config.js.example firebase-config.js
   # Edite o arquivo com suas credenciais reais
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
