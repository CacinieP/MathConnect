import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Tile = ({ content, status, onClick, isSelected, isError, familyColor }) => {
  const tileClasses = classNames(
    'tile',
    {
      'tile-idle': status === 'idle',
      'tile-selected': isSelected,
      'tile-matched': status === 'matched',
      'tile-error': isError,
    }
  );

  const style = familyColor ? { '--tile-family-color': familyColor } : {};

  return (
    <button
      type="button"
      className={tileClasses}
      style={style}
      onClick={onClick}
      disabled={status === 'matched'}
      aria-pressed={isSelected}
      aria-label={`Formula tile ${content}`}
    >
      {status !== 'matched' && (
        <div className="tile-content">
          <InlineMath math={content} />
        </div>
      )}
    </button>
  );
};

Tile.propTypes = {
  content: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['idle', 'matched', 'error']).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  isError: PropTypes.bool,
  familyColor: PropTypes.string,
};

Tile.defaultProps = {
  isSelected: false,
  isError: false,
  familyColor: null,
};

export default Tile;
