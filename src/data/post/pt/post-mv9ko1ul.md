---
title: "Categorização em Massa no Google Sheets com Gemini API e Apps Script"
description: "Aprenda a automatizar a categorização de textos no Google Sheets usando a API do Gemini e Apps Script sem sofrer com o fechamento do mês."
publishDate: 2026-10-15T17:15:00.000Z
image: "https://picsum.photos/seed/tech543/1200/630"
category: "Productivity"
tags: ["Google Sheets", "Gemini API", "Apps Script", "Automação", "Produtividade"]
theme: "Bronze Artisan Workshop"
---


Eram 18h30 de uma sexta-feira de fechamento de mês no escritório da Avenida Paulista, e a minha caixa de entrada parecia uma zona de guerra. Na minha tela, uma planilha do Google Sheets exibia exatamente 4.382 linhas de feedback de clientes e descrições de despesas desorganizadas. O diretor comercial tinha acabado de passar pela minha mesa exigindo um relatório consolidado com a categorização de todos esses itens para a reunião de diretoria da segunda-feira cedo. Fazer isso manualmente significaria passar o fim de semana inteiro dando Ctrl+C e Ctrl+V no chat de IA, arriscando errar colunas e perder a sanidade. Foi aí que decidi parar de enxugar gelo e automatizar essa bagunça de vez conectando a API do Gemini direto na nossa planilha.

Se você já passou horas tentando classificar dados em lote no trabalho e bateu a cabeça contra o limite do que fórmulas básicas conseguem fazer, este guia é para você. Vamos direto ao ponto prático.

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office43/1000/550)

<div style="border-left: 4px solid #b45309; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Dica de Ouro da Oficina:</strong> Antes de começar qualquer script, certifique-se de que sua coluna de texto principal está limpa de caracteres especiais corrompidos. Isso evita que a API devolva erros de sintaxe JSON na hora do processamento em lote.
</div>

---

### Por que a sua automação trava? Os 3 vilões ocultos

Antes de colocarmos a mão na massa, vale entender por que métodos comuns de IA no Sheets costumam falhar com grandes volumes de dados:

1. **Estouro de Tempo Limite (Timeout):** O Google Apps Script tem um limite de execução de 6 minutos por script. Se você tentar enviar 4.000 linhas de uma vez só em um único bloco, a conexão vai cair por falta de tempo.
2. **Respostas Fora do Formato (JSON Mal Formado):** A IA às vezes inventa de colocar introduções educadas nas respostas (ex: "Claro, aqui está a sua categoria..."), o que quebra a lógica de leitura da planilha.
3. **Falta de Chave de API Segura:** Salvar a chave do Gemini direto no código aberto da planilha é um convite para vazamentos de credenciais na rede da empresa.

---

### Passo a Passo: Construindo a Ponte entre o Sheets e o Gemini

Vamos resolver isso criando uma função personalizada e um script em lote leve. Siga exatamente estes cliques:

#### Passo 1: Obter a Chave da API do Gemini
Acesse o Google AI Studio, faça login com sua conta Google e gere uma chave de API gratuita. Copie essa chave e guarde em um bloco de notas temporário.

#### Passo 2: Configurar o Apps Script
No seu Google Sheets, clique no menu superior em **Extensões > Apps Script**. Apague qualquer código que estiver lá dentro e cole o seguinte script otimizado para processamento linha por linha:

```javascript
function categorizarComGemini(texto) {
  var apiKey = "SUA_CHAVE_DE_API_AQUI"; // Substitua pela sua chave real
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
  var prompt = "Classifique o texto abaixo em apenas uma das seguintes categorias: Financeiro, Suporte, Comercial, Operacional. Retorne apenas o nome da categoria, sem pontuação ou texto extra. Texto: " + texto;
  
  var payload = {
    "contents": [{
      "parts": [{ "text": prompt }]
    }]
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    var categoria = result.candidates[0].content.parts[0].text.trim();
    return categoria;
  } catch (error) {
    return "Erro na API";
  }
}
```

#### Passo 3: Usando direto na Planilha
Volte para a sua planilha do Google Sheets. Na coluna ao lado do seu texto (por exemplo, na célula B2, assumindo que o texto está em A2), digite a fórmula personalizada:

```text
=categorizarComGemini(A2)
```

Arraste a fórmula para baixo. O Google Sheets fará a chamada assíncrona para o Gemini, trazendo a categoria exata de cada linha em segundos.

---

### Cuidados e Boas Práticas Corporativas

<div style="border-left: 4px solid #b45309; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Aviso de Segurança:</strong> Nunca envie dados sensíveis de clientes (como CPFs, senhas ou dados bancários cobertos pela LGPD) para APIs de IA externas sem a devida autorização do departamento de conformidade da sua empresa. Prefira anonimizar os dados antes do envio.
</div>

- **Faça em lotes menores:** Se sua planilha tem mais de 1.000 linhas, processe em blocos de 200 a 300 linhas por vez para evitar gargalhar o consumo de requisições por minuto (RPM) da API gratuita.
- **Transforme em Valores:** Assim que a IA preencher as colunas, selecione o intervalo, aperte `Ctrl + C` e cole como valores (`Ctrl + Shift + V`). Isso congela os resultados e evita que a planilha gaste créditos ou refaça chamadas desnecessárias toda vez que for aberta.

---

### Perguntas Frequentes (FAQ)

**1. O script dá erro de cota excedida (Rate Limit). O que fazer?**
A versão gratuita da API do Gemini possui um limite de requisições por minuto. Para contornar isso, insira uma pequena pausa no código usando `Utilities.sleep(1000);` (pausa de 1 segundo) entre uma linha e outra se estiver processando via macro.

**2. Posso usar essa mesma lógica para traduzir ou resumir textos?**
Com certeza. Basta alterar a variável `prompt` dentro do código do Apps Script para instruir o Gemini a realizar a tarefa desejada (ex: "Resuma o texto abaixo em uma frase...").

**3. Meus colegas de equipe conseguem ver minha chave de API no código?**
Se eles tiverem acesso de editor ao Apps Script, sim. Para ambientes corporativos compartilhados, o ideal é armazenar a chave sensível utilizando a propriedade do script (`PropertiesService.getScriptProperties()`) em vez de deixá-la explícita no texto do código.
