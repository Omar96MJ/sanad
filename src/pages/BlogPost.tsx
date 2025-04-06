
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Facebook, Twitter, Linkedin, Share2, ArrowLeft } from "lucide-react";

// Type definition for blog post
interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  categories: string[];
  readTime: number;
}

// Example blog posts data
const blogPostsData: BlogPostData[] = [
  {
    id: "1",
    title: "Understanding Anxiety in the Modern World",
    slug: "understanding-anxiety-modern-world",
    excerpt: "Learn about the causes, symptoms, and coping mechanisms for anxiety in today's fast-paced society.",
    content: `
      <h2>Understanding Anxiety in the Modern World</h2>
      
      <p>Anxiety is one of the most common mental health challenges people face in our fast-paced, modern world. The constant pressure to succeed, information overload, and unprecedented global events have all contributed to rising anxiety levels worldwide.</p>
      
      <h3>What is Anxiety?</h3>
      
      <p>Anxiety is the body's natural response to stress. It's a feeling of fear or apprehension about what's to come. In moderate amounts, anxiety can be helpful – it alerts us to potential dangers and helps us prepare for important events. However, when anxiety becomes excessive, persistent, and interferes with daily activities, it may be classified as an anxiety disorder.</p>
      
      <p>Common symptoms of anxiety include:</p>
      
      <ul>
        <li>Increased heart rate</li>
        <li>Rapid breathing</li>
        <li>Restlessness</li>
        <li>Trouble concentrating</li>
        <li>Difficulty falling asleep</li>
        <li>Persistent feelings of worry or dread</li>
      </ul>
      
      <h3>Modern Contributors to Anxiety</h3>
      
      <p>Several factors unique to our modern lifestyle contribute to increasing anxiety levels:</p>
      
      <h4>Digital Overload</h4>
      
      <p>The constant stream of information from social media, news outlets, and work communications means our brains rarely get a chance to rest and process. Studies have shown links between heavy social media use and increased anxiety and depression, particularly among young people.</p>
      
      <h4>Work-Life Balance Challenges</h4>
      
      <p>Remote work has blurred the lines between professional and personal life for many. The ability to work from anywhere often translates to feeling like we should be working everywhere and all the time. This "always on" culture contributes significantly to anxiety and burnout.</p>
      
      <h4>Global Events and Uncertainty</h4>
      
      <p>From pandemics to climate change to economic fluctuations, we're constantly aware of large-scale challenges that can trigger anxiety about the future. The 24-hour news cycle ensures we never miss a crisis, which can lead to disaster fatigue and persistent worry.</p>
      
      <h3>Effective Coping Strategies</h3>
      
      <p>The good news is that there are many evidence-based approaches to managing anxiety in the modern world:</p>
      
      <h4>Digital Boundaries</h4>
      
      <p>Setting limits on technology use can significantly reduce anxiety. Try:</p>
      
      <ul>
        <li>Designated tech-free times during your day</li>
        <li>Social media breaks or "fasts"</li>
        <li>Turning off non-essential notifications</li>
        <li>Not checking devices first thing in the morning or right before bed</li>
      </ul>
      
      <h4>Mindfulness and Meditation</h4>
      
      <p>Regular mindfulness practice helps train your brain to return to the present moment rather than worrying about the future or ruminating on the past. Even 5-10 minutes of daily meditation can make a significant difference in anxiety levels over time.</p>
      
      <h4>Physical Movement</h4>
      
      <p>Exercise is one of the most effective natural anxiety remedies. Physical activity releases endorphins, improves sleep quality, and can serve as a form of moving meditation. Find movement you enjoy, whether it's walking, dancing, yoga, or team sports.</p>
      
      <h4>Professional Support</h4>
      
      <p>For persistent or severe anxiety, professional help is invaluable. Cognitive Behavioral Therapy (CBT) is particularly effective for anxiety disorders, helping identify and change thought patterns that trigger anxiety. In some cases, medication may also be appropriate as part of a comprehensive treatment plan.</p>
      
      <h3>Building Resilience for the Long Term</h3>
      
      <p>Beyond immediate coping strategies, building psychological resilience can help you weather life's challenges with less anxiety:</p>
      
      <ul>
        <li>Cultivate strong social connections – relationships are a buffer against stress</li>
        <li>Practice self-compassion – treat yourself with the kindness you would offer a friend</li>
        <li>Develop a growth mindset – view challenges as opportunities to learn and grow</li>
        <li>Establish meaning and purpose – connect your daily activities to your core values</li>
      </ul>
      
      <h3>Conclusion</h3>
      
      <p>Anxiety is a natural human emotion that has been amplified by our modern lifestyle. By understanding the unique challenges we face today and implementing targeted strategies, it's possible to reduce anxiety and build a more balanced relationship with our digital, fast-paced world.</p>
      
      <p>Remember that seeking help for anxiety is a sign of strength, not weakness. Whether through self-help strategies, support groups, or professional treatment, taking steps to address anxiety can lead to profound improvements in your quality of life and overall wellbeing.</p>
    `,
    imageUrl: "/placeholder.svg",
    date: "March 15, 2025",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg",
      role: "Clinical Psychologist"
    },
    categories: ["Mental Health", "Anxiety", "Wellbeing"],
    readTime: 8
  },
  {
    id: "2",
    title: "The Science of Mindfulness Meditation",
    slug: "science-of-mindfulness-meditation",
    excerpt: "Explore the neuroscience behind mindfulness meditation and how it can transform your brain and mental health.",
    content: `
      <h2>The Science of Mindfulness Meditation</h2>
      
      <p>Mindfulness meditation has moved from the realm of spiritual practice to scientific inquiry, with thousands of studies now documenting its effects on the brain and body. What was once considered alternative is now mainstream, with mindfulness programs implemented in healthcare settings, corporations, schools, and even military training.</p>
      
      <h3>What is Mindfulness Meditation?</h3>
      
      <p>At its core, mindfulness meditation is the practice of intentionally focusing attention on the present moment and accepting it without judgment. While this sounds simple, it represents a radical shift from our default mode of thinking, which often involves dwelling on the past or worrying about the future.</p>
      
      <p>Common mindfulness practices include:</p>
      
      <ul>
        <li>Focused attention on breath</li>
        <li>Body scan meditations</li>
        <li>Mindful walking</li>
        <li>Loving-kindness meditation</li>
        <li>Mindful eating</li>
      </ul>
      
      <h3>Neuroscience of Mindfulness</h3>
      
      <p>Advanced neuroimaging techniques have allowed scientists to observe how mindfulness meditation actually changes the brain, both in structure and function:</p>
      
      <h4>Structural Brain Changes</h4>
      
      <p>Studies using MRI scans have found that regular meditation practice is associated with:</p>
      
      <ul>
        <li>Increased gray matter in the prefrontal cortex, associated with attention and emotional regulation</li>
        <li>Greater volume in the hippocampus, crucial for learning and memory</li>
        <li>Reduced size of the amygdala, the brain's "fight or flight" center</li>
        <li>Altered connectivity between brain regions, improving communication networks</li>
      </ul>
      
      <p>What's particularly remarkable is that these changes can begin to appear with just 8 weeks of consistent practice, suggesting the brain's impressive neuroplasticity in response to mindfulness training.</p>
      
      <h4>Functional Brain Changes</h4>
      
      <p>Beyond physical structure, mindfulness meditation changes how the brain functions:</p>
      
      <ul>
        <li>Decreased activity in the Default Mode Network (DMN), the brain network active when mind-wandering</li>
        <li>Improved attention networks, enhancing focus and reducing distractibility</li>
        <li>Enhanced emotional regulation circuits, creating space between stimulus and response</li>
        <li>Reduced stress reactivity, with lower cortisol levels and inflammatory markers</li>
      </ul>
      
      <h3>Health Benefits Backed by Science</h3>
      
      <p>The neurological changes from mindfulness translate to measurable health benefits:</p>
      
      <h4>Mental Health</h4>
      
      <ul>
        <li>Reduced symptoms of anxiety and depression</li>
        <li>Improved emotion regulation</li>
        <li>Enhanced resilience to stress</li>
        <li>Better sleep quality</li>
        <li>Decreased rumination (repetitive negative thinking)</li>
      </ul>
      
      <h4>Physical Health</h4>
      
      <ul>
        <li>Lower blood pressure</li>
        <li>Improved immune function</li>
        <li>Reduced inflammation</li>
        <li>Better pain management, particularly for chronic conditions</li>
        <li>Faster recovery from illness</li>
      </ul>
      
      <h4>Cognitive Benefits</h4>
      
      <ul>
        <li>Enhanced attention span and focus</li>
        <li>Improved working memory</li>
        <li>Better decision-making</li>
        <li>Increased cognitive flexibility</li>
        <li>Preservation of cognitive function with aging</li>
      </ul>
      
      <h3>Evidence-Based Mindfulness Programs</h3>
      
      <p>Several structured mindfulness programs have been developed and rigorously tested:</p>
      
      <h4>Mindfulness-Based Stress Reduction (MBSR)</h4>
      
      <p>Developed by Jon Kabat-Zinn at the University of Massachusetts Medical School in the 1970s, MBSR is an 8-week program combining mindfulness meditation, body awareness, and yoga. Originally designed for patients with chronic pain, it's now used for a wide range of conditions and for general wellbeing.</p>
      
      <h4>Mindfulness-Based Cognitive Therapy (MBCT)</h4>
      
      <p>MBCT combines elements of MBSR with cognitive therapy and is particularly effective for preventing relapse in recurrent depression. Studies show it can reduce relapse rates by up to 50% for those with three or more previous episodes of depression.</p>
      
      <h3>Practical Applications</h3>
      
      <p>The science of mindfulness has led to widespread applications:</p>
      
      <h4>Clinical Settings</h4>
      
      <p>Mindfulness is now incorporated into treatment for various conditions, including depression, anxiety, addiction, chronic pain, and even cancer support care.</p>
      
      <h4>Educational Settings</h4>
      
      <p>Schools implementing mindfulness programs report improved attention, reduced behavioral problems, and better emotional regulation among students. Even brief mindfulness practices before tests have been shown to improve performance.</p>
      
      <h4>Workplace Applications</h4>
      
      <p>Companies like Google, Apple, and General Mills have implemented mindfulness programs, reporting benefits including reduced employee stress, improved collaboration, and enhanced creativity and innovation.</p>
      
      <h3>Starting Your Own Practice</h3>
      
      <p>The scientific evidence is compelling, but the real benefits come from regular practice. Here are science-backed tips for beginning:</p>
      
      <ul>
        <li>Start small – even 5-10 minutes daily is beneficial</li>
        <li>Consistency matters more than duration</li>
        <li>Use guided meditations (apps like Headspace, Calm, or Waking Up)</li>
        <li>Expect your mind to wander – noticing this IS the practice</li>
        <li>Apply mindfulness to daily activities (eating, walking, showering)</li>
      </ul>
      
      <h3>Conclusion</h3>
      
      <p>The science of mindfulness meditation offers a compelling case for its integration into daily life. What was once considered esoteric has proven to be a powerful tool for mental and physical wellbeing, backed by neurological evidence and clinical outcomes.</p>
      
      <p>As research continues to evolve, one thing is clear: mindfulness meditation isn't just about feeling good in the moment—it's about transforming your brain and health for the long term. The ancient wisdom of mindfulness, now validated by modern science, offers a remedy for many of the challenges of contemporary life.</p>
    `,
    imageUrl: "/placeholder.svg",
    date: "April 2, 2025",
    author: {
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg",
      role: "Neuroscientist"
    },
    categories: ["Mindfulness", "Neuroscience", "Mental Health"],
    readTime: 10
  }
];

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPostsData.find(post => post.id === id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Link to="/blog" className="text-blue-500 hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <Link to="/blog" className="text-blue-500 hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
      </Link>

      {/* Hero image */}
      <div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="bg-primary/10">
              {category}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {post.date} · {post.readTime} min read
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Post content */}
      <div 
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <Separator className="my-8" />

      {/* Author card */}
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">About {post.author.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{post.author.role}</p>
            <p className="text-sm">
              An experienced healthcare professional dedicated to improving mental health outcomes 
              through evidence-based practice and compassionate care.
            </p>
          </div>
        </div>
      </Card>

      {/* Share buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-12">
        <span className="font-medium flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share this article:
        </span>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="rounded-full">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Related posts - we'd map through related posts here */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPostsData
            .filter(relatedPost => relatedPost.id !== post.id)
            .slice(0, 2)
            .map(relatedPost => (
              <Card key={relatedPost.id} className="overflow-hidden">
                <Link to={`/blog/${relatedPost.id}`}>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{relatedPost.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
