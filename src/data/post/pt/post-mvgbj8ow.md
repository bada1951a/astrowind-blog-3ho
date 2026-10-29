---
title: "Como Automatizar Relatórios em PDF no Google Sheets com Apps Script"
description: "Aprenda a criar um script no Google Sheets para gerar e enviar relatórios semanais em PDF automaticamente direto do seu escritório."
publishDate: 2026-10-20T17:15:00.000Z
image: 'https://picsum.photos/seed/work-mvgbl3dg-7-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automação", "Produtividade"]
theme: "Acid Lime Hacker Space"
---

Eram exatas 18h45 de uma sexta-feira chuvosa em São Paulo. O ar-condicionado do escritório já tinha desligado sozinho, a equipe de vendas tinha acabado de enviar a última leva de planilhas consolidadas e a minha caixa de entrada parecia um campo de guerra. O ritual de final de mês era sempre o mesmo: abrir cinco planilhas diferentes, formatar os dados de faturamento, exportar cada uma manualmente como PDF, anexar ao e-mail e disparar para a diretoria antes de segunda-feira cedo. Foi bem na hora em que o mouse travou na minha mão que eu decidi: chega de trabalho braçal. Se eu precisava enviar relatórios semanais sem perder meu fim de semana, o Google Sheets e um toque de código teriam que fazer o serviço pesado por mim.

<div style="border-left: 4px solid #84cc16; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Missão do Dia:</strong> Criar um script automatizado que pega a aba de fechamento da sua planilha, converte em um PDF limpo e formata o disparo por e-mail automaticamente toda semana. Sem plugins pagos, sem dor de cabeça.
</div>

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbl3dg-7-b/1000/550.jpg)

---

### O Calvário do Trabalho Manual: Por que isso acontece?

Antes de colocar a mão na massa, vale entender os três vilões que transformam uma tarefa simples em um pesadelo corporativo:

1. <strong>O Fator Humano e o Esquecimento:</strong> Depender da memória para enviar relatórios semanais na correria do fechamento é pedir para tomar puxão de orelha na reunião de diretoria de segunda-feira.
2. <strong>Exportações Manuais Inconsistentes:</strong> Salvar como PDF pelo navegador muitas vezes quebra a formatação, corta colunas importantes ou deixa as margens totalmente desalinhadas.
3. <strong>Falta de Integração Nativa Simples:</strong> Embora o Google Sheets seja poderoso, ele não vem com um botão pronto de "enviar PDF personalizado toda sexta-feira" — o que obriga a gente a desbravar o Google Apps Script.

---

### Passo a Passo: Construindo seu Robô de Relatórios

Esqueça códigos complexos de programação. Vamos usar um script pronto, testado no campo de batalha dos escritórios, adaptado para rodar em minutos.

#### Passo 1: Abrir o Editor de Código
No seu Google Sheets, vá no menu superior e clique em <strong>Extensões > Apps Script</strong>. Isso vai abrir a interface de desenvolvimento do Google no seu navegador.

#### Passo 2: Inserir o Script de Geração e Envio
Apague qualquer código que estiver na tela e cole o bloco abaixo. Ele converte a aba ativa em PDF usando parâmetros de URL e dispara via `MailApp`:

```javascript
function enviarRelatorioSemanal() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName("Resumo_Executivo"); // Substitua pelo nome exato da sua aba
  var idPlanilha = planilha.getId();
  
  // Configurações de exportação em PDF (tamanho A4, retrato, sem grades)
  var urlExportacao = "https://docs.google.com/spreadsheets/d/" + idPlanilha + "/export?";
  
  var opcoesExportacao = {
    exportFormat: "pdf",
    format: "pdf",
    size: "a4",
    portrait: "true",
    fitw: "true",
    gridlines: "false",
    printtitle: "false",
    sheetnames: "false",
    fzr: "false",
    gid: aba.getSheetId()
  };
  
  var urlCompleta = urlExportacao;
  for (var chave in opcoesExportacao) {
    urlCompleta += chave + "=" + opcoesExportacao[chave] + "&";
  }
  
  var token = ScriptApp.getOAuthToken();
  var resposta = UrlFetchApp.fetch(urlCompleta, {
    headers: {
      'Authorization': 'Bearer ' +  token
    }
  });
  
  var blobPdf = resposta.getBlob().setName("Relatorio_Semanal_" + Utilities.formatDate(new Date(), "GMT-3", "dd-MM-yyyy") + ".pdf");
  
  // Configurações do E-mail
  var destinatario = "diretoria@suaempresa.com.br";
  var assunto = "Relatório Semanal Automatizado - Fechamento";
  var corpo = "Olá,\n\nSegue em anexo o relatório semanal atualizado gerado automaticamente pelo Google Sheets.\n\nAtenciosamente,\nSua Equipe de Operações.";
  
  MailApp.sendEmail(destinatario, assunto, corpo, {
    attachments: [blobPdf]
  });
}
```

#### Passo 3: Configurar a Automação (Gatilho)
1. No painel esquerdo do Apps Script, clique no ícone de relógio (<strong>Acionadores</strong> / Triggers).
2. No canto inferior direito, clique em <strong>Adicionar acionador</strong>.
3. Escolha a função `enviarRelatorioSemanal`.
4. Em "Selecione o tipo de acionador baseado no tempo", escolha <strong>Unidade de tempo baseada na semana</strong>.
5. Defina o dia da semana (ex: Sexta-feira) e o horário desejado (ex: 18h - 19h). Salve e dê as permissões necessárias na sua conta Google.

---

### Alertas de Especialista: O que evitar

<div style="border-left: 4px solid #84cc16; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Atenção à Privacidade e Cotas:</strong> O Google Apps Script possui limites diários de envio de e-mails (geralmente 100 para contas gratuitas do Gmail e até 1.500 para contas corporativas Google Workspace). Garanta que a aba referenciada no script (`Resumo_Executivo`) tenha seu intervalo de impressão bem definido para evitar PDFs com páginas em branco cortadas incorretamente.
</div>

---

### Perguntas Frequentes (FAQ)

<strong>1. O script vai rodar se o meu computador estiver desligado?</strong>  
Sim! Como o Google Apps Script roda diretamente nos servidores em nuvem do Google, a automação será disparada no dia e horário programados, mesmo que você esteja com o notebook fechado aproveitando o fim de semana.

<strong>2. Posso enviar o PDF para mais de uma pessoa ao mesmo tempo?</strong>  
Com certeza. Na variável `destinatario` dentro do código, você pode separar os e-mails por vírgula (ex: `"chefe@empresa.com.br, socio@empresa.com.br"`) ou adaptar o script para puxar uma lista direto de um intervalo de células da planilha.

<strong>3. Como faço para testar o script antes de agendar o envio automático?</strong>  
Basta voltar ao editor do Apps Script, selecionar a função `enviarRelatorioSemanal` no menu superior suspenso e clicar no botão <strong>Executar</strong>. Verifique sua caixa de entrada de e-mails enviados logo em seguida para conferir se o PDF chegou certinho.
