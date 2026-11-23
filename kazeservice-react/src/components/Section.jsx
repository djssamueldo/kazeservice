import React from 'react';

const Section = ({ children, id, className = "", reveal = true, sectionRef }) => {
  const sectionClasses = `section compact-section ${className} ${reveal ? 'reveal' : ''}`;

  return (
    <section className={sectionClasses} id={id} ref={sectionRef}>
      <div className="container">
        {children}
      </div>
    </section>
  );
};

export default Section;
