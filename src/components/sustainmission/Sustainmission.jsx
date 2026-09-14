import { Link } from "react-router-dom";
import "./Sustainmission.css";

import heroImg from "../../assets/hero-img.jpg";

import processingImg from "../../assets/processing-img.jpg";
import materialsImg from "../../assets/materials-img.jpg";
import packagingImg from "../../assets/packaging-img.jpg";
import productCareImg from "../../assets/product-care-img.jpg";

import artisanTextilesImg from "../../assets/artisantextile.jpg";
import artisanYarnImg from "../../assets/artisanyarn.jpg";
import artisanTailoringImg from "../../assets/artisantailoring.jpg";
import supplierPortrait1 from "../../assets/supplierPortrait1.jpg";
import supplierPortrait2 from "../../assets/supplierPortrait2.jpg";
import supplierPortrait3 from "../../assets/supplierPortrait3.jpg";
import supplierPortrait4 from "../../assets/supplierPortrait4.jpg";
import { useNavigate } from "react-router-dom";

function Sustainmission() {
  const navigate = useNavigate();
  return (
    <main className="sustainmission">
      {/* Breadcrumb */}
      <nav className="sustainmission-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span>Sustainability</span>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">Mission</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="sustainmission-hero">
        <img src={heroImg} alt="Hands holding folded sustainable garments" />
        <div className="sustainmission-hero-overlay">
          <h1>Elegance In Simplicity, Earth&apos;s Harmony</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="sustainmission-intro">
        <h2>Sustainability At Modimal</h2>
        <p>
          At Modimal, sustainability is at the heart of everything we do. Our brand identity, characterized by
          its simplicity and elegance, is a reflection of our commitment to a more sustainable future.
        </p>
      </section>

      {/* The Modimal Six */}
      <section className="sustainmission-values">
        <h3 className="sustainmission-values-heading">Our Mission, The Modimal Six:</h3>

        <div className="sustainmission-values-grid">
          <div className="sustainmission-value-card">
            <h4>Minimalism</h4>
            <p>
              We believe less is more. Our thoughtfully designed pieces embrace minimalism, ensuring that
              garment becomes a versatile and timeless addition to your wardrobe. By choosing quality over
              quantity, we encourage conscious consumption.
            </p>
          </div>

          <div className="sustainmission-value-card">
            <h4>Circular</h4>
            <p>
              Embracing the circular economy, we design with longevity in mind. Our pieces are intended to be
              treasured for years, encouraging a shift away from disposable fashion. When you invest in our
              clothing, you're investing in a more sustainable future.
            </p>
          </div>

          <div className="sustainmission-value-card">
            <h4>Ethical</h4>
            <p>
              Every stitch tells a story. Our garments are meticulously crafted by skilled artisans who share
              our values of ethical and fair labor practices. This dedication to craftsmanship not only
              ensures exceptional quality but also supports a network of talented individuals.
            </p>
          </div>

          <div className="sustainmission-value-card">
            <h4>Transparency</h4>
            <p>
              We value openness and transparency. We're on a journey to continuously improve our practices,
              and we're committed to sharing our progress with you. From sourcing to production, we want you
              to know the story behind each piece you wear. We update all information every six months.
            </p>
          </div>

          <div className="sustainmission-value-card">
            <h4>Eco-Friendly Materials</h4>
            <p>
              We are dedicated to reducing our environmental impact. Our clothing is made using sustainable
              materials, carefully sourced to minimize harm to the planet. From organic fabrics to innovative
              recycled materials, we aim to leave a lighter footprint.
            </p>
          </div>

          <div className="sustainmission-value-card">
            <h4>Community And Empowerment</h4>
            <p>
              Our brand is part of a community that shares a vision for a better world. Through collaborations
              and initiatives, we aim to inspire and empower individuals to make conscious choices and
              contribute to positive change.
            </p>
          </div>
        </div>

        <p className="sustainmission-values-summary">
          Guided by our core missions, we intertwine sustainability into every thread of our brand, from
          thoughtfully sourced materials and innovative manufacturing processes to nurturing product longevity
          and embracing eco-friendly packaging &mdash; all harmonizing to create a more meaningful and
          responsible approach to fashion.
        </p>
      </section>

      {/* Category grid — left column: Processing, Packaging.
          Right column: Materials, Product Caring. Each column stacks
          independently so the images stagger like the mockup. */}
      <section className="sustainmission-categories">
        <div className="sustainmission-categories-grid">
          <div className="sustainmission-categories-column">
            <div className="sustainmission-category-card sustainmission-category-card--processing">
              <img src={processingImg} alt="Processing" />
              <button onClick={() => navigate("/sustainability/processing")} className="sustainmission-category-badge">Processing</button>
            </div>

            <div className="sustainmission-category-card sustainmission-category-card--packaging">
              <img src={packagingImg} alt="Packaging" />
              <button onClick={() => navigate("/sustainability/packaging")} className="sustainmission-category-badge">Packaging</button>
            </div>
          </div>

          <div className="sustainmission-categories-column">
            <div className="sustainmission-category-card sustainmission-category-card--materials">
              <img src={materialsImg} alt="Materials" />
              <button onClick={() => navigate("/sustainability/materials")} className="sustainmission-category-badge">Materials</button>
            </div>

            <div className="sustainmission-category-card sustainmission-category-card--product-care">
              <img src={productCareImg} alt="Product Caring" />
              <button onClick={() => navigate("/sustainability/product-care")} className="sustainmission-category-badge">Product Caring</button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <blockquote className="sustainmission-quote">
        &ldquo;With every step, our quest for sustainability is fortified by our trusted suppliers, united in
        our shared dedication to ethical craftsmanship and a more conscious future.&rdquo;
      </blockquote>

      {/* People Beyond Us */}
      <section className="sustainmission-people">
        <h3>People Beyond Us</h3>

        <div className="sustainmission-people-grid">
          <div className="sustainmission-people-row sustainmission-people-row--top">
            <div className="sustainmission-people-card">
              <img src={artisanTextilesImg} alt="Artisan sorting sustainable textiles" />
            </div>

            <div className="sustainmission-people-card">
              <img src={artisanYarnImg} alt="Skeins of naturally dyed yarn" />
            </div>

            <div className="sustainmission-people-card">
              <img src={artisanTailoringImg} alt="Tailor hand-finishing a garment" />
            </div>
          </div>

          <div className="sustainmission-people-row sustainmission-people-row--bottom">
            <div className="sustainmission-people-card">
              <img src={supplierPortrait1} alt="Modimal supplier portrait" />
            </div>

            <div className="sustainmission-people-card">
              <img src={supplierPortrait2} alt="Modimal supplier portrait" />
            </div>

            <div className="sustainmission-people-card">
              <img src={supplierPortrait3} alt="Modimal supplier portrait" />
            </div>

            <div className="sustainmission-people-card">
              <img src={supplierPortrait4} alt="Modimal supplier portrait" />
            </div>
          </div>
        </div>

        <div className="sustainmission-people-cta">
          <Link to="/sustainability/suppliers" className="sustainmission-suppliers-btn">
            Our Suppliers
          </Link>
        </div>
      </section>

      {/* Footer statement */}
      <section className="sustainmission-footer-statement">
        <p>
          With Modimal, you&apos;re not just wearing fashion &mdash; you&apos;re making a statement. A
          statement that elegance and sustainability can coexist, shaping a more responsible and beautiful
          future for us all.
        </p>
      </section>
    </main>
  );
}

export default Sustainmission;