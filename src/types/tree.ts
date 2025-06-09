
export interface Tree {
  id: string;
  name: string;
  scientificName: string;
  localName?: string;
  category: 'farm' | 'community' | 'nursery';
  location: {
    lat: number;
    lng: number;
    h3Index: string;
    address?: string;
  };
  measurements: {
    height?: number;
    trunkWidth?: number;
    canopySpread?: number;
  };
  photos: {
    tree?: string;
    leaves?: string;
    bark?: string;
    fruit?: string;
    flower?: string;
  };
  metadata: {
    taxonomy?: {
      kingdom?: string;
      family?: string;
      genus?: string;
      species?: string;
    };
    uses?: string[];
    medicinalBenefits?: string[];
    ecologicalRelevance?: string;
  };
  taggedBy: string;
  taggedAt: Date;
  isAIGenerated: boolean;
  isVerified: boolean;
}

export interface TreeFormData {
  name: string;
  scientificName: string;
  localName?: string;
  category: 'farm' | 'community' | 'nursery';
  height?: number;
  trunkWidth?: number;
  photos: {
    tree?: File;
    leaves?: File;
    bark?: File;
    fruit?: File;
    flower?: File;
  };
  notes?: string;
}
