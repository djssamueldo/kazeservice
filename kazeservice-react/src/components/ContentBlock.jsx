import React from 'react';

const ContentBlock = ({ children, className = "", narrow = false, wide = false, centered = false }) => {
  let maxWidth = "var(--text-max-width)";
  if (narrow) maxWidth = "var(--text-max-width-narrow)";
  if (wide) maxWidth = "var(--text-max-width-wide)";

  const style = {
    maxWidth,
    textAlign: centered ? 'center' : 'left',
    margin: centered ? '0 auto' : '0'
  };

  return (
    <div className={`content-block ${className}`} style={style}>
      {children}
    </div>
  );
};

export default ContentBlock;
