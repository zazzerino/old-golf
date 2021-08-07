import * as PIXI from 'pixi.js';
import { Player, Game } from './logic';

const canvasWidth = 500;
const canvasHeight = 500;

const cardImageWidth = 240;
const cardImageHeight = 336;

const cardScaleX = canvasWidth / 2000;
const cardScaleY = canvasHeight / 2000;

const cardWidth = cardImageWidth * cardScaleX;
const cardHeight = cardImageHeight * cardScaleY;

interface Coord {
  x: number;
  y: number;
}

interface Position extends Coord {
  angle: number;
}

interface Size {
  width: number;
  height: number;
}

export const app = new PIXI.Application({
  width: canvasWidth,
  height: canvasHeight,
  backgroundColor: 0xdddddd,
});

export const cardFiles = [
  "img/cards/1B.svg", "img/cards/2J.svg", "img/cards/4C.svg",
  "img/cards/5H.svg", "img/cards/7C.svg", "img/cards/8H.svg",
  "img/cards/AC.svg", "img/cards/JH.svg", "img/cards/QC.svg",
  "img/cards/TH.svg", "img/cards/1J.svg", "img/cards/2S.svg",
  "img/cards/4D.svg", "img/cards/5S.svg", "img/cards/7D.svg",
  "img/cards/8S.svg", "img/cards/AD.svg", "img/cards/JS.svg",
  "img/cards/QD.svg", "img/cards/TS.svg", "img/cards/2B.svg",
  "img/cards/3C.svg", "img/cards/4H.svg", "img/cards/6C.svg",
  "img/cards/7H.svg", "img/cards/9C.svg", "img/cards/AH.svg",
  "img/cards/KC.svg", "img/cards/QH.svg", "img/cards/2C.svg",
  "img/cards/3D.svg", "img/cards/4S.svg", "img/cards/6D.svg",
  "img/cards/7S.svg", "img/cards/9D.svg", "img/cards/AS.svg",
  "img/cards/KD.svg", "img/cards/QS.svg", "img/cards/2D.svg",
  "img/cards/3H.svg", "img/cards/5C.svg", "img/cards/6H.svg",
  "img/cards/8C.svg", "img/cards/9H.svg", "img/cards/JC.svg",
  "img/cards/KH.svg", "img/cards/TC.svg", "img/cards/2H.svg",
  "img/cards/3S.svg", "img/cards/5D.svg", "img/cards/6S.svg",
  "img/cards/8D.svg", "img/cards/9S.svg", "img/cards/JD.svg",
  "img/cards/KS.svg", "img/cards/TD.svg"
];

function textureName(fileName: string) {
  const regex = /(.+)*\/(.+)\.svg$/;
  const matches = regex.exec(fileName);

  if (matches == null || matches.length < 3) {
    throw new Error('could not parse filename: ' + fileName);
  }

  return matches[2];
}

function isLoaded(loader: PIXI.Loader, textureName: string): boolean {
  return loader.resources[textureName] != null;
}

function addTexture(loader: PIXI.Loader, fileName: string) {
  const name = textureName(fileName);

  if (!isLoaded(loader, name)) {
    loader.add(name, fileName);
  }
}

export function loadTextures(loader: PIXI.Loader, files: string[], callback: () => void) {
  files.forEach(file => {
    addTexture(loader, file);
  });

  loader.load(callback); // calls the given callback after textures are loaded
}

function getTexture(loader: PIXI.Loader, name: string) {
  try {
    return loader.resources[name].texture;
  } catch (e) {
    console.log(`could not load texture: ${name}`);
  }
}

function makeCardSprite(loader: PIXI.Loader, name: string, position: Position): PIXI.Sprite {
  const texture = getTexture(loader, name);
  const sprite = new PIXI.Sprite(texture);

  sprite.x = position.x;
  sprite.y = position.y;
  sprite.angle = position.angle;

  sprite.scale.set(cardScaleX, cardScaleY);
  // sprite.anchor.set(0.5, 0.5);

  return sprite;
}

function deckPosition(game: Game, canvasWidth: number, canvasHeight: number): Position {
  let x = canvasWidth / 2;
  const y = canvasHeight / 2;
  const angle = 0;

  if (game.hasStarted) {
    // move deck to the left so we can draw the table card to the right
    x -= cardWidth / 2;
  }

  return { x, y, angle };
}

function drawDeck(game: Game, loader: PIXI.Loader, stage: PIXI.Container, size: Size) {
  const { width, height } = size;
  const position = deckPosition(game, width, height);
  const sprite = makeCardSprite(loader, '2B', position);
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;

  stage.addChild(sprite);
}

function tableCardPosition(canvasWidth: number, canvasHeight: number): Position {
  const x = (canvasWidth / 2) + (cardWidth / 2) + 2;
  const y = canvasHeight / 2;

  return { x, y, angle: 0 };
}

function drawTableCard(game: Game, loader: PIXI.Loader, stage: PIXI.Container, size: Size) {
  const { width, height } = size;
  const tableCard = game.tableCard;

  if (tableCard == null) {
    throw new Error("table card is null");
  }

  const position = tableCardPosition(width, height);
  const sprite = makeCardSprite(loader, tableCard, position);
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;

  const graphics = new PIXI.Graphics();
  const spacing = 4;
  graphics.beginFill(0x00ff00);
  const x = position.x - cardWidth / 2;
  const y = position.y - cardHeight / 2;
  graphics.drawRect(x - spacing / 2, y - spacing / 2, cardWidth + spacing, cardHeight + spacing);

  stage.addChild(graphics);
  stage.addChild(sprite);
}

type HandPlacement =  'bottom' | 'left' | 'top' | 'right';

function handPlacements(playerCount: number): HandPlacement[] {
  const placements: Record<number, HandPlacement[]> = {
    1: ['bottom'],
    2: ['bottom', 'top'],
    3: ['bottom', 'left', 'right'],
    4: ['bottom', 'left', 'top', 'right']
  }

  return placements[playerCount];
}

function handPosition(placement: HandPlacement, canvasSize: Size): Position {
  const { width, height } = canvasSize;

  const positions: Record<HandPlacement, Position> = {
    'bottom': {
      x: width / 2,
      y: height - (1.1 * cardHeight),
      angle: 0,
    },
    'left': {
      x: 1.5 * cardWidth,
      y: height / 2,
      angle: 90,
    },
    'top': {
      x: width / 2,
      y: 1.1 * cardHeight,
      angle: 180,
    },
    'right': {
      x: width - (1.5 * cardWidth),
      y: height / 2,
      angle: 270,
    }
  };

  return positions[placement];
}

function makeHandContainer(loader: PIXI.Loader, cards: string[]): PIXI.Container {
  const container = new PIXI.Container();
  const spacing = 5;

  for (let i = 0; i < 3; i++) {
    const x = cardWidth * i + spacing * i;
    const y = 0;
    const sprite = makeCardSprite(loader, cards[i], { x, y, angle: 0 });
    container.addChild(sprite);
  }

  for (let i = 3; i < 6; i++) {
    const j = i - 3;
    const x = cardWidth * j + spacing * j;
    const y = cardHeight + spacing;
    const sprite = makeCardSprite(loader, cards[i], { x, y, angle: 0 });
    container.addChild(sprite);
  }

  container.pivot.x = 0.5 * container.width / container.scale.x;
  container.pivot.y = 0.5 * container.height / container.scale.y;

  return container;
}

function setPosition(container: PIXI.Container, position: Position) {
  const { x, y, angle } = position;
  container.x = x;
  container.y = y;
  container.angle = angle;
}

function drawHands(players: Player[], loader: PIXI.Loader, stage: PIXI.Container, canvasSize: Size) {
  const placements = handPlacements(players.length);

  for (let i = 0; i < players.length; i++) {
    const cards = players[i].cards;
    const container = makeHandContainer(loader, cards);
    const position = handPosition(placements[i], canvasSize);

    setPosition(container, position);
    stage.addChild(container);
  }
}

/**
 * Removes all child elements from the given container.
 */
function removeChildren(container: PIXI.Container) {
  while (container.children.length > 0) {
    const child = container.getChildAt(0);
    container.removeChild(child);
  }
}

export function draw(game: Game, elem: HTMLElement, app: PIXI.Application) {
  const { loader, stage, view } = app;
  const size = { width: view.width, height: view.height };

  removeChildren(stage);
  drawDeck(game, loader, stage, size);

  if (game.hasStarted) {
    drawTableCard(game, loader, stage, size);
    drawHands(game.players, loader, stage, size);
  }

  elem.appendChild(view);
}

export function initPixi() {
  loadTextures(app.loader, cardFiles, () => {
    console.log('textures loaded...');
  });
}
