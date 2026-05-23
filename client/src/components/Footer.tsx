import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-4 px-6 bg-white/50">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-gray-700">Terms of Service</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
          <span>|</span>
          <a href="mailto:support@dentalappeal.claims" className="hover:text-gray-700">Support</a>
        </div>
        <div className="text-center">
          <p>
            © {new Date().getFullYear()}{' '}
            <a 
              href="https://searchboxstrategies.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700 hover:underline transition-all"
            >
              Search Box Strategies
            </a>
            . All rights reserved.
          </p>
          <p className="text-xs text-gray-400">DentalAppeal is a product of Search Box Strategies.</p>
        </div>
      </div>
    </footer>
  );
}
