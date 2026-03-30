import Link from 'next/link';
export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm p-6">
      <h1 className="text-lg font-semibold mb-10 text-gray-900">
        CyberLearn AI
      </h1>

      <div className="space-y-4">
        <Link href="/dashboard">
          <div className=" hover:bg-gray-500 text-black p-3 rounded-lg font-medium cursor-pointer">
          📊 Dashboard
        </div>
        </Link>
        
        <Link href="/aiinsights">
          <div className="p-3 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-500">
          🧠 AI Insights
        </div>
        </Link>
        
      </div>
    </div>
  );
}