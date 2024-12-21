#!/bin/bash

# Configura o script para parar em caso de erro
set -e

# Função para reverter o processo em caso de erro
rollback() {
  echo "Erro detectado! Revertendo todas as alterações..."
  
  # Desfazendo alterações não commitadas
  git reset --hard
  
  # Desfazendo quaisquer commits e alterações de fluxo (caso tenha começado)
  if git rev-parse --verify "release/$versao" >/dev/null 2>&1; then
    echo "Cancelando release do git flow..."
    git flow release finish $versao
  fi

  echo "Rollback concluído. O script será encerrado."
  exit 1
}

# Definindo a captura de erro para chamar a função de rollback
trap 'rollback' ERR

echo "Iniciando processo de criação de release"
echo "**********************************"

echo "Trocando branch para develop"
git checkout develop

echo "Atualizando branch develop"
git pull origin develop

echo "Forneça o número da versão da release a ser criada (exemplo: 1.2.3):"
read versao

echo "Iniciando git flow" 
git flow init -d || {
  echo "Git flow inicializado anteriormente"
}

echo "Iniciando release"
git flow release start $versao

echo "Atualize a versão do package.json para $versao, salve e pressione enter"
read dummy

echo "Atualize a versão no VERSION para $versao, salve e pressione enter"
read dummy

echo "Atualize a versão no CHANGELOG.md para $versao, salve e pressione enter"
read dummy

git add .

git commit -m "$versao"

echo "Finalizando o release com git flow"
git flow release finish $versao -F -p

echo "**********************************"
echo "Script finalizado. O deploy iniciará em instantes. Acompanhe o processo pelas pipelines no Azure DevOps."
read dummy