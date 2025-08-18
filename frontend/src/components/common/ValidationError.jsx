import React from 'react';

const ValidationError = ({ error, fieldName, id }) => {
  if (!error) return null;

  return (
    <div
      id={id}
      className="validation-error"
      role="alert"
      aria-live="polite"
      tabIndex={0}
      style={{
        color: '#dc3545',
        fontSize: '0.875rem',
        marginTop: '0.25rem',
        padding: '0.5rem',
        border: '1px solid #dc3545',
        borderRadius: '4px',
        backgroundColor: '#f8d7da'
      }}
    >
      {error}
    </div>
  );
};

export default ValidationError;
