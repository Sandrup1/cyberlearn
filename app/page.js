import Link from "next/link";
import styles from "./page.module.css";

function Home() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>CyberLearn AI</h1>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/" className={styles.navLink}>Learn</Link>

          <Link href="/signup">
            <button className={styles.signupButton}>
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <h1 className={styles.heroTitle}>
            Master Cybersecurity Through Practical Learning
          </h1>

          <p className={styles.heroText}>
            Build real-world cybersecurity skills through structured theory and
            hands-on labs. Learn at your own pace with AI-powered insights and
            personalized recommendations.
          </p>

          <Link href="/signup">
            <button className={styles.getStartedButton}>
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Learning Section */}
      <section id="learn" className={styles.learningSection}>
        <h2 className={styles.learningTitle}>What you will learn</h2>

        <div className={styles.cardContainer}>
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
            <div key={index} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
