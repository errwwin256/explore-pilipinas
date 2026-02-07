import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#1a9074] to-[#0d5948] text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm opacity-80 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="prose prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>Explore Pilipinas</strong> ("we", "us", "our").
              We are committed to protecting your privacy when you visit and use
              our website. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information.
            </p>
            <br />
            <h2>2. Information We Collect</h2>
            <ul>
              <li>
                <strong>Automatic Data:</strong> Device + usage logs collected
                automatically (IP, browser, etc.).
              </li>
              <li>
                <strong>Cookies & Tracking:</strong> Cookies, web beacons and
                similar technologies for analytics and ads.
              </li>
              <li>
                <strong>User-Provided Data:</strong> Contact form details (name,
                email, message) you submit voluntarily.
              </li>
            </ul>
            <br />
            <h2>3. Use of Data</h2>
            <ul>
              <li>Operate, maintain and improve the website</li>
              <li>Provide communications and respond to inquiries</li>
              <li>Analyze trends and user behaviour</li>
              <li>Deliver personalized advertising via third-party partners</li>
              <li>Comply with legal obligations</li>
            </ul>
            <br />
            <h2>4. Cookies & Advertising</h2>
            <p>
              We use third-party ad networks (e.g., Google AdSense) that may use
              cookies and similar technologies to serve personalized ads. You
              can opt-out via Google Ads Settings or disable cookies in your
              browser, though that may reduce site functionality.
            </p>
            <br />
            <h2>5. COPPA & Minors</h2>
            <p>
              Explore Pilipinas is not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              we become aware that a child under 13 has provided personal data,
              we will delete it.
            </p>
            <br />
            <h2>6. Data Retention</h2>
            <p>
              Personal information (e.g. contact submissions) is retained only
              as long as necessary to fulfill the purpose or as required by law.
            </p>
            <br />
            <h2>7. Your Rights (GDPR)</h2>
            <p>
              If you are located in a jurisdiction with data protection laws
              (e.g. GDPR) you may have rights:
            </p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Object to processing or request restriction</li>
              <li>Request data portability</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p>
              To exercise these rights, email{" "}
              <strong>erwingalura25@gmail.com</strong>.
            </p>
            <br />
            <h2>8. Third-Party Links & Services</h2>
            <p>
              We may link to third-party sites. We are not responsible for their
              privacy practices — please review their policies.
            </p>
            <br />
            <h2>9. Security</h2>
            <p>
              We apply reasonable technical and organizational measures to
              protect your information. No method is 100% secure.
            </p>
            <br />
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this policy. We'll post changes on this page and
              update the "Last updated" date.
            </p>
            <br />
            <h2>11. Contact Us</h2>
            <p>
              Questions or requests regarding privacy: <br />
              <strong>erwingalura25@gmail.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
