
import { Book } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching blog posts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setBlogPosts(data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          date: new Date(post.created_at).toISOString(),
          readTime: post.read_time
        })));
      }
    };

    fetchBlogPosts();
  }, [toast]);

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
            {blogPosts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No blog posts available yet.
              </div>
            ) : (
              blogPosts.map((post) => (
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
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
