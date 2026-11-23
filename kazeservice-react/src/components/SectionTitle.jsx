import React from 'react';

const SectionTitle = ({ children, className = "", level = 2, centered = false }) => {
  const Tag = level === 1 ? 'h1' : level === 3 ? 'h3' : level === 4 ? 'h4' : 'h2';

  const baseStyle = {
    fontFamily: 'var(--font-family-heading)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 'var(--line-height-heading)',
    marginBottom: 'var(--spacing-md)',
    color: 'var(--encre)',
    textAlign: centered ? 'center' : 'left'
  };

  const fontSize = level === 1 ? 'var(--font-size-h1)' : level === 3 ? 'var(--font-size-h3)' : level === 4 ? 'var(--font-size-h4)' : 'var(--font-size-h2)';

  return (
    <Tag className={`section-title ${className}`} style={{...baseStyle, fontSize}}>
      {children}
    </Tag>
  );
};

export default SectionTitle;
