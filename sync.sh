#!/usr/bin/env bash
# RETIRED — 08-24-2026.
#
# This used to rsync the working copy from Google Drive down to ~/dd/travel and auto-commit.
# That split is gone: ~/dd/travel is now the only source of truth. Editing in Drive is what
# let the local repo go six builds stale, and a .git under Drive sync corrupts anyway.
#
# The Drive copy at "My Drive/dd/travel" is now the stale one. Once you have confirmed this
# repo runs, remove it:
#
#   rm -rf "$HOME/Library/CloudStorage/GoogleDrive-vanessa.madison@datadoghq.com/My Drive/dd"
#
# To run the map:      ./serve.sh
# To check it first:   node verify.mjs
echo "sync.sh is retired — ~/dd/travel is the source of truth now. See the comments in this file."
exit 1
