/**
 * TypeScript types that mirror the Spring Boot entity shapes.
 * Keep these in sync with the Java entities.
 */

export interface Technology {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  latestVersion: string | null;
  downloadUrl: string | null;
  officialWebsite: string | null;
  commonErrors: string | null;
  installationSteps: string | null;
  errors?: TechError[];
}

export interface TechError {
  id: number;
  errorCode: string;
  errorMessage: string;
  category: string | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
  osAffected: string | null;
  cause: string;
  solution: string;
  tags: string | null;
  technology: Omit<Technology, 'errors'>;
}
