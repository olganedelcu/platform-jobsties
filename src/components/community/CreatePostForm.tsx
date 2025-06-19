
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreatePostFormProps {
  userId: string;
}

const CreatePostForm = ({ userId }: CreatePostFormProps) => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating post for user:', userId);
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: content.trim(),
          image_url: imageUrl.trim() || null,
        });

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });

      setContent('');
      setImageUrl('');
      
      // Trigger a refresh of the community feed
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="content">What's on your mind?</Label>
        <Textarea
          id="content"
          placeholder="Share your thoughts, experiences, or questions with the community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] mt-2"
        />
      </div>

      <div>
        <Label htmlFor="imageUrl" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Image URL (optional)
        </Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-2"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Posting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Post
          </>
        )}
      </Button>
    </form>
  );
};

export default CreatePostForm;
