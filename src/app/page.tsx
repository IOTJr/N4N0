const proofPoints = [
  {
    label: "No-shows",
    value: "-25%",
    detail: "Reminder sequences, deposits, and confirmations.",
  },
  {
    label: "Response time",
    value: "< 60 sec",
    detail: "Instant intake for every web or social lead.",
  },
  {
    label: "Admin hours",
    value: "10+ hrs",
    detail: "Less manual follow-up for the front desk each week.",
  },
];

const services = [
  {
    title: "Growth Audit",
    description:
      "Map the booking funnel, identify leaks, and prioritize the changes that recover lost revenue fastest.",
    bullets: ["Funnel review", "No-show analysis", "Conversion leaks", "ROI roadmap"],
  },
  {
    title: "AI Intake",
    description:
      "Capture leads instantly, qualify the request, and route edge cases to your team with the right context.",
    bullets: ["Web chat", "IG / FB leads", "Qualification rules", "Human handoff"],
  },
  {
    title: "Automation Ops",
    description:
      "Connect booking, deposits, reminders, reviews, and reactivation into one reliable operating system.",
    bullets: ["Booking flows", "Deposits", "Follow-up", "Reporting"],
  },
];

const processSteps = [
  "Lead arrives from web, search, or social.",
  "AI asks the right intake questions and filters the request.",
  "Patient books, pays a deposit, or is handed to staff.",
  "Confirmation and reminder sequences reduce no-shows.",
  "Post-visit follow-up drives reviews and reactivation.",
];

const useCases = [
  {
    title: "Dental clinics",
    points: ["New patient booking", "Treatment consult routing", "Inactive patient reactivation"],
  },
  {
    title: "Med spas",
    points: ["Consult qualification", "Membership follow-up", "Upsell and retention flows"],
  },
];

export default function Home() {
  return (
    <div className="site-shell min-h-screen text-slate-50">
      <div className="container mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <header className="nav-shell mb-10 flex items-center justify-between gap-6 rounded-full px-5 py-4">
          <a href="#top" className="brand flex items-center gap-3">
            <span className="brand-mark">N4N0</span>
            <span className="hidden sm:block">
              <span className="block text-sm font-medium text-slate-100">Booking + acquisition system</span>
              <span className="block text-xs text-slate-400">Dental clinics and med spas</span>
            </span>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <a href="#services" className="nav-link">Services</a>
            <a href="#process" className="nav-link">Process</a>
            <a href="/booking" className="nav-link">Demo</a>
          </nav>

          <a href="/booking" className="button button-primary">Book a demo</a>
        </header>

        <main id="top" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-8">
            <div className="pill">Automate intake, booking, and follow-up</div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Book more patients. Cut no-shows. Keep the front desk focused.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                N4N0 is a lightweight operating system for dental clinics and med spas. It captures leads, qualifies requests, routes complex cases, and keeps the entire follow-up loop moving without adding manual work.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a href="/booking" className="button button-primary">Get a free audit</a>
              <a href="#process" className="button button-secondary">See the workflow</a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <article key={point.label} className="metric-card">
                  <span className="metric-label">{point.label}</span>
                  <strong className="metric-value">{point.value}</strong>
                  <p className="metric-detail">{point.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="orb orb-one" aria-hidden="true" />
            <div className="orb orb-two" aria-hidden="true" />
            <div className="panel-card stack-top">
              <div className="panel-header">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Live workflow</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">One flow from lead to reactivation</h2>
              </div>

              <div className="mt-8 space-y-3">
                {processSteps.slice(0, 4).map((step, index) => (
                  <div key={step} className="workflow-row">
                    <span className="workflow-index">0{index + 1}</span>
                    <p className="workflow-text">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">This week</p>
                    <p className="text-xl font-semibold text-white">Booking pipeline health</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Lead-to-book</p>
                    <p className="text-2xl font-semibold text-emerald-300">68%</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-300">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <div className="stat-chip">New</div>
                    <div className="mt-2 text-lg font-semibold text-white">42</div>
                    <div>Leads</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <div className="stat-chip">Booked</div>
                    <div className="mt-2 text-lg font-semibold text-white">29</div>
                    <div>Appointments</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <div className="stat-chip">Saved</div>
                    <div className="mt-2 text-lg font-semibold text-white">11</div>
                    <div>No-shows</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section id="services" className="section-shell mt-16">
          <div className="section-heading">
            <p className="section-kicker">Services</p>
            <h2 className="section-title">Three building blocks that turn attention into appointments.</h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{service.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-200">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="bullet-row">{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section-shell mt-16">
          <div className="section-heading">
            <p className="section-kicker">Process</p>
            <h2 className="section-title">Simple enough for staff, reliable enough to run every day.</h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {processSteps.map((step, index) => (
              <article key={step} className="process-card">
                <div className="process-step">0{index + 1}</div>
                <p className="mt-4 text-sm leading-7 text-slate-200">{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="section-shell">
            <div className="section-heading">
              <p className="section-kicker">Use cases</p>
              <h2 className="section-title">Built for clinics that need more booked visits, not more software.</h2>
            </div>

            <div className="mt-8 space-y-4">
              {useCases.map((item) => (
                <div key={item.title} className="usecase-card">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {item.points.map((point) => (
                      <li key={point} className="bullet-row">{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          <article id="contact" className="section-shell contact-shell">
            <div className="section-heading">
              <p className="section-kicker">Contact</p>
              <h2 className="section-title">If the current booking flow is leaking revenue, start with a quick audit.</h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="contact-card">
                <p className="text-sm text-slate-400">Email</p>
                <a className="mt-2 block text-lg font-semibold text-white" href="mailto:hello@yourdomain.com">hello@yourdomain.com</a>
              </div>
              <div className="contact-card">
                <p className="text-sm text-slate-400">Phone / WhatsApp</p>
                <a className="mt-2 block text-lg font-semibold text-white" href="tel:+10000000000">+1 (000) 000-0000</a>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/10 bg-cyan-300/5 p-5 text-sm leading-7 text-slate-300">
              Use this section to route qualified leads to a discovery call, and keep the rest of the visitors moving toward a helpful next step.
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/booking" className="button button-primary">Book a demo</a>
              <a href="#services" className="button button-secondary">Review services</a>
            </div>
          </article>
        </section>

        <footer className="mt-16 flex flex-col gap-3 border-t border-white/8 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 N4N0. Booking + acquisition systems for service businesses.</p>
          <p>Remote / Worldwide</p>
        </footer>
      </div>
    </div>
  );
}
