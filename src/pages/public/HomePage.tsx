import React from 'react';
import { Hero } from '../../components/public/Hero';
import { Stats } from '../../components/public/Stats';
import { About } from '../../components/public/About';
import { Services } from '../../components/public/Services';
import { FeatureSection } from '../../components/public/FeatureSection';
import { Packages } from '../../components/public/Packages';
import { FAQ } from '../../components/public/FAQ';
import { Contact } from '../../components/public/Contact';

export const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <About />
      <Services />
      <FeatureSection />
      <Packages />
      <FAQ />
      <Contact />
    </div>
  );
};
