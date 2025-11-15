import React from 'react';

export const Button = ({ primary, label, ...props }) => {
  const mode = primary ? 'btn-primary' : 'btn-secondary';
  return (
    <button
      type="button"
      className={['btn', mode].join(' ')}
      {...props}
    >
      {label}
    </button>
  );
};