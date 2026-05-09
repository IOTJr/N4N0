export default function Home() {
  return (
    <div className="min-h-screen bg-cyber flex items-center justify-center text-slate-50">
      <div className="container mx-auto px-6 lg:px-24 py-24">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6EE7F3]/40 to-[#7C3AED]/30 backdrop-blur-sm border border-white/[.06] flex items-center justify-center shadow-glow">
              <span className="font-semibold text-lg">[N4N0]</span>
            </div>
            <div>
              <div className="text-sm text-slate-300">Booking + Acquisition System</div>
              <div className="text-xs text-slate-400">Remote / Worldwide</div>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/booking" className="btn-primary">Book a Demo</a>
            <a href="#audit" className="btn-ghost">Get a Free Audit</a>
          </nav>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <section>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
              Book More Patients. Cut No-Shows. Automate Growth.
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-xl">
              For Dental Clinics and Med Spas — a plug-and-play booking + customer acquisition + no-show reduction system that automates intake, qualification, deposits, reminders and reactivation while handing complex cases to your team.
            </p>

            <div className="mt-8 flex gap-4">
              <a href="/booking" className="btn-cta">Book a Demo</a>
              <a href="#audit" className="btn-outline">Get a Free Audit</a>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card">
                <div className="text-xs text-slate-300">No-show reduction</div>
                <div className="font-semibold text-white">[ADD REAL METRIC HERE]</div>
              </div>
              <div className="glass-card">
                <div className="text-xs text-slate-300">Booking uplift</div>
                <div className="font-semibold text-white">[ADD REAL METRIC HERE]</div>
              </div>
              <div className="glass-card">
                <div className="text-xs text-slate-300">Staff time saved</div>
                <div className="font-semibold text-white">[ADD REAL METRIC HERE]</div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="scene">
              <div className="card-3d glass p-8">
                <h3 className="text-xl font-semibold mb-4">How it works — at a glance</h3>
                <ol className="space-y-3 text-slate-300">
                  <li>1. Lead capture (web, IG, FB, Google)</li>
                  <li>2. AI intake & qualification</li>
                  <li>3. Automated booking + optional deposit</li>
                  <li>4. Multi-step reminders to reduce no-shows</li>
                  <li>5. Post-visit follow-up & reviews</li>
                  <li>6. Reactivation campaigns and reporting</li>
                </ol>
                <div className="mt-6 text-sm text-slate-400">Special cases are routed to your human assistant automatically.</div>
              </div>

              <div className="workflow shadow-2xl">
                <svg viewBox="0 0 600 200" className="w-full h-40">
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity=".8" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity=".8" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="10" width="140" height="40" rx="8" fill="url(#g)" />
                  <text x="20" y="35" fill="#fff" fontSize="12">Landing</text>
                  <rect x="160" y="10" width="140" height="40" rx="8" fill="#111827" opacity=".5" />
                  <text x="180" y="35" fill="#fff" fontSize="12">Intake (AI)</text>
                  <rect x="320" y="10" width="140" height="40" rx="8" fill="#111827" opacity=".5" />
                  <text x="340" y="35" fill="#fff" fontSize="12">Booking</text>
                  <rect x="100" y="80" width="140" height="40" rx="8" fill="#111827" opacity=".5" />
                  <text x="120" y="105" fill="#fff" fontSize="12">Deposit</text>
                  <rect x="260" y="80" width="140" height="40" rx="8" fill="#111827" opacity=".5" />
                  <text x="280" y="105" fill="#fff" fontSize="12">Reminders</text>
                </svg>
              </div>
            </div>
          </section>
        </main>

        <section id="audit" className="mt-16 p-8 glass-section">
          <h2 className="text-2xl font-bold mb-4">What we offer</h2>
          <p className="text-slate-300 max-w-3xl">Business Audit • AI Implementation • Workflow Automation</p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="service-card">
              <h4 className="font-semibold">Business Audit</h4>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>- Funnel + operations audit</li>
                <li>- Conversion leak detection</li>
                <li>- No-show root causes</li>
                <li>- ROI opportunities</li>
              </ul>
              <div className="mt-3 text-sm text-slate-400">Outcome: Clear action plan to recover bookings.</div>
            </div>

            <div className="service-card">
              <h4 className="font-semibold">AI Implementation</h4>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>- AI assistant/chat intake</li>
                <li>- Lead qualification logic</li>
                <li>- Scripts & prompt library</li>
                <li>- Handoff rules</li>
              </ul>
              <div className="mt-3 text-sm text-slate-400">Outcome: Faster responses and fewer missed leads.</div>
            </div>

            <div className="service-card">
              <h4 className="font-semibold">Workflow Automation</h4>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>- Booking & deposit flows</li>
                <li>- Reminders & follow-ups</li>
                <li>- Reviews & reactivation</li>
                <li>- Reporting dashboard</li>
              </ul>
              <div className="mt-3 text-sm text-slate-400">Outcome: Lower admin load and measurable ROI.</div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-xl font-bold mb-4">Use cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card">
              <h5 className="font-semibold">Dental Clinics</h5>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>- New patient flows</li>
                <li>- Reactivation of inactive patients</li>
                <li>- Treatment consult flows + reminders</li>
              </ul>
            </div>
            <div className="glass-card">
              <h5 className="font-semibold">Med Spas</h5>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>- Consult booking & qualification</li>
                <li>- Memberships & upsell workflows</li>
                <li>- Retention follow-ups</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 p-8 glass-section">
          <h3 className="text-xl font-bold">Case studies & Projects</h3>
          <p className="text-slate-300 mt-3">(Placeholders — fill with real results)</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-compact">
              <div className="text-sm text-slate-400">Clinic type: [DENTAL CLINIC TYPE]</div>
              <div className="font-semibold mt-2">Problem: [ADD PROBLEM]</div>
              <div className="text-sm text-slate-300 mt-1">Solution: [ADD SOLUTION]</div>
              <div className="text-sm text-slate-300 mt-2">Result: [ADD REAL RESULT]</div>
            </div>

            <div className="card-compact">
              <div className="text-sm text-slate-400">Clinic type: [MED SPA TYPE]</div>
              <div className="font-semibold mt-2">Problem: [ADD PROBLEM]</div>
              <div className="text-sm text-slate-300 mt-1">Solution: [ADD SOLUTION]</div>
              <div className="text-sm text-slate-300 mt-2">Result: [ADD REAL RESULT]</div>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center text-sm text-slate-400">
          <div>Contact</div>
          <div>Email: rohajohn54@gmail.com • WhatsApp/Phone: +254723178444</div>
          <div className="mt-3">Location served: Remote / Worldwide</div>
        </footer>
      </div>
    </div>
  );
}
