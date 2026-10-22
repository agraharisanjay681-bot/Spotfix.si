import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { Language, translations } from '../translations';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Citizen');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitContactForm({ name, email, phone, role, organization, message });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] border border-[var(--brand-border-subtle)] font-bold text-xs">
          <Mail className="w-4 h-4 text-[var(--brand-accent)]" />
          <span>Contact & Municipal Support</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--brand-text-main)]">
          Get In Touch With <span className="font-bold text-[var(--brand-primary)]">SPOT FIX</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] font-normal">
          Have feedback, municipal partnership requests, or inquiries? Drop us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-[var(--brand-card)] rounded-3xl border border-[var(--brand-border)] p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--brand-text-main)]">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-[var(--brand-text-secondary)] max-w-md mx-auto leading-relaxed">
                Thank you, {name}! Our team and local municipal coordinator have received your inquiry and sent a confirmation acknowledgment.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-semibold text-xs shadow-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--brand-text-main)] mb-2">
                Send Inquiry or Partnership Request
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sanjay Agrahari"
                    className="w-full px-4 py-3 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    I am a...
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-bold focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  >
                    <option value="Citizen">Citizen / Resident</option>
                    <option value="Authority">Municipal Official / Officer</option>
                    <option value="NGO">NGO Volunteer / Student</option>
                    <option value="Media">Media / Press</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--brand-text-main)] block mb-1 text-xs">
                  Gram Panchayat / Organization Name (Optional)
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Rampur Gram Panchayat / Gram Vikas Samiti"
                  className="w-full px-4 py-3 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--brand-text-main)] block mb-1 text-xs">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full p-4 rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message & Notify'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info & Emergency Contacts */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] space-y-4 shadow-theme">
            <h4 className="font-bold text-base flex items-center space-x-2">
              <Phone className="w-5 h-5 text-[var(--brand-accent)]" />
              <span>Municipal Helpline Numbers</span>
            </h4>
            <div className="space-y-2 text-xs opacity-95">
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Civic Control Room:</span>
                <span className="font-bold font-mono">1800-180-2026</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>PWD Road Repair Helpline:</span>
                <span className="font-bold font-mono">1077</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span>Sanitation Emergency:</span>
                <span className="font-bold font-mono">1916</span>
              </div>
              <div className="flex justify-between">
                <span>Support Email:</span>
                <span className="font-bold font-mono">support@spotfix.civic</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] space-y-3 shadow-xs">
            <h4 className="font-bold text-sm text-[var(--brand-text-main)] flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>Frequently Asked Questions</span>
            </h4>
            <div className="space-y-3 text-xs text-[var(--brand-text-secondary)]">
              <div>
                <p className="font-bold text-[var(--brand-text-main)]">Does SPOT FIX require internet?</p>
                <p className="text-[11px] text-[var(--brand-text-muted)] mt-0.5">It supports low-bandwidth networks and saves drafts locally when offline.</p>
              </div>
              <div>
                <p className="font-bold text-[var(--brand-text-main)]">How does SPOT FIX priority work?</p>
                <p className="text-[11px] text-[var(--brand-text-muted)] mt-0.5">Scores 0-100 combine severity, public safety impact, and community upvotes.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
