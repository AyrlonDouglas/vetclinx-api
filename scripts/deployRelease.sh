#!/bin/bash

# Configura o script para parar em caso de erro
# set -e

echo "Iniciando processo de criação de release";
echo "**********************************";

echo "Guardando mudanças";
git stash;

echo "Trocando branch para develop";
git checkout develop;

echo "Atualizando branch develop";
git pull origin develop;

echo "Forneça o número da versão da release a ser criada (exemplo: 1.2.3):"; read versao;

echo "Iniciando git flow";
git flow init;

echo "Iniciando release"
git flow release start $versao;

echo "Atualize a versão do package.json para $versao, salve e pressione enter"; read dummy;

echo "Atualize a versão no VERSION para $versao, salve e pressione enter"; read dummy;

echo "Atualize a versão no CHANGELOG.mg para $versao, salve e pressione enter"; read dummy;

git add .;

git commit -m $versao;

git flow release finish $versao -Fp;

echo "**********************************"
echo Script finalizado, o deploy iniciaŕa em instantes. Acompanhe o processo pelas pipelines no azure devops; read dummy;
