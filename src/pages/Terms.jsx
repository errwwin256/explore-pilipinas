import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#1a9074] to-[#0d5948] text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Terms & Conditions
          </h1>
          <p className="text-sm opacity-80 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="prose prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By using <strong>Explore Pilipinas</strong> (the "Website"), you
              accept and agree to be bound by these Terms. If you disagree with
              any part, please do not use the Website.
            </p>
            <br />
            <h2>2. Content & Usage</h2>
            <p>
              All website content (text, images, code, layout) is protected by
              copyright. You may view, share or link to public pages, but do not
              copy or republish content without permission.
            </p>
            <br />
            <h2>3. User Submissions</h2>
            <p>
              Submissions via forms must not infringe rights or laws. We may
              remove, edit or refuse any submission.
            </p>
            <br />
            <h2>4. Advertisements & Third-Party Services</h2>
            <p>
              The website may contain third-party advertising (e.g., Google
              AdSense). We are not responsible for their content or policies.
            </p>
            <br />
            <h2>5. Website Availability</h2>
            <p>
              We strive for continuous availability but do not guarantee
              uninterrupted access. We are not liable for outages or data loss.
            </p>
            <br />
            <h2>6. Limitation of Liability</h2>
            <p>
              To the extent permitted by law, <strong>Explore Pilipinas</strong>{" "}
              is not liable for indirect, incidental, or consequential damages.
            </p>
            <br />
            <h2>7. Changes to Terms</h2>
            <p>
              We may modify or replace these Terms. Updated Terms will be posted
              here. Continued use after changes means you accept them.
            </p>
            <br />
            <h2>8. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of the Republic of the
              Philippines. Disputes will be resolved in Philippine courts.
            </p>
            <br />
            <h2>9. Contact Information</h2>
            <p>
              Questions about these Terms: <br />
              <strong>erwingalura25@gmail.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
