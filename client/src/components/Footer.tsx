import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CheckCircle2,
    AlertCircle,
    Smartphone,
    ShieldCheck,
    Truck,
    CreditCard,
    Gift,
    Headphones,
    Award
} from "lucide-react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setSubscribeError("Please enter your email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setSubscribeError("Please enter a valid email address.");
            return;
        }

        try {
            setIsSubscribing(true);
            setSubscribeError("");

            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 5000);

        } catch (error) {
            setSubscribeError("Unable to subscribe. Please try again.");
        } finally {
            setIsSubscribing(false);
        }
    };

    const footerLinks = {
        about: [
            { name: "About Us", href: "/about" },
            { name: "Contact Us", href: "/contact" },
            { name: "Careers", href: "/careers" },
            { name: "Become an Affiliate", href: "/affiliate" },
            { name: "Our Blog", href: "/blog" },
            { name: "Terms of Use", href: "/terms" },
        ],
        buying: [
            { name: "Buyer Safety Centre", href: "/safety" },
            { name: "FAQs", href: "/faqs" },
            { name: "Delivery Information", href: "/delivery" },
            { name: "Return Policy", href: "/returns" },
            { name: "Bulk Purchase", href: "/bulk" },
        ],
        more: [
            { name: "Site Map", href: "/sitemap" },
            { name: "Track My Order", href: "/track-order" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Authentic Items Policy", href: "/authentic" },
        ],
    };

    const paymentMethods = [
        { name: "Visa", icon: <CreditCard size={20} /> },
        { name: "Mastercard", icon: <CreditCard size={20} /> },
        { name: "Verve", icon: <CreditCard size={20} /> },
        { name: "KongaPay", icon: <ShieldCheck size={20} /> },
        { name: "Wallet", icon: <Gift size={20} /> },
    ];

    // Social links with SVG icons (since lucide-react doesn't have them)
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

    const currentYear = new Date().getFullYear();

    // Phone numbers for WhatsApp
    const phoneNumbers = [
        { number: "07034502399", label: "07034502399" },
        { number: "09061189594", label: "09061189594" },
    ];

    return (
        <footer className="site-footer">

            {/* =================================================
                TOP SECTION – Support + Newsletter
            ================================================= */}

            <div className="footer-top">

                <div className="footer-container">

                    {/* Support */}
                    <div className="footer-support">

                        <h3>Customer Support</h3>

                        <div className="footer-support-item">
                            <Mail size={18} />
                            <div>
                                <span>Email</span>
                                <a href="mailto:help@obaaratech.com">help@obaaratech.com</a>
                            </div>
                        </div>

                        <div className="footer-support-item">
                            <Phone size={18} />
                            <div>
                                <span>WhatsApp / Phone</span>
                                <div className="footer-phone-numbers">
                                    {phoneNumbers.map((p, index) => (
                                        <a
                                            key={index}
                                            href={`https://wa.me/234${p.number.replace(/^0/, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="footer-whatsapp-link"
                                        >
                                            <span className="whatsapp-icon">💬</span>
                                            {p.label}
                                            {index < phoneNumbers.length - 1 && <span className="phone-separator">, </span>}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="footer-support-item">
                            <MapPin size={18} />
                            <div>
                                <span>Address</span>
                                <span>Lagos, Nigeria</span>
                            </div>
                        </div>

                    </div>

                    {/* Newsletter */}
                    <div className="footer-newsletter">

                        <h3>Get Latest Deals</h3>

                        <p>Our best promotions sent to your inbox.</p>

                        <form className="footer-newsletter-form" onSubmit={handleSubscribe}>

                            <div className={`footer-newsletter-input ${subscribeError ? "error" : ""}`}>
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setSubscribeError("");
                                    }}
                                    disabled={isSubscribing || subscribed}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubscribing || subscribed}
                                >
                                    {isSubscribing ? (
                                        "Sending..."
                                    ) : subscribed ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>

                            {subscribeError && (
                                <span className="footer-newsletter-error">
                                    <AlertCircle size={14} />
                                    {subscribeError}
                                </span>
                            )}

                            {subscribed && (
                                <span className="footer-newsletter-success">
                                    <CheckCircle2 size={14} />
                                    Subscribed successfully!
                                </span>
                            )}

                        </form>

                    </div>

                </div>

            </div>

            {/* =================================================
                MIDDLE SECTION – Links
            ================================================= */}

            <div className="footer-middle">

                <div className="footer-container">

                    {/* About */}
                    <div className="footer-links">
                        <h4>About Obaaratech</h4>
                        <ul>
                            {footerLinks.about.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Buying */}
                    <div className="footer-links">
                        <h4>Buying on Obaaratech</h4>
                        <ul>
                            {footerLinks.buying.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* More Info */}
                    <div className="footer-links">
                        <h4>More Info</h4>
                        <ul>
                            {footerLinks.more.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Payment Methods */}
                    <div className="footer-payment">

                        <h4>Payment Methods</h4>

                        <div className="footer-payment-icons">
                            {paymentMethods.map((method) => (
                                <div key={method.name} className="footer-payment-icon">
                                    {method.icon}
                                    <span>{method.name}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                BOTTOM SECTION – App Download + Social + Copyright
            ================================================= */}

            <div className="footer-bottom">

                <div className="footer-container">

                    {/* App Download */}
                    <div className="footer-app">

                        <div className="footer-app-content">
                            <Smartphone size={24} />
                            <div>
                                <strong>Download & Shop on the Go</strong>
                                <span>Download the Obaaratech App</span>
                            </div>
                        </div>

                        <div className="footer-app-buttons">
                            <a href="#" className="footer-app-btn">
                                <span>Coming Soon</span>
                                <span>Google Play Store</span>
                            </a>
                            <a href="#" className="footer-app-btn">
                                <span>Coming Soon</span>
                                <span>App Store</span>
                            </a>
                        </div>

                    </div>

                    {/* Social Links */}
                    <div className="footer-social">

                        <span>Connect with us</span>

                        <div className="footer-social-icons">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className={`footer-social-icon ${social.name.toLowerCase()}`}
                                    style={{ color: social.color }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                COPYRIGHT
            ================================================= */}

            <div className="footer-copyright">

                <div className="footer-container">

                    <p>
                        Copyright &copy; {currentYear} Obaaratech Community Marketplace.
                        All rights reserved.
                    </p>

                    <div className="footer-trust-badges">
                        <span>
                            <ShieldCheck size={14} />
                            Secure Checkout
                        </span>
                        <span>
                            <Truck size={14} />
                            Fast Delivery
                        </span>
                        <span>
                            <Headphones size={14} />
                            24/7 Support
                        </span>
                        <span>
                            <Award size={14} />
                            Trusted Marketplace
                        </span>
                    </div>

                </div>

            </div>

        </footer>
    );
}