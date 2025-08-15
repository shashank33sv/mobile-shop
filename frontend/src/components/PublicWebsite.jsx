import React, { useState, useEffect } from "react";
import axios from "axios";

/* 
  Make sure you have in public/:
    - harish.jpg       (owner image)
    - ceft.jpg         (certification image)
    - favicon.ico      (logo, shown in tab/header)
*/

export default function PublicWebsite({ onAdminLoginClick }) {
  const [activePage, setActivePage] = useState("Sales");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    axios
      .get(`${API_BASE.replace(/\/$/, "")}/public/products`)  // Public products endpoint without auth
      .then(res => {
        const availableProducts = Array.isArray(res.data)
          ? res.data.filter(p => (p.quantity ?? 0) > 0)
          : [];
        setProducts(availableProducts);
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen transition-colors duration-300">
      {/* Header */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-2 sm:mb-0 space-x-3">
            <img
              src="/favicon.png"
              alt="Sri Maruthi Logo"
              className="w-10 h-10 rounded-full border border-blue-200 shadow-sm"
              style={{ objectFit: "cover", background: "#eef" }}
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-900">
                Sri Maruthi Cell Care &amp; Services
              </h1>
              <span className="block text-xs font-medium text-gray-500 tracking-wide">
                Mobile Sales & Service, Shivani
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActivePage("Sales")}
              className={`text-gray-600 hover:text-blue-600 font-medium ${
                activePage === "Sales" ? "text-blue-700 font-bold underline" : ""
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActivePage("About")}
              className={`text-gray-600 hover:text-blue-600 font-medium ${
                activePage === "About" ? "text-blue-700 font-bold underline" : ""
              }`}
            >
              About
            </button>
            <button
              onClick={onAdminLoginClick}
              className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
            >
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {activePage === "Sales" && <SalesPage products={products} />}
        {activePage === "About" && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function SalesPage({ products }) {
  return (
    <div>
      <h2 className="text-4xl font-bold text-center text-blue-900 mb-6">Our Products</h2>
      <p className="text-center text-gray-600 mb-10">
        Latest mobiles and accessories available in our shop.
      </p>
      {Array.isArray(products) && products.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-400">No Products Found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <img
                src={product.image || "https://placehold.co/400x400/CCCCCC/222/No+Image"}
                alt={product.name}
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-lg font-bold text-blue-500 mt-2">
                  Cost: ₹{Number(product.cost).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto text-gray-700 py-6 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
        About Sri Maruthi Cell Care &amp; Services
      </h2>
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-start md:items-center p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
        {/* Owner Image */}
        <img
          src="/harish.jpg"
          alt="Owner Harish"
          className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-xl border-2 border-blue-400 shadow"
          style={{ flexShrink: 0 }}
        />
        {/* About content */}
        <div className="flex-1 min-w-0">
          <p className="mb-3 leading-relaxed">
            <b>Sri Maruthi Cell Care &amp; Services</b> is your one-stop destination in Shivani for the latest mobile sales, expert repairs, and accessories. Founded in <b>2013</b>, we have built a reputation for reliable products and honest service at fair prices.
          </p>
          <p className="mb-3 leading-relaxed">
            <b>Owner: Harish S A</b> (pictured): With over a decade of industry experience, Harish ensures every device receives quality care, whether it’s a new purchase, screen replacement, battery, or any complex diagnostic work. Every device gets personal attention!
          </p>
          <p className="mb-3 leading-relaxed">
            Our certified technicians solve problems with care and integrity. We believe in transparent pricing, a warm welcome, and long-term relationships with every customer.
          </p>
          <p className="leading-relaxed text-blue-700 font-semibold">
            Visit us near Shivani bus-stop. Thank you for trusting us with your mobile needs!
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white pt-6 pb-2 shadow-inner mt-12 flex flex-col">
      <div className="container mx-auto text-center text-gray-500 select-none px-4 pb-6">
        Maruthi Mobile Sales & Services, Shivani (577549) near Bus-stop, Cheeranahalli Rd<br />
        Phone: <a className="text-blue-600 hover:underline" href="tel:+919686771218">+91 9686771218</a>
      </div>
      <div className="w-full bg-gray-100 py-2 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-700 text-sm tracking-wide">
          Created by <span className="text-red-500 text-lg">❤</span>{' '}
          <a
            href="https://www.linkedin.com/in/shashank33sv"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline text-blue-700"
            style={{ letterSpacing: '1px' }}
          >
            Sv
          </a>
        </div>
      </div>
    </footer>
  );
}
