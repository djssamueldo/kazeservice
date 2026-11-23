import React from 'react';

const PageContainer = ({ children, className = "", narrow = false, wide = false }) => {
  const containerClasses = `container ${className}`;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default PageContainer;
