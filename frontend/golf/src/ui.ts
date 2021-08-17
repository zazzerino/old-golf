import { sendCreateGame } from "./websocket";

export function createButton(parent: HTMLElement, text: string, onClick?: () => any): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;

  if (onClick) {
    button.onclick = onClick;
  }

  parent.appendChild(button);
  return button;
}

export function createCreateGameButton(parent: HTMLElement, id = 'create-game-button'): HTMLButtonElement {
  const createGameButton = createButton(parent, 'Create Game');
  createGameButton.id = id;

  createGameButton.onclick = (_ev) => {
    console.log('creating game...');
    sendCreateGame();
  }

  return createGameButton;
}
