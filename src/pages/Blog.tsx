
import { Book } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Medical Risk Management",
      excerpt: "Learn about the key principles of managing medical risks in modern healthcare practices.",
      date: "2024-03-15",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Best Practices for Patient Documentation",
      excerpt: "Discover how proper documentation can protect both healthcare providers and patients.",
      date: "2024-03-10",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "The Future of AI in Healthcare",
      excerpt: "Exploring how artificial intelligence is transforming medical practice and risk assessment.",
      date: "2024-03-05",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold inline-flex items-center justify-center gap-3">
              <Book className="w-8 h-8 text-blue-600" />
              Blog
            </h1>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <article 
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/blog/${post.id}`} className="p-6 block">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
