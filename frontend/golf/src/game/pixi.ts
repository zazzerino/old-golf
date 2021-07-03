import * as PIXI from 'pixi.js';
import { Game } from './logic';

const canvasWidth = 600;
const canvasHeight = 600;

const cardImageWidth = 240;
const cardImageHeight = 336;

const cardScaleX = canvasWidth / 2000;
const cardScaleY = canvasHeight / 2000;

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

export function loadTextures(
  loader: PIXI.Loader,
  files: string[],
  callback: () => void
) {
  files.forEach(file => {
    addTexture(loader, file);
  });

  loader.load(callback); // calls the given callback after textures are loaded
}

function getTexture(loader: PIXI.Loader, name: string) {
  return loader.resources[name].texture;
}

interface Coord {
  x: number;
  y: number;
}

interface Position extends Coord {
  angle: number;
}

function makeCardSprite(
  loader: PIXI.Loader,
  name: string,
  position: Position
): PIXI.Sprite {
  const texture = getTexture(loader, name);
  const sprite = new PIXI.Sprite(texture);

  sprite.x = position.x;
  sprite.y = position.y;
  sprite.angle = position.angle;
  sprite.scale.set(cardScaleX, cardScaleY);
  sprite.anchor.set(0.5, 0.5);

  return sprite;
}

function deckPosition(game: Game, canvasWidth: number, canvasHeight: number): Position {
  let x = canvasWidth / 2;
  const y = canvasHeight / 2;
  const angle = 0;

  if (game.hasStarted) {
    // move deck to the left so we can draw the table card to the right
    x -= 0.5 * cardImageWidth * cardScaleX;
  }

  return { x, y, angle };
}

function drawDeck(
  game: Game,
  loader: PIXI.Loader,
  stage: PIXI.Container,
  canvasWidth: number,
  canvasHeight: number
) {
  const position = deckPosition(game, canvasWidth, canvasHeight);
  const sprite = makeCardSprite(loader, '2B', position);

  stage.addChild(sprite);
}

function tableCardPosition(canvasWidth: number, canvasHeight: number): Position {
  const x = (canvasWidth / 2) + (1/2 * cardScaleX * cardImageWidth) + 2;
  const y = canvasHeight / 2;
  const angle = 0;

  return { x, y, angle };
}

function drawTableCard(
  game: Game,
  loader: PIXI.Loader,
  stage: PIXI.Container,
  canvasWidth: number,
  canvasHeight: number
) {
  const tableCard = game.tableCard;

  if (tableCard == null) {
    throw new Error("table card is null");
  }

  const position = tableCardPosition(canvasWidth, canvasHeight);
  const sprite = makeCardSprite(loader, tableCard, position);

  stage.addChild(sprite);
}

function removeChildren(container: PIXI.Container) {
  while (container.children.length > 0) {
    const child = container.getChildAt(0);
    container.removeChild(child);
  }
}

export function draw(game: Game, elem: HTMLElement, app: PIXI.Application) {
  const loader = app.loader;
  const stage = app.stage;
  const view = app.view;
  const width = view.width;
  const height = view.height;

  removeChildren(stage);
  drawDeck(game, loader, stage, width, height);

  if (game.hasStarted) {
    drawTableCard(game, loader, stage, width, height);
  }

  elem.appendChild(view);
}

export function initPixi() {
  loadTextures(app.loader, cardFiles, () => {
    console.log('textures loaded...');
  });
}
