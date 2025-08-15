import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 pt-6 pb-2 shadow-inner mt-12 flex flex-col">
      {/* Top: Info and Socials */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 mb-2">
        <div className="mb-3 md:mb-0 text-center md:text-left">
          <p className="text-gray-700 dark:text-gray-400 font-semibold">&copy; 2025 Sri Maruthi Cell Care & Services. All Rights Reserved.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Maruthi Mobile Sales & Services, Shivani (577549) near Bus-stop, Cheeranahalli Rd
          </p>
          <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Contact:</span>{' '}
            <a href="tel:9686771218" className="hover:underline text-blue-600">9686771218</a>
          </p>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-600 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Instagram size={28} />
          </a>
          <a
            href="https://www.facebook.com/YOUR_FACEBOOK_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Facebook size={28} />
          </a>
        </div>
      </div>
      {/* Bottom: Created by */}
      <div className="w-full py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 text-sm tracking-wide">
          Created by <span className="text-red-500 text-lg">❤</span>{' '}
          <a
            href="https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME"
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