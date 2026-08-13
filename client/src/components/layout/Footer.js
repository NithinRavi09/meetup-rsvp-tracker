export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-sm gap-4">
        <p>© {new Date().getFullYear()} Local Meetup. All rights reserved.</p>
        <div className="flex items-center space-x-6 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-800 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-800 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-slate-800 transition-colors">
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
}
