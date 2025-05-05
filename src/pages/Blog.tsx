import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

// Updated blog data with real content from arabtherapy.com
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
        <li>Genetics</li>
        <li>Brain chemistry</li>
        <li>Personality</li>
        <li>Life events</li>
      </ul>
      <h3>Common Symptoms</h3>
      <p>Anxiety symptoms can include:</p>
      <ul>
        <li>Feeling nervous, restless or tense</li>
        <li>Having a sense of impending danger, panic or doom</li>
        <li>Increased heart rate</li>
        <li>Breathing rapidly (hyperventilation)</li>
        <li>Sweating</li>
        <li>Trembling</li>
        <li>Feeling weak or tired</li>
        <li>Trouble concentrating</li>
        <li>Having difficulty sleeping</li>
        <li>Experiencing gastrointestinal (GI) problems</li>
      </ul>
      <h3>Treatment Options</h3>
      <p>The two main treatments for anxiety disorders are psychotherapy and medications. You may benefit most from a combination of the two.</p>
      <h4>Psychotherapy</h4>
      <p>Cognitive behavioral therapy (CBT) is the most effective form of psychotherapy for anxiety disorders. It focuses on teaching specific skills to improve symptoms and gradually return to activities that were avoided because of anxiety.</p>
      <h4>Medications</h4>
      <p>Several types of medications are used to help relieve symptoms, depending on the type of anxiety disorder you have and whether you also have other mental or physical health issues.</p>
      <h3>Self-Help Strategies</h3>
      <p>In addition to professional treatment, these self-care steps can help you manage anxiety:</p>
      <ul>
        <li>Keep physically active</li>
        <li>Avoid alcohol and recreational drugs</li>
        <li>Quit smoking and cut back or quit drinking caffeinated beverages</li>
        <li>Use stress management and relaxation techniques</li>
        <li>Make sleep a priority</li>
        <li>Eat healthy foods</li>
      </ul>
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
      <p>Social anxiety disorder, also called social phobia, is an anxiety disorder in which a person has an excessive and unreasonable fear of social situations. Anxiety (intense nervousness) and self-consciousness arise from a fear of being closely watched, judged, and criticized by others.</p>
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
      <h4>2. Gradual Exposure</h4>
      <p>Gradually expose yourself to feared social situations. Start with situations that cause you less anxiety and work your way up to more challenging ones.</p>
      <h4>3. Shift Focus Away from Yourself</h4>
      <p>During social interactions, focus on others and your surroundings rather than monitoring your own behavior or physical symptoms.</p>
      <h4>4. Learn Relaxation Techniques</h4>
      <p>Practice deep breathing, progressive muscle relaxation, or mindfulness meditation to manage physical symptoms of anxiety.</p>
      <h4>5. Develop Social Skills</h4>
      <p>If you feel you lack certain social skills, consider taking a class or working with a therapist to develop them.</p>
      <h4>6. Take Care of Your Physical Health</h4>
      <p>Regular exercise, adequate sleep, and a healthy diet can all help manage anxiety.</p>
      <h4>7. Seek Professional Help</h4>
      <p>Cognitive-behavioral therapy (CBT) is highly effective for social anxiety. Medications, such as selective serotonin reuptake inhibitors (SSRIs), may also be helpful.</p>
      <h3>Remember: You're Not Alone</h3>
      <p>Social anxiety is one of the most common mental health conditions. Millions of people struggle with it, and many have found ways to manage their symptoms and live fulfilling lives.</p>
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
        <li>Accidents and natural disasters</li>
        <li>Acts of violence</li>
        <li>Childhood abuse or neglect</li>
        <li>Medical interventions</li>
        <li>Grief and loss</li>
        <li>War and conflict</li>
      </ul>
      <h3>How Trauma Affects Mental Health</h3>
      <p>Trauma can impact mental health in many ways:</p>
      <h4>Post-Traumatic Stress Disorder (PTSD)</h4>
      <p>PTSD involves intrusive memories, avoidance behaviors, negative changes in thinking and mood, and changes in physical and emotional reactions.</p>
      <h4>Depression and Anxiety</h4>
      <p>Trauma increases the risk of developing depression and anxiety disorders.</p>
      <h4>Substance Use Disorders</h4>
      <p>Many people use alcohol or drugs to cope with the overwhelming emotions associated with trauma.</p>
      <h4>Relationship Difficulties</h4>
      <p>Trauma can affect a person's ability to trust others and maintain healthy relationships.</p>
      <h3>Building Resilience After Trauma</h3>
      <h4>1. Seek Professional Help</h4>
      <p>Evidence-based treatments for trauma include:</p>
      <ul>
        <li>Trauma-focused cognitive-behavioral therapy (TF-CBT)</li>
        <li>Eye movement desensitization and reprocessing (EMDR)</li>
        <li>Prolonged exposure therapy</li>
      </ul>
      <h4>2. Practice Self-Care</h4>
      <p>Prioritize physical health through regular exercise, balanced nutrition, and adequate sleep.</p>
      <h4>3. Build a Support Network</h4>
      <p>Connect with understanding friends, family members, or support groups.</p>
      <h4>4. Develop Coping Skills</h4>
      <p>Learn relaxation techniques, mindfulness practices, and emotional regulation skills.</p>
      <h4>5. Find Meaning</h4>
      <p>Many trauma survivors find that helping others or advocating for change helps them find meaning in their experiences.</p>
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
    title: 'Techniques for Cognitive Behavioral Therapy (CBT) to Overcome Negative Thinking',
    excerpt: 'Cognitive Behavioral Therapy (CBT) is a powerful tool for overcoming negative thinking and improving mental health. Learn how to apply CBT techniques to overcome negative thoughts and improve your overall well-being.',
    content: `
      <h2>Techniques for Cognitive Behavioral Therapy (CBT) to Overcome Negative Thinking</h2>
      <p>Cognitive Behavioral Therapy (CBT) is a type of psychotherapy that focuses on changing negative thought patterns and behaviors. It is a highly effective treatment for a wide range of mental health conditions, including anxiety, depression, and substance abuse.</p>
      <h3>Understanding CBT</h3>
      <p>CBT is based on the idea that our thoughts, feelings, and behaviors are interconnected. When we have negative thoughts, it can lead to negative feelings and behaviors, which in turn can reinforce the negative thoughts. CBT aims to help individuals identify and challenge these negative thought patterns and develop more positive ones.</p>
      <h3>CBT Techniques</h3>
      <h4>1. Identifying Negative Thoughts</h4>
      <p>CBT involves identifying negative thoughts that are causing distress. These thoughts may be irrational or based on inaccurate beliefs.</p>
      <h4>2. Challenging Negative Thoughts</h4>
      <p>Once negative thoughts are identified, CBT involves challenging them by asking yourself if they are realistic and looking for alternative explanations for situations.</p>
      <h4>3. Developing Positive Thoughts</h4>
      <p>CBT involves developing positive thoughts that are based on accurate beliefs and evidence. These positive thoughts can help counteract negative thoughts and improve mood.</p>
      <h4>4. Behavioral Activation</h4>
      <p>CBT involves gradually exposing oneself to feared situations or activities. This can help individuals overcome their fear and develop a more positive outlook.</p>
      <h4>5. Relaxation Techniques</h4>
      <p>CBT involves learning relaxation techniques such as deep breathing, progressive muscle relaxation, and mindfulness meditation. These techniques can help manage physical symptoms of anxiety and improve overall well-being.</p>
      <h3>Benefits of CBT</h3>
      <p>Cognitive Behavioral Therapy (CBT) has been shown to be effective in treating a wide range of mental health conditions. It can help individuals develop new coping strategies, improve mood, and reduce symptoms of anxiety and depression.</p>
    `,
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
    tags: ['Cognitive Behavioral Therapy', 'Negative Thinking', 'Mental Health']
  },
  {
    id: '5',
    title: 'How to Manage Stress in Daily Life',
    excerpt: 'Stress is a normal part of life, but excessive stress can have negative effects on our physical and mental health. Learn effective strategies for managing stress and improving your overall well-being.',
    content: `
      <h2>How to Manage Stress in Daily Life</h2>
      <p>Stress is a normal part of life, but excessive stress can have negative effects on our physical and mental health. It can lead to physical symptoms such as headaches, muscle tension, and fatigue, as well as mental symptoms such as anxiety, depression, and irritability.</p>
      <h3>Understanding Stress</h3>
      <p>Stress is the body's response to a perceived threat or challenge. It is a natural response that helps us prepare to face a situation. However, when stress becomes chronic or overwhelming, it can have negative effects on our health.</p>
      <h3>Common Stressors</h3>
      <p>Common stressors include work, school, relationships, financial concerns, and health issues. These stressors can be internal or external and can vary in intensity.</p>
      <h3>Effective Strategies for Managing Stress</h3>
      <h4>1. Exercise Regularly</h4>
      <p>Regular physical activity can help reduce stress and improve overall health. Exercise releases endorphins, which are natural mood-boosters.</p>
      <h4>2. Practice Mindfulness and Meditation</h4>
      <p>Mindfulness and meditation can help reduce stress and improve mental health. These practices involve focusing on the present moment and developing a sense of calm and relaxation.</p>
      <h4>3. Get Enough Sleep</h4>
      <p>Getting enough sleep is essential for managing stress. Lack of sleep can lead to increased stress levels and negative health effects.</p>
      <h4>4. Eat a Balanced Diet</h4>
      <p>Eating a balanced diet can help reduce stress and improve overall health. A diet rich in fruits, vegetables, and whole grains can help provide the necessary nutrients for the body.</p>
      <h4>5. Connect with Others</h4>
      <p>Connecting with others can help reduce stress and improve mental health. Social support can provide a sense of belonging and can help individuals feel more supported and less alone.</p>
      <h4>6. Take Breaks and Practice Self-Care</h4>
      <p>It's important to take breaks and practice self-care to manage stress. This can include activities such as taking a walk, practicing yoga, or engaging in a hobby.</p>
      <h3>Remember: Stress is Normal, but Excessive Stress Can Have Negative Effects</h3>
      <p>Stress is a normal part of life, but excessive stress can have negative effects on our physical and mental health. It is important to find effective strategies for managing stress and improving overall well-being.</p>
    `,
    author: 'Dr. Ahmed Al-Shamri',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-09-05',
    imageUrl: 'https://images.unsplash.com/photo-1485546784815-e380f3c5a786',
    tags: ['Stress Management', 'Mental Health', 'Well-being']
  },
  {
    id: '6',
    title: 'The Impact of Sleep on Mental Health',
    excerpt: 'Sleep is essential for maintaining good mental health. Learn how to improve your sleep habits and reduce the impact of sleep deprivation on your mental health.',
    content: `
      <h2>The Impact of Sleep on Mental Health</h2>
      <p>Sleep is essential for maintaining good mental health. It is a natural process that helps the body repair and restore itself. Sleep deprivation can have negative effects on mental health, including anxiety, depression, and mood disorders.</p>
      <h3>Understanding Sleep</h3>
      <p>Sleep is a complex process that involves several stages, including REM sleep and non-REM sleep. REM sleep is the stage of sleep during which we dream, while non-REM sleep is the stage of sleep during which we are most deeply relaxed.</p>
      <h3>Common Sleep Disorders</h3>
      <p>Common sleep disorders include insomnia, sleep apnea, and restless leg syndrome. These disorders can interfere with sleep and have negative effects on mental health.</p>
      <h3>Effective Strategies for Improving Sleep</h3>
      <h4>1. Establish a Consistent Sleep Schedule</h4>
      <p>Going to bed and waking up at the same time every day can help regulate your sleep-wake cycle and improve sleep quality.</p>
      <h4>2. Create a Sleep-Conducive Environment</h4>
      <p>A comfortable sleep environment can help improve sleep quality. This includes a cool, dark, and quiet room.</p>
      <h4>3. Limit Exposure to Screens Before Bed</h4>
      <p>Exposure to screens before bed can interfere with sleep quality. It is recommended to avoid using electronic devices for at least an hour before bedtime.</p>
      <h4>4. Exercise Regularly</h4>
      <p>Regular physical activity can help improve sleep quality. Exercise releases endorphins, which are natural mood-boosters.</p>
      <h4>5. Avoid Caffeine and Alcohol</h4>
      <p>Caffeine and alcohol can interfere with sleep quality. It is recommended to avoid consuming these substances in the hours leading up to bedtime.</p>
      <h4>6. Manage Stress</h4>
      <p>Managing stress can help improve sleep quality. Techniques such as mindfulness and meditation can be helpful.</p>
      <h3>Remember: Sleep is Essential for Good Mental Health</h3>
      <p>Sleep is essential for maintaining good mental health. It is important to establish a consistent sleep schedule, create a sleep-conducive environment, and manage stress to improve sleep quality and reduce the impact of sleep deprivation on mental health.</p>
    `,
    author: 'Dr. Noura Al-Otaibi',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-08-28',
    imageUrl: 'https://images.unsplash.com/photo-1522621032211-ac0031dfbddc',
    tags: ['Sleep', 'Mental Health', 'Well-being']
  },
  {
    id: '7',
    title: 'The Impact of Work Environment on Mental Health',
    excerpt: 'The work environment can have a significant impact on mental health. Learn how to create a healthy work environment and reduce stress and burnout.',
    content: `
      <h2>The Impact of Work Environment on Mental Health</h2>
      <p>The work environment can have a significant impact on mental health. A positive work environment can help reduce stress and burnout, while a negative work environment can have negative effects on mental health.</p>
      <h3>Understanding the Work Environment</h3>
      <p>The work environment includes the physical and social aspects of the workplace. It includes factors such as the physical layout of the office, the work schedule, the work culture, and the relationships with colleagues and supervisors.</p>
      <h3>Common Work Environment Issues</h3>
      <p>Common work environment issues include poor communication, lack of support, and a lack of recognition. These issues can have negative effects on mental health.</p>
      <h3>Effective Strategies for Creating a Healthy Work Environment</h3>
      <h4>1. Establish Clear Communication Channels</h4>
      <p>Clear communication channels can help reduce stress and improve collaboration. This includes regular meetings, open-door policies, and clear expectations.</p>
      <h4>2. Provide Support and Resources</h4>
      <p>Providing support and resources can help reduce stress and improve mental health. This includes access to mental health resources, training and development opportunities, and opportunities for professional development.</p>
      <h4>3. Foster a Positive Work Culture</h4>
      <p>Fostering a positive work culture can help reduce stress and improve mental health. This includes creating a supportive and inclusive work environment, recognizing and rewarding employees, and promoting a culture of collaboration and teamwork.</p>
      <h4>4. Encourage Work-Life Balance</h4>
      <p>Encouraging work-life balance can help reduce stress and improve mental health. This includes providing flexible work arrangements, allowing employees to take time off for personal reasons, and promoting a culture of work-life balance.</p>
      <h4>5. Recognize and Reward Employees</h4>
      <p>Recognizing and rewarding employees can help reduce stress and improve mental health. This includes providing opportunities for recognition and rewards, such as bonuses, promotions, and awards.</p>
      <h3>Remember: A Healthy Work Environment Can Help Reduce Stress and Burnout</h3>
      <p>The work environment can have a significant impact on mental health. A positive work environment can help reduce stress and burnout, while a negative work environment can have negative effects on mental health. It is important to create a healthy work environment and provide support and resources to help employees manage stress and improve mental health.</p>
    `,
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-08-14',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    tags: ['Work Environment', 'Mental Health', 'Well-being']
  },
  {
    id: '8',
    title: 'The Benefits of Mindfulness and Meditation for Mental Health',
    excerpt: 'Mindfulness and meditation are powerful tools for improving mental health. Learn how to incorporate mindfulness and meditation into your daily routine and experience the benefits.',
    content: `
      <h2>The Benefits of Mindfulness and Meditation for Mental Health</h2>
      <p>Mindfulness and meditation are powerful tools for improving mental health. They can help reduce stress, improve focus, and enhance overall well-being.</p>
      <h3>Understanding Mindfulness and Meditation</h3>
      <p>Mindfulness is the practice of being present and aware of the present moment. It involves paying attention to your thoughts, feelings, and surroundings without judgment. Meditation is the practice of focusing your mind on a particular object, thought, or activity, with the goal of achieving a state of relaxation and inner peace.</p>
      <h3>Benefits of Mindfulness and Meditation</h3>
      <h4>1. Reduces Stress</h4>
      <p>Mindfulness and meditation can help reduce stress by helping you become more aware of your thoughts and feelings. This can help you manage stress more effectively and reduce the negative effects of stress on your mental and physical health.</p>
      <h4>2. Improves Focus</h4>
      <p>Mindfulness and meditation can help improve focus by training your mind to stay present and avoid distractions. This can help you be more productive and efficient in your daily activities.</p>
      <h4>3. Enhances Overall Well-being</h4>
      <p>Mindfulness and meditation can help enhance overall well-being by improving your mood, reducing anxiety and depression, and improving your sleep quality.</p>
      <h3>How to Incorporate Mindfulness and Meditation into Your Daily Routine</h3>
      <h4>1. Start with Short Sessions</h4>
      <p>Start with short sessions of mindfulness and meditation, such as 5-10 minutes per day. As you become more comfortable with the practice, you can gradually increase the duration of your sessions.</p>
      <h4>2. Find a Quiet and Comfortable Space</h4>
      <p>Find a quiet and comfortable space where you can practice mindfulness and meditation without distractions. This can be a chair, a cushion, or a cushioned mat.</p>
      <h4>3. Focus on Your Breath</h4>
      <p>Focus on your breath as you practice mindfulness and meditation. This can help you stay present and reduce distractions.</p>
      <h4>4. Be Patient and Kind to Yourself</h4>
      <p>Be patient and kind to yourself as you practice mindfulness and meditation. It is normal to experience moments of discomfort or difficulty, but with practice, you can become more comfortable and effective.</p>
      <h3>Remember: Mindfulness and Meditation Can Help Improve Mental Health</h3>
      <p>Mindfulness and meditation are powerful tools for improving mental health. They can help reduce stress, improve focus, and enhance overall well-being. By incorporating mindfulness and meditation into your daily routine, you can experience the benefits and improve your mental and physical health.</p>
    `,
    author: 'Dr. Ahmed Al-Shamri',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-07-30',
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    tags: ['Mindfulness', 'Meditation', 'Mental Health']
  },
  {
    id: '9',
    title: 'The Relationship Between Diet and Mental Health',
    excerpt: 'The relationship between diet and mental health is complex and multifaceted. Learn how what you eat can impact your mental health and how to make healthy food choices.',
    content: `
      <h2>The Relationship Between Diet and Mental Health</h2>
      <p>The relationship between diet and mental health is complex and multifaceted. What you eat can have a significant impact on your mental health, including mood, anxiety, and depression.</p>
      <h3>Understanding the Relationship Between Diet and Mental Health</h3>
      <p>The relationship between diet and mental health is complex and multifaceted. Factors such as the type of food you eat, the amount of food you eat, and the timing of your meals can all impact your mental health.</p>
      <h3>Common Foods That Can Impact Mental Health</h3>
      <p>Common foods that can impact mental health include:</p>
      <ul>
        <li>Whole grains</li>
        <li>Fruits and vegetables</li>
        <li>Protein-rich foods</li>
        <li>Healthy fats</li>
        <li>Omega-3 fatty acids</li>
        <li>Antioxidants</li>
      </ul>
      <h3>Common Foods That Can Have Negative Effects on Mental Health</h3>
      <p>Common foods that can have negative effects on mental health include:</p>
      <ul>
        <li>Sugar</li>
        <li>Processed foods</li>
        <li>Alcohol</li>
        <li>Caffeine</li>
        <li>Trans fats</li>
      </ul>
      <h3>How to Make Healthy Food Choices</h3>
      <h4>1. Eat a Balanced Diet</h4>
      <p>Eat a balanced diet that includes a variety of fruits, vegetables, whole grains, protein-rich foods, and healthy fats. This can help provide the necessary nutrients for the body and improve mental health.</p>
      <h4>2. Limit Sugar and Processed Foods</h4>
      <p>Limit your intake of sugar and processed foods, as they can have negative effects on mental health. Instead, focus on eating whole, nutrient-dense foods.</p>
      <h4>3. Drink Plenty of Water</h4>
      <p>Drink plenty of water to stay hydrated and improve mental health. Dehydration can lead to fatigue, irritability, and difficulty concentrating.</p>
      <h4>4. Get Enough Sleep</h4>
      <p>Get enough sleep to improve mental health. Lack of sleep can lead to increased stress and negative health effects.</p>
      <h4>5. Avoid Alcohol and Caffeine</h4>
      <p>Avoid alcohol and caffeine, as they can have negative effects on mental health. Instead, focus on drinking water and limiting your intake of caffeine.</p>
      <h4>6. Consider Taking Supplements</h4>
      <p>Consider taking supplements such as omega-3 fatty acids, B vitamins, and magnesium to improve mental health. These supplements can help provide the necessary nutrients for the body and improve mental health.</p>
      <h3>Remember: The Relationship Between Diet and Mental Health is Complex and Multifaceted</h3>
      <p>The relationship between diet and mental health is complex and multifaceted. What you eat can have a significant impact on your mental health, including mood, anxiety, and depression. By making healthy food choices, you can improve your mental health and overall well-being.</p>
    `,
    author: 'Dr. Noura Al-Otaibi',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['Diet', 'Mental Health', 'Well-being']
  },
  {
    id: '10',
    title: 'The Benefits of Building Positive Relationships',
    excerpt: 'Building positive relationships is essential for mental health. Learn how to develop and maintain positive relationships and how they can improve your overall well-being.',
    content: `
      <h2>The Benefits of Building Positive Relationships</h2>
      <p>Building positive relationships is essential for mental health. Positive relationships can help reduce stress, improve mood, and enhance overall well-being.</p>
      <h3>Understanding the Benefits of Positive Relationships</h3>
      <p>Positive relationships can have a significant impact on mental health. They can help reduce stress, improve mood, and enhance overall well-being.</p>
      <h3>Common Benefits of Positive Relationships</h3>
      <p>Common benefits of positive relationships include:</p>
      <ul>
        <li>Reduced stress</li>
        <li>Improved mood</li>
        <li>Enhanced overall well-being</li>
        <li>Increased self-esteem</li>
        <li>Improved communication skills</li>
        <li>Increased resilience</li>
      </ul>
      <h3>How to Develop and Maintain Positive Relationships</h3>
      <h4>1. Practice Active Listening</h4>
      <p>Practice active listening to develop and maintain positive relationships. This involves paying attention to the other person's words and feelings, and responding in a way that shows you are listening and understanding.</p>
      <h4>2. Show Empathy</h4>
      <p>Show empathy to develop and maintain positive relationships. This involves putting yourself in the other person's shoes and understanding their perspective.</p>
      <h4>3. Be Kind and Respectful</h4>
      <p>Be kind and respectful to develop and maintain positive relationships. This involves treating others with kindness and respect, and avoiding negative behavior.</p>
      <h4>4. Communicate Openly and Honestly</h4>
      <p>Communicate openly and honestly to develop and maintain positive relationships. This involves being transparent and honest with others, and being willing to listen to their perspective.</p>
      <h4>5. Seek Support and Help When Needed</h4>
      <p>Seek support and help when needed to develop and maintain positive relationships. This involves reaching out to friends, family, or professionals when you need support or help.</p>
      <h3>Remember: Building Positive Relationships is Essential for Mental Health</h3>
      <p>Building positive relationships is essential for mental health. Positive relationships can help reduce stress, improve mood, and enhance overall well-being. By developing and maintaining positive relationships, you can improve your mental health and overall well-being.</p>
    `,
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-07-05',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Relationships', 'Mental Health', 'Well-being']
  },
  {
    id: '11',
    title: 'How to Overcome Grief and Loss',
    excerpt: 'Grief and loss can be a difficult and painful experience. Learn effective strategies for coping with grief and loss and how to find meaning and healing.',
    content: `
      <h2>How to Overcome Grief and Loss</h2>
      <p>Grief and loss can be a difficult and painful experience. It is a natural response to the loss of a loved one, a significant life event, or a change in circumstances. Grief can be a complex and multifaceted experience, and it can take time to heal.</p>
      <h3>Understanding Grief and Loss</h3>
      <p>Grief and loss can be a complex and multifaceted experience. It can be triggered by a variety of factors, including the loss of a loved one, a significant life event, or a change in circumstances. Grief can be a physical, emotional, and psychological experience.</p>
      <h3>Common Symptoms of Grief and Loss</h3>
      <p>Common symptoms of grief and loss include:</p>
      <ul>
        <li>Feeling sad or depressed</li>
        <li>Feeling angry or irritable</li>
        <li>Feeling numb or disconnected</li>
        <li>Feeling guilty or ashamed</li>
        <li>Feeling anxious or worried</li>
        <li>Having difficulty sleeping</li>
        <li>Having difficulty concentrating</li>
        <li>Having physical symptoms such as headaches, nausea, or fatigue</li>
      </ul>
      <h3>Effective Strategies for Coping with Grief and Loss</h3>
      <h4>1. Allow Yourself to Feel Your Emotions</h4>
      <p>Allow yourself to feel your emotions as you grieve. It is normal to experience a range of emotions, including sadness, anger, and guilt. It is important to allow yourself to feel these emotions without judgment or criticism.</p>
      <h4>2. Seek Support from Others</h4>
      <p>Seek support from others as you grieve. This can include friends, family, or professionals. Talking to others can help you process your emotions and find support.</p>
      <h4>3. Take Care of Yourself</h4>
      <p>Take care of yourself as you grieve. This can include eating a balanced diet, getting enough sleep, and engaging in physical activity. It is important to take care of yourself to help you heal and move forward.</p>
      <h4>4. Practice Mindfulness and Meditation</h4>
      <p>Practice mindfulness and meditation as you grieve. This can help you stay present and reduce stress. Mindfulness and meditation can also help you process your emotions and find inner peace.</p>
      <h4>5. Find Meaning and Healing</h4>
      <p>Find meaning and healing as you grieve. This can include finding ways to honor the memory of the person who has passed away, finding ways to cope with the loss, and finding ways to find meaning in the experience.</p>
      <h3>Remember: Grief and Loss is a Normal and Natural Experience</h3>
      <p>Grief and loss is a normal and natural experience. It is important to allow yourself to feel your emotions, seek support from others, take care of yourself, practice mindfulness and meditation, and find meaning and healing. With time and support, you can find peace and healing.</p>
    `,
    author: 'Dr. Ahmed Al-Shamri',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-06-10',
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    tags: ['Grief', 'Loss', 'Mental Health']
  },
  {
    id: '12',
    title: 'The Benefits of Self-Reflection and Self-Care',
    excerpt: 'Self-reflection and self-care are essential for mental health. Learn how to practice self-reflection and self-care and how they can improve your overall well-being.',
    content: `
      <h2>The Benefits of Self-Reflection and Self-Care</h2>
      <p>Self-reflection and self-care are essential for mental health. They can help you develop a deeper understanding of yourself, improve your self-esteem, and enhance your overall well-being.</p>
      <h3>Understanding Self-Reflection and Self-Care</h3>
      <p>Self-reflection and self-care are essential for mental health. They involve taking time to reflect on your thoughts, feelings, and behaviors, and taking steps to care for yourself.</p>
      <h3>Benefits of Self-Reflection and Self-Care</h3>
      <h4>1. Improves Self-Understanding</h4>
      <p>Self-reflection and self-care can help you develop a deeper understanding of yourself. This can help you understand your strengths, weaknesses, and values, and can help you make better decisions.</p>
      <h4>2. Improves Self-Esteem</h4>
      <p>Self-reflection and self-care can help you improve your self-esteem. This can help you feel more confident and self-assured, and can help you build positive relationships.</p>
      <h4>3. Enhances Overall Well-being</h4>
      <p>Self-reflection and self-care can help enhance overall well-being. This can help you feel more relaxed, focused, and energized, and can help you manage stress and anxiety.</p>
      <h3>How to Practice Self-Reflection and Self-Care</h3>
      <h4>1. Set Goals</h4>
      <p>Set goals for self-reflection and self-care. This can help you stay focused and motivated. Goals can include setting aside time for self-reflection and self-care, setting boundaries, and taking care of yourself.</p>
      <h4>2. Practice Mindfulness and Meditation</h4>
      <p>Practice mindfulness and meditation to help you stay present and reduce stress. Mindfulness and meditation can also help you process your emotions and find inner peace.</p>
      <h4>3. Take Care of Yourself</h4>
      <p>Take care of yourself by eating a balanced diet, getting enough sleep, and engaging in physical activity. It is important to take care of yourself to help you feel your best and to improve your overall well-being.</p>
      <h4>4. Connect with Others</h4>
      <p>Connect with others to help you feel supported and connected. This can include spending time with friends, family, or professionals. Connecting with others can help you feel more connected and supported, and can help you build positive relationships.</p>
      <h4>5. Practice Self-Compassion</h4>
      <p>Practice self-compassion to help you be kind and understanding of yourself. This can help you feel more relaxed and less stressed, and can help you build positive relationships.</p>
      <h3>Remember: Self-Reflection and Self-Care are Essential for Mental Health</h3>
      <p>Self-reflection and self-care are essential for mental health. They can help you develop a deeper understanding of yourself, improve your self-esteem, and enhance your overall well-being. By practicing self-reflection and self-care, you can feel your best and improve your mental and physical health.</p>
    `,
    author: 'Dr. Noura Al-Otaibi',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-06-20',
    imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    tags: ['Self-Reflection', 'Self-Care', 'Mental Health']
  }
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
