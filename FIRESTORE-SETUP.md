# Configuração do Firestore - Projeto gen-lang-client-0530296680

## ⚠️ Passos Obrigatórios para Conectar

### 1. Obter Configurações do Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `gen-lang-client-0530296680`
3. Vá em **Configurações do Projeto** (ícone de engrenagem)
4. Na aba **Geral**, role até **Seus aplicativos**
5. Clique em **Adicionar app** → **Web** (ícone `</>`
6. Digite um nome (ex: "Catalogo Produtos")
7. **Copie as configurações** que aparecem

### 2. Atualizar o HTML
No arquivo `produtos-firestore.html`, substitua:

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key-aqui",           // ← Cole aqui
    authDomain: "gen-lang-client-0530296680.firebaseapp.com", // ← Já correto
    projectId: "gen-lang-client-0530296680",                  // ← Já correto
    storageBucket: "gen-lang-client-0530296680.appspot.com",  // ← Já correto
    messagingSenderId: "20277219870",                         // ← Já correto
    appId: "seu-app-id-aqui"              // ← Cole aqui
};
```

### 3. Configurar Regras do Firestore
1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **Regras**
3. Substitua por estas regras (para desenvolvimento):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /produto/{document} {
      allow read, write: if true;  // APENAS para desenvolvimento
    }
  }
}
```

### 4. Verificar Dados Existentes
Confirme que sua coleção está assim:
- **Coleção**: `produto`
- **Documentos** com campos:
  - `categoria`: "televisao" (string)
  - `produto`: "Televisor Samsung" (string)  
  - `preco`: "1500" (string)

## 🚀 Como Testar

Após configurar, abra o arquivo:
```bash
Start-Process .\produtos-firestore.html
```

## ✅ O que a página faz:

- **Conecta** automaticamente ao Firestore
- **Lista** todos os produtos da coleção "produto"  
- **Adiciona** novos produtos via formulário
- **Atualiza** em tempo real (mudanças aparecem automaticamente)
- **Mostra estatísticas** (total, categorias, preço médio)

## 🔧 Troubleshooting

**Se der erro "Permission denied":**
- Verifique as regras do Firestore
- Confirme que a coleção "produto" existe

**Se der erro "Firebase not found":**
- Verifique apiKey e appId nas configurações
- Confirme que o projeto está ativo no Firebase

**Se não carregar produtos:**
- Abra o Console do navegador (F12) para ver erros
- Confirme que os documentos existem na coleção "produto"