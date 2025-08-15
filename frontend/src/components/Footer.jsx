export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 pt-6 pb-0 shadow-inner">
      {/* Main footer content (address/socials) can go here if desired */}
      <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 select-none px-4 pb-6">
        Maruthi Mobile Sales & Services, Shivani (577549) near Bus-stop, Cheeranahalli Rd<br />
        Phone: +91 9686771218
      </div>
      {/* Absolute bottom / final bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-900 py-3 mt-0">
        <div className="container mx-auto text-center text-gray-700 dark:text-gray-400 text-sm select-none">
          Created by{' '}
          <a
            href="https://www.linkedin.com/in/shashanksv/"
            className="text-blue-600 font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            ❤ Sv
          </a>
        </div>
      </div>
    </footer>
  );
}
