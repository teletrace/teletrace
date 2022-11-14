FROM gitpod/workspace-full:latest

# add utilities
RUN brew install gh jq fzf httpie ripgrep lazygit k9s helm kubectx kubernetes-cli awscli golangci-lint pre-commit
