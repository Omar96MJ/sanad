
// This file should be updated with proper toast.error usage
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PenLine, Trash, Plus, BookOpen } from "lucide-react";

// Define blog post type
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  status: "draft" | "published";
  featuredImage?: string;
}

const BlogManagement = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  // Sample blog posts data
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Understanding Anxiety: Causes and Coping Mechanisms",
      content: "Anxiety is a normal emotion that everyone experiences at times. Many people feel anxious, or nervous, when faced with a problem at work, before taking a test, or making an important decision...",
      author: "Dr. Smith",
      publishDate: "2025-01-15",
      status: "published"
    },
    {
      id: "2",
      title: "The Benefits of Mindfulness Meditation",
      content: "Mindfulness meditation is a mental training practice that teaches you to slow down racing thoughts, let go of negativity, and calm both your mind and body...",
      author: "Dr. Smith",
      publishDate: "2025-02-20",
      status: "published"
    },
    {
      id: "3",
      title: "Sleep Hygiene: Tips for Better Sleep",
      content: "Sleep hygiene refers to healthy sleep habits. Good sleep hygiene practices can help you get the quality sleep you need for optimal health and wellbeing...",
      author: "Dr. Smith",
      publishDate: "2025-03-10",
      status: "draft"
    }
  ]);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPost | null>(null);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogStatus, setNewBlogStatus] = useState<"draft" | "published">("draft");
  
  const handleCreatePost = () => {
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      toast.error(t('please_fill_all_fields'));
      return;
    }
    
    const newPost: BlogPost = {
      id: String(Date.now()),
      title: newBlogTitle,
      content: newBlogContent,
      author: "Dr. Smith", // In a real app, this would come from the authenticated user
      publishDate: new Date().toISOString().split('T')[0],
      status: newBlogStatus
    };
    
    setBlogPosts([...blogPosts, newPost]);
    setNewBlogTitle("");
    setNewBlogContent("");
    setNewBlogStatus("draft");
    setIsCreateDialogOpen(false);
    toast.success(t('blog_post_created'));
  };
  
  const handleEditPost = () => {
    if (!currentBlogPost || !currentBlogPost.title.trim() || !currentBlogPost.content.trim()) {
      toast.error(t('please_fill_all_fields'));
      return;
    }
    
    setBlogPosts(blogPosts.map(post => 
      post.id === currentBlogPost.id ? currentBlogPost : post
    ));
    
    setIsEditDialogOpen(false);
    setCurrentBlogPost(null);
    toast.success(t('blog_post_updated'));
  };
  
  const handleDeletePost = () => {
    if (!currentBlogPost) return;
    
    setBlogPosts(blogPosts.filter(post => post.id !== currentBlogPost.id));
    setIsDeleteDialogOpen(false);
    setCurrentBlogPost(null);
    toast.success(t('blog_post_deleted'));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t('manage_blog_posts')}
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              {t('new_blog_post')}
            </Button>
          </CardTitle>
          <CardDescription>
            {t('publish_and_manage_blog_content')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blogPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('no_blog_posts')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('title')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('publish_date')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status === 'published' ? t('published') : t('draft')}
                      </span>
                    </TableCell>
                    <TableCell>{post.publishDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentBlogPost(post);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <PenLine className="h-4 w-4" />
                          <span className="sr-only">{t('edit')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentBlogPost(post);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">{t('delete')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('create_new_blog_post')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                {t('title')}
              </label>
              <Input
                id="title"
                value={newBlogTitle}
                onChange={(e) => setNewBlogTitle(e.target.value)}
                placeholder={t('enter_blog_title')}
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                {t('content')}
              </label>
              <Textarea
                id="content"
                value={newBlogContent}
                onChange={(e) => setNewBlogContent(e.target.value)}
                placeholder={t('write_blog_content')}
                rows={12}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                {t('status')}
              </label>
              <select
                id="status"
                value={newBlogStatus}
                onChange={(e) => setNewBlogStatus(e.target.value as "draft" | "published")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="draft">{t('draft')}</option>
                <option value="published">{t('published')}</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreatePost}>{t('create_post')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('edit_blog_post')}</DialogTitle>
          </DialogHeader>
          {currentBlogPost && (
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium mb-1">
                  {t('title')}
                </label>
                <Input
                  id="edit-title"
                  value={currentBlogPost.title}
                  onChange={(e) =>
                    setCurrentBlogPost({ ...currentBlogPost, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="edit-content" className="block text-sm font-medium mb-1">
                  {t('content')}
                </label>
                <Textarea
                  id="edit-content"
                  value={currentBlogPost.content}
                  onChange={(e) =>
                    setCurrentBlogPost({ ...currentBlogPost, content: e.target.value })
                  }
                  rows={12}
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium mb-1">
                  {t('status')}
                </label>
                <select
                  id="edit-status"
                  value={currentBlogPost.status}
                  onChange={(e) =>
                    setCurrentBlogPost({
                      ...currentBlogPost,
                      status: e.target.value as "draft" | "published"
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="draft">{t('draft')}</option>
                  <option value="published">{t('published')}</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleEditPost}>{t('update_post')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_blog_post')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_blog_post_confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogManagement;
