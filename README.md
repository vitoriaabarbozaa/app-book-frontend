# Minha Estante - Mobile App

Aplicativo mobile desenvolvido com React Native e Expo para gerenciar uma coleção pessoal de livros.

## Funcionalidades

- Listagem de livros
- Cadastro de novos livros (Título, Autor, Gênero, Status e Nota)
- Edição de livros existentes
- Exclusão de livros

## Requisitos

- Node.js instalado
- Expo Go instalado no celular (para testar em dispositivo físico)

## Instalação

1. Entre na pasta do projeto:
   ```bash
   cd app-book-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a API:
   Edite o arquivo `src/services/api.js` e altere a `baseURL` para o IP da sua máquina caso esteja testando em um celular real.

## Execução

Inicie o projeto Expo:
```bash
npx expo start
```

Escaneie o QR Code com o app Expo Go no seu celular.
