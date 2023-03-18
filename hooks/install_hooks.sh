#!/bin/sh
mkdir -p .git/hooks && \
echo "exec yarn lint" > .git/hooks/pre-commit && \
chmod u+x .git/hooks/pre-commit && \
exit 0 || \
exit 1