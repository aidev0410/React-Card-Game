import { memo, useCallback, useMemo } from "react";

interface CardProps {
  number: number;
  isHighlighted: boolean;
  isFlipped: boolean;
  onClick: (num: number) => void;
  onRemove: (num: number) => void;
}

const Card = ({
  number,
  isHighlighted,
  isFlipped,
  onClick,
  onRemove,
}: CardProps) => {
  const cardClassName = useMemo(
    () =>
      isFlipped ? "card flipped" : isHighlighted ? "card highlighted" : "card",
    [isFlipped, isHighlighted]
  );

  const handleClick = useCallback(() => {
    if (!isFlipped) onClick(number);
  }, [number, isFlipped, onClick]);

  const handleRemove = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onRemove(number);
    },
    [number, onRemove]
  );

  return (
    <div className={cardClassName} onClick={handleClick}>
      <div className="card-content">{isFlipped ? "" : number}</div>
      <button className="remove-button" onClick={handleRemove}>
        Remove
      </button>
    </div>
  );
};

export default memo(Card);
