# 📱 Automação Mobile | Milk's Coffee (Maestro)

Este módulo contém a suíte de testes End-to-End (E2E) para o aplicativo mobile do Milk's Coffee. Utilizando o **Maestro**, a estratégia foca em simular o comportamento real do usuário, interagindo diretamente com a árvore de acessibilidade e os `testID`s da aplicação React Native.

---

## 🎯 Cenários Cobertos

* ✅ **Caminho Feliz (Jornada de Compra):** 
  * Autenticação validada.
  * Adição de produtos da vitrine ao carrinho.
  * Gestão de quantidades de itens.
  * Preenchimento do formulário de Checkout.
  * Tratamento do teclado virtual da UI (hideKeyboard).
  * Finalização de pagamento via PIX e validação da Nota Fiscal.
  * Limpeza de estado (Logout) ao final da execução.
* ❌ **Caminho Triste (Segurança):**
  * Validação de alertas nativos e bloqueio de acesso ao inserir credenciais inválidas.

---

## 🎥 Demonstração Visual

![Demonstração do Maestro executando o fluxo de compras](./milks-coffee/docs/demo-maestro.gif)

---

## ⚙️ Como executar localmente

**Pré-requisitos:** Emulador Android/iOS configurado e Maestro CLI instalado.

1. Acesse a pasta do projeto mobile no terminal:
```bash
cd milks-coffee/mobile
```

2. Certifique-se de que o aplicativo está aberto no emulador (pode ser na tela de login).

3. Execute o fluxo de compras completo:
```bash
maestro test .maestro/compra.yaml
```

4. Execute o fluxo de validação de login inválido:
```bash
maestro test .maestro/login_invalido.yaml
```