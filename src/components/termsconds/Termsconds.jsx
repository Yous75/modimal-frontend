import "./Termsconds.css";

function Termsconds() {
    const contents = [
        { number: "1.", title: "Introduction", id: "introduction" },
        { number: "2.", title: "Using Our Website", id: "using-our-website" },
        { number: "3.", title: "Customer Accounts", id: "customer-accounts" },
        {
            number: "4.",
            title: "Products and Product Information",
            id: "products-information",
        },
        { number: "5.", title: "Prices and Payments", id: "prices-payments" },
        { number: "6.", title: "Orders", id: "orders" },
        { number: "7.", title: "Shipping and Delivery", id: "shipping-delivery" },
        { number: "8.", title: "Returns and Refunds", id: "returns-refunds" },
        {
            number: "9.",
            title: "Intellectual Property",
            id: "intellectual-property",
        },
        {
            number: "10.",
            title: "Third-Party Services",
            id: "third-party-services",
        },
        {
            number: "11.",
            title: "Limitation of Liability",
            id: "limitation-liability",
        },
        {
            number: "12.",
            title: "Changes to These Terms",
            id: "changes-terms",
        },
        { number: "13.", title: "Contact Us", id: "contact-us" },
    ];

    return (
        <main className="terms-page">

            {/* =========================================================
                PAGE HEADER
            ========================================================= */}

            <section className="terms-hero">
                <div className="terms-hero-container">

                    <p className="terms-eyebrow">
                        LEGAL
                    </p>

                    <h1 className="terms-title">
                        Terms &amp; Conditions
                    </h1>

                    <p className="terms-updated">
                        Last updated: September 2026
                    </p>

                </div>
            </section>


            {/* =========================================================
                MAIN CONTENT AREA
            ========================================================= */}

            <div className="terms-layout">

                {/* =====================================================
                    LEFT CONTENTS SIDEBAR
                ===================================================== */}

                <aside className="terms-sidebar">

                    <p className="terms-sidebar-title">
                        CONTENTS
                    </p>

                    <nav className="terms-contents">
                        {contents.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="terms-content-link"
                            >
                                <span className="terms-content-number">
                                    {item.number}
                                </span>

                                <span className="terms-content-name">
                                    {item.title}
                                </span>
                            </a>
                        ))}
                    </nav>

                </aside>


                {/* =====================================================
                    RIGHT POLICY CONTENT
                ===================================================== */}

                <div className="terms-content">

                    {/* =================================================
                        INTRODUCTION
                    ================================================= */}

                    <div className="terms-intro">

                        <p>
                            Welcome to modimal. By accessing or using our
                            website, you agree to these Terms &amp; Conditions.
                            Please read them carefully before using our website
                            or placing an order.
                        </p>

                    </div>


                    {/* =================================================
                        SECTION 1
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="introduction"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                1.
                            </span>

                            <h2>
                                Introduction
                            </h2>

                        </div>

                        <p>
                            These Terms &amp; Conditions govern your use of the
                            modimal. website and the purchase of products
                            through our online store. By using our website,
                            you confirm that you have read, understood, and
                            agreed to these terms.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 2
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="using-our-website"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                2.
                            </span>

                            <h2>
                                Using Our Website
                            </h2>

                        </div>

                        <p>
                            You agree to use our website only for lawful
                            purposes. You must not:
                        </p>

                        <ul>
                            <li>
                                Use the website for fraudulent purposes
                            </li>

                            <li>
                                Attempt to gain unauthorized access to our
                                systems
                            </li>

                            <li>
                                Interfere with the operation or security of
                                the website
                            </li>

                            <li>
                                Copy or reproduce website content without
                                permission
                            </li>

                            <li>
                                Use our website to distribute harmful or
                                malicious material
                            </li>
                        </ul>

                    </section>


                    {/* =================================================
                        SECTION 3
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="customer-accounts"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                3.
                            </span>

                            <h2>
                                Customer Accounts
                            </h2>

                        </div>

                        <p>
                            Some features may require you to create an account.
                            You are responsible for providing accurate
                            information and keeping your account credentials
                            secure.
                        </p>

                        <p>
                            You are responsible for activity that occurs
                            through your account and should notify us if you
                            believe your account has been accessed without
                            authorization.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 4
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="products-information"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                4.
                            </span>

                            <h2>
                                Products and Product Information
                            </h2>

                        </div>

                        <p>
                            We make reasonable efforts to ensure that product
                            descriptions, images, colors, sizes, and other
                            information displayed on our website are accurate.
                            However, colors may appear slightly different
                            depending on your device or screen settings.
                        </p>

                        <p>
                            Product availability may change without notice.
                            We also reserve the right to correct errors or
                            inaccuracies in product information when necessary.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 5
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="prices-payments"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                5.
                            </span>

                            <h2>
                                Prices and Payments
                            </h2>

                        </div>

                        <p>
                            All product prices are displayed on the website in
                            the applicable currency. We reserve the right to
                            change prices, promotions, or product information
                            at any time.
                        </p>

                        <p>
                            Orders are subject to successful payment
                            authorization. If a payment cannot be authorized,
                            we may be unable to process the order.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 6
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="orders"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                6.
                            </span>

                            <h2>
                                Orders
                            </h2>

                        </div>

                        <p>
                            When you place an order, you are making an offer to
                            purchase the selected products. After receiving
                            your order, we may send you an order confirmation.
                        </p>

                        <p>
                            An order may be cancelled if the product is
                            unavailable, payment cannot be authorized, or
                            there is an obvious pricing or technical error.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 7
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="shipping-delivery"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                7.
                            </span>

                            <h2>
                                Shipping and Delivery
                            </h2>

                        </div>

                        <p>
                            We will make reasonable efforts to process and ship
                            orders within the estimated delivery time displayed
                            at checkout.
                        </p>

                        <p>
                            Delivery times may vary depending on location,
                            shipping provider, weather, holidays, or
                            circumstances outside our control.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 8
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="returns-refunds"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                8.
                            </span>

                            <h2>
                                Returns and Refunds
                            </h2>

                        </div>

                        <p>
                            Returns and refunds are handled according to our
                            Returns &amp; Refunds Policy. Please review that
                            policy before placing an order.
                        </p>

                        <p>
                            Returned garments may need to meet specific
                            conditions regarding their original condition,
                            tags, packaging, and signs of wear.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 9
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="intellectual-property"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                9.
                            </span>

                            <h2>
                                Intellectual Property
                            </h2>

                        </div>

                        <p>
                            All content on our website, including the following,
                            belongs to modimal. or its respective licensors and
                            may not be reproduced or used without permission:
                        </p>

                        <ul>
                            <li>Logos</li>
                            <li>Product photography</li>
                            <li>Images</li>
                            <li>Graphics</li>
                            <li>Text</li>
                            <li>Designs</li>
                            <li>Website layouts</li>
                            <li>Branding</li>
                        </ul>

                    </section>


                    {/* =================================================
                        SECTION 10
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="third-party-services"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                10.
                            </span>

                            <h2>
                                Third-Party Services
                            </h2>

                        </div>

                        <p>
                            Our website may use third-party services such as
                            payment processors, shipping providers, analytics
                            tools, or other external services.
                        </p>

                        <p>
                            These services may have their own terms and
                            privacy policies. We encourage you to review the
                            applicable policies of any third-party service you
                            use through our website.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 11
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="limitation-liability"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                11.
                            </span>

                            <h2>
                                Limitation of Liability
                            </h2>

                        </div>

                        <p>
                            To the extent permitted by applicable law,
                            modimal. will not be responsible for losses
                            resulting from circumstances beyond our reasonable
                            control, interruptions to the website, or
                            unauthorized access caused by circumstances outside
                            our control.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 12
                    ================================================= */}

                    <section
                        className="terms-section"
                        id="changes-terms"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                12.
                            </span>

                            <h2>
                                Changes to These Terms
                            </h2>

                        </div>

                        <p>
                            We may update these Terms &amp; Conditions from time
                            to time. The updated version will be published on
                            this page, and the "Last updated" date will be
                            changed accordingly.
                        </p>

                    </section>


                    {/* =================================================
                        SECTION 13
                    ================================================= */}

                    <section
                        className="terms-section terms-contact-section"
                        id="contact-us"
                    >

                        <div className="terms-section-heading">

                            <span className="terms-section-number">
                                13.
                            </span>

                            <h2>
                                Contact Us
                            </h2>

                        </div>

                        <p>
                            If you have questions regarding these Terms &amp;
                            Conditions, please contact:
                        </p>

                        <div className="terms-contact">

                            <p>
                                <strong>Email:</strong>{" "}
                                <a href="mailto:support@modimal.com">
                                    support@modimal.com
                                </a>
                            </p>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}

export default Termsconds;