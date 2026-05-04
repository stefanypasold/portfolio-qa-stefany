# 🐶☕ Milk's Coffee - Full-Stack QA Automation Project

Este é um projeto prático de portfólio focado na Garantia de Qualidade (QA). Desenvolvi do zero um sistema completo de PDV e E-commerce simulado (Front-end e Back-end) para criar um ecossistema real e robusto, permitindo a aplicação de testes End-to-End avançados.

## 🛠️ Tecnologias Utilizadas
* **Aplicação:** React.js, Node.js (Express), SQLite.
* **Automação de Testes:** Cypress integrado com **Cucumber (BDD)**.

## 🎯 Arquitetura de Testes e Boas Práticas
A automação foi estruturada visando legibilidade, manutenibilidade e resiliência:
- **Behavior Driven Development (BDD):** Cenários escritos em Gherkin (`.feature`) garantindo fácil leitura e alinhamento com regras de negócio.
- **Page Object Model (POM):** Isolamento de mapeamentos de elementos e métodos de ação.
- **Data-Cy Attributes:** Utilização exclusiva do atributo `data-cy` no código-fonte, garantindo que os testes não quebrem com mudanças visuais de CSS.
- **Cenários Independentes (Setup & Teardown):** O fluxo de cadastro do Admin sempre exclui o próprio dado de teste gerado, mantendo o banco de dados limpo.

## 🚀 Como Executar o Projeto

**1. Iniciando o Back-end (API)**
```bash
cd api
npm install
npm run dev
```

**2. Iniciando o Front-end (Web)**

```bash
cd web
npm install
npm start
```

**3. Executando a Automação (Cypress + Cucumber)**

```bash
npx cypress open
```