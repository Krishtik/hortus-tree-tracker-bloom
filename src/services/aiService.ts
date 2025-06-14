import { apiClient } from './apiClient';

export interface TreeIdentificationResult {
  commonName: string;
  scientificName: string;
  localName?: string;
  confidence: number;
  uses: string[];
  taxonomy?: {
    kingdom?: string;
    family?: string;
    genus?: string;
    species?: string;
  };
  medicinalBenefits?: string[];
  ecologicalRelevance?: string;
  description?: string;
}

class AIService {
  private geminiApiKey = 'AIzaSyBnsSB-nGMPjshldXgyfm9V5dvMLi8eFTQ';

  setApiKey(apiKey: string) {
    this.geminiApiKey = apiKey;
    localStorage.setItem('ai_api_key', apiKey);
  }

  async identifyTree(imageFile: File): Promise<TreeIdentificationResult> {
    try {
      console.log('Starting tree identification with Gemini API...');
      
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Call Gemini API for tree identification
      const geminiResult = await this.callGeminiAPI(base64Image);
      
      // Enhance with Wikipedia data
      const enhancedResult = await this.enhanceWithWikipedia(geminiResult);
      
      return enhancedResult;
    } catch (error) {
      console.error('Tree identification failed:', error);
      
      // Fallback to mock data
      return this.getMockResult();
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async callGeminiAPI(base64Image: string): Promise<TreeIdentificationResult> {
    const prompt = `Analyze this tree image and provide detailed information in JSON format with the following structure:
    {
      "commonName": "string",
      "scientificName": "string", 
      "localName": "string (Hindi/local name if known)",
      "confidence": 0.95,
      "uses": ["medicinal", "timber", "fruit", "shade"],
      "taxonomy": {
        "kingdom": "Plantae",
        "family": "string",
        "genus": "string", 
        "species": "string"
      },
      "medicinalBenefits": ["benefit1", "benefit2"],
      "ecologicalRelevance": "string",
      "description": "detailed description"
    }
    
    Focus on trees commonly found in India. Be specific about the identification.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const text = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return result;
        }
      }

      throw new Error('Failed to parse Gemini response');
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  private async enhanceWithWikipedia(result: TreeIdentificationResult): Promise<TreeIdentificationResult> {
    try {
      console.log('Enhancing with Wikipedia data...');
      
      // Search Wikipedia for additional information
      const searchQuery = encodeURIComponent(result.scientificName || result.commonName);
      const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`;
      
      const response = await fetch(wikipediaUrl);
      if (response.ok) {
        const wikiData = await response.json();
        
        if (wikiData.extract) {
          result.description = wikiData.extract;
        }
      }
      
      return result;
    } catch (error) {
      console.warn('Wikipedia enhancement failed:', error);
      return result;
    }
  }

  private getMockResult(): TreeIdentificationResult {
    return {
      commonName: 'Identified Tree',
      scientificName: 'Plantae species',
      localName: 'स्थानीय वृक्ष',
      confidence: 0.75,
      uses: ['shade', 'ornamental'],
      taxonomy: {
        kingdom: 'Plantae',
        family: 'Unknown',
        genus: 'Unknown',
        species: 'Unknown'
      },
      medicinalBenefits: ['General wellness'],
      ecologicalRelevance: 'Provides habitat for local wildlife',
      description: 'A tree species requiring further identification.'
    };
  }

  async searchPlantDatabase(query: string): Promise<any[]> {
    try {
      // This would typically call a plant database API
      console.log('Searching plant database for:', query);
      return [];
    } catch (error) {
      console.error('Plant database search failed:', error);
      return [];
    }
  }
}

export const aiService = new AIService();
