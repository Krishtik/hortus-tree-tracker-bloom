
interface TreeIdentificationResult {
  scientificName: string;
  commonName: string;
  localName?: string;
  confidence: number;
  taxonomy: {
    kingdom: string;
    family: string;
    genus: string;
    species: string;
  };
  uses: string[];
  medicinalBenefits: string[];
  ecologicalRelevance: string;
  characteristics: {
    leafType?: string;
    barkTexture?: string;
    height?: string;
    habitat?: string;
  };
}

class AIService {
  private apiKey: string | null = null;

  constructor() {
    // In production, this would come from environment variables
    this.apiKey = localStorage.getItem('ai_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('ai_api_key', key);
  }

  async identifyTree(imageFile: File): Promise<TreeIdentificationResult> {
    if (!this.apiKey) {
      throw new Error('AI API key not configured');
    }

    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // For now, we'll simulate AI response
      // In production, this would call OpenAI Vision API or similar
      const mockResult = await this.simulateAIIdentification(base64Image);
      
      return mockResult;
    } catch (error) {
      console.error('Error identifying tree:', error);
      throw new Error('Failed to identify tree. Please try again.');
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  }

  private async simulateAIIdentification(base64Image: string): Promise<TreeIdentificationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data - in production this would come from AI API
    const mockTrees = [
      {
        scientificName: 'Mangifera indica',
        commonName: 'Mango Tree',
        localName: 'आम का पेड़',
        confidence: 0.92,
        taxonomy: {
          kingdom: 'Plantae',
          family: 'Anacardiaceae',
          genus: 'Mangifera',
          species: 'M. indica'
        },
        uses: ['Fruit production', 'Timber', 'Shade'],
        medicinalBenefits: ['Anti-inflammatory', 'Antioxidant', 'Digestive aid'],
        ecologicalRelevance: 'Provides habitat for birds and insects, carbon sequestration',
        characteristics: {
          leafType: 'Simple, alternate',
          barkTexture: 'Rough, dark brown',
          height: '10-40 meters',
          habitat: 'Tropical and subtropical regions'
        }
      },
      {
        scientificName: 'Azadirachta indica',
        commonName: 'Neem Tree',
        localName: 'नीम का पेड़',
        confidence: 0.88,
        taxonomy: {
          kingdom: 'Plantae',
          family: 'Meliaceae',
          genus: 'Azadirachta',
          species: 'A. indica'
        },
        uses: ['Medicinal', 'Pest control', 'Timber'],
        medicinalBenefits: ['Antibacterial', 'Antifungal', 'Immune booster'],
        ecologicalRelevance: 'Natural pesticide, soil improvement, drought resistant',
        characteristics: {
          leafType: 'Compound, pinnate',
          barkTexture: 'Rough, fissured',
          height: '15-20 meters',
          habitat: 'Arid and semi-arid regions'
        }
      }
    ];

    // Return random mock tree for demo
    return mockTrees[Math.floor(Math.random() * mockTrees.length)];
  }

  async generateTreeMetadata(scientificName: string): Promise<Partial<TreeIdentificationResult>> {
    // This would use LLM to generate additional metadata
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      uses: ['Shade', 'Timber', 'Ecological benefits'],
      medicinalBenefits: ['Traditional medicine', 'Natural remedies'],
      ecologicalRelevance: 'Important for local ecosystem and biodiversity'
    };
  }
}

export const aiService = new AIService();
export type { TreeIdentificationResult };
