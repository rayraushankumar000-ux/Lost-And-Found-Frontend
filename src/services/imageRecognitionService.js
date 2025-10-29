// Mock image recognition service
export const imageRecognitionService = {
  // Analyze image and extract features
  analyzeImage: async (imageFile) => {
    // In a real application, this would call an AI/ML API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock analysis results
        const features = {
          colors: ['black', 'silver'],
          categories: ['electronics', 'phone'],
          brand: 'Apple',
          model: 'iPhone 13',
          confidence: 0.87
        };
        resolve(features);
      }, 2000);
    });
  },

  // Compare two images for similarity
  compareImages: async (image1, image2) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock similarity score
        const similarity = Math.random() * 100;
        resolve({
          similarity: Math.round(similarity),
          match: similarity > 70
        });
      }, 1500);
    });
  },

  // Extract text from image (OCR)
  extractText: async (imageFile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock OCR results
        const text = "Sample text extracted from image";
        resolve({
          text: text,
          confidence: 0.92
        });
      }, 1000);
    });
  }
};

export default imageRecognitionService;