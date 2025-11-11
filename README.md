# Teste Deploy (GitHub Pages)

Este repositório contém um exemplo simples para testar o deploy de um site estático no GitHub Pages.

O repositório inclui:

- `index.html` — página de exemplo que será publicada.
- `.github/workflows/pages.yml` — workflow GitHub Actions que publica o conteúdo do repositório no GitHub Pages quando há push para `main`.

Como publicar (PowerShell - Windows):

1. Inicialize o repositório local (se ainda não tiver):

```powershell
git init
git add .
git commit -m "Add site and GH Pages workflow"
git branch -M main
```

2. Adicione o remote e envie para o GitHub (substitua a URL abaixo):

```powershell
git remote add origin https://github.com/<seu-usuario>/<nome-do-repositorio>.git
git push -u origin main
```

3. Aguarde a Action concluir (aba Actions no GitHub). Quando terminar, a URL estará disponível em:

```
https://<seu-usuario>.github.io/<nome-do-repositorio>/
```

Observações:

- Se preferir, você pode publicar apenas os arquivos dentro de uma pasta `docs/` e ativar GitHub Pages nas configurações do repositório apontando para `gh-pages`/`docs` conforme desejar. O workflow aqui publicado usa a ação oficial do Pages e publica a raiz do repositório.
- Se o repositório for um repositório do tipo usuário/organização chamado `<seu-usuario>.github.io`, a URL pública será `https://<seu-usuario>.github.io/`.
