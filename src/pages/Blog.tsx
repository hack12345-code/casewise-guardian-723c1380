
import { Book } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Blog = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <Card key={n} className="bg-card">
                    <CardHeader className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold inline-flex items-center justify-center gap-3">
              <Book className="w-8 h-8 text-primary" />
              Latest Articles
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Stay informed with our latest insights on medical practice and risk management
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts?.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                <Link to={`/blog/${post.id}`}>
                  <CardHeader className="space-y-2">
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <time dateTime={post.created_at}>
                        {new Date(post.created_at || '').toLocaleDateString()}
                      </time>
                      <span>{post.read_time}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
