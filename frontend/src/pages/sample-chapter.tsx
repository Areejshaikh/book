import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { ChapterComponent } from '../components/Chapter/ChapterComponent';
import { RAGChatComponent } from '../components/RAGChat/RAGChatComponent';
import { TranslationControls } from '../components/TranslationControls';

const SampleChapter = () => {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const chapterData = {
    title: "Foundations of Physical AI",
    content: `
      <h2>Introduction to Physical AI</h2>
      <p>Physical AI represents a paradigm shift in artificial intelligence, emphasizing the integration of AI with the physical world through embodied systems. Unlike traditional AI that operates primarily in digital spaces, Physical AI leverages the physical properties of systems to achieve intelligent behavior.</p>
      
      <h3>Defining Physical AI</h3>
      <p>Physical AI encompasses approaches where intelligence emerges from the interaction between computational algorithms and physical systems. This includes:</p>
      <ul>
        <li>Embodied cognition principles</li>
        <li>Morphological computation</li>
        <li>Material intelligence</li>
        <li>Sensorimotor learning</li>
      </ul>
      
      <h3>Key Principles</h3>
      <h4>Embodiment</h4>
      <p>The body is not merely an output device for AI but an integral part of intelligence. The physical form influences cognitive processes and learning capabilities.</p>
      
      <h4>Morphological Computation</h4>
      <p>Physical properties of the body (e.g., elasticity, compliance, dynamics) contribute to computation, reducing the burden on central processing units.</p>
    `,
    learningObjectives: [
      "Define Physical AI and distinguish it from traditional AI",
      "Explain the concept of embodied cognition",
      "Identify applications of Physical AI in robotics"
    ],
    prerequisites: [
      "Basic understanding of robotics concepts",
      "Familiarity with AI fundamentals"
    ],
    quizQuestions: [
      {
        id: 1,
        question: "What distinguishes Physical AI from traditional AI?",
        options: [
          "Focus on digital spaces only",
          "Integration with the physical world through embodied systems",
          "Emphasis on computational speed",
          "Exclusively software-based approaches"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "In Physical AI, what does 'embodiment' refer to?",
        options: [
          "The use of advanced processors",
          "The AI operating only in cloud environments",
          "The body being an integral part of intelligence",
          "The physical appearance of robots"
        ],
        correctAnswer: 2
      }
    ]
  };

  const handleTranslate = async (targetLanguage: string) => {
    setIsTranslating(true);
    
    // Simulate translation API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (targetLanguage === 'ur') {
      setTranslatedContent(`
        <h2>متعامدہ ای آئی کا تعارف</h2>
        <p>متعامدہ ای آئی مصنوعی ذہانت میں ایک نظریاتی بارش کی نمائندگی کرتا ہے، جو کہ مادی دنیا کے ساتھ ای آئی کو ضم کرنے پر زور دیتا ہے۔ روایتی ای آئی کے برعکس جو بنیادی طور پر ڈیجیٹل خلا میں کام کرتا ہے، متعامدہ ای آئی نظام کی مادی خصوصیات کا استعمال ذہانت مندی حاصل کرنے کے لئے کرتا ہے۔</p>
        
        <h3>متعامدہ ای آئی کی وضاحت</h3>
        <p>متعامدہ ای آئی ایس طریقہ کار کا احاطہ کرتا ہے جہاں ذہانت کمپیوٹیشنل الگورتھمز اور مادی نظام کے تعامل سے نمودار ہوتی ہے۔ اس میں شامل ہیں:</p>
        <ul>
          <li>جسمانی شعور کے اصول</li>
          <li>روپ و محسوس کی معلومات</li>
          <li>مواد کی ذہانت</li>
          <li>احساس و عمل کے سیکھنے کا طریقہ</li>
        </ul>
      `);
      setCurrentLanguage('ur');
    } else {
      setTranslatedContent(null);
      setCurrentLanguage('en');
    }
    
    setIsTranslating(false);
  };

  return (
    <Layout title="Sample Chapter - Physical AI Foundations" description="A chapter on Physical AI foundations">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <TranslationControls 
            onTranslate={handleTranslate}
            isTranslating={isTranslating}
            currentLanguage={currentLanguage}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ChapterComponent
              title={chapterData.title}
              content={translatedContent || chapterData.content}
              learningObjectives={chapterData.learningObjectives}
              prerequisites={chapterData.prerequisites}
              quizQuestions={chapterData.quizQuestions}
              onProgressUpdate={(progress) => console.log(`Chapter progress: ${progress}%`)}
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Chapter Content</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-600 hover:underline">Introduction</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Defining Physical AI</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Key Principles</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Applications</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Challenges</a></li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="font-semibold mb-3">Ask AI Assistant</h3>
                <RAGChatComponent chapterId={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SampleChapter;