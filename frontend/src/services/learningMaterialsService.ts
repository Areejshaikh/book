import { LearningMaterial } from '../types/learningMaterials';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const getLearningMaterials = async (chapterId: number): Promise<LearningMaterial[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/learning-materials`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching learning materials for chapter ${chapterId}:`, error);
    throw error;
  }
};