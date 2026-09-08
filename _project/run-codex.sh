#!/bin/zsh
# usage: run-codex.sh <label> <brief-file>
cd "$(dirname "$0")/.."
label="$1"; brief="$2"
codex exec --approve-for-me -C "$PWD" -o "_project/codex-$label-last.md" - < "$brief" > "_project/codex-$label.log" 2>&1
echo "CODEX $label EXIT $?" >> "_project/codex-$label.log"
