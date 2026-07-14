# MSS — Landing Page — M-ES / Maverick Event Solutions (Copy Final)

> Documento de referência para leitura humana e base para prompt de agente codificador.
> Status: copy aprovado. Produto em MVP — sem uso em evento real ainda, lançamento em breve.

---

## Navegação (header)

Reaproveita o header da MSS, com link de volta para a home (`/`).

---

## 1. Hero (`#hero`)

**Nome de exibição:** Maverick Event Solutions (M-ES) — nome completo na primeira menção; "M-ES" nas seções seguintes.

**Tagline (aprovada):**
> Carteira virtual para eventos — carga, consumo e prestação de contas em um só sistema, sem fila e sem troco.

**Elementos visuais:** placeholder até haver mockups/screenshots do painel ou do app.

---

## 2. Funcionalidades (`#funcionalidades`)

**Carga**
> Via gateway de pagamento — Mercado Pago, Stripe ou a própria adquirente que o organizador já usa.

**PDV**
> Débito por leitura de QR Code (no app ou em cartão plástico) ou por número de conta personalizável + senha. Funciona em qualquer hardware com internet, com suporte opcional a câmera ou leitor USB.

**Painel administrativo**
> Acompanhamento em tempo real de vendas, saldo e todos os dados operacionais do evento — visão completa para fechamento de caixa e prestação de contas.

---

## 3. Para quem é (`#para-quem-e`)

**Texto (público amplo, não restrito a escolas):**

> Feito para qualquer evento que movimenta dinheiro: festas escolares, eventos corporativos, feiras, festivais e associações — qualquer organizador que precise de controle financeiro sem fila e sem risco de descontrole de caixa.

**Sugestão visual:** exibir os tipos de evento como tags/pills (Festas escolares · Eventos corporativos · Feiras e festivais · Associações e clubes) para reforçar a amplitude sem precisar de um parágrafo longo.

---

## 4. Status atual (`#status`)

- MVP em desenvolvimento; lançamento em breve
- Ainda sem uso em evento real — sem prova social/números publicados por enquanto
- Demonstração feita pessoalmente/por chamada; sem ambiente de teste self-service no momento

**Nota:** manter o tom honesto sobre o estágio do produto (MVP) — não implica em promessas de recursos prontos que ainda não existem.

---

## 5. CTA / Contato (`#contato`)

```
Quer ver o M-ES funcionando?

[Botão: Solicitar demonstração — WhatsApp] → https://wa.me/5511940035698?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20demonstra%C3%A7%C3%A3o%20do%20M-ES.
[Botão: Solicitar demonstração — E-mail]   → mailto:contato@mavericksoftware.com.br?subject=Demonstra%C3%A7%C3%A3o%20M-ES
```

**Nota de implementação:** o CTA leva direto para conversa com Heitor (WhatsApp/e-mail), não para um fluxo automatizado de agendamento — coerente com o estágio atual (MVP), evitando prometer algo que ainda não existe.

---

## Rodapé

Reaproveita o rodapé padrão da MSS (ver `mss-home-copy.md`).

---

## Notas técnicas para implementação

- Página em rota própria: `/m-es`.
- Seção "Funcionalidades" pode usar layout de 3 colunas/cards (Carga / PDV / Painel), mantendo paralelismo visual com a estrutura das outras páginas de produto.
- Tags/pills da seção "Para quem é": lista simples, fácil de expandir conforme novos tipos de evento forem validados.
- Sem métricas ou cases de uso publicados nesta fase — revisar quando houver primeiro evento real rodado.
- Botões de contato usam `mailto:` e `wa.me` com mensagem/assunto pré-preenchidos (URL-encoded), mesmo padrão das outras páginas.
- Link de volta para a home no header.
