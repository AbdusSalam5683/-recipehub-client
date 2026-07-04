// client/src/components/common/Footer.jsx
'use client';

import Link from 'next/link';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import AnimatedLogo from './AnimatedLogo';

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM5.838 12c0-3.403 2.759-6.162 6.162-6.162s6.162 2.759 6.162 6.162-2.759 6.162-6.162 6.162-6.162-2.759-6.162-6.162zm11.802-7.699c0-.794.644-1.438 1.438-1.438s1.438.644 1.438 1.438-.644 1.438-1.438 1.438-1.438-.644-1.438-1.438z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186c-.264-1.031-1.043-1.81-2.074-2.074-1.828-.494-9.147-.494-9.147-.494s-7.319 0-9.147.494c-1.031.264-1.81 1.043-2.074 2.074-.494 1.828-.494 5.643-.494 5.643s0 3.815.494 5.643c.264 1.031 1.043 1.81 2.074 2.074 1.828.494 9.147.494 9.147.494s7.319 0 9.147-.494c1.031-.264 1.81-1.043 2.074-2.074.494-1.828.494-5.643.494-5.643s0-3.815-.494-5.643zm-13.501 9.634v-6.889l6.173 3.444-6.173 3.445z" />
      </svg>
    ),
  },
];

const columns = [
  {
    title: 'Quick Links',
    links: [
      { href: '/', label: 'Home' },
      { href: '/browse-recipes', label: 'Browse Recipes' },
      { href: '/user-dashboard', label: 'Dashboard' },
      { href: '/user-dashboard/add-recipe', label: 'Add Recipe' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '#', label: 'Help Center' },
      { href: '#', label: 'Privacy Policy' },
      { href: '#', label: 'Terms of Service' },
      { href: '#', label: 'Contact Us' },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-charcoal-900 text-cream-200">
      {/* scalloped cut-card edge, like a torn recipe card */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        className="block w-full h-3 text-cream-100 dark:text-charcoal-950"
        style={{ transform: 'translateY(1px)' }}
      >
        <path
          d="M0,10 L0,4 Q5,10 10,4 Q15,10 20,4 Q25,10 30,4 Q35,10 40,4 Q45,10 50,4 Q55,10 60,4 Q65,10 70,4 Q75,10 80,4 Q85,10 90,4 Q95,10 100,4 Q105,10 110,4 Q115,10 120,4 Q125,10 130,4 Q135,10 140,4 Q145,10 150,4 Q155,10 160,4 Q165,10 170,4 Q175,10 180,4 Q185,10 190,4 Q195,10 200,4 L200,10 Z"
          fill="currentColor"
        />
      </svg>

      <div className="container-custom pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <AnimatedLogo variant="dark" size="sm" />
            <p className="mt-4 text-sm text-cream-400 leading-relaxed max-w-[26ch]">
              Discover, share, and cook amazing recipes from food enthusiasts around the world.
            </p>
            <div className="flex gap-2.5 mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="h-9 w-9 grid place-items-center rounded-full border border-charcoal-700 text-cream-400 hover:text-cream-50 hover:border-sage-500 hover:bg-sage-600/20 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display italic font-semibold text-lg text-cream-50 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-cream-300 hover:text-paprika-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-display italic font-semibold text-lg text-cream-50 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="h-8 w-8 grid place-items-center rounded-full bg-charcoal-800 text-turmeric-400 shrink-0">
                  <EnvelopeIcon className="h-4 w-4" />
                </span>
                <span className="text-cream-300">support@recipehub.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-8 w-8 grid place-items-center rounded-full bg-charcoal-800 text-turmeric-400 shrink-0">
                  <PhoneIcon className="h-4 w-4" />
                </span>
                <span className="text-cream-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-8 w-8 grid place-items-center rounded-full bg-charcoal-800 text-turmeric-400 shrink-0">
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <span className="text-cream-300">123 Food Street, Kitchen City</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-sm text-cream-400"
          style={{ borderTop: '1px dashed rgba(251,243,231,0.15)' }}
        >
          <p>&copy; {currentYear} RecipeHub. All rights reserved. Made with ❤️ by the RecipeHub team.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
