
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileEdit, Plus, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Define types for blog posts
interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft";
  publishDate: string;
  authorId: string;
  authorName: string;
}

const BlogManagement = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  // Mock data for blog posts - in a real app this would come from the database
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Managing Anxiety in Everyday Life',
      content: 'Anxiety is a normal emotion that everyone experiences at times. Many people feel anxious, or nervous, when faced with a problem at work, before taking a test, or making an important decision...',
      status: "published",
      publishDate: '2025-04-15',
      authorId: 'author-1',
      authorName: 'Dr. Smith'
    },
    {
      id: '2',
      title: 'The Importance of Sleep for Mental Health',
      content: 'Sleep is crucial for maintaining good mental health. Research has shown that there is a close relationship between sleep and mental health...',
      status: "draft",
      publishDate: '',
      authorId: 'author-1',
      authorName: 'Dr. Smith'
    }
  ]);

  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  
  // State for new post
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostStatus, setNewPostStatus] = useState<"published" | "draft">("draft");
  
  // Function to handle creating new blog post
  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast(t('please_fill_all_fields'));
      return;
    }
    
    const newPost: BlogPost = {
      id: `${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      status: newPostStatus,
      publishDate: newPostStatus === "published" ? new Date().toISOString().split('T')[0] : '',
      authorId: 'author-1', // This would be the current user's ID in a real app
      authorName: 'Dr. Smith' // This would be the current user's name in a real app
    };
    
    // In a real app, this would be an API call to save the post
    setBlogPosts([...blogPosts, newPost]);
    toast(t('blog_post_created'));
    
    // Reset form and close dialog
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostStatus("draft");
    setCreateDialogOpen(false);
  };
  
  // Function to handle updating a blog post
  const handleUpdatePost = () => {
    if (!currentPost || !currentPost.title.trim() || !currentPost.content.trim()) {
      toast(t('please_fill_all_fields'));
      return;
    }
    
    // Update publish date if status changes from draft to published
    const updatedPost = { 
      ...currentPost,
      publishDate: currentPost.status === "published" && !currentPost.publishDate 
        ? new Date().toISOString().split('T')[0] 
        : currentPost.publishDate
    };
    
    // In a real app, this would be an API call to update the post
    setBlogPosts(blogPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    toast(t('blog_post_updated'));
    
    setCurrentPost(null);
    setEditDialogOpen(false);
  };
  
  // Function to handle deleting a blog post
  const handleDeletePost = () => {
    if (!currentPost) return;
    
    // In a real app, this would be an API call to delete the post
    setBlogPosts(blogPosts.filter(post => post.id !== currentPost.id));
    toast(t('blog_post_deleted'));
    
    setCurrentPost(null);
    setDeleteDialogOpen(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>
            {t('manage_blog_posts')}
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('new_blog_post')}
          </Button>
        </CardTitle>
        <CardDescription>
          {t('publish_and_manage_blog_content')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {blogPosts.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">{t('no_blog_posts')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('publish_date')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.status === "published" ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {t('published')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                        {t('draft')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{post.publishDate || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setCurrentPost(post);
                          setEditDialogOpen(true);
                        }}
                      >
                        <FileEdit className="h-4 w-4 mr-1" />
                        {t('edit')}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive"
                        onClick={() => {
                          setCurrentPost(post);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        {t('delete')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* Create Post Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('create_new_blog_post')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('title')}</label>
                <Input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder={t('enter_blog_title')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('content')}</label>
                <Textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={t('write_blog_content')}
                  rows={10}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('status')}</label>
                <select 
                  value={newPostStatus}
                  onChange={(e) => setNewPostStatus(e.target.value as "published" | "draft")}
                  className="w-full p-2 border rounded"
                >
                  <option value="draft">{t('draft')}</option>
                  <option value="published">{t('published')}</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleCreatePost}>
                {t('create_post')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Post Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('edit_blog_post')}</DialogTitle>
            </DialogHeader>
            {currentPost && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('title')}</label>
                  <Input
                    value={currentPost.title}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      title: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('content')}</label>
                  <Textarea 
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      content: e.target.value
                    })}
                    rows={10}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('status')}</label>
                  <select 
                    value={currentPost.status}
                    onChange={(e) => setCurrentPost({
                      ...currentPost,
                      status: e.target.value as "published" | "draft"
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="draft">{t('draft')}</option>
                    <option value="published">{t('published')}</option>
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleUpdatePost}>
                {t('update_post')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Post Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('delete_blog_post')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('delete_blog_post_confirmation')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground">
                {t('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default BlogManagement;
