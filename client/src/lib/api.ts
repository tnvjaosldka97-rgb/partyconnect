// API client for hosts and parties
import type { HostApplication, Party } from './storage';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://partybear.vercel.app/api'
  : '/api';

// Host Application API
export async function fetchHostApplications(): Promise<HostApplication[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hosts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch host applications: ${response.statusText}`);
    }
    const data = await response.json();
    return data.applications || [];
  } catch (error) {
    console.error('Error fetching host applications:', error);
    return [];
  }
}

export async function createHostApplication(application: HostApplication): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/hosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(application),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create host application: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating host application:', error);
    return false;
  }
}

export async function updateHostApplicationStatus(
  id: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/hosts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status, rejectionReason }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update host application: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating host application:', error);
    return false;
  }
}

export async function deleteHostApplication(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/hosts?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete host application: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting host application:', error);
    return false;
  }
}

// Party API
export async function fetchParties(): Promise<Party[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/parties`);
    if (!response.ok) {
      throw new Error(`Failed to fetch parties: ${response.statusText}`);
    }
    const data = await response.json();
    return data.parties || [];
  } catch (error) {
    console.error('Error fetching parties:', error);
    return [];
  }
}

export async function createParty(party: Party): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/parties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(party),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create party: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating party:', error);
    return false;
  }
}

export async function updatePartyStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/parties`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update party status: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating party status:', error);
    return false;
  }
}

export async function updateParty(id: string, updates: Partial<Party>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/parties`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update party: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating party:', error);
    return false;
  }
}

export async function deleteParty(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/parties?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete party: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting party:', error);
    return false;
  }
}

