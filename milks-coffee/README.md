# ☕ Milk's Coffee - Arquitetura de Qualidade (QA)
![Milk's Coffee](./milks-coffee/docs/logo-milks.png)

Este repositório contém o ecossistema completo do **Milk's Coffee**, um projeto desenvolvido e automatizado do zero com o objetivo de aplicar arquiteturas de testes e garantir a qualidade de ponta a ponta (E2E).

A aplicação simula um e-commerce de cafeteria e está dividida em duas frentes principais, cada uma com sua própria suíte de automação baseada em boas práticas de mercado, como mapeamento resiliente de elementos e independência de estado.

---

## 🏗️ Estrutura do Monorepo
O projeto está dividido em dois módulos independentes:

O projeto está dividido em dois módulos independentes:

* **📱 Módulo Mobile (App do Cliente):** Desenvolvido em React Native (Expo). A automação E2E foi construída com **Maestro**, focada em fluxos nativos, performance de execução e validação de interface fluida.
* **💻 Módulo Web (Painel Admin):** Aplicação web focada na gestão do e-commerce. A automação foi estruturada utilizando **Cypress**, aplicando o padrão Page Object Model (POM) para alta escalabilidade e fácil manutenção.

---

## 🔗 Documentação Técnica

Para ver os vídeos de execução e instruções de como rodar cada automação na sua máquina, acesse a documentação específica de cada módulo:

* ➡️ [Acessar a documentação de Testes Mobile (Maestro)](./mobile/README.md)
* ➡️ [Acessar a documentação de Testes Web (Cypress)](./web/README.md)

---

## 🛠️ Tecnologias Utilizadas

* **Mobile:** React Native, Expo, Maestro.
* **Web:** Cypress, Node.js, Cucumber/BDD.
* **Padrões de Projeto:** Page Object Model (POM), Data-Driven Testing.