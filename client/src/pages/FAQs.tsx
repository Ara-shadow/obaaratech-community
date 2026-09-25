import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const faqs = [
    {
        category: "General",
        questions: [
            {
                q: "What is Obaaratech?",
                a: "Obaaratech is Nigeria's community marketplace where you can buy, sell, and connect with people in your local community. From products and services to job opportunities, we bring commerce closer to you."
            },
            {
                q: "Is Obaaratech free to use?",
                a: "Yes! Creating an account and browsing listings is completely free. We charge a small commission only when you make a successful sale."
            },
            {
                q: "How do I create an account?",
                a: "Simply click the 'Register' button at the top right, fill in your details, and you're ready to start buying and selling."
            },
        ]
    },
    {
        category: "Buying",
        questions: [
            {
                q: "How do I buy an item?",
                a: "Browse listings, find what you like, click 'Add to Cart' or 'Buy Now', and follow the checkout process to complete your purchase."
            },
            {
                q: "What payment methods are accepted?",
                a: "We accept payments via Flutterwave, including card payments, bank transfers, USSD, and other secure payment methods."
            },
            {
                q: "Is my payment secure?",
                a: "Absolutely! All payments are processed securely through Flutterwave. We never store your card details."
            },
        ]
    },
    {
        category: "Selling",
        questions: [
            {
                q: "How do I list an item?",
                a: "Click 'Sell' in the header, fill in the listing details, add photos, and publish. Your listing will be live for buyers to find."
            },
            {
                q: "How much does it cost to sell?",
                a: "We charge a small commission only when your item sells. The commission rate varies based on your seller plan."
            },
            {
                q: "How do I get paid?",
                a: "Once your item sells and the buyer confirms delivery, the funds are released to your Obaaratech wallet. You can then request a settlement to your bank account."
            },
        ]
    },
    {
        category: "Delivery",
        questions: [
            {
                q: "How does delivery work?",
                a: "Delivery arrangements are made directly between buyers and sellers. We recommend using a reliable courier service for safe delivery."
            },
            {
                q: "Can I track my order?",
                a: "Yes! You can track your order status in your account dashboard under 'Orders'."
            },
        ]
    },
];

export default function FAQs() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const filteredFAQs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div className="static-page">
            <div className="static-page-container">
                <h1>Frequently Asked Questions</h1>
                <p className="static-page-subtitle">Find answers to the most common questions</p>

                <div className="faqs-search">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")}>✕</button>
                    )}
                </div>

                <div className="faqs-list">
                    {filteredFAQs.length === 0 ? (
                        <div className="faqs-empty">
                            <p>No FAQs found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        filteredFAQs.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="faqs-category">
                                <h2>{category.category}</h2>

                                {category.questions.map((faq, index) => {
                                    const globalIndex = faqs.reduce((acc, c, i) => {
                                        if (i < categoryIndex) return acc + c.questions.length;
                                        return acc;
                                    }, 0) + index;

                                    const isExpanded = expandedIndex === globalIndex;

                                    return (
                                        <div key={index} className="faqs-item">
                                            <button
                                                className={`faqs-question ${isExpanded ? "expanded" : ""}`}
                                                onClick={() => toggleFAQ(globalIndex)}
                                            >
                                                <span>{faq.q}</span>
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                            {isExpanded && (
                                                <div className="faqs-answer">
                                                    <p>{faq.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}