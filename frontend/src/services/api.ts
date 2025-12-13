// services/api.ts

// Default backend URL - this can be overridden by setting window.__BACKEND_URL__
// in the HTML template or by using a build-time environment variable
const DEFAULT_BACKEND_URL = 'http://localhost:5000';

// Get the backend URL from a global variable if available, otherwise use the default
const BACKEND_URL =
  typeof window !== 'undefined' && (window as any).__BACKEND_URL__
    ? (window as any).__BACKEND_URL__
    : DEFAULT_BACKEND_URL;

export const generateText = async (): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/generate-text`);
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error generating text:', error);
    return "Error generating text. Please try again.";
  }
};

export const generateMultipleTexts = async (count: number = 5): Promise<string[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/generate-text-multiple?count=${count}`);
    const data = await response.json();
    return data.texts;
  } catch (error) {
    console.error('Error generating multiple texts:', error);
    return ["Error generating text. Please try again."];
  }
};