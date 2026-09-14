import React, { useState } from 'react';
import './Sustainprocare.css';

// Placeholder asset imports - replace with your actual local file paths in /assets
import heroImg from '../../assets/care-hero.jpg';
import cottonImg from '../../assets/care-cotton.jpg';
import woolImg from '../../assets/care-wool.jpg';
import linenImg from '../../assets/care-linen.jpg';
import silkImg from '../../assets/care-silk.jpg';
import cashmereImg from '../../assets/care-cashmere.jpg';

// NOTE: this component uses Font Awesome icon classes (<i className="fa-solid ...">).
// Make sure Font Awesome's CSS is loaded in your project (CDN link or the
// @fortawesome packages), otherwise the icons will not render.

const careData = {
  Cotton: {
    image: cottonImg,
    alt: 'Cotton field under a blue sky',
    instructions: [
      {
        icon: 'fa-solid fa-droplet',
        label: 'Washing',
        text: 'Machine wash at 30°C on a gentle cycle. Turn inside out to preserve colour. Use a pH-neutral detergent and avoid bleach.'
      },
      {
        icon: 'fa-regular fa-sun',
        label: 'Drying',
        text: 'Lay flat or hang to air dry away from direct sunlight. Tumble dry on low heat if needed — remove while slightly damp to reduce ironing.'
      },
      {
        icon: 'fa-solid fa-temperature-high',
        label: 'Ironing',
        text: 'Cotton takes heat well. Iron on medium-high while slightly damp or use a steam iron. Press on the reverse side for printed or dark fabrics.'
      },
      {
        icon: 'fa-solid fa-box-archive',
        label: 'Storage',
        text: 'Fold and store in a breathable drawer or shelf. Avoid prolonged hanging to prevent shoulder distortion.'
      }
    ]
  },
  Wool: {
    image: woolImg,
    alt: 'Garments hanging on a clothes rail',
    instructions: [
      {
        icon: 'fa-solid fa-droplet',
        label: 'Washing',
        text: "Hand wash in cool water (max 30°C) with a wool-specific detergent. Alternatively, use your machine's wool or delicate cycle. Never wring or twist."
      },
      {
        icon: 'fa-regular fa-sun',
        label: 'Drying',
        text: 'Always lay flat to dry on a clean towel, reshaping while damp. Never tumble dry or hang wet — wool stretches under its own weight when wet.'
      },
      {
        icon: 'fa-solid fa-temperature-high',
        label: 'Ironing',
        text: 'Iron on the lowest setting with a damp cloth or pressing cloth between the iron and the garment. Steam gently from a distance rather than pressing directly.'
      },
      {
        icon: 'fa-solid fa-box-archive',
        label: 'Storage',
        text: 'Fold and store in a cedar-lined drawer or sealed cotton bag to deter moths. Air out between wears. Wool is naturally odour-resistant — wash infrequently.'
      }
    ]
  },
  Linen: {
    image: linenImg,
    alt: 'Linen garments hanging on white hangers',
    instructions: [
      {
        icon: 'fa-solid fa-droplet',
        label: 'Washing',
        text: "Machine wash at 40°C on a gentle or linen cycle. Linen softens with every wash. Use a mild detergent and skip the fabric softener — linen becomes more supple naturally."
      },
      {
        icon: 'fa-regular fa-sun',
        label: 'Drying',
        text: "Hang or lay flat to air dry. Linen dries quickly. Remove promptly to minimise creasing. A little natural wrinkling is part of linen's character."
      },
      {
        icon: 'fa-solid fa-temperature-high',
        label: 'Ironing',
        text: 'Iron linen slightly damp on a medium-high setting. Steam works beautifully. Many of our linen designs are meant to be worn relaxed — pressing is optional.'
      },
      {
        icon: 'fa-solid fa-box-archive',
        label: 'Storage',
        text: 'Hang or fold loosely in a cool, dry place. Linen breathes naturally and benefits from good air circulation. Avoid plastic storage bags.'
      }
    ]
  },
  Silk: {
    image: silkImg,
    alt: 'Folded silk fabrics in a stack of colours',
    instructions: [
      {
        icon: 'fa-solid fa-droplet',
        label: 'Washing',
        text: 'Hand wash only in cool water (below 30°C) with a gentle silk detergent or a tiny drop of mild shampoo. Rinse thoroughly and do not wring — press gently to remove water.'
      },
      {
        icon: 'fa-regular fa-sun',
        label: 'Drying',
        text: 'Lay flat on a clean white towel and roll up to absorb moisture, then unroll and lay flat to finish drying. Keep away from direct sunlight or heat.'
      },
      {
        icon: 'fa-solid fa-temperature-high',
        label: 'Ironing',
        text: 'Iron on the lowest silk setting while slightly damp. Always iron on the reverse side. A pressing cloth adds extra protection against water marks.'
      },
      {
        icon: 'fa-solid fa-box-archive',
        label: 'Storage',
        text: 'Store folded in acid-free tissue or a silk bag. Avoid contact with perfume, deodorant, or harsh chemicals before wearing — they can permanently mark silk.'
      }
    ]
  },
  Cashmere: {
    image: cashmereImg,
    alt: 'Close-up of a cotton plant at golden hour',
    instructions: [
      {
        icon: 'fa-solid fa-droplet',
        label: 'Washing',
        text: 'Hand wash in cool water (max 25°C) with a cashmere-specific shampoo or very mild detergent. Avoid soaking longer than 10 minutes. Never rub — gently squeeze suds through.'
      },
      {
        icon: 'fa-regular fa-sun',
        label: 'Drying',
        text: 'Press between two clean towels to remove water, then lay flat to dry in its natural shape. Never tumble dry or hang — cashmere stretches easily when wet.'
      },
      {
        icon: 'fa-solid fa-temperature-high',
        label: 'Ironing',
        text: 'Use a steamer or hold a steam iron a few centimetres above the garment without contact. If pressing is needed, use a pressing cloth on the lowest heat setting.'
      },
      {
        icon: 'fa-solid fa-box-archive',
        label: 'Storage',
        text: 'Fold — never hang — and store in a breathable cotton bag with cedar or lavender sachets. Pilling is natural and can be removed gently with a cashmere comb.'
      }
    ]
  }
};

const Sustainprocare = () => {
  const [activeTab, setActiveTab] = useState('Cotton');

  const fabrics = Object.keys(careData);
  const currentCare = careData[activeTab];

  return (
    <section className="sustain-procare">

      {/* HERO */}
      <div className="procare-hero">
        <img src={heroImg} alt="Clothes hanging against a wall" className="procare-hero-bg" />
        <div className="procare-hero-overlay">
          <span className="procare-label-light">Garment Longevity</span>
          <h1 className="procare-hero-title">Wear Longer,</h1>
          <h1 className="procare-hero-title procare-hero-italic">Care Smarter</h1>
          <p>
            The most sustainable garment is the one already in your wardrobe. Proper care extends the life of every piece and keeps it from landfill for years longer.
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="tab-bar">
        <div className="tab-navigation">
          {fabrics.map((fabric) => (
            <button
              key={fabric}
              className={`tab-button ${activeTab === fabric ? 'active' : ''}`}
              onClick={() => setActiveTab(fabric)}
            >
              {fabric}
            </button>
          ))}
        </div>
      </div>

      {/* CARE CARD */}
      <div className="care-section">
        <div className="care-card">
          <div className="care-details">
            <h3>{activeTab} Care Instructions</h3>
            <ul className="instruction-list">
              {currentCare.instructions.map((item) => (
                <li key={item.label} className="instruction-item">
                  <span className="instruction-icon">
                    <i className={item.icon}></i>
                  </span>
                  <div className="instruction-body">
                    <span className="instruction-label">{item.label}</span>
                    <p className="instruction-text">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="care-image-wrapper">
            <img src={currentCare.image} alt={currentCare.alt} />
          </div>
        </div>
      </div>

      {/* CIRCULARITY CTA */}
      <div className="circularity-band">
        <span className="circularity-label">Circularity</span>
        <h2>Don't Toss It, Repair It</h2>
        <p>
          Small repairs extend the life of a garment significantly. Our free repair guide covers common fixes — loose buttons, open seams, minor pilling — so your Modimal pieces stay with you longer.
        </p>
        <button className="repair-guide-btn">View Repair Guide →</button>
      </div>

    </section>
  );
};

export default Sustainprocare;