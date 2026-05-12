export default function Home() {
  return (
    <div className="site-shell min-h-screen text-slate-100">
      <div className="site-glow" />
      <div className="container relative mx-auto px-6 py-10 lg:px-14 lg:py-14">
        <header className="panel-shell mb-10 flex flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-7">
          <div className="flex items-center gap-3">
            <div className="logo-chip">N4N0</div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sky-200/90">Growth Operating System</p>
              <p className="text-sm text-slate-300">Dental Clinics and Med Spas</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <a href="/booking" className="button button-primary">Book a Demo</a>
            <a href="/free-audit" className="button button-secondary">Get a Free Audit</a>
            <a href="/admin/login" className="button button-secondary">Admin Portal</a>
          </nav>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="space-y-7">
            <div className="space-y-4">
              <p className="section-kicker">Revenue Intelligence + Automation</p>
              <h1 className="hero-title max-w-2xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Professional patient growth infrastructure for modern clinics.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                N4N0 combines intake automation, booking optimization, reminders, and retention campaigns into one high-conversion pipeline your front desk can trust.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="/booking" className="button button-primary">Book a Live Walkthrough</a>
              <a href="/free-audit" className="button button-secondary">Get a Free Audit</a>
            </div>

            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Deployment marker: May 12, 2026 R2</p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <span className="stat-value">-34%</span>
                <span className="stat-label">Average no-show reduction</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">2.3x</span>
                <span className="stat-label">Faster first-contact response</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">12h</span>
                <span className="stat-label">Typical implementation kickoff</span>
              </div>
            </div>
          </section>

          <section className="panel-shell p-6 lg:p-7">
            <h2 className="text-xl font-semibold text-white">Operational flow built for healthcare teams</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p className="flow-item">Lead capture from ads, website, socials, and referrals</p>
              <p className="flow-item">AI pre-qualification and intelligent triage</p>
              <p className="flow-item">Scheduling with optional deposits for high intent</p>
              <p className="flow-item">Reminder orchestration to reduce drop-offs</p>
              <p className="flow-item">Post-visit nurtures, reviews, and reactivation</p>
            </div>
            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-4 text-sm text-cyan-50">
              Includes KPI dashboarding for booking velocity, no-show ratios, and campaign attribution.
            </div>
          </section>
        </main>

        <section id="offers" className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="panel-shell p-6 lg:p-7">
            <h3 className="text-2xl font-semibold text-white">Foundation Tier</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-sky-200">For single-location clinics</p>
            <div className="mt-5 space-y-2">
              <p className="price-line">Setup fee: <strong>$750</strong></p>
              <p className="price-line">Monthly maintenance retainer: <strong>$150/mo</strong></p>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              <li>AI intake and booking flow configuration</li>
              <li>Reminder automation and no-show prevention setup</li>
              <li>Monthly maintenance, patching, and optimization</li>
              <li>Email support during business hours</li>
            </ul>
          </article>

          <article className="panel-shell panel-highlight p-6 lg:p-7">
            <h3 className="text-2xl font-semibold text-white">Scale Tier</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-amber-200">For multi-location or high-volume teams</p>
            <div className="mt-5 space-y-2">
              <p className="price-line">Setup fee: <strong>$1,750</strong></p>
              <p className="price-line">Monthly maintenance retainer: <strong>$450/mo</strong></p>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              <li>Advanced workflow customization and integrations</li>
              <li>Priority support and faster response SLA</li>
              <li>Weekly monitoring and security patch cadence</li>
              <li>Quarterly strategy tuning and conversion reviews</li>
            </ul>
          </article>
        </section>

        <section className="mt-12 panel-shell p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-white">Need a custom proposal?</h3>
              <p className="mt-2 text-slate-300">Start with a free audit and we will map your current leaks and fastest ROI path.</p>
            </div>
            <a href="/free-audit" className="button button-primary">Start Free Audit</a>
          </div>
        </section>

        <footer className="mt-12 pb-4 text-center text-sm text-slate-400">
          <p>Email: rohajohn54@gmail.com | WhatsApp: +254723178444</p>
          <p className="mt-2">Remote and worldwide delivery</p>
        </footer>
      </div>
    </div>
  );
}
