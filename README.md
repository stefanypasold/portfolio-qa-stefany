# ☕ Milk's Coffee - QA Automation Portfolio

Este repositório contém o projeto completo da **Milk's Coffee**, uma aplicação desenvolvida e automatizada do zero para demonstrar habilidades avançadas em Qualidade de Software (QA). 

O projeto é dividido em um aplicativo Mobile (cliente) e, em breve, um painel Web (admin), com suas respectivas suítes de testes End-to-End (E2E).

---

## 📱 Módulo 1: Automação Mobile (Maestro)
O aplicativo mobile foi desenvolvido em **React Native (Expo)**. A automação foi construída utilizando o **Maestro**, garantindo testes rápidos, resilientes e focados na jornada real do usuário.

### 🎯 Cenários Cobertos
* ✅ **Caminho Feliz (Compra Completa):** 
  * Autenticação com sucesso.
  * Adição de produtos da vitrine ao carrinho.
  * Gestão de quantidades.
  * Preenchimento de formulário de Checkout.
  * Tratamento de teclado virtual da UI (uso do comando `- hideKeyboard`).
  * Finalização de pagamento via PIX.
  * Validação de dados na Nota Fiscal gerada.
  * Limpeza de estado (Logout) ao final do teste.
* ❌ **Caminho Triste (Segurança):**
  * Validação de alertas nativos ao inserir credenciais inválidas.

### 🎥 Demonstração Visual
![Demonstração do Maestro executando o fluxo de compras](./milks-cafe/docs/demo-maestro.gif)

### 🛠️ Como executar localmente
Para rodar a suíte E2E no seu emulador Android/iOS:

1. Acesse a pasta do projeto mobile:
```bash
cd milks-coffee/mobile
```
2. Execute o fluxo de compras completo:
```bash
maestro test .maestro/compra.yaml
```
3. Execute o fluxo de validação de login:
```bash
maestro test .maestro/login_invalido.yaml
```