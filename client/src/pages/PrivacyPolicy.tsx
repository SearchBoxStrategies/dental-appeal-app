import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    fetch('/privacy.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('privacy-content')!.innerHTML = html;
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="privacy-content" className="container mx-auto px-4 py-8"></div>
    </div>
  );
}
