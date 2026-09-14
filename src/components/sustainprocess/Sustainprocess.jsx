import React from 'react';
import './Sustainprocess.css';

// NOTE: this component uses Font Awesome icon classes (<i className="fa-solid ...">).
// Make sure Font Awesome's CSS is loaded in your project (CDN link or the
// @fortawesome packages), otherwise the icons will not render.

// Placeholder asset imports - replace with your actual local file paths in /assets
// Only 3 real images in this component: the hero banner + the 2 images
// under the "Our Process" section (the process cards use icons only, no images).
import heroImg from '../../assets/process-hero.jpg';
import dyeProcessImg from '../../assets/dye-process.jpg';
import waterFacilityImg from '../../assets/water-facility.jpg';

const Sustainprocess = () => {

  const processSteps = [
    {
      icon: 'fa-solid fa-droplet',
      title: 'Low-Impact Dyeing',
      description: 'We use only non-toxic, eco-free dyes certified under the OEKO-TEX Standard 100. Our partner dye houses operate at lower temperatures, reducing energy consumption while achieving the rich, lasting tones our collections are known for.'
    },
    {
      icon: 'fa-solid fa-recycle',
      title: 'Water Recycling',
      description: 'Our closed-loop water systems capture and filter 90% of water used in wet processing. Treated wastewater is purified to safe discharge standards, and where possible, recycled back into the dyeing cycle — drastically reducing freshwater consumption.'
    },
    {
      icon: 'fa-solid fa-scissors',
      title: 'Zero-Waste Pattern Cutting',
      description: 'Through intelligent digital pattern-making, we optimize every centimetre of fabric. Offcuts are catalogued and repurposed into accessories or donated to local design schools — ensuring nothing leaves our cutting rooms as landfill.'
    }
  ];

  const processImages = [
    { src: dyeProcessImg, alt: 'Natural dye pigment used in low-impact dyeing' },
    { src: waterFacilityImg, alt: 'Water recycling and filtration facility' }
  ];

  const stats = [
    {
      value: '70%',
      label: 'Less Water Used',
      description: 'compared to conventional dyeing processes'
    },
    {
      value: '100%',
      label: 'Azo-Free Dyes',
      description: 'across our entire colour palette'
    },
    {
      value: '< 3%',
      label: 'Fabric Waste',
      description: 'generated per fabric collection — industry avg. is 15%'
    }
  ];

  return (
    <section className="sustain-process">

      {/* HERO */}
      <div className="process-hero">
        <img src={heroImg} alt="Skeins of naturally dyed yarn" className="hero-bg-image" />
        <div className="hero-overlay">
          <span className="subtitle">Supply Chain</span>
          <h1 className="hero-title">Responsible Craftsmanship</h1>
          <h1 className="hero-title hero-italic">From Fiber to Finished Garment</h1>
          <p>
            Every stage of our production is guided by a commitment to low-impact methods — protecting people, water, and the planet.
          </p>
        </div>
      </div>

      {/* PROCESS TIMELINE */}
      <div className="process-section">
        <span className="subtitle process-label">Our Process</span>
        <div className="process-timeline">
          {processSteps.map((step) => (
            <div key={step.title} className="process-card">
              <div className="card-icon">
                <i className={step.icon}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE STRIP */}
      <div className="process-images">
        {processImages.map((img) => (
          <img key={img.alt} src={img.src} alt={img.alt} />
        ))}
      </div>

      {/* STATS BAND */}
      <div className="stats-band">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-item">
            <h2 className="stat-value">{stat.value}</h2>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Sustainprocess;