import { getGame, getUser } from "./state";
import { sendCreateGame, sendStartGame } from "./websocket";

function createButton(parent: HTMLElement, text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;
  parent.appendChild(button);

  return button;
}

export function createGameButton(parent: HTMLElement, id = 'create-game-button'): HTMLButtonElement {
  const button = createButton(parent, 'Create Game');
  button.id = id;

  button.onclick = (_ev) => {
    console.log('creating game...');
    const user = getUser();
    if (user) {
      sendCreateGame(user.id);
    }
  }

  return button;
}

export function startGameButton(parent: HTMLElement, id = 'start-game-button'): HTMLButtonElement {
  const button = createButton(parent, 'Start Game');
  button.id = id;

  button.onclick = (_ev) => {
    console.log('starting game...');
    const user = getUser();
    const game = getGame();

    if (user && game) {
      sendStartGame(game.id, user.id);
    }
  }

  return button;
}

// function getCardLocation(n: number): CardLocation | undefined {
//   switch (n) {
//     case 0: return 'HAND0';
//     case 1: return 'HAND1';
//     case 2: return 'HAND2';
//     case 3: return 'HAND3';
//     case 4: return 'HAND4';
//     case 5: return 'HAND5';
//   }
// }

// function makeHand(cards: string[], uncoveredCards: number[], opts: DrawHandOpts) {
//   const { onClick } = opts;
//   const group = document.createElementNS(svgNS, 'g');

//   for (let i = 0; i < 6; i++) {
//     const offset = i % 3;

//     const x = cardSize.width * offset + handPadding * offset;
//     const y = i < 3 ? 0 : cardSize.height + handPadding;
//     const coord = { x, y };
//     const card = uncoveredCards.includes(i) ? cards[i]: '2B';

//     const cardElem = makeCard(card, coord, onClick);

//     // if (Number.isFinite(i)) {
//     //   const location = getCardLocation(i);
//     //   if (location && opts.playableCards.includes(location)) {
//     //     const highlightRect = makeHighlight(coord);
//     //     group.appendChild(highlightRect);
//     //   }
//     // }

//     // if (i === clickedCard) {
//     //   const hlRect = makeHighlight(coord);
//     //   group.appendChild(hlRect);
//     // }

//     if (onClick) {
//       cardElem.onclick = () => onClick(i as ClickedCard);
//     }

//     group.appendChild(cardElem);
//   }

//   return group;
// }

// function drawHand(svg: SVGElement, hand: Hand, pos: HandPosition, opts: DrawHandOpts) {
//   const boundingRect = svg.getBoundingClientRect();
//   const canvasWidth = boundingRect.width;
//   const canvasHeight = boundingRect.height;

//   const midX = canvasWidth / 2 - cardSize.width * 1.5;
//   const bottomY = canvasHeight - cardSize.height * 2 - handPadding * 2;

//   const handElem = makeHand(hand.cards, hand.uncoveredIndices, opts);

//   let x: number;
//   let y: number;

//   switch (pos) {
//     case 'bottom':
//       handElem.setAttribute('transform', `translate(${midX}, ${bottomY})`);
//       break;
//     case 'top':
//       x = midX + cardSize.width * 3 + handPadding * 2;
//       y = cardSize.height * 2 + handPadding * 2;
//       handElem.setAttribute('transform', `translate(${x}, ${y}), rotate(180)`);
//       break;
//   }

//   svg.appendChild(handElem);
// }
