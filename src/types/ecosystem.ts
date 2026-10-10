export type EcosystemNodeType =
  | 'site'
  | 'product'
  | 'system'
  | 'crm'
  | 'automation'
  | 'integration'
  | 'internal_tool'
  | 'in_development';

export type EcosystemNodeStatus = 'active' | 'beta' | 'development' | 'planned';

export type ArchitectureLayer = 'public' | 'operations' | 'platform' | 'infra';

export interface EcosystemConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relationshipLabel: string;
  isVerified: boolean;
  protocol?: string;
}

export interface EcosystemNode {
  id: string;
  name: string;
  type: EcosystemNodeType;
  categoryLabel: string;
  summary: string;
  /**
   * Explicación directa y humana sin tecnicismos para clientes de negocio.
   */
  businessValue: string;
  status: EcosystemNodeStatus;
  architectureLayer: ArchitectureLayer;
  publicUrl?: string;
  caseStudySlug?: string;
  connectedTo: string[];
  isDemoData: boolean;
  verifiedTechnologies: string[];
  iconName: string;
  keyDeliverable: string;
}

