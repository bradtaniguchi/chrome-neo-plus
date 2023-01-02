# Start from the base Dockerfile,
# taken from:
# https://github.com/microsoft/vscode-dev-containers
FROM mcr.microsoft.com/vscode/devcontainers/universal:1-linux

USER root

# install dependencies here
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends neovim wget gnupg curl \
    && apt-get clean

USER codespace

ENV NODE_VERSION=16.14.2
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/home/codespace/.nvm
RUN rm -rf /home/codespace/.npmrc
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/home/codespace/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# install global npm packages
RUN npm i -g @nrwl/cli nx

# update git settings, neovim should be configured
# by dotfiles later
RUN git config --global core.editor "nvim"

