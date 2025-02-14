
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const BlogPost = () => {
  const { id } = useParams();
  
  // This would typically fetch from your database
  const post = {
    id: Number(id),
    title: "Understanding Medical Risk Management",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2024-03-15",
    readTime: "5 min read",
    author: "Dr. John Smith"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>
          </header>
          <div className="prose prose-lg max-w-none">
            {post.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
