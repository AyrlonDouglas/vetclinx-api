# Sistema de Recomendacao de Discussões

Este projeto implementa um sistema de recomendação de discussões baseado em interações do usuário com tags. A partir das interações registradas, o sistema sugere novas discussões com base nas tags mais relevantes para cada usuário.

## Estrutura do Sistema

O sistema é baseado nas seguintes entidades:

- **Discussões**: Contêm título, conteúdo, tags associadas e o usuário que a criou.
- **Tags**: Utilizadas para categorizar as discussões e facilitar a recomendação.
- **Interações de Usuário com Tags**: Registra as interações do usuário com cada tag e atribui um peso com base na frequência dessas interações.

## Funcionamento da Recomendação

1. Sempre que um usuário interagir com uma discussão (exemplo: comentar, votar, visualizar), o sistema aumenta o peso da tag associada.
2. Para recomendar novas discussões, o sistema busca as tags com maior peso para o usuário.
3. As discussões que possuem essas tags são sugeridas ao usuário.

## Melhorias Futuras

- **Ajuste de pesos**: Diferenciar interações (exemplo: um voto pode ter peso menor que um comentário).
- **Evitar recomendações repetidas**: Não sugerir discussões já visualizadas pelo usuário.
- **Decay de peso**: Diminuir o peso de tags menos utilizadas ao longo do tempo.
- **Filtragem colaborativa**: Identificar padrões entre usuários para recomendação mais precisa.
- **Melhoria no desempenho**: Implementar mecanismos de cache e otimização de consultas.

Este sistema permite que os usuários descubram novas discussões relevantes de forma automatizada, aumentando o engajamento e a qualidade das interações na plataforma.
