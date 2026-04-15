# 🏆 Simulador Copa do Mundo 2026

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Linguagem](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)

Este projeto foi desenvolvido como resolução do desafio técnico para a vaga de Estágio em Desenvolvimento de Software da **Geopost Energy / Katalyst Data Management**. O objetivo é simular as fases de grupo e mata-mata da Copa do Mundo, consumindo e enviando dados para uma API Restful.

## 🚀 Funcionalidades Implementadas

O simulador atende a todos os requisitos propostos no escopo da prova:

- **Consumo de API:** Requisição `GET` para extrair as 32 seleções usando a Fetch API e injetando o header obrigatório `Biosca18`.
- **Fase de Grupos (Sorteio e Lógica):** - Embaralhamento aleatório (algoritmo de *Fisher-Yates*) e divisão em 8 grupos (A ao H).
  - Simulação de partidas no formato *Round-Robin* (todos contra todos no grupo).
  - Sistema de classificação dinâmico utilizando múltiplos critérios de desempate (`.sort()` com Pontos > Saldo de Gols > Sorteio).
- **Mata-Mata (Chaveamento em Árvore):**
  - Cruzamento olímpico (1ºA x 2ºB, etc.) desde as Oitavas de Final até a Grande Final.
  - Lógica de pênaltis implementada: em caso de empate no tempo normal, a partida é decidida nos pênaltis, garantindo que não haja empates matemáticos na fase eliminatória.
- **Registro do Campeão:** Envio dinâmico do resultado da final via método `POST` contendo os Tokens das equipes e o placar, no formato JSON exigido.

## 🛠️ Tecnologias Utilizadas

Para demonstrar domínio dos fundamentos da web, este projeto foi construído **sem o uso de frameworks**, utilizando apenas:

* **HTML5:** Estruturação semântica.
* **CSS3:** Estilização responsiva utilizando `Flexbox` e `CSS Grid`.
* **JavaScript (ES6+):** Lógica de negócios, manipulação do DOM e consumo de requisições assíncronas (`async/await`).

## ⚙️ Como executar o projeto localmente

1. Clone este repositório para a sua máquina:
   ```bash
   git clone [https://github.com/Biosca18/simulador-copa-geopost.git](https://github.com/Biosca18/simulador-copa-geopost.git)

