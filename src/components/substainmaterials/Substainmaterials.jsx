import { Link } from "react-router-dom";
import "./Substainmaterials.css";

// ---- Placeholder image imports ---------------------------------------
// Swap these paths for your real asset filenames whenever they're ready.
// Cotton / Wool / Linen / Cashmere each use a single "diptych" style image
// (two photos combined side-by-side into one graphic, as shown in the
// screenshot). Silk uses two separate images placed next to each other.
import cottonImg from "../../assets/cotton.jpg";
import woolImg from "../../assets/wool.jpg";
import linenImg from "../../assets/linen.jpg";
import silkCocoonsImg from "../../assets/silk-cocoons.jpg";

import cashmereImg from "../../assets/cashmere.jpg";

function Substainmaterials() {
  return (
    <div className="materials-page">
      {/* Breadcrumb */}
      <div className="materials-breadcrumb">
        <Link to="/">Home</Link>
        <span className="materials-breadcrumb-sep">/</span>
        {/* NOTE: pointing this at the existing "/sustainability/mission" route
            for now since there isn't yet a dedicated Sustainability landing
            page/route in App.jsx. Update the "to" prop once one exists. */}
        <Link to="/sustainability/mission">Sustainability</Link>
        <span className="materials-breadcrumb-sep">/</span>
        <span className="materials-breadcrumb-current">Materials</span>
      </div>

      {/* Heading + intro */}
      <h1 className="materials-heading">Sustainably Sourced Materials</h1>

      <div className="materials-intro">
        <p>
          At Modimal, We Believe In Investing In The Now To Design For The
          Future. That's Why We Are Committed To Sourcing Quality Materials
          That Will Have Less Impact On The Environment.
        </p>
        <p>
          So Far In 2022, 92% Of The Base Fabrics In Our Collection Are More
          Sustainably Sourced. Our Goal Is To Use Only 100% Sustainably
          Sourced Materials By 2025.
        </p>
        <p>
          There Are Five Kinds Of Fabrics In Our Collections That Are Organic
          And Responsible Sourced, And We Highlight These So You Can Make
          Considered Choices When You Shop.
        </p>
      </div>

      {/* ---------------- Cotton (image left / text right) ---------------- */}
      <div className="materials-row">
        <div className="materials-row-image">
          <img src={cottonImg} alt="Cotton" />
        </div>
        <div className="materials-row-content">
          <h2>Cotton</h2>
          <p>
            We Source Certified Organic Cotton, Which Is Grown Without The
            Use Of Pesticides Or Synthetic Fertilizers And Requires Less
            Irrigation As It Relies Mainly On Rainwater.
          </p>
          <p>
            (1). Avoiding Harmful Pesticides Preserves Soil Biodiversity And
            Protects The Health Of Surrounding Communities.
          </p>
          <p>
            (2). Our Organic Cotton Fabrics Are Made Using Organic Cotton
            Yarns That Are Certified By The Global Organic Textile Standard
            (GOTS).
          </p>
        </div>
      </div>

      {/* ---------------- Wool (text left / image right) ---------------- */}
      <div className="materials-row materials-row-reverse">
        <div className="materials-row-image">
          <img src={woolImg} alt="Wool" />
        </div>
        <div className="materials-row-content">
          <h2>Wool</h2>
          <p>
            Wool Is A Natural Fiber With Added Performance Attributes Such As
            Temperature Regulation, Durability, And Natural Water Repellency.
            Considered A Circular Product By Nature, Wool Can Be Recycled Or
            Biodegraded Easily. Animal Welfare Is Extremely Important To Us,
            And Therefore We Only Source Mulesing-Free Wool From Producers
            That Follow Humane And Eco-Friendly Processes Aligned With Our
            Animal Welfare Guidelines.
          </p>
        </div>
      </div>

      {/* ---------------- Linen (image left / text right) ---------------- */}
      <div className="materials-row">
        <div className="materials-row-image">
          <img src={linenImg} alt="Linen" />
        </div>
        <div className="materials-row-content">
          <h2>Linen</h2>
          <p>
            Found Throughout Our Collections, Linen Is A Sustainable Fiber
            Made From The Flax Plant. Flax Is Naturally Pest Resistant That
            Requires Less Pesticides, Water And Energy To Produce Compared
            To Cotton And Polyester. Flax Aids In Sequestering Carbon Into
            The Soil, Which Removes Carbon Dioxide From The Atmosphere And
            Is Beneficial For Improving Soil Health.
          </p>
        </div>
      </div>

      {/* ---------------- Silk (text left / two images right) ---------------- */}
      <div className="materials-row materials-row-reverse">
        <div className="materials-row-image materials-row-image-split">
          <img src={silkCocoonsImg} alt="Silk cocoons" />
          
        </div>
        <div className="materials-row-content">
          <h2>Silk</h2>
          <p>
            Organic Silk Is A More Responsible Alternative To Making
            Conventional Silk Through Traditional Methods. The Silkworms Are
            Fed Mulberry Tree Leaves From Organic Agriculture That Uses No
            Pesticides Or Harmful Chemicals And Resulting In A Lustrous
            Fabric That Is Gentle On Both You And Environment. This
            Responsibly Sourced Material Epitomizes Our Dedication To
            Creating Exquisite Clothing With A Conscience.
          </p>
        </div>
      </div>

      {/* ---------------- Cashmere (image left / text right) ---------------- */}
      <div className="materials-row">
        <div className="materials-row-image">
          <img src={cashmereImg} alt="Cashmere" />
        </div>
        <div className="materials-row-content">
          <h2>Cashmere</h2>
          <p>
            We're Proud To Source Our Cashmere Through The Good Cashmere
            Standard By The Aid By Trade Foundation (AbTF). This Independent
            Standard Works To Source Traceable, Sustainably Certified
            Cashmere That Cares For The Wellbeing Of Cashmere Goats,
            Protects The Environment And Supports The Herders That Produce
            It.
          </p>
        </div>
      </div>

      {/* Closing info */}
      <div className="materials-closing">
        <p>
          We Are Continually Exploring More Sustainable Alternatives That
          Offer The Same Quality And Performance. We Will Soon Add New
          Fabrics In To Our Collections Which Are Recycling And Repurposing.
          By Giving A New Life To Leftover Fabrics Through Recycling And
          Repurposing, We Can Reduce Our Demand On The Planet's Limited
          Natural Resources. Recycled Fabrics Are Made Using The Waste From
          Both The Pre- And Post-Consumer Stage Of A Product's Life.
        </p>
        <p>
          We Track Our Material Usage And Progress Annually As Part Of
          Textile Exchange's Corporate Fibers And Materials Benchmark, View
          Our Latest Report <a href="#report">Here</a>.
        </p>
      </div>
    </div>
  );
}

export default Substainmaterials;