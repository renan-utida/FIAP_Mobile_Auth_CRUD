# 📱 FIAP_Mobile_Auth_CRUD

Aplicação mobile desenvolvida com **React Native + Expo** durante as aulas de **Mobile Development** da FIAP, cobrindo layout, navegação, autenticação com Firebase, CRUD completo com Realtime Database e leitura de código de barras.

---

## 📸 Screenshots

---

### 🔐 Autenticação — Cadastro e Login

Fluxo completo de criação de conta e acesso ao app via Firebase Authentication.

<div align="center">
  <img src="./assets/screenshots/1.png" width="18%" alt="Tela de Login" />
  <img src="./assets/screenshots/2.png" width="18%" alt="Tela de Cadastro vazia" />
  <img src="./assets/screenshots/3.png" width="18%" alt="Tela de Cadastro preenchida" />
  <img src="./assets/screenshots/4.png" width="18%" alt="Confirmação de cadastro com sucesso" />
  <img src="./assets/screenshots/5.png" width="18%" alt="Login preenchido" />
</div>

> Da esquerda para direita: tela de login · tela de cadastro · preenchimento dos dados · confirmação de cadastro · login com as credenciais criadas.

---

### 🏠 Home & 📷 Leitor de Código de Barras

Acesso à tela principal e uso da câmera para leitura e preenchimento automático do código de barras.

<div align="center">
  <img src="./assets/screenshots/6.png" width="23%" alt="Home sem produtos" />
  <img src="./assets/screenshots/7.png" width="23%" alt="Alert com código lido" />
  <img src="./assets/screenshots/8.png" width="23%" alt="Home com campos preenchidos pelo scanner" />
</div>

> Da esquerda para direita: home sem produtos · alert com o código lido · campo de código de barras preenchido automaticamente na Home.

---

### 🛒 CRUD de Produtos

Cadastro, listagem, edição e exclusão de produtos no Firebase Realtime Database.

<div align="center">
  <img src="./assets/screenshots/9.png" width="18%" alt="Sucesso ao cadastrar produto" />
  <img src="./assets/screenshots/10.png" width="18%" alt="Listagem de produtos" />
  <img src="./assets/screenshots/11.png" width="18%" alt="Formulário de edição" />
  <img src="./assets/screenshots/12.png" width="18%" alt="Sucesso ao atualizar produto" />
  <img src="./assets/screenshots/13.png" width="18%" alt="Confirmação de exclusão" />
</div>

> Da esquerda para direita: confirmação de cadastro · produto listado · edição do preço · confirmação de atualização · diálogo de confirmação de exclusão.

---

### ☁️ Firebase Console

Dados reais registrados no Firebase após o uso do app — usuários autenticados e produtos salvos no banco.

<div align="center">
  <img src="./assets/screenshots/14.png" width="80%" alt="Firebase Authentication — lista de usuários cadastrados" />
</div>

<p align="center"><em>Firebase Authentication — 4 usuários cadastrados via app.</em></p>

<div align="center">
  <img src="./assets/screenshots/15.png" width="80%" alt="Firebase Realtime Database — produto Banana cadastrado" />
</div>

<p align="center"><em>Firebase Realtime Database — produto salvo com nome, preço e código de barras.</em></p>

---

## 🚀 Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/) — navegação entre telas
- [Firebase Authentication](https://firebase.google.com/products/auth) — autenticação por email/senha
- [Firebase Realtime Database](https://firebase.google.com/products/realtime-database) — CRUD de produtos
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/) — leitura de código de barras

---

## 📂 Estrutura do projeto

```
fiap-auth-app/
├── App.js
├── .env                  # Credenciais Firebase (não vai ao GitHub)
├── .env.example          # Modelo das variáveis de ambiente
└── src/
    ├── firebase/
    │   ├── config.js         # Inicialização do Firebase
    │   ├── authService.js    # Funções de autenticação
    │   └── productService.js # Funções de CRUD de produtos
    ├── navigation/
    │   └── AppNavigator.js   # Configuração das rotas
    └── screens/
        ├── LoginScreen.js
        ├── RegisterScreen.js
        ├── ForgotPasswordScreen.js
        ├── HomeScreen.js
        └── BarcodeScannerScreen.js
```

---

## 🗂️ Aulas

### Aula 01 — Layout e Navegação

Foco na criação do projeto e organização das telas sem backend.

**O que foi feito:**
- Criação do projeto com `create-expo-app`
- Instalação e configuração do React Navigation
- Estrutura de pastas `src/navigation` e `src/screens`
- Tela de **Login** com campos de email e senha
- Tela de **Cadastro** com campos de nome, email e senha
- Tela de **Esqueci minha senha** com campo de email
- Tela **Home** com mensagem de boas-vindas
- Navegação completa entre todas as telas

---

### Aula 02 — Firebase Authentication

Foco na integração com Firebase para autenticação real de usuários.

**O que foi feito:**
- Criação do projeto no Firebase Console
- Ativação do método de login **Email/Senha**
- Instalação do Firebase JS SDK (`npm install firebase`)
- Configuração com variáveis de ambiente (`.env`) para proteger as credenciais
- Criação do `authService.js` com as funções:
  - `registerUser` — cadastro de usuário
  - `loginUser` — login com email e senha
  - `resetUserPassword` — envio de email de redefinição de senha
- Integração nas telas:
  - `RegisterScreen` — cadastro real no Firebase
  - `LoginScreen` — autenticação real no Firebase
  - `ForgotPasswordScreen` — envio de email de recuperação

---

### Aula 03 — CRUD com Realtime Database

Foco na criação, listagem, edição e exclusão de produtos no Firebase Realtime Database.

**O que foi feito:**
- Criação do Realtime Database no Firebase Console
- Atualização do `config.js` para incluir o `getDatabase`
- Criação do `productService.js` com as funções:
  - `createProduct` — salva produto no banco
  - `getProducts` — lista todos os produtos
  - `deleteProduct` — remove produto pelo ID
  - `updateProduct` — atualiza dados de um produto
- Atualização da `HomeScreen` com:
  - Formulário de cadastro de produto (nome e preço)
  - Listagem com `FlatList`
  - Botão de **Excluir** com confirmação
  - Botão de **Editar** que preenche os campos para atualização
  - Botão de **Cancelar edição**
  - Limpeza automática do formulário após cada ação

---

### Aula 04 — Leitor de Código de Barras

Foco na integração da câmera do dispositivo para leitura de código de barras e vinculação ao cadastro de produtos.

**O que foi feito:**
- Instalação do `expo-camera` compatível com Expo SDK 54
- Criação da tela `BarcodeScannerScreen` com:
  - Solicitação de permissão da câmera
  - Abertura da câmera com `CameraView`
  - Leitura de código de barras via `onBarcodeScanned`
  - Prevenção de leituras múltiplas em sequência
  - Alert com o código lido e retorno automático para a Home
- Registro da nova tela no `AppNavigator`
- Atualização da `HomeScreen` com:
  - Botão **"Ler código de barras"** no topo
  - Campo de código de barras no formulário
  - Preenchimento automático do campo ao voltar do scanner via `route.params`
  - Salvamento do campo `barcode` junto ao produto no Firebase
  - Exibição do código de barras na listagem de produtos

---

## 🏆 Checkpoint 2 — Melhorias implementadas

A partir da versão resultante da Aula 4, foram implementadas melhorias de usabilidade — 4 obrigatórias solicitadas pelo professor e 4 extras.

---

### Melhorias Obrigatórias

---

#### Melhoria 1 — Formatação do campo preço no padrão brasileiro

**Problema:** o campo preço aceitava qualquer valor sem formatação ou validação de tipo.

**Solução implementada:**
- O campo preço passa a formatar o valor em tempo real enquanto o usuário digita, no padrão `R$ 0,00`
- Apenas dígitos numéricos são aceitos — letras e caracteres especiais são ignorados automaticamente
- O valor é salvo no Firebase de forma limpa (ex: `1299.99`) via função `parsePriceToSave`
- Na listagem de produtos, o preço é exibido formatado em Real brasileiro via função `formatDisplayPrice`
- Ao editar um produto, o preço já salvo é carregado corretamente no formato `R$ 0,00` no campo

---

#### Melhoria 2 — Tratamento do teclado para telas pequenas

**Problema:** ao abrir o teclado virtual em telas pequenas, ele sobrepunha o formulário impedindo a visualização e interação com os campos. Não havia como fechar o teclado tocando fora dos inputs.

**Solução implementada:**
- Toda a tela foi envolta em `KeyboardAvoidingView`, que empurra o conteúdo para cima automaticamente quando o teclado abre
- O comportamento é diferenciado por plataforma: `padding` no iOS e `height` no Android, usando `Platform.OS`
- `TouchableWithoutFeedback` com `Keyboard.dismiss` permite fechar o teclado ao tocar em qualquer área fora dos inputs

---

#### Melhoria 3 — Preservar dados do formulário ao voltar do scanner

**Problema:** ao navegar da Home para a tela do scanner e voltar, os dados preenchidos nos campos Nome e Preço eram perdidos, ficando apenas o código de barras recém lido.

**Solução implementada:**
- Ao abrir o scanner, a `HomeScreen` passa os valores atuais de `name`, `price` e `editingProductId` como parâmetros de navegação para a `BarcodeScannerScreen`
- A `BarcodeScannerScreen` armazena esses valores e os devolve junto com o `scannedBarcode` ao navegar de volta para a Home
- O `useEffect` da `HomeScreen` recupera todos os parâmetros de volta, restaurando nome, preço e estado de edição exatamente como estavam antes de abrir a câmera

---

#### Melhoria 4 — Scroll da tela inteira para visibilidade dos itens

**Problema:** em telas pequenas, a lista de produtos ficava parcialmente cortada e não era possível visualizar ou acessar os itens que estavam abaixo da área visível.

**Solução implementada:**
- O container interno da `HomeScreen` foi substituído de `View` para `ScrollView`, permitindo rolagem de toda a tela
- O `FlatList` recebeu `scrollEnabled={false}` para delegar o controle de scroll ao `ScrollView` externo, evitando conflito entre os dois componentes no Android
- `keyboardShouldPersistTaps="handled"` foi adicionado ao `ScrollView` para garantir que toques nos botões funcionem mesmo com o teclado aberto
- `paddingBottom: 40` foi adicionado ao final da tela para garantir que o botão Sair não fique cortado ao rolar

---

### Melhorias Adicionais

---

#### Melhoria 5 (Extra) — Tratamento do teclado nas telas de autenticação

**Problema:** a melhoria 2 havia sido aplicada apenas na `HomeScreen`. As telas de `LoginScreen`, `RegisterScreen` e `ForgotPasswordScreen` ainda sofriam do mesmo problema de sobreposição do teclado.

**Solução implementada:**
- `KeyboardAvoidingView`, `TouchableWithoutFeedback` e `Keyboard.dismiss` foram aplicados também nas telas `RegisterScreen` e `ForgotPasswordScreen`

---

#### Melhoria 6 (Extra) — Limpeza da senha ao retornar para o Login

**Problema:** ao navegar da `LoginScreen` para `RegisterScreen` ou `ForgotPasswordScreen` e voltar, o campo de senha permanecia preenchido, o que representa um risco de segurança caso outra pessoa tenha acesso ao dispositivo.

**Solução implementada:**
- `useFocusEffect` do React Navigation foi adicionado à `LoginScreen`
- Toda vez que a tela recebe foco — inclusive ao voltar de outras telas — o campo senha é limpo automaticamente via `setPassword('')`
- O campo email é mantido preenchido para conveniência do usuário, que não precisa redigitá-lo

---

#### Melhoria 7 (Extra) — Scroll na tela de Cadastro

**Problema:** a melhoria 4 havia sido aplicada apenas na `HomeScreen`. A `RegisterScreen`, por ter 3 campos, poderia ter o botão "Cadastrar" escondido atrás do teclado em dispositivos com telas menores.

**Solução implementada:**
- O container da `RegisterScreen` foi substituído de `View` para `ScrollView` com `flexGrow: 1` e `justifyContent: center`
- `keyboardShouldPersistTaps="handled"` garante que o botão Cadastrar funcione mesmo com o teclado aberto
- `paddingBottom: 40` evita que o botão fique cortado ao rolar

---

#### Melhoria 8 (Extra) — Respeito à área segura do dispositivo (Safe Area)

**Problema:** em dispositivos Android com barra de navegação inferior (3 botões: voltar, home e multitarefa), o conteúdo do app ficava posicionado atrás dessa faixa, sobrepondo elementos da interface do sistema.

**Solução implementada:**
- `SafeAreaProvider` do pacote `react-native-safe-area-context` foi adicionado ao `App.js`, envolvendo todo o app
- `SafeAreaView` com `edges={['bottom']}` foi aplicado no `AppNavigator`, respeitando a borda inferior em todas as telas automaticamente
- A solução é compatível com todos os dispositivos: Android com barra de 3 botões, iPhone com botão home físico e iPhone sem botão (notch/Dynamic Island)

---

## 🎨 Estilização
 
Após a implementação de todas as funcionalidades e melhorias, o app recebeu uma identidade visual completa com tema **Dark Mode + Roxo/Violeta**, aplicada em todas as telas.
 
---
 
### Paleta de cores
 
| Elemento | Cor |
|---|---|
| Fundo geral | `#0D0D0D` |
| Card / container | `#1A1A1A` |
| Input | `#242424` |
| Borda sutil | `#2A2A2A` / `#333` |
| Botão primário | `#7C3AED` (roxo) |
| Texto principal | `#FFFFFF` |
| Texto secundário | `#888` / `#AAA` |
| Labels | `#AAA` |
| Botão excluir | `#EF4444` (vermelho) |
 
---
 
### O que foi estilizado por tela
 
**LoginScreen** — título grande com subtítulo, card escuro com inputs estilizados, botão primário roxo sólido, botão secundário com borda roxa e link discreto para esqueci a senha.
 
**RegisterScreen** — mesma identidade do Login, com `ScrollView` para garantir visibilidade do botão Cadastrar em telas menores ao abrir o teclado.
 
**ForgotPasswordScreen** — layout centralizado com subtítulo explicativo, input e botão no mesmo padrão das demais telas de autenticação.
 
**HomeScreen** — header fixo no topo com título e botão Sair, card de formulário com botão de scanner integrado, badge roxo com contador de produtos, cards de produto com info à esquerda e botões compactos (Editar + X) à direita, scroll automático ao clicar em Editar, preço destacado em roxo na listagem.
 
**BarcodeScannerScreen** — câmera em tela cheia com overlay escuro semi-transparente e mira de scan com cantos roxos, painel inferior escuro com instruções e botão "Ler novamente".
 
**AppNavigator** — header do React Navigation estilizado com fundo `#1A1A1A`, texto e ícones brancos e sombra removida para integração suave com o tema escuro.
 
---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/client) instalado no celular, ou emulador Android/iOS

### 1. Clonar o repositório

```bash
git clone https://github.com/renan-utida/fiap-mobile-auth-crud.git
cd fiap-mobile-auth-crud
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Preencha com os valores do seu projeto no [Firebase Console](https://console.firebase.google.com):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
```

### 4. Rodar o projeto

```bash
npx expo start
```

> ⚠️ Sempre que criar ou alterar o `.env`, reinicie o servidor com `Ctrl+C` e rode `npx expo start` novamente para carregar as novas variáveis.

> ⚠️ A leitura de código de barras requer **dispositivo físico** com o Expo Go — não funciona no browser.

---

## 🔒 Variáveis de ambiente

As credenciais do Firebase ficam no arquivo `.env`, que está no `.gitignore` e **não vai ao GitHub**. O arquivo `.env.example` serve como modelo para quem clonar o repositório.

---

## 📋 Fluxos disponíveis no app

| Fluxo | Descrição |
|---|---|
| Login → Home | Autentica com email e senha no Firebase |
| Login → Cadastro | Navega para tela de cadastro |
| Login → Esqueci senha | Navega para tela de recuperação |
| Cadastro → Login | Cria usuário real no Firebase e volta ao login |
| Esqueci senha → Login | Envia email de redefinição e volta ao login |
| Home → Ler código de barras | Abre a câmera para leitura |
| Scanner → Home | Retorna o código lido e preenche o campo automaticamente |
| Home → Cadastrar produto | Salva produto (com código de barras) no Realtime Database |
| Home → Listar produtos | Carrega e exibe produtos do banco ao abrir a tela |
| Home → Editar produto | Preenche formulário com dados do produto para atualização |
| Home → Excluir produto | Remove produto do banco com confirmação via Alert |
| Home → Sair | Volta para a tela de login |

---

## 👨‍🎓 Informações acadêmicas

Desenvolvido durante as aulas de **Mobile Development & IoT** — FIAP

Curso: Engenharia de Software

Turma: 3ESPW

[<img loading="lazy" src="https://github.com/user-attachments/assets/b4f96f4b-542e-4988-9bc1-b1acf22a41a1" width=115><br><sub>Renan Dias Utida</sub>](https://github.com/renan-utida)

**Renan Dias Utida** - RM558540

Estudante de Engenharia de Software na FIAP

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/renan-dias-utida-1b1228225/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/renan-utida)

---