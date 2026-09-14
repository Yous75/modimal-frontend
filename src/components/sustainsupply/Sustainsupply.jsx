import React from 'react';
import './Sustainsupply.css';

// Placeholder asset imports - replace with your actual local file paths in /assets
import heroImg from '../../assets/supply-hero.jpg';
import portugalImg from '../../assets/supplier-portugal.jpg';
import italyImg from '../../assets/supplier-italy.jpg';
import indiaImg from '../../assets/supplier-india.jpg';

const suppliers = [
  {
    id: 1,
    name: 'Texteis do Norte',
    location: 'Guimarães, Portugal',
    team: '248 employees',
    speciality: 'Organic Cotton & Linen',
    specialityColor: '#A9752E',
    certifications: ['GOTS', 'SA8000', 'OEKO-TEX'],
    image: portugalImg,
    alt: 'Sewing machine in a Portuguese textile workshop'
  },
  {
    id: 2,
    name: 'Manifattura Sorelle',
    location: 'Prato, Italy',
    team: '64 employees',
    speciality: 'Wool & Cashmere',
    specialityColor: '#5A6B5C',
    certifications: ['RWS', 'FAIR TRADE', 'GOTS'],
    image: italyImg,
    alt: 'Seamstress at work in an Italian atelier'
  },
  {
    id: 3,
    name: 'Artisan Weaves Co.',
    location: 'Jaipur, India',
    team: '183 employees',
    speciality: 'Silk & Hand-weave Textiles',
    specialityColor: '#4F6D82',
    certifications: ['FAIR TRADE', 'SA8000', 'GOTS'],
    image: indiaImg,
    alt: 'Textile workers in a weaving facility in Jaipur'
  }
];

const Sustainsupply = () => {

  return (
    <section className="sustain-supply">

      {/* HERO */}
      <div className="supply-hero">
        <img src={heroImg} alt="Seamstress working at a sewing machine" className="supply-hero-bg" />
        <div className="supply-hero-overlay">
          <span className="supply-label-light">Transparency</span>
          <h1 className="supply-hero-title">The Faces Behind Your</h1>
          <h1 className="supply-hero-title supply-hero-italic">modimal. Pieces</h1>
          <p>
            We partner only with facilities that share our standards for fair wages, safe conditions, and dignified work. We visit every supplier — no exceptions.
          </p>
        </div>
      </div>

      {/* PARTNERS */}
      <div className="partners-section">
        <div className="partners-heading">
          <span className="partners-label">Our Partners</span>
          <h2>Three countries, one standard</h2>
        </div>

        <div className="partners-images-row">
          {suppliers.map((supplier) => (
            <img key={supplier.id} src={supplier.image} alt={supplier.alt} />
          ))}
        </div>

        <div className="partners-info-row">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="partner-card">
              <h3>{supplier.name}</h3>
              <p className="partner-location">{supplier.location}</p>
              <hr className="partner-divider" />

              <div className="partner-stat-row">
                <span className="partner-stat-label">Team</span>
                <span className="partner-stat-value">{supplier.team}</span>
              </div>
              <div className="partner-stat-row">
                <span className="partner-stat-label">Speciality</span>
                <span
                  className="partner-stat-value speciality-value"
                  style={{ color: supplier.specialityColor }}
                >
                  {supplier.speciality}
                </span>
              </div>

              <div className="partner-badges">
                {supplier.certifications.map((cert) => (
                  <span key={cert} className="partner-badge">{cert}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUOTE BAND */}
      <div className="quote-band">
        <blockquote>
          "Every facility we work with is audited annually against living-wage benchmarks, safety standards, and worker-led grievance mechanisms. Transparency is not a policy — it is a practice."
        </blockquote>
        <span className="quote-attribution">— modimal. Supply Chain Commitment</span>
        <button className="transparency-report-btn">Full Supplier Transparency Report →</button>
      </div>

    </section>
  );
};

export default Sustainsupply;