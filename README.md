# AEP-2-bimestre

CHATBOT HOSPITALAR – ISAÚDE

O projeto intitulado Chatbot Hospitalar, também chamado de ISAÚDE, foi desenvolvido pelos alunos Rafael Garcia Ribeiro, Jonatas Marques da Silva e Gustavo Antunes, do curso de Engenharia de Software da Unicesumar, campus de Maringá, no ano de 2025.

O ISAÚDE é um assistente digital programado em linguagem C, criado com o objetivo de realizar triagens iniciais de sintomas de maneira simples, rápida e acessível. O sistema interage com o usuário por meio do terminal, realizando perguntas diretas sobre sintomas comuns e apresentando, ao final, um possível diagnóstico baseado nas respostas fornecidas.

É importante ressaltar que o sistema não substitui a consulta médica profissional, servindo apenas como uma ferramenta de apoio e orientação inicial, principalmente para usuários de áreas rurais ou locais com acesso limitado à internet e aos serviços de saúde.

Objetivos

O objetivo geral do projeto foi desenvolver um chatbot em linguagem C capaz de coletar sintomas informados pelo usuário e apresentar um diagnóstico provável, de acordo com padrões lógicos pré-definidos.

Entre os objetivos específicos estão:

Utilizar estruturas condicionais para interpretar as respostas do usuário;

Identificar combinações de sintomas associados a doenças comuns;

Exibir orientações básicas de cuidado correspondentes a cada caso identificado;

Garantir que o sistema seja simples, intuitivo e acessível, mesmo para pessoas com pouco conhecimento tecnológico.

Estrutura e Funcionamento do Sistema

O chatbot foi implementado em linguagem C, utilizando as bibliotecas stdio.h, string.h e locale.h.
Essas bibliotecas permitem, respectivamente, a entrada e saída de dados no terminal, a comparação de strings para as respostas “sim” e “não”, e a configuração da acentuação e idioma em português.

Ao iniciar o programa, o usuário é recebido com uma mensagem de boas-vindas e instruído a responder as perguntas apenas com “sim” ou “não”. Em seguida, o sistema realiza uma série de perguntas sobre sintomas, como:

Dor de cabeça

Febre

Tosse seca

Dor no corpo

Falta de ar

Náusea

Coriza

Cada resposta “sim” ativa uma variável correspondente ao sintoma. Ao final das perguntas, o sistema analisa as respostas por meio de estruturas condicionais (if, else if e else) e apresenta um possível diagnóstico, além de recomendações iniciais de cuidados.

Lógica de Decisão

O sistema segue uma árvore de decisão simples, baseada nas combinações dos sintomas. Os resultados possíveis são:

Dengue: quando o usuário relata febre, dor no corpo e dor de cabeça, mas sem coriza.
Orientação: repouso absoluto, hidratação constante e evitar o uso de medicamentos como ibuprofeno.

COVID-19: quando há febre, tosse seca e falta de ar.
Orientação: isolamento, hidratação e acompanhamento médico.

Gripe comum: quando há coriza, tosse seca e dor de cabeça.
Orientação: repouso leve, consumo de líquidos e vitamina C.

Infecção viral: quando há náusea, dor no corpo e febre.
Orientação: repouso, alimentação leve e hidratação adequada.

Sem sintomas: quando todas as respostas são “não”.
Orientação: manter hábitos saudáveis, boa alimentação e hidratação.

Sintomas mistos: quando as respostas não se encaixam em nenhum padrão definido.
Orientação: observar a evolução e procurar atendimento médico em caso de piora.

Desenvolvimento e Estrutura do Código

O código foi dividido em quatro partes principais:

Configuração inicial: define o idioma para português e cria as variáveis que armazenam os sintomas.

Coleta de dados: o programa realiza perguntas ao usuário, validando as respostas aceitas (“sim” ou “não”).

Processamento lógico: as respostas são analisadas e comparadas para determinar o diagnóstico mais provável.

Exibição de resultados: o chatbot apresenta o diagnóstico e as orientações de forma clara e direta no terminal.

Resultados Obtidos

Durante os testes realizados, o chatbot demonstrou um bom desempenho na coleta e análise de sintomas, exibindo diagnósticos coerentes e compreensíveis.
Mesmo usuários com pouca experiência em tecnologia conseguiram utilizar o sistema com facilidade, o que comprova a eficácia da interface textual e a simplicidade da navegação.

O projeto, portanto, atingiu todos os objetivos propostos, mostrando-se funcional, acessível e didático. Ele reforça como a lógica de programação e as estruturas condicionais podem ser aplicadas na criação de soluções práticas voltadas à área da saúde.

Considerações Éticas

O chatbot ISAÚDE foi desenvolvido apenas com finalidade educacional e de pesquisa.
O sistema não coleta nem armazena informações pessoais, preservando a privacidade e segurança do usuário.
Além disso, o programa não substitui um profissional da saúde, sendo apenas um apoio inicial à triagem de sintomas.

Melhorias Futuras

Entre as possíveis melhorias futuras estão:

Adicionar novos sintomas e doenças ao sistema;

Criar uma interface gráfica mais amigável;

Implementar uma versão com voz sintetizada ou integração web;

Utilizar estruturas de dados mais avançadas, como árvores dinâmicas, para aprimorar a análise dos sintomas.

Conclusão

O projeto Chatbot Hospitalar – ISAÚDE demonstrou a aplicabilidade prática da lógica de programação em linguagem C, apresentando um sistema útil para triagem preliminar de sintomas e educação em saúde.
Sua leveza, compatibilidade com diferentes dispositivos e capacidade de operar sem internet reforçam seu potencial de aplicação em comunidades rurais ou com recursos limitados.

Ao unir tecnologia e saúde, o ISAÚDE mostra como a engenharia de software pode contribuir de forma direta para melhorar o acesso à informação e otimizar atendimentos médicos.
