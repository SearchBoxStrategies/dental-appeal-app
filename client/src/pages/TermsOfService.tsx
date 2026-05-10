import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    // Load the HTML file from public folder
    fetch('/terms.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('terms-content')!.innerHTML = html;
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="terms-content" className="container mx-auto px-4 py-8"></div>
    </div>
  );
}
