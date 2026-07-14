# MSS — Landing Page — TupiJuá (Copy Final)

> Documento de referência para leitura humana e base para prompt de agente codificador.
> Status: copy aprovado. Pendências: definição de assets visuais, implementação do formulário de lista de espera.
> Produto ainda em fase de validação própria — sem usuários externos, sem URL pública.

---

## Navegação (header)

Reaproveita o header da MSS, com link de volta para a home (`/`).

---

## 1. Hero (`#hero`)

**Nome de exibição:** TupiJuá

**Tagline (aprovada):**
> App de treino e acompanhamento fitness — simples de usar, pronto para virar o seu.

**Elementos visuais:** placeholder até haver screenshots/mockups do app.

---

## 2. Funcionalidades (`#funcionalidades`)

- Registro de treinos, livres ou a partir de um plano cadastrado
- Cadastro de planos de treino personalizados
- Acompanhamento de métricas e evolução com gráficos

---

## 3. Para quem é (`#para-quem-e`)

| Público | O que ganha |
|---|---|
| **Usuário final** | App de treino completo — do registro à evolução da sua performance |
| **Parceiro (white-label)** | Base pronta para rebrandear e oferecer como produto próprio |

**Nota de destaque visual:** dar mais peso textual/visual à linha de parceria do que à de usuário final — é o motivo principal desta página existir.

---

## 4. Parceria / White-label (`#parceria`)

**Texto (modelo de parceria ainda em aberto — página serve para abrir a conversa, não vender pacote fechado):**

> O TupiJuá está pronto para virar a base de um produto com a sua marca. Ainda estamos definindo o melhor formato de parceria — e é justamente por isso que vale conversar: o modelo pode ser desenhado junto com quem tiver interesse real.

---

## 5. Status atual (`#status`)

- App nativo — stack não mencionada na página
- Android em desenvolvimento; iOS no futuro
- Fase de validação própria; sem usuários externos ainda
- Sem URL pública no momento

---

## 6. CTAs (`#contato`)

### Bloco 1 — Parceria comercial

```
Quer conversar sobre uma parceria white-label?

[Botão: Falar no WhatsApp] → https://wa.me/5511940035698?text=Ol%C3%A1!%20Tenho%20interesse%20em%20uma%20parceria%20white-label%20com%20o%20TupiJu%C3%A1.
[Botão: Enviar e-mail]     → mailto:contato@mavericksoftware.com.br?subject=Parceria%20TupiJu%C3%A1
```

### Bloco 2 — Lista de lançamento

```
Quer ser avisado quando o TupiJuá for lançado?

[Campo de e-mail] + [Botão: Quero ser avisado]
```

**Decisão de implementação (registrada, não bloqueia o copy):** captura via Cloudflare Worker + KV (namespace dedicado para e-mails da lista de espera), em vez de `mailto:` manual ou serviço externo. Justificativa: gera lista estruturada e exportável, e reaproveita stack que Heitor já opera em outros projetos — custo de implementação marginal.

---

## Rodapé

Reaproveita o rodapé padrão da MSS (ver `mss-home-copy.md`).

---

## Notas técnicas para implementação

- Página em rota própria: `/tupijua`.
- Formulário de lista de espera: endpoint via Cloudflare Worker, gravando em KV namespace (a criar na fase de implementação). Validar e-mail no client-side antes do POST; tratar erro de rede/rate limit visivelmente para o usuário.
- Botões de parceria usam `mailto:` e `wa.me` com mensagem/assunto pré-preenchidos (URL-encoded).
- Sem menção a stack técnica (MAUI) em nenhum ponto da página pública.
- Assets pendentes: screenshots/mockups do app.
- Link de volta para a home no header.
