# Mottu Control

## Integrantes

- **Gabriel Teodoro Gonçalves Rosa** — RM: 555962
- **Luka Shibuya** — RM: 558123
- **Eduardo Giovannini** — RM: 555030

---

## Descrição do Projeto

O **Mottu Control** é uma solução tecnológica desenvolvida para o mapeamento inteligente e gestão de motos em pátios de filiais da empresa Mottu. O sistema utiliza tecnologias modernas para monitorar a localização e o status das motos, facilitando o controle de disponibilidade, aluguel, manutenção e cadastro de clientes associados.

### Funcionalidades principais

- Visualização e filtragem de motos por modelo, placa e status.
- Cadastro e edição de motos e clientes.
- Associação dinâmica de motos a clientes.
- Navegação intuitiva com abas (Bottom Tabs e Stack).
- Armazenamento local com AsyncStorage.
- Atualização via pull-to-refresh para dados dinâmicos.
- Interface estilizada com cores personalizadas e ícones.

---

## Como Rodar o Projeto Localmente

**Pré-requisitos**

- Node.js instalado (recomendado >= 16.x)
- npm
- Emulador Android/iOS ou dispositivo com Expo Go instalado

## Passos

\***\*Clone o repositório:**

- git clone https://github.com/gtheox/MottuControl
- cd MottuControl

**Instale as dependências:**

- npm install

**Inicie o servidor Expo:**

- npx expo start
- Abra o app no dispositivo ou emulador:
- No dispositivo: escaneie o QR code com Expo Go (Android/iOS)
- No emulador: escolha rodar no Android Studio

## Estrutura do Projeto

MottuControl/
│
├── src/
│ ├── Telas/ # Telas do app (Home, Motos, Clientes, Formulários)
│ ├── assets/ # Imagens e recursos estáticos
│ └── App.js # Configuração de navegação e entrada principal
│
├── package.json # Dependências e scripts
├── README.md # Documentação do projeto
└── ...

## Uso do Aplicativo

- Tela Descrição
- Home Navegação principal para áreas de motos, clientes e sobre
- Motos Catálogo, filtro, alteração de status, associação a clientes
- Clientes Listagem, cadastro e edição de clientes
- Sobre Informações sobre os desenvolvedores e objetivo do projeto

## **Contato dos Desenvolvedores**

Nome GitHub LinkedIn
Gabriel Teodoro [gtheox](https://github.com/gtheox) [perfil](https://www.linkedin.com/in/gabriel-teodoro-gon%C3%A7alves-rosa-a26970236/)
Luka Shibuya [lukashibuya](https://github.com/lukashibuya) [perfil](https://www.linkedin.com/in/luka-shibuya-b62a322b3/)
Eduardo Giovannini [DuGiovannini](https://github.com/DuGiovannini) [perfil](https://www.linkedin.com/in/eduardo-giovannini-157216262/)

**\*\***Licença\*\*
Este projeto é destinado ao uso acadêmico e pessoal, sem fins comerciais.
