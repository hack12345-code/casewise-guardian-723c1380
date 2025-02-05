import { Book } from "lucide-react";

const Blog = () => {
  // Sample blog posts data - in a real app, this would come from an API
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
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Book className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-center">Blog</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;