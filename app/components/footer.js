export default function Footer() {
  return (
    <footer className="w-full py-10 px-12 border-t border-gray-100 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-black">CyberLearn AI</h2>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Mastering cybersecurity through hands-on labs and AI-driven insights. 
            Built for the next generation of security professionals.
          </p>
        </div>

        {/* Links Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-black text-sm uppercase tracking-wider">Platform</h4>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">Modules</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">Labs</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">AI Insights</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-black text-sm uppercase tracking-wider">Resources</h4>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">Documentation</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">Community</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">Support</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-black text-sm uppercase tracking-wider">Company</h4>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">About Us</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm transition">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-xs font-medium">
          © 2026 CyberLearn AI. All rights reserved.
        </p>
        <div className="flex gap-6">
           {/* Social icons could go here */}
           <span className="text-gray-300 text-xs italic">Secure. Analyze. Learn.</span>
        </div>
      </div>
    </footer>
  );
}
