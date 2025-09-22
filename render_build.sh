#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pipenv install

pipenv run upgrade

echo "[+] Instalando frontend"
npm ci
npm run build

echo "[+] Instalando backend (pip)"
pip install --upgrade pip
pip install -r requirements.txt

echo "[+] Migraciones"
export FLASK_APP=src.app
flask db upgrade

echo "[+] Build finalizado"