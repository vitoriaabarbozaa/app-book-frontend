# Minha Estante - Mobile App (Expo SDK 52)

Aplicativo mobile desenvolvido com React Native e Expo para gerenciar uma coleção pessoal de livros.

## Funcionalidades

- Listagem de livros
- Cadastro de novos livros (Título, Autor, Gênero, Status e Nota)
- Edição de livros existentes
- Exclusão de livros

## Requisitos

- Node.js instalado
- App **Expo Go** instalado no celular

## Instalação e Execução

1. Entre na pasta do projeto:
   ```bash
   cd app-book-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. **Configuração da API:**
   Abra o arquivo `src/services/api.js` e altere a `baseURL` para o IP da sua máquina (ex: `http://192.168.x.x:3000/api`).

4. Inicie o projeto:
   ```bash
   npx expo start
   ```

5. Escaneie o QR Code com o app **Expo Go** no seu celular.

> **Importante:** O celular e o computador devem estar conectados na mesma rede Wi-Fi para que o app consiga acessar a API do backend.
