# Calendário Corporativo - versão organizada

Esta versão mantém a aplicação no mesmo modelo simples para GitHub Pages: React, Babel, Tailwind e Supabase por CDN.

## O que mudou

- O projeto foi organizado em pastas:
  - `assets/css/style.css`
  - `assets/scripts/00-tailwind-config.js`
  - `assets/scripts/01-supabase-client.js`
  - `assets/scripts/02-constants.js`
  - `assets/scripts/03-icons.jsx`
  - `assets/scripts/04-components.jsx`
  - `assets/scripts/app.jsx`
- O visual recebeu ajustes leves para reforçar a ideia de **gestão à vista**.
- Foi adicionado um painel superior com:
  - lançamentos da semana;
  - informes urgentes;
  - setores com avisos;
  - filtro operacional por setor.
- Foi adicionado um bloco visual de **Fluxo Operacional**, preparando o caminho para projetos em cascata.
- Os cards agora indicam visualmente se o lançamento é **Público** ou **Setorial**.
- O banco de dados, nomes de tabelas e estrutura Supabase foram preservados.

## Como testar no GitHub Pages

Envie para o repositório:

```txt
index.html
assets/
```

A pasta `_backup-original` está incluída apenas como cópia de segurança dos arquivos originais. Ela não é necessária para o funcionamento do site.

## Observação importante

Esta ainda não é a migração para Vite.  
É uma organização segura e gradual do projeto atual, para testar sem uma mudança drástica de ambiente.
