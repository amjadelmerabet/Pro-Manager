// Components
import Header from "../components/Header";
import Footer from "../components/Footer";

// Styles
import "./Blog.css";

const articles = [
  {
    category: "Planning",
    date: "May 18, 2025",
    readTime: "4 min read",
    title: "A calmer way to plan your next project",
    excerpt:
      "Big goals can feel easier to start when they have a clear home. Learn how a simple project outline, a realistic deadline, and a few next steps can turn an idea into steady progress.",
    tone: "blue",
  },
  {
    category: "Task management",
    date: "May 9, 2025",
    readTime: "3 min read",
    title: "From a long to-do list to a useful daily plan",
    excerpt:
      "A task list should help you choose what to do, not make every item feel equally urgent. A few thoughtful priorities and clear statuses can bring focus back to the day.",
    tone: "aqua",
  },
  {
    category: "Work habits",
    date: "April 27, 2025",
    readTime: "5 min read",
    title: "Why small updates make projects easier to follow",
    excerpt:
      "A quick note or status change gives future you the context to pick up where you left off. See how comments and activity history can keep the story of a project in one place.",
    tone: "coral",
  },
  {
    category: "Getting started",
    date: "April 14, 2025",
    readTime: "4 min read",
    title: "Should this task belong to a project?",
    excerpt:
      "Some tasks are part of a bigger effort; others are best left on their own. A flexible approach to linking work keeps your workspace organized without adding unnecessary structure.",
    tone: "navy",
  },
  {
    category: "Workspace tips",
    date: "April 2, 2025",
    readTime: "3 min read",
    title: "Find a view that fits the way you think",
    excerpt:
      "A board can make progress visible, while a list can make details easier to scan. Explore how Pro Manager’s different layouts help you look at the same work from a fresh angle.",
    tone: "blue",
  },
  {
    category: "Product notes",
    date: "March 21, 2025",
    readTime: "4 min read",
    title: "A workspace designed to feel like yours",
    excerpt:
      "From light and dark themes to two different workspace styles, small choices can make everyday planning feel more comfortable. Here are a few ways to make Pro Manager your own.",
    tone: "aqua",
  },
];

export default function BlogPage() {
  return (
    <div className="blog-page public">
      <div className="container">
        <Header />

        <main>
          <section className="blog-hero">
            <p className="blog-eyebrow poppins-semibold">The Pro Manager blog</p>
            <h2 className="blog-hero-title poppins-bold">
              Ideas for making work feel more manageable
            </h2>
            <p className="blog-hero-subtitle poppins-regular">
              Notes, tips, and practical inspiration for planning projects,
              keeping tasks moving, and building a workspace that works for you.
            </p>
          </section>

          <section className="blog-articles" aria-label="Articles">
            {articles.map((article, index) => (
              <article
                className={`blog-card blog-card-${article.tone}${index === 0 ? " blog-card-featured" : ""}`}
                key={article.title}
              >
                <div className="blog-card-art" aria-hidden="true">
                  <span className="blog-art-orbit" />
                  <span className="blog-art-card blog-art-card-back" />
                  <span className="blog-art-card blog-art-card-front">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-meta poppins-medium">
                    <span className="blog-category">{article.category}</span>
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="blog-card-title poppins-semibold">
                    {article.title}
                  </h3>
                  <p className="blog-card-excerpt poppins-regular">
                    {article.excerpt}
                  </p>
                  <span className="blog-read-label poppins-semibold">
                    From the Pro Manager journal
                  </span>
                </div>
              </article>
            ))}
          </section>

          <section className="blog-cta">
            <p className="blog-eyebrow poppins-semibold">Make room for good work</p>
            <h3 className="poppins-semibold">Turn your next idea into a plan</h3>
            <p className="poppins-regular">
              Bring projects and everyday tasks together in your Pro Manager
              workspace.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
