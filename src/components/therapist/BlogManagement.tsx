import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BlogPost } from "@/lib/types";
import { Book, Search, Edit, Trash2, Plus, FileText } from "lucide-react";

const BlogManagement = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  // Mock data for blog posts
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Understanding Anxiety',
      titleAr: 'فهم القلق',
      excerpt: 'Learn about the causes and symptoms of anxiety disorders.',
      excerptAr: 'تعرف على أسباب وأعراض اضطرابات القلق.',
      content: 'Anxiety disorders are characterized by persistent, excessive worry...',
      contentAr: 'تتميز اضطرابات القلق بالقلق المستمر والمفرط...',
      author: 'Dr. Smith',
      authorAr: 'د. سميث',
      authorId: 'therapist-1',
      authorRole: 'doctor',
      publishedDate: '2025-05-01',
      imageUrl: '/placeholder.svg',
      tags: ['anxiety', 'mental health'],
      tagsAr: ['القلق', 'الصحة النفسية']
    },
    {
      id: '2',
      title: 'Coping with Depression',
      titleAr: 'التعامل مع الاكتئاب',
      excerpt: 'Effective strategies for managing depression symptoms.',
      excerptAr: 'استراتيجيات فعالة للتعامل مع أعراض الاكتئاب.',
      content: 'Depression is a common but serious mood disorder that affects...',
      contentAr: 'الاكتئاب هو اضطراب مزاجي شائع ولكنه خطير يؤثر على...',
      author: 'Dr. Smith',
      authorAr: 'د. سميث',
      authorId: 'therapist-1',
      authorRole: 'doctor',
      publishedDate: '2025-05-10',
      imageUrl: '/placeholder.svg',
      tags: ['depression', 'mental health'],
      tagsAr: ['الاكتئاب', 'الصحة النفسية']
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    titleAr: '',
    excerpt: '',
    excerptAr: '',
    content: '',
    contentAr: '',
    tags: [],
    tagsAr: []
  });
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddPost = () => {
    if (!newPost.title || !newPost.content || !newPost.excerpt) {
      toast.error(t('please_fill_required_fields'));
      return;
    }
    
    const post: BlogPost = {
      id: `${Date.now()}`,
      title: newPost.title || '',
      titleAr: newPost.titleAr || '',
      excerpt: newPost.excerpt || '',
      excerptAr: newPost.excerptAr || '',
      content: newPost.content || '',
      contentAr: newPost.contentAr || '',
      author: 'Dr. Smith', // This would come from the logged-in user
      authorAr: 'د. سميث', // This would be translated
      authorId: 'therapist-1', // This would come from the logged-in user
      authorRole: 'doctor',
      publishedDate: new Date().toISOString().split('T')[0],
      imageUrl: '/placeholder.svg', // This would be uploaded
      tags: newPost.tags || [],
      tagsAr: newPost.tagsAr || []
    };
    
    // In a real app, this would be an API call
    setPosts([...posts, post]);
    setNewPost({
      title: '',
      titleAr: '',
      excerpt: '',
      excerptAr: '',
      content: '',
      contentAr: '',
      tags: [],
      tagsAr: []
    });
    setIsAddDialogOpen(false);
    toast.success(t('post_published'));
  };
  
  const handleUpdatePost = () => {
    if (!currentPost || !currentPost.title || !currentPost.content) {
      toast.error(t('please_fill_required_fields'));
      return;
    }
    
    // In a real app, this would be an API call
    setPosts(posts.map(post => 
      post.id === currentPost.id ? currentPost : post
    ));
    
    setIsEditDialogOpen(false);
    toast.success(t('post_updated'));
  };
  
  const handleDeletePost = () => {
    if (!currentPost) return;
    
    // In a real app, this would be an API call
    setPosts(posts.filter(post => post.id !== currentPost.id));
    
    setIsDeleteDialogOpen(false);
    toast.success(t('post_deleted'));
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            {t('blog_management')}
          </CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            {t('new_post')}
          </Button>
        </div>
        <CardDescription className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_posts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t('no_posts_found')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 bg-muted">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="w-full md:w-3/4 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t('published_on', { date: post.publishedDate })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setCurrentPost(post);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setCurrentPost(post);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mb-3">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Add Post Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('publish_new_post')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('title')} ({t('english')})</label>
                  <Input 
                    value={newPost.title || ''}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder={t('enter_title')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('title')} ({t('arabic')})</label>
                  <Input 
                    value={newPost.titleAr || ''}
                    onChange={(e) => setNewPost({...newPost, titleAr: e.target.value})}
                    placeholder={t('enter_title_arabic')}
                    className="mt-1 text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('excerpt')} ({t('english')})</label>
                  <Input 
                    value={newPost.excerpt || ''}
                    onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                    placeholder={t('enter_excerpt')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('excerpt')} ({t('arabic')})</label>
                  <Input 
                    value={newPost.excerptAr || ''}
                    onChange={(e) => setNewPost({...newPost, excerptAr: e.target.value})}
                    placeholder={t('enter_excerpt_arabic')}
                    className="mt-1 text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">{t('content')} ({t('english')})</label>
                <Textarea 
                  value={newPost.content || ''}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder={t('write_content')}
                  className="mt-1"
                  rows={8}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t('content')} ({t('arabic')})</label>
                <Textarea 
                  value={newPost.contentAr || ''}
                  onChange={(e) => setNewPost({...newPost, contentAr: e.target.value})}
                  placeholder={t('write_content_arabic')}
                  className="mt-1 text-right"
                  dir="rtl"
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('tags')} ({t('english')})</label>
                  <Input 
                    value={(newPost.tags || []).join(', ')}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    placeholder={t('enter_tags')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('tags')} ({t('arabic')})</label>
                  <Input 
                    value={(newPost.tagsAr || []).join(', ')}
                    onChange={(e) => setNewPost({...newPost, tagsAr: e.target.value.split(',').map(tag => tag.trim())})}
                    placeholder={t('enter_tags_arabic')}
                    className="mt-1 text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">{t('featured_image')}</label>
                <div className="mt-1 border-2 border-dashed rounded-md p-4 text-center">
                  <p>{t('image_upload_coming_soon')}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleAddPost}>
                {t('publish')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Post Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('edit_post')}</DialogTitle>
            </DialogHeader>
            {currentPost && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{t('title')} ({t('english')})</label>
                    <Input 
                      value={currentPost.title}
                      onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('title')} ({t('arabic')})</label>
                    <Input 
                      value={currentPost.titleAr || ''}
                      onChange={(e) => setCurrentPost({...currentPost, titleAr: e.target.value})}
                      className="mt-1 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{t('excerpt')} ({t('english')})</label>
                    <Input 
                      value={currentPost.excerpt}
                      onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('excerpt')} ({t('arabic')})</label>
                    <Input 
                      value={currentPost.excerptAr || ''}
                      onChange={(e) => setCurrentPost({...currentPost, excerptAr: e.target.value})}
                      className="mt-1 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">{t('content')} ({t('english')})</label>
                  <Textarea 
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                    className="mt-1"
                    rows={8}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">{t('content')} ({t('arabic')})</label>
                  <Textarea 
                    value={currentPost.contentAr || ''}
                    onChange={(e) => setCurrentPost({...currentPost, contentAr: e.target.value})}
                    className="mt-1 text-right"
                    dir="rtl"
                    rows={8}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{t('tags')} ({t('english')})</label>
                    <Input 
                      value={currentPost.tags.join(', ')}
                      onChange={(e) => setCurrentPost({...currentPost, tags: e.target.value.split(',').map(tag => tag.trim())})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('tags')} ({t('arabic')})</label>
                    <Input 
                      value={(currentPost.tagsAr || []).join(', ')}
                      onChange={(e) => setCurrentPost({...currentPost, tagsAr: e.target.value.split(',').map(tag => tag.trim())})}
                      className="mt-1 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleUpdatePost}>
                {t('update')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Post Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('delete_post')}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>{t('confirm_delete_post')}</p>
              <p className="font-medium mt-2">{currentPost?.title}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDeletePost}>
                {t('delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BlogManagement;
