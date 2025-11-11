# Projeto HTML + TypeScript + Firebase

## ⚠️ IMPORTANTE - CONFIGURAÇÃO DE SEGURANÇA

### API Key Leaked - Ação Necessária

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
- `teste-firebase.html` - Página de teste de conexão Firebase
- `src/` - Código TypeScript modular
- `dist/` - JavaScript compilado
- `firebase-config.js` - **Configuração local (não commitado)**

## 🔐 Configuração de Secrets (Produção)

Para deploy automático no GitHub Pages:

1. **Configure os secrets do GitHub** (obrigatório):
   - Vá em: `Settings` → `Secrets and variables` → `Actions`
   - Adicione os 6 secrets listados em `GITHUB-SECRETS-SETUP.md`

2. **Ou use o script automatizado**:
   ```powershell
   # Se tiver GitHub CLI instalado
   .\setup-github-secrets.ps1
   ```

3. **Deploy automático**:
   - O GitHub Actions gera `firebase-config.js` automaticamente
   - Usa os secrets para configuração segura
   - Deploy em: `https://rodrigo1992-cmyk.github.io/Python---Teste-Deploy/`

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

## 🔒 Segurança

### Desenvolvimento Local:
- ✅ Credenciais em arquivo local não-commitado
- ✅ `.gitignore` configurado
- ✅ Template de exemplo criado

### Produção (GitHub Pages):
- ✅ **GitHub Secrets** - credenciais protegidas
- ✅ **Build automático** - configuração gerada via CI/CD
- ✅ **Sem exposição** - secrets nunca aparecem no código

### Estrutura de Segurança:
- **Local**: `firebase-config.js` (não commitado)
- **Produção**: GitHub Secrets → build automático
- **Template**: `firebase-config.js.example` (público)

---

**Status**: � Configure os GitHub Secrets para deploy automático
