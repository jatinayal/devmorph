
import React from 'react'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

const Contact = () => {
    return (
        <section className="bg-black min-h-screen text-white pt-20">
            {/* Background elements to match theme */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-400/5 blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px]" />
            </div>

            <ContactSection />

            <Footer />
        </section>
    )
}

export default Contact
