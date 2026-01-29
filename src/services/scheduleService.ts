import { GlobalEvent, TechnicalSession, Paper, CSVImportResult } from '@/types';

// Global Events Management
export const getAllGlobalEvents = (): GlobalEvent[] => {
  const eventsStr = localStorage.getItem('globalEvents');
  if (!eventsStr) return [];
  try {
    return JSON.parse(eventsStr);
  } catch {
    return [];
  }
};

export const saveGlobalEvent = (event: Omit<GlobalEvent, 'id' | 'createdAt' | 'updatedAt'>): GlobalEvent => {
  const events = getAllGlobalEvents();
  const newEvent: GlobalEvent = {
    ...event,
    id: `ge-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  events.push(newEvent);
  localStorage.setItem('globalEvents', JSON.stringify(events));
  return newEvent;
};

export const updateGlobalEvent = (id: string, updates: Partial<GlobalEvent>): GlobalEvent | null => {
  const events = getAllGlobalEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  events[index] = {
    ...events[index],
    ...updates,
    updatedAt: new Date(),
  };
  localStorage.setItem('globalEvents', JSON.stringify(events));
  return events[index];
};

export const deleteGlobalEvent = (id: string): boolean => {
  const events = getAllGlobalEvents();
  const filtered = events.filter(e => e.id !== id);
  if (filtered.length === events.length) return false;
  
  localStorage.setItem('globalEvents', JSON.stringify(filtered));
  return true;
};

// Technical Sessions Management
export const getAllTechnicalSessions = (): TechnicalSession[] => {
  const sessionsStr = localStorage.getItem('technicalSessions');
  if (!sessionsStr) return [];
  try {
    return JSON.parse(sessionsStr);
  } catch {
    return [];
  }
};

export const saveTechnicalSession = (session: Omit<TechnicalSession, 'id' | 'createdAt' | 'updatedAt' | 'papers'>): TechnicalSession => {
  const sessions = getAllTechnicalSessions();
  const newSession: TechnicalSession = {
    ...session,
    id: `ts-${Date.now()}`,
    papers: [],
    assignedPaperIds: session.assignedPaperIds || [], // Support new paper assignment system
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  sessions.push(newSession);
  localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  return newSession;
};

export const updateTechnicalSession = (id: string, updates: Partial<TechnicalSession>): TechnicalSession | null => {
  const sessions = getAllTechnicalSessions();
  const index = sessions.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  sessions[index] = {
    ...sessions[index],
    ...updates,
    updatedAt: new Date(),
  };
  localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  return sessions[index];
};

export const deleteTechnicalSession = (id: string): boolean => {
  const sessions = getAllTechnicalSessions();
  const filtered = sessions.filter(s => s.id !== id);
  if (filtered.length === sessions.length) return false;
  
  localStorage.setItem('technicalSessions', JSON.stringify(filtered));
  return true;
};

// Papers Management
export const addPaperToSession = (sessionId: string, paperData: Omit<Paper, 'id' | 'createdAt' | 'updatedAt' | 'sessionId'>): Paper | null => {
  const sessions = getAllTechnicalSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return null;
  
  // Check for duplicate paper ID
  if (session.papers.some(p => p.paperId === paperData.paperId)) {
    throw new Error(`Paper ID ${paperData.paperId} already exists in this session`);
  }
  
  const newPaper: Paper = {
    ...paperData,
    id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sessionId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  session.papers.push(newPaper);
  session.updatedAt = new Date();
  localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  return newPaper;
};

export const updatePaper = (paperId: string, updates: Partial<Paper>): Paper | null => {
  const sessions = getAllTechnicalSessions();
  let updatedPaper: Paper | null = null;
  
  for (const session of sessions) {
    const paperIndex = session.papers.findIndex(p => p.id === paperId);
    if (paperIndex !== -1) {
      session.papers[paperIndex] = {
        ...session.papers[paperIndex],
        ...updates,
        updatedAt: new Date(),
      };
      session.updatedAt = new Date();
      updatedPaper = session.papers[paperIndex];
      break;
    }
  }
  
  if (updatedPaper) {
    localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  }
  return updatedPaper;
};

export const deletePaper = (paperId: string): boolean => {
  const sessions = getAllTechnicalSessions();
  let deleted = false;
  
  for (const session of sessions) {
    const originalLength = session.papers.length;
    session.papers = session.papers.filter(p => p.id !== paperId);
    if (session.papers.length < originalLength) {
      session.updatedAt = new Date();
      deleted = true;
      break;
    }
  }
  
  if (deleted) {
    localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  }
  return deleted;
};

export const reorderPapers = (sessionId: string, paperIds: string[]): boolean => {
  const sessions = getAllTechnicalSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return false;
  
  // Reorder papers based on paperIds array
  const reorderedPapers = paperIds.map((id, index) => {
    const paper = session.papers.find(p => p.id === id);
    if (!paper) return null;
    return { ...paper, displayOrder: index };
  }).filter(p => p !== null) as Paper[];
  
  session.papers = reorderedPapers;
  session.updatedAt = new Date();
  localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  return true;
};

// CSV Import
export const importPapersFromCSV = (csvData: string): CSVImportResult => {
  const errors: any[] = [];
  let importedCount = 0;
  
  const lines = csvData.trim().split('\n');
  if (lines.length < 2) {
    return {
      success: false,
      importedCount: 0,
      errors: [{ line: 0, error: 'CSV file is empty or invalid' }],
    };
  }
  
  // Parse header
  const header = lines[0].split(',').map(h => h.trim());
  const expectedHeaders = ['Session ID', 'Paper ID', 'Paper Title', 'Authors'];
  
  // Validate header
  if (header.length < 4 || !expectedHeaders.every((h, i) => header[i] === h)) {
    return {
      success: false,
      importedCount: 0,
      errors: [{ line: 1, error: `Invalid CSV header. Expected: ${expectedHeaders.join(', ')}` }],
    };
  }
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = parseCSVLine(line);
    if (values.length < 4) {
      errors.push({ line: i + 1, error: 'Missing required fields' });
      continue;
    }
    
    const [sessionId, paperId, paperTitle, authors] = values;
    
    // Validate session exists
    const sessions = getAllTechnicalSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      errors.push({ line: i + 1, error: `Session ID ${sessionId} not found` });
      continue;
    }
    
    // Check for duplicate paper ID
    if (session.papers.some(p => p.paperId === paperId)) {
      errors.push({ line: i + 1, error: `Paper ID ${paperId} already exists` });
      continue;
    }
    
    // Add paper
    try {
      addPaperToSession(sessionId, {
        paperId,
        paperTitle,
        authors,
        displayOrder: session.papers.length,
      });
      importedCount++;
    } catch (error: any) {
      errors.push({ line: i + 1, error: error.message });
    }
  }
  
  return {
    success: errors.length === 0,
    importedCount,
    errors,
  };
};

// Helper function to parse CSV line (handles quoted values)
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
};

// NEW: Assign papers from AbstractSubmission to Technical Session
export const assignPapersToSession = (sessionId: string, paperIds: string[]): boolean => {
  const sessions = getAllTechnicalSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return false;
  
  // Update assigned paper IDs
  session.assignedPaperIds = paperIds;
  session.updatedAt = new Date();
  
  localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  return true;
};

// NEW: Get assigned papers for a session
export const getAssignedPapers = (sessionId: string): string[] => {
  const sessions = getAllTechnicalSessions();
  const session = sessions.find(s => s.id === sessionId);
  return session?.assignedPaperIds || [];
};

// NEW: Remove paper assignment from session when paper status changes
export const removePaperFromAllSessions = (submissionId: string): void => {
  const sessions = getAllTechnicalSessions();
  let updated = false;
  
  sessions.forEach(session => {
    if (session.assignedPaperIds && session.assignedPaperIds.includes(submissionId)) {
      session.assignedPaperIds = session.assignedPaperIds.filter(id => id !== submissionId);
      session.updatedAt = new Date();
      updated = true;
    }
  });
  
  if (updated) {
    localStorage.setItem('technicalSessions', JSON.stringify(sessions));
  }
};
