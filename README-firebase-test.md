# 🧪 Firebase Test Notebook - Instruções de Uso

## 📋 Pré-requisitos

1. **Python 3.7+** instalado
2. **Jupyter Notebook** ou **VS Code** com extensão Python
3. **Conexão com internet** para acessar Firebase

## 🔧 Configuração Inicial

### 1. Criar arquivo de variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com suas credenciais Firebase:

```env
# Firebase Configuration
FIREBASE_API_KEY=sua-api-key-aqui
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=sua-app-id-aqui

# Configurações adicionais
FIRESTORE_COLLECTION=produto
DEBUG=True
LOCAL_TESTING=True
```

### 2. Executar o notebook

1. Abra `firebase-test.ipynb` no VS Code ou Jupyter
2. Execute as células sequencialmente (Shift + Enter)
3. Verifique os resultados de cada teste

## 🧪 Testes Inclusos

O notebook executa os seguintes testes:

1. **📦 Instalação de Dependências** - Instala automaticamente as bibliotecas necessárias
2. **🔧 Carregamento de Variáveis** - Carrega credenciais do arquivo .env
3. **🔥 Inicialização Firebase** - Configura conexão com Firebase
4. **🔍 Teste de Conexão** - Verifica conectividade com Firestore via REST API
5. **📊 Análise de Dados** - Processa e exibe dados existentes
6. **➕ Teste de Escrita** - Cria um documento de teste
7. **🔄 Verificação** - Confirma que a escrita funcionou
8. **📋 Resumo** - Relatório final dos testes

## 🔐 Segurança

- ✅ **Arquivo .env** está no .gitignore
- ✅ **Notebook** está no .gitignore
- ✅ **API Keys** são mascaradas nos logs
- ✅ **Credenciais** nunca são commitadas

## 🚨 Solução de Problemas

### Erro: "Module not found"
Execute a primeira célula para instalar dependências automaticamente.

### Erro: "API Key not found"
Verifique se o arquivo `.env` existe e contém todas as variáveis necessárias.

### Erro: "Permission denied"
Verifique as regras de segurança do Firestore no Firebase Console.

### Erro: "Invalid API Key"
Confirme se a API Key está correta no Firebase Console.

## 📝 Notas Importantes

- Este notebook usa **REST API** com Web API Key (não Service Account)
- Para produção, considere usar Firebase Admin SDK
- Documentos de teste são marcados com `created_by: "notebook-test"`
- O notebook é seguro para execução repetida

## 🎯 Resultado Esperado

Se tudo estiver configurado corretamente, você verá:

- ✅ Conexão bem-sucedida com Firestore
- ✅ Lista de documentos existentes
- ✅ Criação de documento de teste
- ✅ Relatório final com estatísticas

---

**Status dos Arquivos:**
- 🔒 `.env` - Protegido (não commitado)
- 🔒 `firebase-test.ipynb` - Protegido (não commitado)
- ✅ `README-firebase-test.md` - Público (documentação)