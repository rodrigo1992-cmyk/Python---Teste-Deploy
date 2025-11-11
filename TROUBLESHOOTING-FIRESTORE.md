# 🔧 Troubleshooting: Produtos não carregam do Firestore

## 📋 Checklist de Diagnóstico

### 1. ✅ Verificar Console do Navegador
1. Abra `produtos-firestore.html` no navegador
2. Pressione **F12** para abrir Developer Tools
3. Vá na aba **Console**
4. Procure por logs que começam com:
   - `🚀 Inicializando Firebase...`
   - `📊 Snapshot recebido. Tamanho:`
   - `📦 Documento encontrado:`

**O que esperar ver:**
```
🚀 Inicializando Firebase...
✅ Firebase App inicializado
✅ Firestore conectado
🔍 Iniciando carregamento de produtos...
📊 Snapshot recebido. Tamanho: 1
📦 Documento encontrado: ABC123 {categoria: "televisao", produto: "Televisor Samsung", preco: "1500"}
✅ Total de produtos carregados: 1
```

### 2. 🔍 Usar o Botão "Testar Conexão"
- Clique no botão **"🔍 Testar Conexão"** na página
- Observe as mensagens de status e logs no console

**Possíveis resultados:**

#### ✅ **Sucesso:**
- Status: "✅ Teste OK! X documento(s) encontrado(s)"

#### ⚠️ **Coleção vazia:**
- Status: "⚠️ Conexão OK, mas coleção 'produto' está vazia"
- **Solução:** Verifique se os documentos estão na coleção correta

#### ❌ **Erro de permissão:**
- Status: "❌ Acesso negado!"
- **Solução:** Configure as regras do Firestore (veja abaixo)

### 3. 🔐 Configurar Regras do Firestore

**Problema mais comum:** Regras de segurança bloqueando o acesso.

**Como corrigir:**
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione projeto `gen-lang-client-0530296680`
3. Vá em **Firestore Database** → **Regras**
4. Substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso à coleção "produto"
    match /produto/{document} {
      allow read, write: if true;
    }
  }
}
```

5. Clique em **Publicar**

### 4. 📁 Verificar Estrutura do Banco

**Verifique se seus dados estão organizados assim:**

```
Firestore Database
└── (default)
    └── produto (coleção)
        └── [documento-id]
            ├── categoria: "televisao"
            ├── produto: "Televisor Samsung"
            └── preco: "1500"
```

**⚠️ Cuidados:**
- Nome da coleção deve ser exatamente `produto` (minúsculo)
- Campos devem ser strings
- Não deve haver subcoleções

### 5. 🌐 Testar Conexão com Internet

Execute no Console do navegador:
```javascript
fetch('https://firestore.googleapis.com/')
  .then(() => console.log('✅ Internet OK'))
  .catch(e => console.log('❌ Problema de rede:', e))
```

### 6. 🔄 Limpar Cache do Navegador

1. Pressione **Ctrl+Shift+R** para recarregar sem cache
2. Ou abra em aba anônima/privada

## 🚨 Erros Comuns e Soluções

### Erro: "permission-denied"
**Causa:** Regras do Firestore muito restritivas
**Solução:** Configure as regras conforme item 3

### Erro: "project not found" 
**Causa:** Project ID incorreto
**Solução:** Verifique se o projectId no HTML é `gen-lang-client-0530296680`

### Erro: "unavailable"
**Causa:** Problema de rede ou Firestore indisponível
**Solução:** Verifique internet e tente novamente

### Coleção vazia mas dados existem
**Causa:** Nome da coleção incorreto
**Solução:** Verifique se a coleção no Firestore é `produto` (não `produtos`)

## 🎯 Teste Rápido

Execute no Console do navegador (com a página aberta):
```javascript
// Teste manual
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
const testSnapshot = await getDocs(collection(window.db, "produto"));
console.log('Documentos encontrados:', testSnapshot.size);
testSnapshot.forEach(doc => console.log(doc.id, doc.data()));
```

## 📞 Próximos Passos

1. **Execute os testes** acima na ordem
2. **Anote os resultados** do Console
3. **Configure as regras** se necessário
4. **Verifique a estrutura** dos dados no Firebase Console

Se o problema persistir, compartilhe os logs do Console para análise mais detalhada.