import React from 'react';
import './Refunds.css';

const Refunds = () => {
  return (
    <div className="refunds-container">
      {/* Header Section */}
      <header className="refunds-header">
        <div className="header-left">
          <span className="subtitle">CUSTOMER SERVICE</span>
          <h1 className="title">Returns &amp; Refunds</h1>
          <p className="last-updated">Last updated: September 2026</p>
        </div>
        <div className="header-right">
          <p>
            We want you to feel confident when shopping with modimal. If your purchase isn't right for you, we're here to help.
          </p>
        </div>
      </header>

      {/* Main Rules Grid */}
      <section className="policy-grid-section">
        <div className="policy-col left-col">
          <span className="section-label">OUR RETURN POLICY</span>
          <p className="policy-intro">
            Eligible items can be returned within <strong>14 days of delivery</strong>. To qualify for a return, the item must:
          </p>
          <ul className="check-list">
            <li>
              <i className="fa-solid fa-check check-icon"></i>
              <span>Be unworn and unused</span>
            </li>
            <li>
              <i className="fa-solid fa-check check-icon"></i>
              <span>Be in its original condition</span>
            </li>
            <li>
              <i className="fa-solid fa-check check-icon"></i>
              <span>Have all original tags attached</span>
            </li>
            <li>
              <i className="fa-solid fa-check check-icon"></i>
              <span>Be returned in its original packaging</span>
            </li>
            <li>
              <i className="fa-solid fa-check check-icon"></i>
              <span>Not show signs of washing, damage, stains, perfume, or alteration</span>
            </li>
          </ul>
          <p className="policy-note">
            For hygiene and safety reasons, certain products may not be eligible for return.
          </p>
        </div>

        <div className="policy-col right-col-card">
          <span className="section-label">ITEMS THAT CANNOT BE RETURNED</span>
          <p className="card-intro">The following items may not be eligible for return:</p>
          <ul className="cross-list">
            <li>
              <i className="fa-solid fa-xmark cross-icon"></i>
              <span>Final-sale items</span>
            </li>
            <li>
              <i className="fa-solid fa-xmark cross-icon"></i>
              <span>Items marked as non-returnable</span>
            </li>
            <li>
              <i className="fa-solid fa-xmark cross-icon"></i>
              <span>Items that have been worn or washed</span>
            </li>
            <li>
              <i className="fa-solid fa-xmark cross-icon"></i>
              <span>Items with removed or damaged tags</span>
            </li>
            <li>
              <i className="fa-solid fa-xmark cross-icon"></i>
              <span>Items damaged after delivery due to improper use</span>
            </li>
            <li>
              <i className="fa-solid fa-xmark cross-icon"></i>
              <span>Personalized or specially made items, where applicable</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Process Banner Section */}
      <section className="process-banner">
        <div className="process-inner">
          <span className="process-subtitle">PROCESS</span>
          <h2 className="process-title">How to Return an Item</h2>
          
          <div className="process-steps">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3>Request Your Return</h3>
              <p>Contact our customer support team with your order number and the item you wish to return.</p>
            </div>
            
            <div className="step-card">
              <span className="step-num">02</span>
              <h3>Receive Return Instructions</h3>
              <p>Our support team will review your request and provide instructions for sending the item back.</p>
            </div>

            <div className="step-card">
              <span className="step-num">03</span>
              <h3>Send Your Item</h3>
              <p>Pack the item securely and send it using the return instructions provided.</p>
            </div>

            <div className="step-card">
              <span className="step-num">04</span>
              <h3>Inspection</h3>
              <p>Once we receive your return, we will inspect the item to make sure it meets our return requirements.</p>
            </div>

            <div className="step-card">
              <span className="step-num">05</span>
              <h3>Refund</h3>
              <p>If your return is approved, we will process your refund using the applicable refund method.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Additional Details Section */}
      <section className="details-columns-section">
        <div className="detail-col">
          <h3>Refunds</h3>
          <p>
            Once your return has been received and approved, your refund will be processed. Depending on your payment provider or bank, it may take additional time for the refunded amount to appear in your account.
          </p>
        </div>

        <div className="detail-col">
          <h3>Exchanges</h3>
          <p>
            If you need a different size or another product, please contact customer support. Depending on stock availability, we may be able to offer an exchange or provide another suitable solution.
          </p>
        </div>

        <div className="detail-col">
          <h3>Damaged or Incorrect Items</h3>
          <p>
            If you receive an item that is damaged, defective, or different from what you ordered, please contact us as soon as possible with your order number, a description of the issue, and clear photographs of the item and packaging.
          </p>
        </div>
      </section>

      {/* Return Shipping Callout Banner */}
      <div className="shipping-callout">
        <i className="fa-solid fa-truck-fast shipping-icon"></i>
        <p>
          <strong>Return Shipping:</strong> Customers are responsible for return shipping costs unless the item is defective, damaged, or incorrectly sent.
        </p>
      </div>

      {/* Still Have Questions CTA */}
      <section className="questions-section">
        <h2>Still have questions?</h2>
        <p>Our team is here to help. Reach out and we'll get back to you as soon as possible.</p>
        <button className="contact-btn">
          CONTACT SUPPORT <i className="fa-solid fa-arrow-right-long"></i>
        </button>
      </section>
    </div>
  );
};

export default Refunds;