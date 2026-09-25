import { Link } from "react-router-dom";
import { ShieldCheck, Users, ShoppingBag, Award, Truck, Headphones } from "lucide-react";

export default function About() {
    return (
        <div className="static-page">
            <div className="static-page-container">
                <h1>About Obaaratech</h1>
                <p className="static-page-subtitle">Nigeria's Community Marketplace</p>

                <div className="static-page-content">
                    <section className="static-page-section">
                        <h2>Our Story</h2>
                        <p>
                            Obaaratech was born from a simple idea: to create a trusted platform
                            where Nigerians can buy, sell, and connect with their local community.
                            We believe in the power of community commerce – where transactions
                            are built on trust, transparency, and human connection.
                        </p>
                        <p>
                            From electronics and fashion to services and job opportunities,
                            Obaaratech brings together people and businesses to create a
                            thriving digital marketplace for all Nigerians.
                        </p>
                    </section>

                    <div className="static-page-grid">
                        <div className="static-page-card">
                            <ShieldCheck size={32} className="static-page-card-icon" />
                            <h3>Trust & Safety</h3>
                            <p>Every transaction is protected. We verify sellers and ensure secure payments.</p>
                        </div>

                        <div className="static-page-card">
                            <Users size={32} className="static-page-card-icon" />
                            <h3>Community First</h3>
                            <p>Built for Nigerians, by Nigerians. We put our community at the heart of everything.</p>
                        </div>

                        <div className="static-page-card">
                            <ShoppingBag size={32} className="static-page-card-icon" />
                            <h3>Endless Possibilities</h3>
                            <p>From products to services, find everything you need in one trusted marketplace.</p>
                        </div>

                        <div className="static-page-card">
                            <Award size={32} className="static-page-card-icon" />
                            <h3>Quality Guarantee</h3>
                            <p>We're committed to quality. Every listing is reviewed to ensure authenticity.</p>
                        </div>
                    </div>

                    <div className="static-page-section">
                        <h2>Our Values</h2>
                        <ul className="static-page-list">
                            <li><strong>Integrity:</strong> We operate with honesty and transparency in everything we do.</li>
                            <li><strong>Community:</strong> We empower local businesses and individuals to succeed.</li>
                            <li><strong>Innovation:</strong> We continuously improve to serve our community better.</li>
                            <li><strong>Trust:</strong> We build lasting relationships based on mutual trust and respect.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}