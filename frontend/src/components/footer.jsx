export default function Footer() {
  return (
    <footer className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-center items-center text-sm text-gray-600">
        <span>Copyright © 2025 IDK Team | All Rights Reserved |</span>
        <a href="/terms" className="hover:text-indigo-500 mx-1">Terms and Conditions</a>
        <span>|</span>
        <a href="/privacy" className="hover:text-indigo-500 mx-1">Privacy Policy</a>
      </div>
    </footer>
  );
}