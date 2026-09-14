import React from 'react';
import './Sustainpack.css';

// Placeholder asset imports - replace with your actual local file paths in /assets
import packHeroImg from '../../assets/pack-hero.jpg';
import boxImg from '../../assets/pack-box.jpg';
import bagImg from '../../assets/pack-bag.jpg';
import cottonFieldImg from '../../assets/pack-cotton-field.jpg';
import dyePigmentImg from '../../assets/pack-dye-pigment.jpg';

const Sustainpack = () => {

  // Rendered two-at-a-time: an image row followed by its matching text row
  const materialGroups = [
    [
      {
        title: '100% Recycled Mailers',
        description: 'FSC-certified, post-consumer recycled cardboard. Printed with water-based inks, fully recyclable and compostable. Our boxes are designed to be reused before they ever reach the recycling bin.',
        image: boxImg,
        alt: 'Recycled cardboard mailer boxes'
      },
      {
        title: 'Organic Garment Bags',
        description: 'Unbleached, GOTS-certified organic cotton replaces single-use plastic bags. Reusable as a dust bag, travel pouch, or laundry bag — your garment arrives in something worth keeping.',
        image: bagImg,
        alt: 'Garments on hangers wrapped in organic cotton bags'
      }
    ],
    [
      {
        title: 'Recycled Hang Tags',
        description: "Our tags are printed on unbleached, raw-fibre recycled paper using plant-based pigments. Every tag includes care instructions, material sourcing, and a QR link to the maker's profile.",
        image: cottonFieldImg,
        alt: 'Cotton field under a blue sky'
      },
      {
        title: 'Soy-Based Inks',
        description: 'All text and branding across our packaging is printed with soy-based inks — a renewable, low-VOC alternative to petroleum inks. They biodegrade faster and produce brighter results with less pigment.',
        image: dyePigmentImg,
        alt: 'Hands holding natural dye pigment powders'
      }
    ]
  ];

  const disposalItems = [
    {
      title: 'Cardboard box',
      description: 'Flatten and add to your kerbside paper recycling. If soiled, compost it.'
    },
    {
      title: 'Organic garment bag',
      description: "Keep it — it's a reusable dust bag. Or cut into cleaning cloths. Compostable when worn out."
    },
    {
      title: 'Tissue paper',
      description: 'Reuse for wrapping or composting. It breaks down within a few weeks in a home compost bin.'
    },
    {
      title: 'Hang tag',
      description: 'Recycle with paper. The string is natural cotton — compost or cut for garden twine.'
    }
  ];

  return (
    <section className="sustain-pack">

      {/* HERO */}
      <div className="pack-hero">
        <img src={packHeroImg} alt="Overhead view of open cardboard boxes" className="pack-hero-bg" />
        <div className="pack-hero-overlay">
          <span className="pack-label-light">Packaging</span>
          <h1 className="pack-hero-title">Thoughtful</h1>
          <h1 className="pack-hero-title pack-hero-italic">Inside and Out</h1>
          <p>
            Every material we use to ship your order has been chosen with the same care as the garment inside it.
          </p>
        </div>
      </div>

      {/* MATERIALS */}
      <div className="materials-section">
        <div className="materials-heading">
          <span className="pack-label">Our Materials</span>
          <h2>Packaging that doesn't cost the earth</h2>
        </div>

        {materialGroups.map((group, index) => (
          <div className="material-group" key={index}>
            <div className="material-images-row">
              {group.map((item) => (
                <img key={item.title} src={item.image} alt={item.alt} />
              ))}
            </div>
            <div className="material-text-row">
              {group.map((item) => (
                <div key={item.title} className="material-text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* END OF LIFE */}
      <div className="end-of-life">
        <div className="end-of-life-inner">
          <span className="eol-label">End of Life</span>
          <h2>How to Dispose Responsibly</h2>
          <ul className="disposal-grid">
            {disposalItems.map((item) => (
              <li key={item.title}>
                <span className="disposal-dot"></span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
};

export default Sustainpack;