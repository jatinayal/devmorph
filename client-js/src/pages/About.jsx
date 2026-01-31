import React from 'react'

const About = () => {
  return (
    <section className="
      relative
      min-h-screen
      bg-black
      text-white
      mt-10
      px-6
      py-24
      overflow-hidden
      font-poppins
    ">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-lime-400/10 blur-[180px]" />
      </div>

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="
            inline-block
            text-lime-400
            text-sm
            font-bold
            uppercase
            tracking-widest
            mb-4
          ">
            About DevMorph
          </span>

          <h1 className="
            text-4xl md:text-6xl
            font-bold
            leading-tight
          ">
            Building the future of
            <br className="hidden md:block" />
            website creation with AI
          </h1>

          <p className="
            mt-6
            text-white/60
            text-base md:text-lg
            max-w-2xl
            mx-auto
          ">
            DevMorph empowers creators, developers, and founders to transform
            ideas into real, production-ready websites — faster than ever.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Our Mission
            </h2>
            <p className="text-white/70 leading-relaxed">
              We believe building for the web should be intuitive, creative, and
              accessible. DevMorph removes friction from the process by combining
              AI generation, visual editing, and real-time previews — all in one
              seamless workflow.
            </p>
          </div>

          <div className="
            rounded-3xl
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            p-8
          ">
            <ul className="space-y-4 text-white/80 text-sm">
              <li>• Turn prompts into real websites</li>
              <li>• Edit visually, not painfully</li>
              <li>• Test responsiveness instantly</li>
              <li>• Own your code, always</li>
            </ul>
          </div>
        </div>

        {/* Why DevMorph */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Why DevMorph?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'AI-First',
                desc: 'Generate complete websites from natural language prompts.'
              },
              {
                title: 'Visual Editing',
                desc: 'Click, select, and edit elements directly inside the preview.'
              },
              {
                title: 'Production Ready',
                desc: 'Clean HTML, Tailwind styling, responsive by default.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  bg-white/5
                  backdrop-blur-xl
                  border border-white/10
                  p-6
                  hover:border-lime-400/40
                  transition
                "
              >
                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Our Vision
          </h2>
          <p className="text-white/70 leading-relaxed">
            We’re building a future where anyone can create for the web —
            founders launching fast, developers iterating visually, and creators
            focusing on ideas instead of boilerplate.
          </p>
        </div>

      </div>
    </section>
  )
}

export default About
