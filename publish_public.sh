#!/usr/bin/env bash
# Publish this folder to https://github.com/haihpse150218/llm-mechsim-oracle (main).
# Splits the folder's history out of the workspace repo, sets the author to the GitHub account
# haihpse150218 (noreply address, so GitHub links the commits) and drops Co-Authored-By trailers,
# so the public repo lists only haihpse150218 as contributor. Run from anywhere inside the workspace repo.
# Requires: `gh auth status` shows haihpse150218 as the active account.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
PREFIX="List Paper/q4-pipeline/ideas/llm-mechsim-oracle"
EMAIL="59084874+haihpse150218@users.noreply.github.com"
git subtree split --prefix="$PREFIX" -b mechsim-export >/dev/null
git branch -f mechsim-public mechsim-export
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --env-filter "
export GIT_AUTHOR_NAME='Phi Hai Hoang' GIT_AUTHOR_EMAIL='$EMAIL'
export GIT_COMMITTER_NAME='Phi Hai Hoang' GIT_COMMITTER_EMAIL='$EMAIL'" \
  --msg-filter 'sed "/^Co-Authored-By:/d" | sed -e :a -e "/^\n*\$/{\$d;N;ba" -e "}"' mechsim-public >/dev/null
# Deterministic rewrite: unchanged old commits get the same hashes, so this is a fast-forward.
git -c credential.username=haihpse150218 push https://github.com/haihpse150218/llm-mechsim-oracle.git mechsim-public:main
