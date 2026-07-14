# MSS — Landing Page — Paraki (Copy Final)

> Documento de referência para leitura humana e base para prompt de agente codificador.
> Status: copy aprovado. Pendências: screenshots do mapa e do app (Play Store).
> Escopo do produto (até segunda ordem): bicicletários e paraciclos apenas.

---

## Navegação (header)

Reaproveita o header da MSS, com link de volta para a home (`/`).

---

## 1. Hero (`#hero`)

**Nome de exibição:** Paraki

**Tagline (aprovada):**
> Mapeamento colaborativo de bicicletários e paraciclos — infraestrutura de apoio para quem pedala, em um só lugar.

**Elementos visuais:** screenshot do mapa em uso — placeholder até asset ser fornecido.

---

## 2. Como funciona (`#como-funciona`)

1. Qualquer pessoa pode cadastrar um bicicletário ou paraciclo no mapa
2. Cada cadastro inclui localização, fotos e informações (capacidade, tipo, condição)
3. Todo envio passa por moderação antes de ser publicado
4. Colaboradores com reputação conquistada podem enviar sem moderação prévia — mas todo cadastro segue sujeito a revisão humana

---

## 3. Para quem é (`#para-quem-e`)

| Público | O que ganha |
|---|---|
| **Ciclistas/usuários** | Encontram bicicletários e paraciclos perto de onde estão |
| **Estabelecimentos** (shoppings, empresas) | Visibilidade gratuita do próprio bicicletário para quem já pedala e busca onde estacionar |
| **Poder público/pesquisa** | Dado aberto sobre infraestrutura real de bicicletários na cidade |

---

## 4. Status atual (`#status`)

- No ar em: `https://paraki.mavericksoftware.com.br/`
- App em teste na Play Store (screenshots a caminho); iOS em breve
- Sem números/métricas publicados por enquanto
- Código closed-source — não mencionar repositório nesta página

**Nota:** seção puramente informativa, sem botão de ação.

---

## 5. Contato (`#contato`)

```
Quer saber mais sobre o Paraki? Fale com a gente.

[Botão: E-mail]      → mailto:contato@mavericksoftware.com.br
[Botão: WhatsApp]    → https://wa.me/5511940035698
```

**Nota importante:** esta página não possui CTA de ação (ex.: "autorizar cadastro", "solicitar credencial"). A interação com estabelecimentos específicos (ex. shoppings) parte de Heitor via contato direto — a página serve como peça de apoio/credibilidade para esse pitch, não como ponto de conversão autônomo.

---

## Rodapé

Reaproveita o rodapé padrão da MSS (ver `mss-home-copy.md`).

---

## Notas técnicas para implementação

- Página em rota própria: `/paraki`.
- Sem formulário, sem CTA button além dos botões de contato padrão (e-mail/WhatsApp).
- Imagem do hero e prints do app: placeholders até assets serem entregues.
- Não referenciar o repositório do código (closed-source).
- Link de volta para a home no header.
