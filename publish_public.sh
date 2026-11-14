#!/usr/bin/env bash
# Publish this folder to https://github.com/haihpse150218/llm-mechsim-oracle (main).
# Splits the folder's history out of the workspace repo, sets the author to the GitHub account
# haihpse150218 (noreply address, so GitHub links the commits); Co-Authored-By trailers are kept,
# so the public repo lists haihpse150218 (and Claude) as contributors. Run from anywhere inside the workspace repo.
# Requires: `gh auth status` shows haihpse150218 as the active account.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
PREFIX="List Paper/q4-pipeline/ideas/llm-mechsim-oracle"
EMAIL="59084874+haihpse150218@users.noreply.github.com"
git subtree split --prefix="$PREFIX" -b mechsim-export >/dev/null
git branch -f mechsim-public mechsim-export
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --env-filter "
export GIT_AUTHOR_NAME='Hoang Phi Hai' GIT_AUTHOR_EMAIL='$EMAIL'
export GIT_COMMITTER_NAME='Hoang Phi Hai' GIT_COMMITTER_EMAIL='$EMAIL'" \
  mechsim-public >/dev/null
# Deterministic rewrite: unchanged old commits get the same hashes, so this is a fast-forward.
git -c credential.username=haihpse150218 push https://github.com/haihpse150218/llm-mechsim-oracle.git mechsim-public:main
