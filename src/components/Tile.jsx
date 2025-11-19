import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import here to ensure styles are present

const Tile = ({ content, status, onClick, isSelected }) => {
    const tileClasses = classNames(
        'tile',
        {
            'tile-idle': status === 'idle',
            'tile-selected': isSelected,
            'tile-matched': status === 'matched',
            'tile-error': status === 'error',
        }
    );

    return (
        <div className={tileClasses} onClick={onClick}>
            {status !== 'matched' && (
                <div className="tile-content">
                    <InlineMath math={content} />
                </div>
            )}
        </div>
    );
};

Tile.propTypes = {
    content: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['idle', 'matched', 'error']).isRequired,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
};

export default Tile;
