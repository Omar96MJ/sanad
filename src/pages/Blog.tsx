import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

// Updated blog data with comprehensive content
export const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: Causes, Symptoms, and Treatment',
    excerpt: 'Anxiety disorders affect millions of people worldwide. Learn about the causes, symptoms, and available treatments.',
    content: `
      <h2>Understanding Anxiety: Causes, Symptoms, and Treatment</h2>
      <p>Anxiety is a normal and often healthy emotion. However, when a person regularly feels disproportionate levels of anxiety, it might become a medical disorder.</p>
      
      <h3>What Causes Anxiety?</h3>
      <p>Anxiety disorders can be caused by a complex set of risk factors including:</p>
      <ul>
        <li><strong>Genetics:</strong> Family history plays a role in increasing the likelihood that a person will develop anxiety. This suggests that the tendency to develop anxiety may be hereditary.</li>
        <li><strong>Brain chemistry:</strong> Anxiety disorders may result from abnormal functioning of nerve cell pathways that connect brain regions involved in thinking and emotion.</li>
        <li><strong>Environmental factors:</strong> Trauma, stressful events such as abuse, death of a loved one, divorce, changing jobs or schools, may trigger anxiety disorders in susceptible individuals.</li>
        <li><strong>Medical factors:</strong> Certain medical conditions like thyroid problems or heart arrhythmias can mimic anxiety symptoms.</li>
        <li><strong>Substance use:</strong> Drugs, alcohol, and caffeine can aggravate existing anxiety.</li>
      </ul>
      
      <h3>Common Symptoms of Anxiety</h3>
      <p>Anxiety symptoms can include:</p>
      <ul>
        <li>Feeling nervous, restless or tense</li>
        <li>Having a sense of impending danger, panic or doom</li>
        <li>Increased heart rate and rapid breathing</li>
        <li>Sweating and trembling</li>
        <li>Feeling weak or tired</li>
        <li>Difficulty concentrating or thinking about anything other than the present worry</li>
        <li>Having trouble sleeping</li>
        <li>Experiencing gastrointestinal (GI) problems</li>
        <li>Difficulty controlling worry</li>
        <li>Having the urge to avoid things that trigger anxiety</li>
      </ul>
      
      <h3>Types of Anxiety Disorders</h3>
      <p>There are several types of anxiety disorders, including:</p>
      <ul>
        <li><strong>Generalized Anxiety Disorder (GAD):</strong> Characterized by persistent and excessive worry about various things.</li>
        <li><strong>Social Anxiety Disorder:</strong> Involves high levels of anxiety, fear and avoidance of social situations.</li>
        <li><strong>Panic Disorder:</strong> Characterized by recurrent panic attacks, which are sudden periods of intense fear.</li>
        <li><strong>Phobias:</strong> Characterized by major anxiety when exposed to a specific object or situation and a desire to avoid it.</li>
        <li><strong>Separation Anxiety Disorder:</strong> Characterized by fear of separation from home or from people to whom a person is attached.</li>
      </ul>
      
      <h3>Treatment Options</h3>
      <p>The two main treatments for anxiety disorders are psychotherapy and medications. You may benefit most from a combination of the two.</p>
      
      <h4>Psychotherapy</h4>
      <p>Cognitive behavioral therapy (CBT) is the most effective form of psychotherapy for anxiety disorders. It focuses on teaching specific skills to improve symptoms and gradually return to activities that were avoided because of anxiety.</p>
      
      <h4>Medications</h4>
      <p>Several types of medications are used to help relieve symptoms, depending on the type of anxiety disorder you have and whether you also have other mental or physical health issues. For example:</p>
      <ul>
        <li><strong>Anti-anxiety medications:</strong> Benzodiazepines may be prescribed for short-term relief of anxiety symptoms.</li>
        <li><strong>Antidepressants:</strong> Many antidepressants are also effective for anxiety disorders.</li>
        <li><strong>Beta-blockers:</strong> These medications can help reduce the physical symptoms of anxiety, such as rapid heartbeat, shaking, and trembling.</li>
      </ul>
      
      <h3>Self-Help Strategies</h3>
      <p>In addition to professional treatment, these self-care steps can help you manage anxiety:</p>
      <ul>
        <li><strong>Stay physically active:</strong> Regular exercise can help reduce anxiety.</li>
        <li><strong>Avoid alcohol and recreational drugs:</strong> These substances can cause or worsen anxiety.</li>
        <li><strong>Quit smoking and cut back or quit drinking caffeinated beverages:</strong> Both nicotine and caffeine can worsen anxiety.</li>
        <li><strong>Use stress management and relaxation techniques:</strong> Techniques such as meditation, deep breathing, and yoga can help manage anxiety.</li>
        <li><strong>Make sleep a priority:</strong> Do what you can to make sure you're getting enough good sleep.</li>
        <li><strong>Eat healthy foods:</strong> A healthy diet can help manage stress levels.</li>
      </ul>
      
      <p>If you're experiencing anxiety that disrupts your daily activities, consider talking to a mental health professional. With proper treatment, many people with anxiety disorders can lead normal, fulfilling lives.</p>
    `,
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1513008128329-ee3c5b73dd1f',
    tags: ['Anxiety', 'Mental Health', 'Treatment']
  },
  {
    id: '2',
    title: 'How to Overcome Social Anxiety',
    excerpt: 'If you struggle with social anxiety, you\'re not alone. Discover effective strategies for overcoming anxiety in social situations.',
    content: `
      <h2>How to Overcome Social Anxiety</h2>
      <p>Social anxiety disorder, also called social phobia, is an anxiety disorder in which a person has an excessive and unreasonable fear of social situations. Anxiety and self-consciousness arise from a fear of being closely watched, judged, and criticized by others.</p>
      
      <h3>Understanding Social Anxiety</h3>
      <p>People with social anxiety disorder suffer from distorted thinking, including false beliefs about social situations and the negative opinions of others. Without treatment, social anxiety disorder can be debilitating. It can interfere with work, school, relationships or enjoyment of life.</p>
      
      <h3>Common Symptoms</h3>
      <p>Social anxiety disorder symptoms can include:</p>
      <ul>
        <li>Fear of situations where you may be judged negatively</li>
        <li>Worry about embarrassing or humiliating yourself</li>
        <li>Intense fear of interacting with strangers</li>
        <li>Fear that others will notice you're anxious</li>
        <li>Physical symptoms of anxiety or panic, including fast heartbeat, dizziness, muscle tension, or flushing</li>
        <li>Avoiding doing things or speaking to people out of fear of embarrassment</li>
        <li>Avoiding situations where you might be the center of attention</li>
      </ul>
      
      <h3>Effective Strategies for Overcoming Social Anxiety</h3>
      
      <h4>1. Challenge Negative Thoughts</h4>
      <p>Learn to identify and challenge the negative thoughts that underlie your fear of social situations. Ask yourself if these thoughts are realistic and look for alternative explanations for situations.</p>
      <p>For example, if you think, "Everyone will laugh at me if I make a mistake," challenge this by asking, "Is this really true? Do I laugh at others when they make small mistakes? Probably not."</p>
      
      <h4>2. Gradual Exposure</h4>
      <p>Gradually expose yourself to feared social situations. Start with situations that cause you less anxiety and work your way up to more challenging ones.</p>
      <p>You might start by making eye contact with a cashier, then progress to asking a question, having a brief conversation, and eventually attending social gatherings. Each successful experience will build your confidence.</p>
      
      <h4>3. Shift Focus Away from Yourself</h4>
      <p>During social interactions, focus on others and your surroundings rather than monitoring your own behavior or physical symptoms.</p>
      <p>Try asking questions and genuinely listening to the answers. This not only takes attention away from your anxiety but also helps you connect with others.</p>
      
      <h4>4. Learn Relaxation Techniques</h4>
      <p>Practice deep breathing, progressive muscle relaxation, or mindfulness meditation to manage physical symptoms of anxiety.</p>
      <p>Before entering a social situation, take a few minutes to breathe deeply: inhale for a count of four, hold for a count of two, and exhale for a count of six. This can help calm your nervous system.</p>
      
      <h4>5. Develop Social Skills</h4>
      <p>If you feel you lack certain social skills, consider taking a class or working with a therapist to develop them.</p>
      <p>Basic social skills include making eye contact, smiling, asking open-ended questions, and actively listening. These can be practiced and improved over time.</p>
      
      <h4>6. Take Care of Your Physical Health</h4>
      <p>Regular exercise, adequate sleep, and a healthy diet can all help manage anxiety.</p>
      <p>Physical activity releases endorphins, which are natural mood lifters. Aim for at least 30 minutes of moderate exercise most days of the week.</p>
      
      <h4>7. Seek Professional Help</h4>
      <p>Cognitive-behavioral therapy (CBT) is highly effective for social anxiety. Medications, such as selective serotonin reuptake inhibitors (SSRIs), may also be helpful.</p>
      <p>A mental health professional can provide a proper diagnosis and create a treatment plan tailored to your specific needs.</p>
      
      <h3>Remember: You're Not Alone</h3>
      <p>Social anxiety is one of the most common mental health conditions. Millions of people struggle with it, and many have found ways to manage their symptoms and live fulfilling lives.</p>
      
      <p>With patience, practice, and perhaps professional help, you can learn to manage social anxiety and participate more fully in life's social experiences.</p>
    `,
    author: 'Dr. Ahmed Al-Shamri',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
    tags: ['Social Anxiety', 'Stress Management', 'Mental Health']
  },
  {
    id: '3',
    title: 'The Relationship Between Trauma and Mental Health',
    excerpt: 'Psychological trauma affects our mental health in numerous ways. Learn how to recover from trauma and build psychological resilience.',
    content: `
      <h2>The Relationship Between Trauma and Mental Health</h2>
      <p>Trauma is the response to a deeply distressing or disturbing event that overwhelms an individual's ability to cope, causes feelings of helplessness, diminishes their sense of self and their ability to feel a full range of emotions and experiences.</p>
      
      <h3>Understanding Trauma</h3>
      <p>Trauma can result from a single event, a series of events, or a set of circumstances that is experienced by an individual as physically or emotionally harmful or life-threatening. Examples include:</p>
      <ul>
        <li><strong>Accidents and natural disasters:</strong> Car accidents, floods, earthquakes, fires</li>
        <li><strong>Acts of violence:</strong> Physical or sexual assault, combat exposure, witnessing violence</li>
        <li><strong>Childhood abuse or neglect:</strong> Physical, sexual, or emotional abuse, neglect</li>
        <li><strong>Medical trauma:</strong> Invasive procedures, chronic illness, sudden health emergencies</li>
        <li><strong>Grief and loss:</strong> Death of a loved one, especially if sudden or violent</li>
        <li><strong>Systemic trauma:</strong> Poverty, discrimination, political violence</li>
      </ul>
      
      <h3>How Trauma Affects Mental Health</h3>
      
      <h4>Post-Traumatic Stress Disorder (PTSD)</h4>
      <p>PTSD is perhaps the most well-known trauma-related condition, characterized by:</p>
      <ul>
        <li><strong>Intrusive memories:</strong> Flashbacks, nightmares, and unwanted memories of the traumatic event</li>
        <li><strong>Avoidance:</strong> Avoiding people, places, activities, or thoughts that remind one of the trauma</li>
        <li><strong>Negative changes in thinking and mood:</strong> Negative thoughts about oneself or the world, feeling detached from others, difficulty experiencing positive emotions</li>
        <li><strong>Changes in physical and emotional reactions:</strong> Being easily startled, always on guard, trouble sleeping, angry outbursts, overwhelming guilt or shame</li>
      </ul>
      
      <h4>Complex PTSD</h4>
      <p>Complex PTSD may develop in people who experience prolonged, repeated trauma, especially during childhood. In addition to PTSD symptoms, it may include:</p>
      <ul>
        <li>Difficulty regulating emotions</li>
        <li>Negative self-perception</li>
        <li>Distorted perceptions of the perpetrator</li>
        <li>Difficulties in relationships</li>
        <li>Loss of a system of meaning</li>
      </ul>
      
      <h4>Other Mental Health Conditions</h4>
      <p>Trauma increases the risk of developing:</p>
      <ul>
        <li><strong>Depression:</strong> Persistent sadness, loss of interest, feelings of worthlessness</li>
        <li><strong>Anxiety disorders:</strong> Excessive worry, panic attacks, phobias</li>
        <li><strong>Substance use disorders:</strong> Using alcohol or drugs to cope with overwhelming emotions</li>
        <li><strong>Eating disorders:</strong> Using food to cope with difficult emotions or gain a sense of control</li>
        <li><strong>Dissociative disorders:</strong> Disconnection between thoughts, surroundings, actions, and identity</li>
      </ul>
      
      <h3>Building Resilience After Trauma</h3>
      
      <h4>1. Seek Professional Help</h4>
      <p>Evidence-based treatments for trauma include:</p>
      <ul>
        <li><strong>Trauma-focused cognitive-behavioral therapy (TF-CBT):</strong> Helps you process traumatic memories and change unhelpful beliefs related to the trauma</li>
        <li><strong>Eye movement desensitization and reprocessing (EMDR):</strong> A structured therapy that helps you process traumatic memories</li>
        <li><strong>Prolonged exposure therapy:</strong> Gradually exposes you to trauma-related memories and situations that you've been avoiding</li>
        <li><strong>Medications:</strong> Antidepressants, anti-anxiety medications, or sleep aids may be prescribed to manage symptoms</li>
      </ul>
      
      <h4>2. Practice Self-Care</h4>
      <p>Prioritize physical health through:</p>
      <ul>
        <li>Regular exercise</li>
        <li>Balanced nutrition</li>
        <li>Adequate sleep</li>
        <li>Avoiding substances that can worsen symptoms, like alcohol and drugs</li>
      </ul>
      
      <h4>3. Build a Support Network</h4>
      <p>Connect with understanding friends, family members, or support groups. Sharing your experiences with others who have gone through similar situations can be particularly helpful.</p>
      
      <h4>4. Develop Coping Skills</h4>
      <p>Learn techniques to manage distressing emotions and physical sensations:</p>
      <ul>
        <li>Mindfulness practices</li>
        <li>Deep breathing exercises</li>
        <li>Grounding techniques</li>
        <li>Journaling</li>
        <li>Creative expression through art, music, or writing</li>
      </ul>
      
      <h4>5. Find Meaning</h4>
      <p>Many trauma survivors find that helping others or advocating for change helps them find meaning in their experiences. This might involve:</p>
      <ul>
        <li>Volunteering</li>
        <li>Participating in advocacy work</li>
        <li>Sharing your story to help others</li>
        <li>Reconnecting with values and beliefs that are important to you</li>
      </ul>
      
      <h3>Remember: Recovery Is Possible</h3>
      <p>While trauma can have profound effects on mental health, recovery is possible. With appropriate support and treatment, many people not only recover from trauma but experience post-traumatic growth, developing new insights, perspectives, and strengths as a result of their healing journey.</p>
    `,
    author: 'Dr. Noura Al-Otaibi',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-09-25',
    imageUrl: 'https://images.unsplash.com/photo-1611762348135-5a62e6d3a784',
    tags: ['Psychological Trauma', 'Recovery', 'Resilience']
  },
  {
    id: '4',
    title: 'Cognitive Behavioral Therapy (CBT) Techniques for Negative Thinking',
    excerpt: 'CBT is one of the most effective therapeutic approaches. Learn how it can help you change negative thought patterns and improve your mental health.',
    content: `
      <h2>Cognitive Behavioral Therapy (CBT) Techniques for Negative Thinking</h2>
      <p>Cognitive Behavioral Therapy (CBT) is one of the most widely used and effective therapeutic approaches for a range of mental health conditions. At its core, CBT is based on the understanding that our thoughts, feelings, and behaviors are interconnected, and by changing one, we can influence the others.</p>
      
      <h3>Understanding CBT and Its Benefits</h3>
      <p>CBT is a structured, time-limited approach that focuses on current problems and practical solutions. It's been proven effective for treating:</p>
      <ul>
        <li>Depression</li>
        <li>Anxiety disorders</li>
        <li>Post-traumatic stress disorder (PTSD)</li>
        <li>Obsessive-compulsive disorder (OCD)</li>
        <li>Substance use disorders</li>
        <li>Eating disorders</li>
        <li>Sleep difficulties</li>
        <li>Chronic pain</li>
      </ul>
      
      <h3>The Cognitive Model: How Thoughts Influence Feelings and Behaviors</h3>
      <p>CBT is based on the cognitive model, which suggests that it's not events themselves that affect us emotionally, but rather our interpretations of those events. This model includes:</p>
      <ul>
        <li><strong>Automatic thoughts:</strong> Immediate, unquestioned thoughts that pop into our minds in response to situations</li>
        <li><strong>Intermediate beliefs:</strong> Attitudes, rules, and assumptions that influence how we interpret events</li>
        <li><strong>Core beliefs:</strong> Fundamental, deeply held beliefs about ourselves, others, and the world</li>
      </ul>
      <p>When these thoughts are negative, distorted, or unhelpful, they can lead to emotional distress and unhealthy behaviors.</p>
      
      <h3>Common Cognitive Distortions</h3>
      <p>CBT helps identify and challenge cognitive distortions, which are irrational thought patterns such as:</p>
      <ul>
        <li><strong>All-or-nothing thinking:</strong> Seeing things in black and white categories</li>
        <li><strong>Overgeneralization:</strong> Viewing a single negative event as a never-ending pattern of defeat</li>
        <li><strong>Mental filtering:</strong> Focusing on negatives while filtering out positives</li>
        <li><strong>Disqualifying the positive:</strong> Rejecting positive experiences by insisting they "don't count"</li>
        <li><strong>Jumping to conclusions:</strong> Making negative interpretations without definite facts (includes mind reading and fortune telling)</li>
        <li><strong>Catastrophizing:</strong> Expecting disaster; blowing things way out of proportion</li>
        <li><strong>Emotional reasoning:</strong> Assuming that feelings reflect reality ("I feel like a failure, so I must be one")</li>
        <li><strong>Should statements:</strong> Using "should," "must," or "ought" statements that set up unrealistic expectations</li>
        <li><strong>Labeling:</strong> Attaching negative labels to yourself or others</li>
        <li><strong>Personalization:</strong> Seeing yourself as the cause of external negative events</li>
      </ul>
      
      <h3>Key CBT Techniques for Overcoming Negative Thinking</h3>
      
      <h4>1. Thought Records</h4>
      <p>Thought records help you identify and challenge negative thoughts by:</p>
      <ul>
        <li>Describing a situation that triggered distress</li>
        <li>Identifying automatic thoughts and associated emotions</li>
        <li>Noting evidence that supports and contradicts these thoughts</li>
        <li>Developing a balanced alternative perspective</li>
        <li>Re-rating your emotional response</li>
      </ul>
      
      <h4>2. Cognitive Restructuring</h4>
      <p>This technique involves:</p>
      <ul>
        <li>Identifying negative thoughts</li>
        <li>Challenging the evidence for these thoughts</li>
        <li>Examining the utility of these thoughts</li>
        <li>Generating more balanced, helpful alternative thoughts</li>
      </ul>
      
      <h4>3. Behavioral Experiments</h4>
      <p>These experiments test the validity of negative beliefs by:</p>
      <ul>
        <li>Identifying a negative prediction or belief</li>
        <li>Designing an experiment to test it</li>
        <li>Carrying out the experiment</li>
        <li>Analyzing the results and drawing conclusions</li>
      </ul>
      
      <h4>4. Graded Exposure</h4>
      <p>For anxiety and fear-related issues, gradual exposure involves:</p>
      <ul>
        <li>Creating a hierarchy of feared situations</li>
        <li>Gradually exposing yourself to these situations, starting with the least frightening</li>
        <li>Using relaxation techniques during exposure</li>
        <li>Staying in the situation until anxiety decreases</li>
      </ul>
      
      <h4>5. Activity Scheduling and Behavioral Activation</h4>
      <p>Particularly helpful for depression, these techniques involve:</p>
      <ul>
        <li>Scheduling activities that provide a sense of pleasure or mastery</li>
        <li>Gradually increasing activity levels</li>
        <li>Breaking tasks into manageable steps</li>
        <li>Monitoring mood in relation to activities</li>
      </ul>
      
      <h4>6. Problem-Solving</h4>
      <p>CBT teaches structured problem-solving by:</p>
      <ul>
        <li>Defining problems clearly</li>
        <li>Generating multiple solutions</li>
        <li>Evaluating pros and cons of each solution</li>
        <li>Selecting and implementing a solution</li>
        <li>Reviewing the outcome</li>
      </ul>
      
      <h3>Implementing CBT in Daily Life</h3>
      <p>To incorporate CBT principles into your daily routine:</p>
      <ul>
        <li><strong>Practice awareness:</strong> Notice when your mood changes and identify the thoughts behind these changes</li>
        <li><strong>Question your thoughts:</strong> Ask yourself, "What's the evidence for and against this thought?" and "Is there another way to look at this situation?"</li>
        <li><strong>Use reminders:</strong> Set phone reminders to check in with your thoughts throughout the day</li>
        <li><strong>Keep a thought journal:</strong> Track negative thoughts and practice reframing them</li>
        <li><strong>Celebrate progress:</strong> Acknowledge improvements, no matter how small</li>
      </ul>
      
      <h3>When to Seek Professional Help</h3>
      <p>While you can apply many CBT techniques on your own, working with a trained CBT therapist is recommended if:</p>
      <ul>
        <li>Your symptoms are severe or persistent</li>
        <li>You're finding it difficult to apply techniques consistently</li>
        <li>You're dealing with complex issues or trauma</li>
        <li>You're not seeing improvement with self-help approaches</li>
      </ul>
      
      <p>A therapist can provide personalized guidance, help you develop a structured treatment plan, and offer support throughout your journey to healthier thinking patterns.</p>
    `,
    author: 'Dr. Mohammed Al-Salem',
    authorId: '5',
    authorRole: 'doctor',
    publishedDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
    tags: ['Cognitive Behavioral Therapy', 'Positive Thinking', 'Mental Health']
  },
  {
    id: '5',
    title: 'Managing Stress in Daily Life',
    excerpt: 'Stress affects our physical and mental health. Learn effective strategies for managing daily stress and improving your overall wellbeing.',
    content: `
      <h2>Managing Stress in Daily Life</h2>
      <p>Stress is a natural physical and psychological response to life's demands. While some stress can be motivating and even beneficial, chronic or excessive stress can have serious consequences for both physical and mental health.</p>
      
      <h3>Understanding Stress</h3>
      <p>When you encounter a perceived threat—whether it's a deadline at work, a conflict with a loved one, or a financial concern—your body activates a stress response. This response, often called "fight or flight," releases hormones like cortisol and adrenaline that prepare your body to face the challenge or flee from it.</p>
      <p>This stress response can be lifesaving in emergency situations. However, when stress persists over time, it can lead to a variety of health problems including:</p>
      <ul>
        <li>Anxiety and depression</li>
        <li>Digestive problems</li>
        <li>Headaches</li>
        <li>Heart disease and high blood pressure</li>
        <li>Sleep disturbances</li>
        <li>Weight gain</li>
        <li>Memory and concentration impairment</li>
        <li>Weakened immune system</li>
      </ul>
      
      <h3>Common Sources of Stress</h3>
      <p>Stress can come from many sources, including:</p>
      <ul>
        <li><strong>Work-related stress:</strong> Heavy workloads, job insecurity, conflicts with colleagues</li>
        <li><strong>Financial stress:</strong> Debt, insufficient income, unexpected expenses</li>
        <li><strong>Relationship stress:</strong> Conflicts with partners, family members, or friends</li>
        <li><strong>Major life changes:</strong> Moving, changing jobs, getting married or divorced</li>
        <li><strong>Health concerns:</strong> Chronic illness, injury, caring for sick family members</li>
        <li><strong>Environmental factors:</strong> Noise, overcrowding, pollution</li>
        <li><strong>Daily hassles:</strong> Traffic, household chores, technology issues</li>
      </ul>
      
      <h3>Recognizing Stress Symptoms</h3>
      <p>Being able to recognize stress symptoms is the first step toward managing them. Symptoms can be physical, emotional, cognitive, or behavioral:</p>
      
      <h4>Physical Symptoms</h4>
      <ul>
        <li>Headaches and muscle tension</li>
        <li>Fatigue</li>
        <li>Chest pain or rapid heartbeat</li>
        <li>Insomnia</li>
        <li>Digestive problems</li>
        <li>Changes in appetite</li>
        <li>Frequent illness</li>
      </ul>
      
      <h4>Emotional Symptoms</h4>
      <ul>
        <li>Anxiety or restlessness</li>
        <li>Irritability or anger</li>
        <li>Sadness or depression</li>
        <li>Feeling overwhelmed</li>
        <li>Lack of motivation or focus</li>
        <li>Feeling lonely or isolated</li>
      </ul>
      
      <h4>Cognitive Symptoms</h4>
      <ul>
        <li>Racing thoughts</li>
        <li>Constant worry</li>
        <li>Difficulty concentrating</li>
        <li>Poor judgment</li>
        <li>Forgetfulness</li>
        <li>Negative thinking</li>
      </ul>
      
      <h4>Behavioral Symptoms</h4>
      <ul>
        <li>Changes in eating habits</li>
        <li>Procrastination</li>
        <li>Increased use of alcohol, drugs, or cigarettes</li>
        <li>Nervous behaviors (nail biting, pacing)</li>
        <li>Social withdrawal</li>
        <li>Sleep problems</li>
      </ul>
      
      <h3>Effective Stress Management Techniques</h3>
      
      <h4>1. Physical Activity</h4>
      <p>Regular exercise is one of the most effective stress relievers. It releases endorphins, improves mood, boosts energy, and enhances sleep. Aim for at least 30 minutes of moderate activity most days of the week. This could include:</p>
      <ul>
        <li>Walking or jogging</li>
        <li>Swimming or cycling</li>
        <li>Dancing or aerobics</li>
        <li>Yoga or tai chi</li>
        <li>Team sports or fitness classes</li>
      </ul>
      
      <h4>2. Relaxation Techniques</h4>
      <p>Relaxation practices can activate your body's relaxation response, reducing stress hormones and promoting a sense of calm. Effective techniques include:</p>
      <ul>
        <li><strong>Deep breathing:</strong> Slowly breathe in through your nose, hold for a few seconds, and exhale through your mouth</li>
        <li><strong>Progressive muscle relaxation:</strong> Tense and then release each muscle group, moving from head to toe</li>
        <li><strong>Meditation:</strong> Focus your attention and eliminate the stream of thoughts that may be crowding your mind</li>
        <li><strong>Guided imagery:</strong> Visualize calm, peaceful scenes</li>
        <li><strong>Body scan:</strong> Mentally scan your body for areas of tension and consciously relax them</li>
      </ul>
      
      <h4>3. Mindfulness Practices</h4>
      <p>Mindfulness involves staying present and fully engaged in the current moment, without judgment. Mindfulness can reduce rumination, lower stress, and improve focus. Ways to practice mindfulness include:</p>
      <ul>
        <li>Mindful eating (focusing on the taste, texture, and smell of food)</li>
        <li>Mindful walking (paying attention to each step and your surroundings)</li>
        <li>Mindfulness meditation (focusing on your breath or sensations)</li>
        <li>Mindful listening (giving your full attention when others speak)</li>
        <li>Mindful observation (noticing details in your environment)</li>
      </ul>
      
      <h4>4. Healthy Lifestyle Habits</h4>
      <p>Your overall lifestyle can significantly impact your stress levels. Prioritize:</p>
      <ul>
        <li><strong>Sleep hygiene:</strong> Aim for 7-9 hours of quality sleep with consistent sleep/wake times</li>
        <li><strong>Balanced nutrition:</strong> Eat regular meals with plenty of fruits, vegetables, whole grains, and lean proteins</li>
        <li><strong>Hydration:</strong> Drink adequate water throughout the day</li>
        <li><strong>Limit stimulants:</strong> Reduce consumption of caffeine, nicotine, and alcohol</li>
        <li><strong>Time in nature:</strong> Spend time outdoors regularly, as nature exposure reduces stress</li>
      </ul>
      
      <h4>5. Time Management</h4>
      <p>Poor time management can cause significant stress. To manage your time effectively:</p>
      <ul>
        <li>Prioritize tasks using importance and urgency</li>
        <li>Break large projects into smaller steps</li>
        <li>Use calendars, planners, or digital tools to schedule time</li>
        <li>Set realistic goals and deadlines</li>
        <li>Learn to delegate when possible</li>
        <li>Build in buffer time between commitments</li>
        <li>Practice saying "no" to additional responsibilities when you're overloaded</li>
      </ul>
      
      <h4>6. Social Connection</h4>
      <p>Strong social support can buffer against stress. To build and maintain social connections:</p>
      <ul>
        <li>Make time for friends and family regularly</li>
        <li>Join groups or clubs related to your interests</li>
        <li>Volunteer in your community</li>
        <li>Seek support from trusted individuals when needed</li>
        <li>Consider joining a support group if you're facing specific challenges</li>
      </ul>
      
      <h4>7. Cognitive Reframing</h4>
      <p>How you think about stressors can magnify or reduce their impact. Cognitive reframing involves:</p>
      <ul>
        <li>Challenging catastrophic thinking</li>
        <li>Looking for alternative perspectives</li>
        <li>Focusing on aspects you can control</li>
        <li>Practicing self-compassion</li>
        <li>Finding potential benefits or learning opportunities in difficult situations</li>
      </ul>
      
      <h4>8. Creative Expression</h4>
      <p>Creative activities can serve as emotional outlets and promote flow states that reduce stress. Consider:</p>
      <ul>
        <li>Drawing, painting, or coloring</li>
        <li>Playing or listening to music</li>
        <li>Writing, journaling, or poetry</li>
        <li>Dancing or movement</li>
        <li>Crafting, woodworking, or gardening</li>
      </ul>
      
      <h3>Creating a Personalized Stress Management Plan</h3>
      <p>To develop an effective stress management plan:</p>
      <ol>
        <li><strong>Identify your stress triggers</strong> by keeping a stress journal for 1-2 weeks</li>
        <li><strong>Recognize your typical stress responses</strong> (physical, emotional, cognitive, behavioral)</li>
        <li><strong>Select a variety of stress management techniques</strong> that appeal to you</li>
        <li><strong>Schedule these activities</strong> into your daily and weekly routines</li>
        <li><strong>Track your progress</strong> and note which strategies work best for you</li>
        <li><strong>Adjust your plan</strong> as needed based on changing circumstances</li>
      </ol>
      
      <h3>When to Seek Professional Help</h3>
      <p>Consider seeking professional help if:</p>
      <ul>
        <li>Your stress feels overwhelming or unmanageable</li>
        <li>You're using unhealthy coping mechanisms (e.g., substance use)</li>
        <li>Stress is significantly impacting your daily functioning</li>
        <li>You're experiencing symptoms of depression or anxiety</li>
        <li>You've experienced trauma or major life changes</li>
      </ul>
      <p>Mental health professionals can provide additional tools, support, and guidance for managing stress effectively.</p>
      
      <h3>Remember</h3>
      <p>Stress management is not a one-size-fits-all approach. It's about finding what works for you and integrating stress-reducing practices into your daily life. With consistent practice and attention, you can build resilience and reduce the negative impact of stress on your health and wellbeing.</p>
    `,
    author: 'Dr. Layla Al-Maliki',
    authorId: '6',
    authorRole: 'doctor',
    publishedDate: '2023-09-05',
    imageUrl: 'https://images.unsplash.com/photo-1485546784815-e380f3c5a786',
    tags: ['Stress Management', 'Relaxation', 'Mental Health']
  },
  {
    id: '6',
    title: 'The Impact of Sleep on Mental Health',
    excerpt: 'Good sleep is essential for mental health. Discover the relationship between sleep and mental wellbeing, and how to improve your sleep habits.',
    content: `
      <h2>The Impact of Sleep on Mental Health</h2>
      <p>Sleep is far more than just a time when your body shuts down. It's an active period during which critical processing, restoration, and strengthening occurs. Quality sleep is as essential to survival as food and water. Despite this, many people view sleep as a luxury rather than a necessity, and a large portion of the population suffers from poor sleep quality or inadequate sleep duration.</p>
      
      <h3>The Science of Sleep and Mental Health</h3>
      <p>The relationship between sleep and mental health is complex and bidirectional. Mental health issues can disrupt sleep, and sleep problems can contribute to the onset and worsening of mental health challenges.</p>
      
      <p>During sleep, your brain cycles through different stages, each serving important functions:</p>
      <ul>
        <li><strong>Non-REM (NREM) sleep:</strong> Includes light sleep and deep sleep phases where physical restoration occurs, immune function is supported, and memories begin consolidating</li>
        <li><strong>REM (Rapid Eye Movement) sleep:</strong> When most dreaming occurs, emotional processing takes place, and learning and memory consolidation continues</li>
      </ul>
      
      <p>These sleep stages help regulate mood, process emotional information, and maintain cognitive functions like attention, learning, and memory.</p>
      
      <h3>How Sleep Deprivation Affects Mental Health</h3>
      <p>Even short-term sleep deprivation can significantly impact your mental state. The effects include:</p>
      <ul>
        <li><strong>Mood changes:</strong> Irritability, stress, anger, and emotional volatility</li>
        <li><strong>Cognitive impairment:</strong> Reduced concentration, problem-solving abilities, creativity, and judgment</li>
        <li><strong>Decreased impulse control:</strong> Difficulty regulating behavior and emotions</li>
        <li><strong>Heightened stress response:</strong> Increased cortisol production and stress reactivity</li>
        <li><strong>Reduced positive emotional responses:</strong> Diminished ability to experience pleasure</li>
      </ul>
      
      <p>Chronic sleep problems are even more concerning and are linked to:</p>
      <ul>
        <li><strong>Depression:</strong> People with insomnia are 10 times more likely to develop depression</li>
        <li><strong>Anxiety disorders:</strong> Sleep disturbances can trigger or worsen anxiety symptoms</li>
        <li><strong>Bipolar disorder:</strong> Sleep disruptions can precipitate manic episodes</li>
        <li><strong>ADHD-like symptoms:</strong> Attention problems, hyperactivity, and impulsivity</li>
        <li><strong>Psychosis:</strong> Severe sleep deprivation can lead to hallucinations and delusions</li>
        <li><strong>Suicidal thoughts:</strong> Poor sleep is associated with increased suicidal ideation</li>
      </ul>
      
      <h3>Common Sleep Disorders</h3>
      <p>Several sleep disorders can impact mental health:</p>
      <ul>
        <li><strong>Insomnia:</strong> Difficulty falling asleep, staying asleep, or waking too early</li>
        <li><strong>Sleep apnea:</strong> Breathing interruptions during sleep that cause awakenings</li>
        <li><strong>Restless legs syndrome:</strong> Uncomfortable sensations causing an urge to move the legs</li>
        <li><strong>Circadian rhythm disorders:</strong> Misalignment between your internal clock and external environment</li>
        <li><strong>Narcolepsy:</strong> Excessive daytime sleepiness and sudden sleep attacks</li>
        <li><strong>Parasomnias:</strong> Abnormal behaviors during sleep like nightmares, sleep walking, or sleep talking</li>
      </ul>
      
      <h3>Sleep Improvement Strategies</h3>
      
      <h4>1. Sleep Hygiene Practices</h4>
      <p>Good sleep hygiene includes habits and practices that promote quality sleep:</p>
      <ul>
        <li><strong>Consistent schedule:</strong> Go to bed and wake up at the same time every day, even on weekends</li>
        <li><strong>Create a sleep-friendly environment:</strong> Keep your bedroom dark, quiet, cool (60-67°F or 15-19°C), and comfortable</li>
        <li><strong>Remove electronics:</strong> Keep TVs, phones, and computers out of the bedroom, and avoid screens for at least 1 hour before bed</li>
        <li><strong>Limit stimulants:</strong> Avoid caffeine after noon and nicotine close to bedtime</li>
        <li><strong>Be careful with alcohol:</strong> While it might help you fall asleep initially, alcohol disrupts sleep quality</li>
        <li><strong>Dinner timing:</strong> Finish eating 2-3 hours before bedtime</li>
        <li><strong>Exercise regularly:</strong> But complete vigorous exercise at least 3-4 hours before bed</li>
        <li><strong>Manage fluids:</strong> Drink enough to avoid waking up thirsty but not so much that you need nighttime bathroom trips</li>
        <li><strong>Get sunlight exposure:</strong> Spend time outside during daylight hours to help regulate your circadian rhythm</li>
      </ul>
      
      <h4>2. Relaxation Techniques</h4>
      <p>Prepare your mind and body for sleep with relaxation practices:</p>
      <ul>
        <li><strong>Progressive muscle relaxation:</strong> Tense and then release each muscle group</li>
        <li><strong>Deep breathing:</strong> Practice slow, diaphragmatic breathing</li>
        <li><strong>Meditation:</strong> Use guided meditations designed for sleep</li>
        <li><strong>Visualization:</strong> Imagine peaceful, calming scenes</li>
        <li><strong>Gentle stretching:</strong> Perform relaxing stretches before bed</li>
        <li><strong>Warm bath or shower:</strong> The subsequent temperature drop signals your body it's time to sleep</li>
      </ul>
      
      <h4>3. Cognitive Behavioral Therapy for Insomnia (CBT-I)</h4>
      <p>CBT-I is the first-line treatment for chronic insomnia and includes several components:</p>
      <ul>
        <li><strong>Stimulus control:</strong> Strengthening the association between bed and sleep</li>
        <li><strong>Sleep restriction:</strong> Temporarily limiting time in bed to build sleep pressure</li>
        <li><strong>Cognitive restructuring:</strong> Changing unhelpful beliefs about sleep</li>
        <li><strong>Relaxation training:</strong> Learning techniques to reduce physical and mental arousal</li>
        <li><strong>Sleep hygiene education:</strong> Understanding habits that promote good sleep</li>
      </ul>
      
      <h4>4. Managing Racing Thoughts</h4>
      <p>If your mind is active at bedtime:</p>
      <ul>
        <li>Schedule "worry time" earlier in the day to address concerns</li>
        <li>Keep a notepad by your bed to jot down thoughts for tomorrow</li>
        <li>Practice mindfulness to observe thoughts without engaging with them</li>
        <li>Listen to calming audio like meditation guides, gentle music, or sleep stories</li>
      </ul>
      
      <h4>5. When to Consider Sleep Medication</h4>
      <p>While behavioral approaches should be the first line of treatment, medication may sometimes be appropriate:</p>
      <ul>
        <li>Consult with a healthcare provider before taking any sleep medications</li>
        <li>Consider short-term use for acute insomnia due to temporary stressors</li>
        <li>Be aware of potential side effects, dependency risks, and interactions</li>
        <li>Even with medication, continue practicing good sleep hygiene</li>
      </ul>
      
      <h3>Special Considerations</h3>
      
      <h4>Sleep and Trauma</h4>
      <p>Trauma survivors often experience sleep disturbances, including:</p>
      <ul>
        <li>Nightmares and night terrors</li>
        <li>Hypervigilance making it difficult to relax</li>
        <li>Fear of sleep due to nightmares or vulnerability</li>
      </ul>
      <p>Trauma-informed sleep care may include specialized approaches like imagery rehearsal therapy for nightmares.</p>
      
      <h4>Sleep Across the Lifespan</h4>
      <p>Sleep needs and patterns change throughout life:</p>
      <ul>
        <li><strong>Children and adolescents:</strong> Require more sleep than adults; shifts in circadian rhythm during puberty naturally delay sleep timing</li>
        <li><strong>Adults:</strong> Most need 7-9 hours of sleep per night</li>
        <li><strong>Older adults:</strong> Often experience changes in sleep architecture with more fragmented sleep and earlier waking</li>
      </ul>
      
      <h3>Tracking Sleep and Progress</h3>
      <p>Monitoring your sleep can provide valuable insights:</p>
      <ul>
        <li>Keep a sleep diary noting bedtime, wake time, and quality</li>
        <li>Notice patterns in factors that help or hinder your sleep</li>
        <li>Consider using sleep tracking apps or devices, but don't become obsessed with the data</li>
        <li>Track daytime energy, mood, and functioning alongside sleep metrics</li>
      </ul>
      
      <h3>When to Seek Professional Help</h3>
      <p>Consult a healthcare professional if:</p>
      <ul>
        <li>Sleep problems persist despite good sleep hygiene</li>
        <li>You experience excessive daytime sleepiness</li>
        <li>Your bed partner notices breathing pauses during sleep</li>
        <li>Sleep issues significantly impact your daily functioning</li>
        <li>You have concerns about sleep medication use</li>
        <li>You experience symptoms of other sleep disorders</li>
      </ul>
      
      <h3>Remember</h3>
      <p>Improving sleep is one of the most powerful steps you can take for better mental health. Even small changes to your sleep habits can yield significant benefits for your mood, cognitive function, and emotional resilience.</p>
      <p>Don't view better sleep as a luxury—it's a fundamental pillar of mental health and overall wellbeing.</p>
    `,
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-08-28',
    imageUrl: 'https://images.unsplash.com/photo-1522621032211-ac0031dfbddc',
    tags: ['Sleep', 'Mental Health', 'Wellness']
  },
  // ... more blog posts with full content
];

const Blog = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(mockBlogs);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  useEffect(() => {
    let result = mockBlogs;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by active tag
    if (activeTag) {
      result = result.filter(blog => 
        blog.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );
    }
    
    setFilteredBlogs(result);
  }, [searchTerm, activeTag]);

  // Get all unique tags
  const allTags = Array.from(
    new Set(mockBlogs.flatMap(blog => blog.tags))
  ).sort();

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 pb-16">
        <div className="bg-muted/30 py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center slide-up">
              <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 mb-4">
                {t('mental_health_resources')}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('explore_mental_health_blog')}
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                {t('discover_insights')}
              </p>
              <Input
                type="search"
                placeholder={t('search_articles')}
                className="max-w-md mx-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container-custom mt-12">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                className="rounded-full cursor-pointer transition-custom py-1 px-4"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <div 
                  key={blog.id}
                  className={`transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-4">{t('no_articles_found')}</h3>
              <p className="text-muted-foreground">
                {t('try_adjusting_search')}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
