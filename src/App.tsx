import React, {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

type Product = {
  name: string;
  slug: string;
  category: string;
  description: string;
  status: "Verification required";
};

type Route =
  | { page: "home" }
  | { page: "about" }
  | { page: "products" }
  | { page: "product"; slug: string }
  | { page: "capabilities" }
  | { page: "quality" }
  | { page: "medical" }
  | { page: "industries" }
  | { page: "contact" }
  | { page: "privacy" }
  | { page: "terms" }
  | { page: "admin" }
  | { page: "not-found" };

const products: Product[] = [
  {
    name: "Electrical components",
    slug: "electrical-components",
    category: "Electrical",
    description:
      "A configurable category for electrical component requirements. Technical specifications are available upon request.",
    status: "Verification required",
  },
  {
    name: "Industrial components",
    slug: "industrial-components",
    category: "Industrial",
    description:
      "A structured category for industrial component inquiries, pending product-range verification.",
    status: "Verification required",
  },
  {
    name: "Custom-manufactured parts",
    slug: "custom-manufactured-parts",
    category: "Custom",
    description:
      "A starting point for custom part discussions subject to capability and technical verification.",
    status: "Verification required",
  },
];

const primaryNavigation = [
  ["About", "/about"],
  ["Products", "/products"],
  ["Capabilities", "/capabilities"],
  ["Quality", "/quality"],
  ["Medical Packaging", "/medical-packaging"],
  ["Industries", "/industries"],
  ["Contact", "/contact"],
] as const;

function getRoute(pathname: string): Route {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  if (normalized === "/") return { page: "home" };
  if (normalized === "/about") return { page: "about" };
  if (normalized === "/products") return { page: "products" };
  if (normalized.startsWith("/products/")) {
    return {
      page: "product",
      slug: decodeURIComponent(normalized.slice("/products/".length)),
    };
  }
  if (normalized === "/capabilities") return { page: "capabilities" };
  if (normalized === "/quality") return { page: "quality" };
  if (normalized === "/medical-packaging") return { page: "medical" };
  if (normalized === "/industries") return { page: "industries" };
  if (normalized === "/contact") return { page: "contact" };
  if (normalized === "/privacy-policy") return { page: "privacy" };
  if (normalized === "/terms") return { page: "terms" };
  if (normalized === "/admin") return { page: "admin" };

  return { page: "not-found" };
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function AppLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const isInternal = href.startsWith("/");

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!isInternal) return;

    event.preventDefault();
    onNavigate?.();
    navigate(href);
  }

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <AppLink className={`brand ${light ? "brand-light" : ""}`} href="/">
      <span className="brand-mark" aria-hidden="true">
        SB
      </span>
      <span>
        <strong>SemBros</strong>
        <small>Electric Co.</small>
      </span>
    </AppLink>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Brand />

      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
        <b className="sr-only">Toggle navigation</b>
      </button>

      <nav
        id="main-navigation"
        className={`main-navigation ${menuOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {primaryNavigation.map(([label, href]) => (
          <AppLink
            key={href}
            href={href}
            onNavigate={() => setMenuOpen(false)}
          >
            {label}
          </AppLink>
        ))}
        <AppLink
          className="nav-cta"
          href="/contact"
          onNavigate={() => setMenuOpen(false)}
        >
          Request an Inquiry
        </AppLink>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Brand light />
        <p>Established in 2003.</p>
      </div>

      <div className="footer-nav">
        {primaryNavigation.slice(0, 5).map(([label, href]) => (
          <AppLink key={href} href={href}>
            {label}
          </AppLink>
        ))}
        <AppLink href="/privacy-policy">Privacy Policy</AppLink>
        <AppLink href="/terms">Terms</AppLink>
      </div>

      <div className="footer-bottom">
        <span>© 2026 SemBros Electric Co.</span>
        <span>Contact details available after verification.</span>
      </div>
    </footer>
  );
}

function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div>
        <span className="eyebrow eyebrow-light">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const required = [
      "name",
      "company",
      "email",
      "country",
      "interest",
      "message",
    ];

    const missing = required.some((field) => {
      const value = data.get(field);
      return !value || String(value).trim().length === 0;
    });

    if (missing) {
      setError("Please complete all required fields.");
      return;
    }

    if (!data.get("consent")) {
      setError("Please confirm consent before submitting your inquiry.");
      return;
    }

    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <div className="success-message" role="status">
        <span className="success-icon">✓</span>
        <h3>Thank you.</h3>
        <p>
          Your inquiry has been received. Our team will review your
          requirements and respond using the contact details provided.
        </p>
        <button
          type="button"
          className="button button-outline"
          onClick={() => setSubmitted(false)}
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={submitInquiry} noValidate>
      <div className="form-row">
        <label>
          Name <span>*</span>
          <input name="name" required />
        </label>
        <label>
          Company <span>*</span>
          <input name="company" required />
        </label>
      </div>

      <div className="form-row">
        <label>
          Email <span>*</span>
          <input name="email" type="email" required />
        </label>
        <label>
          Country <span>*</span>
          <input name="country" required />
        </label>
      </div>

      <label>
        Product or service interest <span>*</span>
        <select name="interest" defaultValue="" required>
          <option value="" disabled>
            Select an area
          </option>
          <option>Electrical components</option>
          <option>Industrial components</option>
          <option>Custom-manufactured parts</option>
          <option>Medical packaging — subject to verification</option>
          <option>Other requirement</option>
        </select>
      </label>

      <label>
        Message <span>*</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us about your requirements."
        />
      </label>

      <label className="file-field">
        Supporting files
        <input
          name="attachments"
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
        <small>Accepted: PDF, DOC, DOCX, PNG, JPG. Size limits apply.</small>
      </label>

      <label className="checkbox-label">
        <input name="consent" type="checkbox" />
        <span>
          I consent to SemBros reviewing the information submitted for this
          inquiry. <AppLink href="/privacy-policy">Privacy notice</AppLink>
        </span>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="button button-primary button-wide" type="submit">
        Submit inquiry <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero section">
        <div className="hero-copy">
          <div className="eyebrow">
            Manufacturing platform · Established in 2003
          </div>
          <h1>
            Precision manufacturing for dependable electrical and industrial
            components.
          </h1>
          <p className="hero-summary">
            SemBros Electric Co. is building a dependable manufacturing
            platform for customers seeking consistent products, responsive
            communication, and practical production support.
          </p>
          <div className="hero-actions">
            <AppLink className="button button-primary" href="/contact">
              Request an Inquiry <span aria-hidden="true">↗</span>
            </AppLink>
            <AppLink className="button button-secondary" href="/products">
              Explore Products
            </AppLink>
          </div>
          <div className="trust-row" aria-label="Company highlights">
            <div>
              <strong>2003</strong>
              <span>Established</span>
            </div>
            <div>
              <strong>01</strong>
              <span>Manufacturing-focused</span>
            </div>
            <div>
              <strong>→</strong>
              <span>Built for dependable supply</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Industrial visual placeholder">
          <div className="visual-grid" />
          <div className="visual-ring ring-one" />
          <div className="visual-ring ring-two" />
          <div className="visual-panel">
            <span>SB / 03</span>
            <strong>
              Precision
              <br />
              in motion.
            </strong>
            <small>Approved visual assets pending verification</small>
          </div>
          <div className="visual-coordinate">
            Technical placeholder
            <br />
            Approved asset pending
          </div>
        </div>
      </section>

      <section className="statement-band">
        <div>
          <span className="eyebrow">SemBros Electric Co.</span>
          <h2>A clear foundation for verified manufacturing content.</h2>
        </div>
        <p>
          Product, capability, contact, certification, medical-packaging,
          export, and customer claims remain subject to review before public
          publication.
        </p>
      </section>

      <section className="section split-section">
        <SectionHeading
          eyebrow="01 / About"
          title="Practical production support, built around clarity."
        />
        <div>
          <p className="large-copy">
            Established in 2003, SemBros Electric Co. is a manufacturing
            business developing a professional platform for dependable
            electrical, industrial, and potentially medical-packaging-related
            solutions.
          </p>
          <Timeline />
        </div>
      </section>

      <ProductsSection compact />

      <CapabilitiesSection compact />

      <QualitySection />

      <MedicalSection />

      <section className="section industries-section">
        <SectionHeading
          eyebrow="06 / Industries"
          title="Industry categories remain configurable."
          description="Draft sectors are shown as verification-required content until claims are reviewed and approved."
        />
        <IndustryList />
      </section>

      <CtaSection />
    </>
  );
}

function Timeline() {
  return (
    <div className="timeline">
      <div className="timeline-item">
        <strong>2003</strong>
        <span>SemBros Electric Co. established</span>
      </div>
      <div className="timeline-item pending">
        <strong>Next</strong>
        <span>Additional milestones will be added after verification.</span>
      </div>
    </div>
  );
}

function ProductsSection({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return products;

    return products.filter((product) =>
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(value),
    );
  }, [query]);

  return (
    <section className={`section ${compact ? "dark-section" : ""}`}>
      <div className="section-heading-row">
        <SectionHeading
          eyebrow="02 / Products"
          title="Product categories ready for verified detail."
          description={
            compact
              ? undefined
              : "Unverified product details remain unpublished. Specifications are available upon request."
          }
        />
        <div className="search-control">
          <label htmlFor={compact ? "home-product-search" : "product-search"}>
            Search categories
          </label>
          <input
            id={compact ? "home-product-search" : "product-search"}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <article className="product-card" key={product.slug}>
              <div className="card-number">0{index + 1}</div>
              <span className="status-badge">{product.status}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <AppLink className="text-link" href={`/products/${product.slug}`}>
                View category <span aria-hidden="true">↗</span>
              </AppLink>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No categories found</h3>
          <p>Try a different search term or contact the team.</p>
        </div>
      )}

      {compact && (
        <div className="section-inline-action">
          <AppLink className="button button-secondary" href="/products">
            View all product categories
          </AppLink>
        </div>
      )}
    </section>
  );
}

function CapabilitiesSection({ compact = false }: { compact?: boolean }) {
  const capabilities = [
    "Manufacturing",
    "Customization",
    "Inspection",
    "Packaging",
    "Supply support",
  ];

  return (
    <section className="section">
      <SectionHeading
        eyebrow="03 / Capabilities"
        title="Structured for the work ahead."
        description={
          compact
            ? undefined
            : "Capability details, equipment, dimensions, tolerances, and capacity are unpublished pending technical verification."
        }
      />

      <div className="capability-grid">
        {capabilities.map((capability, index) => (
          <article className="capability-item" key={capability}>
            <span>0{index + 1}</span>
            <h3>{capability}</h3>
            <p>
              Technical claim details require verification and supporting
              documentation before publication.
            </p>
          </article>
        ))}
      </div>

      <div className="verification-note">
        <span aria-hidden="true">!</span>
        <p>
          This claim requires technical verification and supporting
          documentation before publication.
        </p>
      </div>
    </section>
  );
}

function QualitySection() {
  return (
    <section className="quality-section">
      <div className="quality-mark" aria-hidden="true">
        Q
      </div>
      <div>
        <span className="eyebrow eyebrow-light">04 / Quality</span>
        <h2>Disciplined processes. Clear evidence.</h2>
        <p>
          We are committed to disciplined processes, inspection, and
          continuous improvement. Specific certifications, inspection
          capabilities, and quality metrics will be published after
          verification.
        </p>
      </div>
      <div className="quality-side">
        <span className="status-badge status-badge-dark">
          Certification claims pending review
        </span>
        <p>
          Documentation and formal compliance claims will be published only
          after approval.
        </p>
      </div>
    </section>
  );
}

function MedicalSection() {
  return (
    <section className="section medical-section">
      <div className="medical-copy">
        <span className="eyebrow">05 / Medical packaging</span>
        <h2>Explore carefully. Verify completely.</h2>
        <p>
          SemBros is evaluating and developing medical packaging solutions
          subject to product-specific scope, regulatory requirements, and
          supporting documentation.
        </p>
        <AppLink className="button button-dark" href="/medical-packaging">
          Explore medical packaging
        </AppLink>
      </div>
      <div className="disclaimer-card">
        <span className="warning-symbol" aria-hidden="true">
          !
        </span>
        <h3>Verification required</h3>
        <p>
          Medical packaging capabilities, regulatory scope, and compliance
          information are subject to product-specific verification and
          supporting documentation.
        </p>
      </div>
    </section>
  );
}

function IndustryList() {
  return (
    <div className="industry-list">
      {[
        "Electrical",
        "Industrial manufacturing",
        "OEM supply",
        "Medical packaging",
        "Other approved sectors",
      ].map((industry) => (
        <div className="industry-row" key={industry}>
          <span>{industry}</span>
          <small>Draft · Verification required</small>
          <span aria-hidden="true">↗</span>
        </div>
      ))}
    </div>
  );
}

function CtaSection() {
  return (
    <section className="cta-section">
      <div>
        <span className="eyebrow eyebrow-light">Start a conversation</span>
        <h2>Tell us what you need manufactured.</h2>
      </div>
      <AppLink className="button button-primary" href="/contact">
        Submit an Inquiry <span aria-hidden="true">↗</span>
      </AppLink>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About SemBros"
        title="A dependable foundation for manufacturing conversations."
        description="SemBros Electric Co. was established in 2003. Additional company identity, location, ownership, and business details remain subject to verification."
      />
      <section className="section split-section">
        <SectionHeading
          eyebrow="Company overview"
          title="Clear information before confident claims."
        />
        <div>
          <p className="large-copy">
            Established in 2003, SemBros Electric Co. is developing a
            professional manufacturing platform for customers seeking
            consistent products, responsive communication, and practical
            production support.
          </p>
          <Timeline />
        </div>
      </section>
      <section className="section pale-section">
        <SectionHeading
          eyebrow="Mission and values"
          title="Mission, values, and approach remain editable content."
          description="These fields are prepared for internal review and approval before publication as final company claims."
        />
        <div className="info-grid">
          {["Mission", "Values", "Manufacturing approach"].map((item) => (
            <article className="info-card" key={item}>
              <span className="status-badge">Verification required</span>
              <h3>{item}</h3>
              <p>Content will be published after company review and approval.</p>
            </article>
          ))}
        </div>
      </section>
      <CtaSection />
    </>
  );
}

function ProductDetailPage({ slug }: { slug: string }) {
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <>
        <PageHero
          eyebrow="Product detail"
          title="Product category not found."
          description="The requested category is not available in the current verified content set."
        />
        <section className="section centered-section">
          <AppLink className="button button-dark" href="/products">
            Return to products
          </AppLink>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={`Product detail · ${product.category}`}
        title={product.name}
        description={product.description}
      />
      <section className="section split-section">
        <SectionHeading
          eyebrow="Overview"
          title="Specifications are available upon request."
        />
        <div className="detail-content">
          <span className="status-badge">{product.status}</span>
          <p>
            This product category is prepared for verified product information,
            applications, materials, dimensions, finishes, customization
            options, technical documents, and related content.
          </p>
          <p>
            No technical specifications are published until they have been
            reviewed and approved.
          </p>
          <AppLink className="button button-dark" href="/contact">
            Send an inquiry
          </AppLink>
        </div>
      </section>
      <section className="section pale-section">
        <SectionHeading
          eyebrow="Product information"
          title="Content fields ready for verification."
        />
        <div className="spec-grid">
          {["Applications", "Materials", "Dimensions", "Tolerances", "Finishes", "Customization"].map(
            (field) => (
              <div className="spec-item" key={field}>
                <strong>{field}</strong>
                <span>Available upon request</span>
              </div>
            ),
          )}
        </div>
      </section>
    </>
  );
}

function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Product categories ready for verified detail."
        description="Explore configurable categories and contact SemBros to discuss requirements. Unverified specifications remain unpublished."
      />
      <ProductsSection />
      <CtaSection />
    </>
  );
}

function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="Practical production support, pending technical verification."
        description="Manufacturing, customization, inspection, packaging, and supply-support content is structured for review before publication."
      />
      <CapabilitiesSection />
      <section className="section pale-section">
        <SectionHeading
          eyebrow="Verification workflow"
          title="Technical claims require evidence."
          description="Machinery, materials, dimensions, tolerances, production capacity, inspection methods, accuracy, and facility details remain unpublished until approved."
        />
        <div className="warning-box">
          This claim requires technical verification and supporting documentation
          before publication.
        </div>
      </section>
    </>
  );
}

function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality"
        title="Disciplined processes. Clear evidence."
        description="Quality-related information is presented carefully while certifications, inspection systems, and metrics remain subject to review."
      />
      <QualitySection />
      <section className="section">
        <SectionHeading
          eyebrow="Quality framework"
          title="Process reliability without unsupported claims."
        />
        <div className="info-grid">
          {[
            "Quality philosophy",
            "Incoming material checks",
            "In-process inspection",
            "Final inspection",
            "Documentation and traceability",
            "Continuous improvement",
          ].map((item) => (
            <article className="info-card" key={item}>
              <h3>{item}</h3>
              <p>Details will be published after verification and approval.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function MedicalPage() {
  return (
    <>
      <PageHero
        eyebrow="Medical packaging"
        title="Explore carefully. Verify completely."
        description="Medical packaging capabilities, regulatory scope, and compliance information are subject to product-specific verification and supporting documentation."
      />
      <section className="section medical-page-grid">
        <div>
          <SectionHeading
            eyebrow="Scope"
            title="A compliance-first content foundation."
            description="SemBros is evaluating and developing medical packaging solutions subject to product-specific scope, regulatory requirements, and supporting documentation."
          />
          <div className="info-grid compact-info-grid">
            {[
              "Packaging formats",
              "Customization options",
              "Materials and applications",
              "Quality and traceability",
            ].map((item) => (
              <article className="info-card" key={item}>
                <h3>{item}</h3>
                <p>Product-specific details require verification.</p>
              </article>
            ))}
          </div>
        </div>
        <div className="disclaimer-card">
          <span className="warning-symbol" aria-hidden="true">
            !
          </span>
          <h3>Verification required</h3>
          <p>
            Do not interpret this page as evidence of sterile status, regulatory
            approval, FDA, CE, ISO 13485, or other compliance claims.
          </p>
        </div>
      </section>
      <section className="contact-section">
        <div className="contact-intro">
          <span className="eyebrow eyebrow-light">Medical inquiry</span>
          <h2>Discuss your requirements.</h2>
          <p>Share product scope and application details for review.</p>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}

function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Industry categories remain configurable."
        description="Draft sectors are shown as verification-required content until current customer and market claims are reviewed."
      />
      <section className="section">
        <IndustryList />
      </section>
      <CtaSection />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you need manufactured."
        description="Share your requirements and our team will review the information provided. No response time is promised until confirmed."
      />
      <section className="contact-section">
        <div className="contact-intro">
          <span className="eyebrow eyebrow-light">Inquiry form</span>
          <h2>Start with the details you can share.</h2>
          <p>
            Official phone, email, address, map, and business-hours details are
            not displayed until verified.
          </p>
          <div className="contact-placeholder">
            <span>Contact details</span>
            <strong>Available after verification</strong>
            <small>Unverified contact information remains unpublished.</small>
          </div>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}

function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const privacy = type === "privacy";

  return (
    <>
      <PageHero
        eyebrow={privacy ? "Privacy Policy" : "Terms"}
        title={
          privacy
            ? "Privacy content prepared for final approval."
            : "Terms content prepared for final approval."
        }
        description="This editable legal content is not final until reviewed and approved."
      />
      <section className="section legal-content">
        <span className="status-badge">Verification required</span>
        <h2>{privacy ? "Privacy Policy" : "Terms"}</h2>
        {privacy ? (
          <>
            <p>Final content will address data collected, inquiry submissions, uploaded files, cookies and analytics, storage, retention, sharing, user rights, and contact requests.</p>
            <p>Contact information will be inserted after official details are verified.</p>
          </>
        ) : (
          <>
            <p>Final content will address website use, intellectual property, product information, inquiry submissions, third-party links, liability limitations, governing law, and contact information.</p>
            <p>Legal content remains subject to review and approval.</p>
          </>
        )}
      </section>
    </>
  );
}

function AdminPage() {
  const checklist = [
    "Legal company identity confirmed",
    "Official contact details confirmed",
    "Product range validated",
    "Machinery and capabilities validated",
    "Medical packaging scope validated",
    "Certifications documented",
    "Quality claims approved",
    "Product images approved",
    "Privacy policy finalized",
    "Terms finalized",
  ];

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Verification and content governance."
        description="This preview dashboard represents protected internal content controls. Authentication and persistence require the production backend configuration."
      />
      <section className="section">
        <div className="dashboard-grid">
          {[
            ["Total inquiries", "0"],
            ["Draft content", "9"],
            ["Published content", "0"],
            ["Items requiring verification", "10"],
          ].map(([label, value]) => (
            <article className="metric-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>

        <div className="admin-panel">
          <SectionHeading
            eyebrow="Launch readiness"
            title="Action required"
            description="The site must not be considered ready for launch until mandatory checks are approved."
          />
          <div className="checklist">
            {checklist.map((item) => (
              <div className="checklist-row" key={item}>
                <span>Verification required</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="This page is not available."
        description="The requested route does not exist in the current website."
      />
      <section className="section centered-section">
        <AppLink className="button button-dark" href="/">
          Return home
        </AppLink>
      </section>
    </>
  );
}

function PageContent({ route }: { route: Route }) {
  switch (route.page) {
    case "home":
      return <HomePage />;
    case "about":
      return <AboutPage />;
    case "products":
      return <ProductsPage />;
    case "product":
      return <ProductDetailPage slug={route.slug} />;
    case "capabilities":
      return <CapabilitiesPage />;
    case "quality":
      return <QualityPage />;
    case "medical":
      return <MedicalPage />;
    case "industries":
      return <IndustriesPage />;
    case "contact":
      return <ContactPage />;
    case "privacy":
      return <LegalPage type="privacy" />;
    case "terms":
      return <LegalPage type="terms" />;
    case "admin":
      return <AdminPage />;
    default:
      return <NotFoundPage />;
  }
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const route = getRoute(pathname);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <PageContent route={route} />
      </main>
      <Footer />
    </div>
  );
}

export default App;