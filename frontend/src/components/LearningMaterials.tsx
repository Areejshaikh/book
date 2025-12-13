import React, { useState, useEffect } from 'react';
import { QuizComponent } from './QuizComponent';
import { getLearningMaterials } from '../services/learningMaterialsService';
import { LearningMaterial, QuizQuestion } from '../types/learningMaterials';

interface LearningMaterialsProps {
  chapterId: number;
}

export const LearningMaterials: React.FC<LearningMaterialsProps> = ({ chapterId }) => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'quiz' | 'boosters'>('summary');

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      try {
        const materialsData = await getLearningMaterials(chapterId);
        setMaterials(materialsData);
      } catch (err) {
        setError('Failed to load learning materials');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningMaterials();
  }, [chapterId]);

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading learning materials...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Find the summary material
  const summary = materials.find(material => material.material_type === 'summary');
  // Find quiz questions
  const quizMaterial = materials.find(material => material.material_type === 'quiz');
  let quizQuestions: QuizQuestion[] = [];
  
  if (quizMaterial && quizMaterial.content) {
    try {
      // Assuming quiz content is a JSON string of questions
      quizQuestions = JSON.parse(quizMaterial.content);
    } catch (e) {
      console.error('Error parsing quiz questions:', e);
    }
  }
  
  // Find learning boosters
  const boosters = materials.find(material => material.material_type === 'learning_booster');

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Learning Materials</h2>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quiz'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('boosters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'boosters'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Learning Boosters
          </button>
        </nav>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        {activeTab === 'summary' && summary && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Chapter Summary</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: summary.content }} 
            />
          </div>
        )}
        
        {activeTab === 'quiz' && quizQuestions.length > 0 && (
          <QuizComponent 
            questions={quizQuestions} 
            onComplete={(score, total) => console.log(`Quiz completed: ${score}/${total}`)} 
          />
        )}
        
        {activeTab === 'boosters' && boosters && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Learning Boosters</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: boosters.content }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};