import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageCircle, Clock, Smartphone } from "lucide-react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubmitted(true);
            setForm({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setSubmitted(false), 5000);

        } catch (error) {
            setError("Unable to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Phone numbers
    const phoneNumbers = [
        { number: "07034502399", label: "07034502399" },
        { number: "09061189594", label: "09061189594" },
    ];

    const contactInfo = [
        {
            icon: <Mail size={20} />,
            label: "Email",
            value: "help@obaaratech.com",
            href: "mailto:help@obaaratech.com"
        },
        {
            icon: <Phone size={20} />,
            label: "WhatsApp / Phone",
            value: phoneNumbers.map(p => p.label).join(", "),
            href: null,
            isWhatsApp: true
        },
        {
            icon: <MapPin size={20} />,
            label: "Address",
            value: "Lagos, Nigeria",
            href: null
        },
        {
            icon: <Clock size={20} />,
            label: "Business Hours",
            value: "Mon–Fri: 8:00 AM – 6:00 PM",
            href: null
        },
    ];

    // Social links with SVG icons
    const socialLinks = [
        { 
            name: "Facebook", 
            icon: (
                <svg className="social-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            ),
            href: "https://facebook.com", 
            color: "#1877f2" 
        },
        { 
            name: "Twitter", 
            icon: (
                <svg className="social-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
            ),
            href: "https://twitter.com", 
            color: "#1da1f2" 
        },
        { 
            name: "Instagram", 
            icon: (
                <svg className="social-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            ),
            href: "https://instagram.com", 
            color: "#e4405f" 
        },
        { 
            name: "LinkedIn", 
            icon: (
                <svg className="social-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            ),
            href: "https://linkedin.com", 
            color: "#0a66c2" 
        },
        { 
            name: "YouTube", 
            icon: (
                <svg className="social-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
            ),
            href: "https://youtube.com", 
            color: "#ff0000" 
        },
    ];

    return (
        <div className="static-page">
            <div className="static-page-container">
                <h1>Contact Us</h1>
                <p className="static-page-subtitle">We'd love to hear from you</p>

                <div className="contact-layout">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Have questions? Reach out to us – we're here to help.</p>

                        <div className="contact-info-list">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="contact-info-item">
                                    <div className="contact-info-icon">{item.icon}</div>
                                    <div>
                                        <span>{item.label}</span>
                                        {item.href ? (
                                            <a href={item.href}>{item.value}</a>
                                        ) : item.isWhatsApp ? (
                                            <div className="contact-whatsapp-numbers">
                                                {phoneNumbers.map((p, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`https://wa.me/234${p.number.replace(/^0/, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="contact-whatsapp-link"
                                                    >
                                                        <span className="whatsapp-icon">💬</span>
                                                        {p.label}
                                                        {idx < phoneNumbers.length - 1 && <span className="phone-separator">, </span>}
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <strong>{item.value}</strong>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="contact-social">
                            <span>Connect with us:</span>
                            <div className="contact-social-icons">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className={`contact-social-icon ${social.name.toLowerCase()}`}
                                        style={{ color: social.color }}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        <h2>Send Us a Message</h2>

                        {submitted && (
                            <div className="contact-message success">
                                <CheckCircle2 size={18} />
                                <span>Your message has been sent successfully!</span>
                            </div>
                        )}

                        {error && (
                            <div className="contact-message error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="contact-form-group">
                                <label htmlFor="contact-name">Your Name <span className="required">*</span></label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Full name"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="contact-form-group">
                                <label htmlFor="contact-email">Email Address <span className="required">*</span></label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="contact-form-group">
                                <label htmlFor="contact-subject">Subject</label>
                                <input
                                    id="contact-subject"
                                    type="text"
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    placeholder="Brief subject"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="contact-form-group">
                                <label htmlFor="contact-message">Message <span className="required">*</span></label>
                                <textarea
                                    id="contact-message"
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="How can we help you?"
                                    rows={5}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button type="submit" className="contact-submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}