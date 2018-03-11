import React from 'react';
import PropTypes from 'prop-types';
import Check from 'react-feather/dist/icons/check';
import X from 'react-feather/dist/icons/x';

function TrueOrFalse(val) {
  return val ? (
    <span>
      <Check color="var(--teal)" /> Yes
    </span>
  ) : (
    <span>
      <X color="var(--red)" /> No
    </span>
  );
}

function Loading({ className }) {
  return (
    <h3 className={className}>
      <span className="loading-animation">Loading</span>
    </h3>
  );
}

Loading.propTypes = {
  className: PropTypes.string,
};

Loading.defaultProps = {
  className: '',
};

export { TrueOrFalse, Loading };
