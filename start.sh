#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

npm_install() {
    local dir="$SCRIPT_DIR/$1"

    cd "$dir"
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies to $dir..."
        npm install
    fi

    cd - > /dev/null
}

npm_install "rainforest-app"
npm_install "rainforest-backend"

echo "Starting database..."
cd "$SCRIPT_DIR/rainforest-backend"
node seedProducts.js &

echo "Starting backend..."
npm start &

echo "Starting frontend..."
cd "$SCRIPT_DIR/rainforest-app"
ng serve &

wait
