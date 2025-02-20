
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();
  
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Card className="p-8">
              <h1 className="text-2xl font-semibold mb-4">Blog post not found</h1>
              <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
              <Link to="/blog" className="text-primary hover:underline inline-flex items-center">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Card>
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
        <article className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog" className="text-primary hover:underline inline-flex items-center mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <Card>
            <CardContent className="p-8">
              <header className="mb-8 border-b pb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <time dateTime={post.created_at}>
                    {new Date(post.created_at || '').toLocaleDateString()}
                  </time>
                  <span>•</span>
                  <span>{post.read_time}</span>
                </div>
              </header>
              
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap">{post.content}</div>
              </div>
            </CardContent>
          </Card>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
