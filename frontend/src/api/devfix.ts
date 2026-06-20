import api from './axios';
import type { Technology, TechError } from '../types';

// ── Technologies ─────────────────────────────────────────────────────────────
export const getAllTechnologies = (): Promise<Technology[]> =>
  api.get('/technologies').then(r => r.data);

export const getTechnologyById = (id: number): Promise<Technology> =>
  api.get(`/technologies/${id}`).then(r => r.data);

// ── Errors ────────────────────────────────────────────────────────────────────
export const getAllErrors = (): Promise<TechError[]> =>
  api.get('/errors').then(r => r.data);

export const getErrorById = (id: number): Promise<TechError> =>
  api.get(`/errors/${id}`).then(r => r.data);

export const searchErrors = (query: string): Promise<TechError[]> =>
  api.get('/errors/search', { params: { q: query } }).then(r => r.data);

export const getErrorsByTechnology = (techId: number): Promise<TechError[]> =>
  api.get(`/errors/technology/${techId}`).then(r => r.data);

export const getErrorsBySeverity = (level: string): Promise<TechError[]> =>
  api.get(`/errors/severity/${level}`).then(r => r.data);
