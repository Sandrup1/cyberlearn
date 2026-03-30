import Link from 'next/link';
function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-sm">
        <h1 className="font-semibold text-lg">CyberLearn AI</h1>

        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-700 hover:text-black">Home</a>
          <a href="#" className="text-gray-700 hover:text-black">Learn</a>
          <Link href="/signup">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
            Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex justify-center items-center py-20 px-5">
        <div className="bg-white p-12 rounded-xl shadow-md text-center max-w-2xl">

          <h1 className="text-4xl font-bold mb-6">
            Master Cybersecurity Through Practical Learning
          </h1>

          <p className="text-gray-600 mb-8">
            Build real-world cybersecurity skills through structured theory and hands-on labs.
            Learn at your own pace with AI-powered insights and personalized recommendations.
          </p>

          <Link href="/signup">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700">
            Get Started
          </button>
          </Link>
        </div>
      </section>

      {/* Learning Section */}
      <section className="text-center pb-20 px-5">
        <h2 className="text-2xl font-semibold mb-10">What you will learn</h2>

        <div className="flex justify-center gap-6 flex-wrap">

          {[
            {
              title: "SQL Injection",
              desc: "Database security and SQL injection prevention",
            },
            {
              title: "XSS",
              desc: "Cross-Site Scripting attacks and prevention",
            },
            {
              title: "CSRF",
              desc: "Cross-Site Request Forgery protection",
            },
            {
              title: "XXE",
              desc: "XML External Entity vulnerability handling",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm w-64 hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}
export default Home; 