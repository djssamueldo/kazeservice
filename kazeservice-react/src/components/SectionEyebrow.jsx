import React from 'react';

const SectionEyebrow = ({ children, className = "" }) => {
  return (
    <p className={`section-eyebrow ${className}`}>
      {children}
    </p>
  );
};

export default SectionEyebrow;
