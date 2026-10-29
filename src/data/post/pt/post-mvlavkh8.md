---
title: "Como Dividir Enderecos e Telefones no Excel com o ChatGPT sem Perder a Cabeca"
description: "Resolva o bloqueio de planilhas protegidas e aprenda a separar dados colados no Excel usando o ChatGPT de forma rapida."
publishDate: 2026-10-24T03:35:00.000Z
image: 'https://picsum.photos/seed/work-mvlaww1w-7-c/1200/675.jpg'
category: 'automation'
tags: ["Excel", "ChatGPT", "Produtividade", "Automacao"]
theme: "Teal Matrix Digital"
---

## 1. Situação de emergência e gargalo crítico no escritório

Eram exatamente quatro para as cinco da tarde em um escritório corporativo na Avenida Paulista em São Paulo, e o clima estava tenso. Precisávamos enviar urgentemente um memorando com a base de dados de clientes consolidada para a diretoria, mas meu colega de equipe estava travado. Ele havia herdado um arquivo de planilha onde a coluna de endereço e telefone estava completamente mesclada em uma única célula por linha, e para piorar, o arquivo estava com uma proteção antiga de planilha com senha que ninguém na sala lembrava.

Como a senha estava perdida, o recurso nativo de "Texto para Colunas" do Excel simplesmente exibia um aviso de erro informando que as células continham fórmulas protegidas ou estavam bloqueadas.

O relógio correndo contra nós, o chefe cobrando atualizações no chat corporativo e o medo de ter que redigitar manualmente mais de quinhentas linhas de endereços longos com bairros, CEPs e números de telefone misturados. Foi nesse momento de desespero que decidi usar uma abordagem diferente: parar de tentar quebrar a senha do Excel e usar o ChatGPT para gerar uma rotina inteligente de extração de dados que funcionasse em uma nova planilha limpa, contornando o problema de vez.

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlaww1w-7-b/1000/550.jpg)

<div style="border-left: 4px solid #14b8a6; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Aviso Importante: Nunca insira dados confidenciais de clientes ou informações cobertas por sigilo corporativo na versão pública do ChatGPT. Sempre anonimize os dados (substitua nomes e números reais por exemplos fictícios) antes de pedir ajuda com fórmulas ou códigos de automação.
</div>

## Por Que Tarefas Simples de Planilha Travam o Escritório

Problemas como esse acontecem com frequência em ambientes corporativos devido a três grandes gargalos operacionais:

1. Dados Consolidados de Forma Incorreta.

Sistemas legados de atendimento muitas vezes exportam relatórios em formato de texto bruto, jogando rua, número, cidade e telefone na mesma coluna sem delimitadores padronizados como ponto e vírgula ou tabulação.

2. Senhas e Restrições Esquecidas: É comum que equipes protejam planilhas para evitar edições acidentais, mas a documentação da senha se perde com a rotatividade de funcionários, deixando a equipe atual sem autonomia para ajustes estruturais básicos.

3. Desconhecimento de Ferramentas de IA Aplicadas: Muitos profissionais ainda tentam resolver problemas complexos de formatação linha por linha manualmente ou gastam horas buscando fórmulas de texto aninhadas no Excel (como LOCALIZ, EXT.TEXTO e ARRUMAR) que quebram facilmente quando o padrão do texto muda.

## O Passo a Passo Prático para Resolver o Problema com o ChatGPT

Para resolver a situação sem precisar da senha da planilha antiga, a solução mais rápida foi copiar a coluna bagunçada, jogar no ChatGPT com o comando correto e pedir uma fórmula ou script para separar o endereço do telefone instantaneamente. Aqui está o procedimento exato que você pode aplicar agora mesmo no seu computador.

### Passo 1: Copiar e Estruturar o Pedido para a IA

Abra o ChatGPT e forneça uma amostra dos dados bagunçados junto com o objetivo claro. Evite textos vagos. Use um prompt estruturado diretamente no navegador.

```text
Atue como um especialista em Excel. Tenho uma coluna no Excel onde o endereço e o telefone estão misturados na mesma célula.

Exemplo de linha.

"Avenida Paulista, 1000, Sao Paulo - SP, (11) 98765-4321". Crie uma formula ou funcao em Excel para separar o endereco completo na Coluna B e o numero de telefone na Coluna C.
```

### Passo 2: Aplicar a Solução na Nova Planilha

Como a planilha antiga estava bloqueada, criamos um arquivo novo em branco. O ChatGPT geralmente sugere duas abordagens muito eficientes: o uso do recurso "Texto para Colunas" guiado por IA ou fórmulas combinadas. No nosso caso, a IA sugeriu usar a ferramenta de preenchimento relâmpago combinada ou uma fórmula com Expressões Regulares (Regex) via VBA, mas a forma mais rápida para o dia a dia corporativo foi usar o recurso nativo de Inteligência Artificial do Excel ou fórmulas de texto.

Caso os dados tenham um padrão fixo, você pode usar a ferramenta nativa do Excel indo em:
1. Abra o menu superior e clique na guia Dados.

2. Selecione a coluna inteira com os dados misturados.

3. Clique em Texto para Colunas, escolha Delimitado, clique em Avançar, selecione a vírgula ou o hífen como separador e conclua o assistente.

Se os dados forem totalmente irregulares (com telefones entre parênteses no final), peça para o ChatGPT gerar uma fórmula personalizada baseada nas funções modernas do Excel, como EXTR.TEXTO e PROCURAR, ou utilize o recurso de Preenchimento Relâmpago (pressione as teclas `Ctrl + E` após digitar manualmente o primeiro exemplo corrigido na linha ao lado).

### Passo 3: Validar e Consolidar o Relatório

Com os dados separados corretamente em colunas limpas, copie os valores gerados, clique com o botão direito na célula de destino, selecione Colar Valores para remover qualquer vínculo de fórmula e finalize a formatação visual do seu relatório para envio à diretoria dentro do prazo.

## Dicas de Ouro para Evitar Novos Bloqueios

- Sempre mantenha uma cópia de segurança (backup) dos relatórios brutos antes de aplicar senhas ou restrições de edição em planilhas compartilhadas.
- Se precisar proteger uma planilha para a equipe, anote a senha em um gerenciador de senhas corporativo seguro em vez de confiar na memória.

- Utilize macros e scripts gerados por IA apenas em ambientes controlados e verifique sempre o código antes de executá-lo em macros do Excel para garantir a segurança da sua estação de trabalho.

## Perguntas Frequentes (FAQ)



Q1. O que fazer se o Preenchimento Relâmpago (Ctrl + E) não reconhecer o padrão do meu endereço?



A1. O Preenchimento Relâmpago aprende com exemplos. Se ele errar na segunda ou terceira linha, digite manualmente o resultado correto na terceira linha e pressione Ctrl + E novamente para forçá-lo a entender a regra lógica.

Se persistir, use o ChatGPT para criar uma fórmula dedicada.



Q2. Posso usar o suplemento do ChatGPT diretamente dentro do Excel corporativo?



A2. Depende das políticas de segurança da sua empresa.

Muitas empresas na Avenida Paulista bloqueiam suplementos externos de IA por questões de conformidade (Compliance). Nesses casos, o método mais seguro é usar o ChatGPT pelo navegador em uma aba separada e apenas colar os resultados ou fórmulas na sua planilha.



Q3. Como proceder se a planilha estiver totalmente corrompida além de protegida por senha?



A3. Se o arquivo nem sequer abrir, tente abri-lo no Excel Online via navegador ou use a opção de "Abrir e Reparar" localizada na janela de abertura de arquivos do aplicativo de desktop na guia Arquivo > Abrir > Procurar.
