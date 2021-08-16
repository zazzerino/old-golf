import React from 'react';
import { useAppSelector } from '../app/hooks';
import { 
  ClickedCard, selectClickedCard, selectCurrentGame, selectHeldCard, selectPlayerHand, selectPlayerScore, selectShowDeckCard 
} from './gameSlice';
import { Game, Hand } from './logic';
import { selectUserId } from '../user';
import { Size, drawGame } from './draw';

interface Context {
  playerId: number;
  svg: SVGElement;
  size: Size;
  game: Game;
  showDeckCard: boolean;
  clickedCard: ClickedCard | null;
  playerHand: Hand | undefined;
  heldCard: string | undefined;
  playerScore: number | undefined;
}

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

export function GameCanvas() {
  const className = 'GameCanvas';

  const svgRef = React.useRef<SVGSVGElement>(null);
  const size: Size = { width: 600, height: 500 };

  const game = useAppSelector(selectCurrentGame);

  const playerId = useAppSelector(selectUserId);
  const playerHand = useAppSelector(selectPlayerHand);
  const playerScore = useAppSelector(selectPlayerScore);

  const heldCard = useAppSelector(selectHeldCard);
  const clickedCard = useAppSelector(selectClickedCard);
  const showDeckCard = useAppSelector(selectShowDeckCard);

  React.useEffect(() => {
    const svg = svgRef.current;

    if (svg && game && (playerId != null)) {
      const context: Context = {
        playerId, game, svg, size, clickedCard, showDeckCard, playerHand, heldCard, playerScore
      };

      drawGame(context);
    }

    return () => {
      if (svg) {
        empty(svg);
      }
    }
  });

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size.width} ${size.height}`}
        width={size.width}
        height={size.height}
        style={{ backgroundColor: 'aliceblue' }}
      />
    </div>
  );
}
