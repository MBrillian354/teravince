 import { Link } from 'react-router-dom';

 export default function Footer() {
   return (
     <footer className="bg-white shadow mt-auto">
       <div className="container mx-auto px-4 py-3 flex justify-center items-center text-sm text-gray-600">
         <span>Copyright © 2025 IDK Team |</span>
         <Link to="/terms"   className="hover:text-indigo-500 mx-1">Terms & Conditions</Link>
         <span>|</span>
         <Link to="/privacy" className="hover:text-indigo-500 mx-1">Privacy Policy</Link>
        <span>|</span>
        <Link to="/cookies" className="hover:text-indigo-500 mx-1">Cookie Policy</Link>
       </div>
     </footer>
   );
 }
