#!/bin/bash
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release

mkdir -p out
cp target/wasm32-unknown-unknown/release/ft_template.wasm ./out/main.wasm

echo "⚡️ Done"
echo "🤝 Your contract is located at 'out/main.wasm'"