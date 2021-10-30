import React from 'react';
import './Loader.css';
import PropTypes from 'prop-types';

export default function Loader({ scale, height }) {
  return (
    <div
      className="loadingio-spinner-dual-ring-27hwrj97ks"
      style={{
        display: 'block', margin: 'auto', transform: `scale(${scale})`, height,
      }}
    >
      <div className="ldio-5nry70rg8yt">
        <div />
        <div>
          <div />
        </div>
      </div>
    </div>
  );
}
Loader.propTypes = {
  scale: PropTypes.number,
  height: PropTypes.string,
};
Loader.defaultProps = {
  scale: 1,
  height: '50px',
};
