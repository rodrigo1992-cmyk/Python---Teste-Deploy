# 🔐 Configuração de GitHub Secrets para Firebase

## Como configurar secrets no GitHub

### 1. Acessar as configurações do repositório
1. Vá para o seu repositório no GitHub: `https://github.com/rodrigo1992-cmyk/Python---Teste-Deploy`
2. Clique na aba **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**

### 2. Adicionar os secrets do Firebase

Clique em **New repository secret** para cada um dos seguintes:

| Nome do Secret | Valor |
|---|---|
| `FIREBASE_API_KEY` | `AIzaSyDGfp7mVx5xvwg6iRPVQL2Y5naPiYzFwT0` |
| `FIREBASE_AUTH_DOMAIN` | `gen-lang-client-0530296680.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | `gen-lang-client-0530296680` |
| `FIREBASE_STORAGE_BUCKET` | `gen-lang-client-0530296680.firebasestorage.app` |
| `FIREBASE_MESSAGING_SENDER_ID` | `20277219870` |
| `FIREBASE_APP_ID` | `1:20277219870:web:bb023875b9e89dd0a2140f` |

### 3. Como criar cada secret:

1. **FIREBASE_API_KEY**:
   - Name: `FIREBASE_API_KEY`
   - Secret: `AIzaSyDGfp7mVx5xvwg6iRPVQL2Y5naPiYzFwT0`

2. **FIREBASE_AUTH_DOMAIN**:
   - Name: `FIREBASE_AUTH_DOMAIN`  
   - Secret: `gen-lang-client-0530296680.firebaseapp.com`

3. **FIREBASE_PROJECT_ID**:
   - Name: `FIREBASE_PROJECT_ID`
   - Secret: `gen-lang-client-0530296680`

4. **FIREBASE_STORAGE_BUCKET**:
   - Name: `FIREBASE_STORAGE_BUCKET`
   - Secret: `gen-lang-client-0530296680.firebasestorage.app`

5. **FIREBASE_MESSAGING_SENDER_ID**:
   - Name: `FIREBASE_MESSAGING_SENDER_ID`
   - Secret: `20277219870`

6. **FIREBASE_APP_ID**:
   - Name: `FIREBASE_APP_ID`
   - Secret: `1:20277219870:web:bb023875b9e89dd0a2140f`

## Como funciona

### Durante o deploy (GitHub Actions):
1. O workflow gera automaticamente o arquivo `firebase-config.js`
2. Usa os secrets do GitHub para preencher as configurações
3. O arquivo fica disponível para as páginas HTML
4. As credenciais nunca ficam expostas no código

### Desenvolvimento local:
1. Mantenha o arquivo `firebase-config.js` local (não commitado)
2. Use o arquivo `firebase-config.js.example` como template
3. Configure suas credenciais localmente

## Vantagens desta abordagem:

✅ **Segurança**: Credenciais ficam protegidas nos secrets do GitHub  
✅ **Automação**: Deploy automático com configuração correta  
✅ **Flexibilidade**: Diferentes credenciais para dev/prod  
✅ **Controle**: Fácil rotação de chaves quando necessário  

## Testando após configurar:

1. Configure todos os secrets no GitHub
2. Faça um push para `main`
3. Vá em **Actions** para ver o deploy
4. Acesse a URL do GitHub Pages: `https://rodrigo1992-cmyk.github.io/Python---Teste-Deploy/`

---

**Status**: ⏳ Aguardando configuração dos secrets no GitHub