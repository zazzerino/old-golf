import React from 'react';
import { useAppSelector } from '../app/hooks';
import { 
  selectClickedCard, selectCurrentGame, selectHeldCard, selectPlayerHand, selectPlayerScore, selectShowDeckCard 
} from './gameSlice';
import { selectUserId } from '../user';
import { Size, drawGame, Context } from './draw';

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
  // const playableCards = useAppSelector(selectPlayableCards);

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
