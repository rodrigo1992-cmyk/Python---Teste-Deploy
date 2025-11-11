# Integrando HTML com Google Cloud Platform (GCP)

## Resumo das Opções para Dados JSON

### 1. **Firebase Firestore** ⭐ (Recomendado)
- **Complexidade**: Baixa
- **Custo**: Gratuito até 50k leituras/20k escritas por dia
- **Vantagens**: 
  - API REST direta do JavaScript
  - Dados JSON nativos
  - Sincronização em tempo real
  - Sem servidor necessário
- **Ideal para**: Apps web interativos, dados estruturados, atualizações frequentes

### 2. **Cloud Storage**
- **Complexidade**: Muito baixa  
- **Custo**: ~$0.02/GB/mês
- **Vantagens**:
  - Simples upload de arquivos JSON
  - Acesso via URL pública
  - CDN automático
- **Ideal para**: Dados estáticos, configurações, datasets que mudam pouco

### 3. **Cloud Functions + Firestore**
- **Complexidade**: Média
- **Custo**: Variável (por invocação)
- **Vantagens**:
  - Lógica de servidor customizada
  - Validações complexas
  - Integração com outros serviços
- **Ideal para**: APIs robustas, validação de dados, integrações

## Exemplo Prático Criado

O arquivo `firestore-example.html` demonstra:
- ✅ Conexão direta HTML → Firestore
- ✅ Leitura e escrita de dados JSON
- ✅ Interface com Tailwind CSS
- ✅ Tratamento de erros
- ✅ Instruções de configuração

## Como Usar o Exemplo

### Passo 1: Configurar Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um projeto ou use existente
3. Ative **Firestore Database** (modo teste)
4. Vá em **Configurações → Configuração do SDK**
5. Copie as configurações

### Passo 2: Configurar o HTML
1. Substitua as configurações demo no arquivo
2. Descomente o código marcado com comentários
3. Configure regras do Firestore:

```javascript
// Regras Firestore (para desenvolvimento - Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // APENAS para desenvolvimento
    }
  }
}
```

### Passo 3: Testar
```bash
# Abrir no navegador
Start-Process .\firestore-example.html

# Ou com servidor local
python -m http.server 8000
```

## Alternativa: Cloud Storage (mais simples)

Para dados JSON estáticos:

```javascript
// 1. Upload manual do arquivo dados.json para Cloud Storage
// 2. No HTML:
fetch('https://storage.googleapis.com/seu-bucket/dados.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Custos Aproximados

| Serviço | Tier Gratuito | Custo após limite |
|---------|---------------|-------------------|
| Firestore | 50k leituras/dia | $0.06 por 100k leituras |
| Cloud Storage | 5GB | $0.02/GB/mês |
| Cloud Functions | 2M invocações/mês | $0.40 por 1M invocações |

## Recomendação Final

**Use Firestore** se:
- Dados mudam frequentemente
- Precisa de sincronização em tempo real
- Quer simplicidade (sem servidor)

**Use Cloud Storage** se:
- Dados são mais estáticos
- Já tem arquivos JSON prontos
- Quer o menor custo possível