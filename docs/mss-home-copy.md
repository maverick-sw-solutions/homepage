# MSS — Landing Page — Home (Copy Final)

> Documento de referência para leitura humana e base para prompt de agente codificador.
> Status: copy aprovado. Pendências: logo, screenshots dos 3 produtos, páginas individuais de cada projeto (/paraki, /tupijua, /m-es).

---

## Navegação (header)

```
[Logo/Wordmark: Maverick Software Solutions]     Sobre | Projetos | Contato
```

- Nome completo na primeira aparição (logo/wordmark do header). Sem logo gráfico ainda — usar wordmark tipográfico.
- Menu com scroll suave para as âncoras `#sobre`, `#projetos`, `#contato`.

---

## 1. Hero (`#hero`)

**Nome de exibição:** Maverick Software Solutions (primeira menção completa; "MSS" nas seções seguintes)

**Tagline (aprovada):**
> Software sob medida para problemas reais.

**CTA primário:** "Ver projetos" → scroll para `#projetos`

**Elementos visuais:** wordmark tipográfico, sem imagem de fundo definida ainda (placeholder neutro).

---

## 2. Sobre (`#sobre`)

**Texto (abordagem E — formal/institucional, terceira pessoa):**

> Heitor Maciel de Vasconcellos Leite é Bacharel em Ciência da Computação e desenvolvedor sênior com 6 anos de atuação no ecossistema Microsoft (.NET, C#, Azure). Em 2026, fundou a MSS (Maverick Software Solutions) para consolidar projetos próprios de software sob uma marca única.

**Imagem:** foto pessoal (headshot, fundo neutro) — a ser fornecida por Heitor.

**Nota:** emprego full-time (SESI/SENAI SP) não é mencionado nesta seção — mantido separado intencionalmente.

---

## 3. Projetos (`#projetos`)

Estrutura padrão por card:

```
[Nome do projeto]
[Carrossel de imagens — placeholder até screenshots serem fornecidos]
[Proposta de valor — 1 linha]
[Botão: Saiba mais →]
```

### 3.1 Paraki
- **Proposta de valor:** Mapeamento colaborativo de infraestrutura de bicicletários
- **CTA:** Saiba mais → `/paraki`
- **Carrossel:** placeholder (3–5 imagens, 16:9) — pendente

### 3.2 TupiJuá
- **Proposta de valor:** App de treino e acompanhamento fitness, pronto para parcerias white-label
- **CTA:** Saiba mais → `/tupijua`
- **Carrossel:** placeholder (3–5 imagens, 16:9) — pendente

### 3.3 M-ES (Maverick Event Solutions)
- **Nome:** "Maverick Event Solutions (M-ES)" na primeira menção (título do card); "M-ES" depois
- **Proposta de valor:** Carteira virtual para eventos — carga, PDV e gestão financeira sem fila
- **CTA:** Saiba mais → `/m-es`
- **Carrossel:** placeholder (3–5 imagens, 16:9) — pendente

---

## 4. Contato (`#contato`)

```
Heitor Maciel de Vasconcellos Leite — Fundador

[Botão: E-mail]      → mailto:contato@mavericksoftware.com.br
[Botão: WhatsApp]    → https://wa.me/5511940035698
```

- Sem formulário na v1 — apenas os dois botões de contato direto.
- Sem número de telefone exposto separadamente (apenas via botão WhatsApp).

---

## 5. Rodapé

```
MSS — Maverick Software Solutions © 2026

CNPJ: 65.483.350/0001-00
65.483.350 HEITOR MACIEL DE VASCONCELLOS LEITE
```

---

## Notas técnicas para implementação

- **Stack sugerida:** HTML/CSS estático + Pico.css ou Bulma, deploy via Cloudflare Pages.
- **Seções como `<section id="...">`:** `hero`, `sobre`, `projetos`, `contato`, seguindo as âncoras do menu.
- **Links dos cards de projeto** (`/paraki`, `/tupijua`, `/m-es`) devem apontar para `#` ou página placeholder até as páginas individuais existirem — não devem dar 404.
- **Carrosséis dos cards:** implementar com placeholder cinza (proporção 16:9) até os assets reais serem entregues; estrutura deve aceitar troca simples de imagens (array de paths, não hardcode).
- **Botões de contato:** usar `mailto:` e `https://wa.me/` diretamente, sem JS necessário.
- **Assets pendentes:** logo (SVG), foto de Heitor, screenshots dos 3 projetos.

---

## Dados brutos (para evitar erro de digitação na implementação)

| Campo | Valor |
|---|---|
| E-mail | contato@mavericksoftware.com.br |
| WhatsApp | (11) 94003-5698 → link `https://wa.me/5511940035698` |
| CNPJ | 65.483.350/0001-00 |
| Razão social (MEI) | 65.483.350 HEITOR MACIEL DE VASCONCELLOS LEITE |
| Nome do fundador | Heitor Maciel de Vasconcellos Leite |
