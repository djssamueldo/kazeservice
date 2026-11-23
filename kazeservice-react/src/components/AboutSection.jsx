import React from 'react';
import Section from './Section';
import ContentBlock from './ContentBlock';
import SectionTitle from './SectionTitle';
import SectionEyebrow from './SectionEyebrow';

const AboutSection = ({ eyebrow, title, description, description2, image, alt, id = "presentationSection", eyebrowClassName = "" }) => {
  return (
    <Section id={id}>
      <div className="about-content">
        <div className="about-text">
          <SectionEyebrow className={eyebrowClassName}>{eyebrow}</SectionEyebrow>
          <div className="about-title-description">
            <SectionTitle>{title}</SectionTitle>
            <div className="about-description">
              <p>{description}</p>
              {description2 && <p>{description2}</p>}
            </div>
          </div>
        </div>
        {image && (
          <div className="about-image">
            <img src={image} alt={alt} style={{ width: '100%', borderRadius: 'var(--rayon-arche)', objectFit: 'cover', height: '400px', marginTop: '20px' }} />
          </div>
        )}
      </div>
    </Section>
  );
};

export default AboutSection;
