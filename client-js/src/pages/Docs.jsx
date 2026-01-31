import React from 'react'
import Footer from '../components/Footer'

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'projects', label: 'Projects' },
  { id: 'ai-generation', label: 'AI Generation' },
  { id: 'editor', label: 'Visual Editor' },
  { id: 'preview', label: 'Preview & Devices' },
  { id: 'community', label: 'Community' },
  { id: 'billing', label: 'Plans & Credits' },
  { id: 'faq', label: 'FAQ' }
]

const Docs = () => {
  return (
    <>
    <div className="min-h-screen pt-14 bg-black text-white flex font-poppins">

      {/* Sidebar */}
      <aside className="
        hidden md:flex
        w-72
        flex-col
        border-r border-white/10
        sticky top-16 
        h-screen
        px-6 py-8
        bg-black/60
        backdrop-blur-xl
      ">
        <h2 className="text-lg font-semibold mb-6 text-lime-400">
          Documentation
        </h2>

        <nav className="flex flex-col gap-3 text-sm">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="
                text-white/70
                hover:text-lime-400
                transition
              "
            >
              {section.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 md:px-12 py-16 max-w-4xl">

        {/* INTRO */}
        <section id="intro" className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DevMorph Documentation
          </h1>
          <p className="text-white/70 leading-relaxed">
            DevMorph is an AI-powered website builder that transforms natural
            language prompts into fully functional websites. Design, edit,
            preview, and publish — all in one place.
          </p>
        </section>

        {/* GETTING STARTED */}
        <section id="getting-started" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            Getting Started
          </h2>
          <p className="text-white/70 mb-4">
            Create an account and start building instantly. No setup required.
          </p>
          <ul className="list-disc list-inside text-white/70 space-y-2">
            <li>Sign up or log in</li>
            <li>Enter a website idea</li>
            <li>Generate with AI</li>
            <li>Edit and publish</li>
          </ul>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            Projects
          </h2>
          <p className="text-white/70">
            Every AI generation creates a project. Projects store versions,
            prompts, and revisions so you can roll back anytime.
          </p>
        </section>

        {/* AI GENERATION */}
        <section id="ai-generation" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            AI Generation
          </h2>
          <p className="text-white/70 mb-4">
            Describe your website in natural language. The AI generates:
          </p>
          <ul className="list-disc list-inside text-white/70 space-y-2">
            <li>HTML structure</li>
            <li>Tailwind-based styling</li>
            <li>Responsive layouts</li>
            <li>Accessible components</li>
          </ul>
        </section>

        {/* EDITOR */}
        <section id="editor" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            Visual Editor
          </h2>
          <p className="text-white/70">
            Click any element inside the preview to edit text, classes, spacing, img-src 
            and colors in real time — no manual coding required.
          </p>
        </section>

        {/* PREVIEW */}
        <section id="preview" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            Preview & Devices
          </h2>
          <p className="text-white/70">
            Switch between phone, tablet, and desktop previews. You can also
            resize the viewport horizontally like Chrome DevTools for accurate
            responsive testing.
          </p>
        </section>

        {/* COMMUNITY */}
        <section id="community" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            MorphSpace
          </h2>
          <p className="text-white/70">
            Explore public projects shared by other creators. comment,
            preview, and learn from real builds.
          </p>
        </section>

        {/* BILLING */}
        <section id="billing" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            Plans & Credits
          </h2>
          <p className="text-white/70">
            Each plan provides AI credits. Credits are consumed when generating
            or revising projects. Upgrade anytime from the pricing page.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            FAQ
          </h2>

          <div className="space-y-4 text-white/70">
            <p><strong>Can I export my code?</strong> Yes, full source code is downloadable.</p>
            <p><strong>Can I edit manually?</strong> Yes, visual + code workflows are supported.</p>
            <p><strong>Is DevMorph beginner-friendly?</strong> Absolutely.</p>
          </div>
        </section>

      </main>

    </div>
    <Footer/>
    </>
  )
}

export default Docs
