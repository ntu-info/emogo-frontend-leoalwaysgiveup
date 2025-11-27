/**
 * Database utility for EmoGo App
 * Uses localStorage for Web, SQLite for Native
 */

import { Platform } from 'react-native';

// Check if we're on web
const isWeb = Platform.OS === 'web';

// Data storage
let dataStore = {
  mood_entries: [],
  vlog_entries: [],
  location_entries: [],
};

// SQLite database (only for native)
let db = null;

/**
 * Initialize the database
 */
export async function initDatabase() {
  if (isWeb) {
    // Web: Load from localStorage
    try {
      const stored = localStorage.getItem('emogo_data');
      if (stored) {
        dataStore = JSON.parse(stored);
      }
      console.log('Web storage initialized');
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
    }
    return true;
  } else {
    // Native: Use SQLite
    try {
      const SQLite = require('expo-sqlite');
      db = await SQLite.openDatabaseAsync('emogo.db');
      
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS mood_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          mood_score INTEGER NOT NULL,
          energy_level INTEGER NOT NULL,
          stress_level INTEGER NOT NULL,
          notes TEXT
        );
        
        CREATE TABLE IF NOT EXISTS vlog_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          video_uri TEXT NOT NULL,
          duration INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS location_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          accuracy REAL
        );
      `);
      
      console.log('SQLite database initialized');
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      return false;
    }
  }
}

/**
 * Save to localStorage (Web only)
 */
function saveToLocalStorage() {
  if (isWeb) {
    try {
      localStorage.setItem('emogo_data', JSON.stringify(dataStore));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
}

/**
 * Save mood entry
 */
export async function saveMoodEntry(moodScore, energyLevel, stressLevel, notes = '') {
  const timestamp = new Date().toISOString();
  const entry = {
    id: Date.now(),
    timestamp,
    mood_score: moodScore,
    energy_level: energyLevel,
    stress_level: stressLevel,
    notes,
  };

  if (isWeb) {
    dataStore.mood_entries.unshift(entry);
    saveToLocalStorage();
    console.log('Mood entry saved (Web)');
    return true;
  } else {
    try {
      await db.runAsync(
        'INSERT INTO mood_entries (timestamp, mood_score, energy_level, stress_level, notes) VALUES (?, ?, ?, ?, ?)',
        [timestamp, moodScore, energyLevel, stressLevel, notes]
      );
      console.log('Mood entry saved (SQLite)');
      return true;
    } catch (error) {
      console.error('Error saving mood entry:', error);
      return false;
    }
  }
}

/**
 * Save vlog entry
 */
export async function saveVlogEntry(videoUri, duration = 1) {
  const timestamp = new Date().toISOString();
  const entry = {
    id: Date.now(),
    timestamp,
    video_uri: videoUri,
    duration,
  };

  if (isWeb) {
    dataStore.vlog_entries.unshift(entry);
    saveToLocalStorage();
    console.log('Vlog entry saved (Web)');
    return true;
  } else {
    try {
      await db.runAsync(
        'INSERT INTO vlog_entries (timestamp, video_uri, duration) VALUES (?, ?, ?)',
        [timestamp, videoUri, duration]
      );
      console.log('Vlog entry saved (SQLite)');
      return true;
    } catch (error) {
      console.error('Error saving vlog entry:', error);
      return false;
    }
  }
}

/**
 * Save location entry
 */
export async function saveLocationEntry(latitude, longitude, accuracy = 0) {
  const timestamp = new Date().toISOString();
  const entry = {
    id: Date.now(),
    timestamp,
    latitude,
    longitude,
    accuracy,
  };

  if (isWeb) {
    dataStore.location_entries.unshift(entry);
    saveToLocalStorage();
    console.log('Location entry saved (Web)');
    return true;
  } else {
    try {
      await db.runAsync(
        'INSERT INTO location_entries (timestamp, latitude, longitude, accuracy) VALUES (?, ?, ?, ?)',
        [timestamp, latitude, longitude, accuracy]
      );
      console.log('Location entry saved (SQLite)');
      return true;
    } catch (error) {
      console.error('Error saving location entry:', error);
      return false;
    }
  }
}

/**
 * Get all mood entries
 */
export async function getMoodEntries() {
  if (isWeb) {
    return dataStore.mood_entries;
  } else {
    try {
      const results = await db.getAllAsync('SELECT * FROM mood_entries ORDER BY timestamp DESC');
      return results;
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }
}

/**
 * Get all vlog entries
 */
export async function getVlogEntries() {
  if (isWeb) {
    return dataStore.vlog_entries;
  } else {
    try {
      const results = await db.getAllAsync('SELECT * FROM vlog_entries ORDER BY timestamp DESC');
      return results;
    } catch (error) {
      console.error('Error getting vlog entries:', error);
      return [];
    }
  }
}

/**
 * Get all location entries
 */
export async function getLocationEntries() {
  if (isWeb) {
    return dataStore.location_entries;
  } else {
    try {
      const results = await db.getAllAsync('SELECT * FROM location_entries ORDER BY timestamp DESC');
      return results;
    } catch (error) {
      console.error('Error getting location entries:', error);
      return [];
    }
  }
}

/**
 * Get data statistics
 */
export async function getDataStats() {
  const moodEntries = await getMoodEntries();
  const vlogEntries = await getVlogEntries();
  const locationEntries = await getLocationEntries();
  
  const getTimeSpan = (entries, timeField = 'timestamp') => {
    if (entries.length < 2) return 0;
    const times = entries.map(e => new Date(e[timeField]).getTime()).sort((a, b) => a - b);
    return (times[times.length - 1] - times[0]) / (1000 * 60 * 60);
  };
  
  return {
    mood: {
      count: moodEntries.length,
      timeSpanHours: Math.round(getTimeSpan(moodEntries) * 100) / 100,
      firstEntry: moodEntries.length > 0 ? moodEntries[moodEntries.length - 1]?.timestamp : null,
      lastEntry: moodEntries.length > 0 ? moodEntries[0]?.timestamp : null,
    },
    vlog: {
      count: vlogEntries.length,
      timeSpanHours: Math.round(getTimeSpan(vlogEntries) * 100) / 100,
      firstEntry: vlogEntries.length > 0 ? vlogEntries[vlogEntries.length - 1]?.timestamp : null,
      lastEntry: vlogEntries.length > 0 ? vlogEntries[0]?.timestamp : null,
    },
    location: {
      count: locationEntries.length,
      timeSpanHours: Math.round(getTimeSpan(locationEntries) * 100) / 100,
      firstEntry: locationEntries.length > 0 ? locationEntries[locationEntries.length - 1]?.timestamp : null,
      lastEntry: locationEntries.length > 0 ? locationEntries[0]?.timestamp : null,
    },
  };
}

/**
 * Export all data as JSON
 */
export async function exportAllData() {
  try {
    const moodEntries = await getMoodEntries();
    const vlogEntries = await getVlogEntries();
    const locationEntries = await getLocationEntries();
    const stats = await getDataStats();
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      appName: 'EmoGo',
      mood_entries: {
        dataType: 'sentiment_questionnaire',
        description: '情緒問卷記錄 (structured active/foreground data)',
        records: moodEntries,
        metadata: stats.mood,
      },
      vlog_entries: {
        dataType: 'one_second_vlog',
        description: '1秒Vlog錄影記錄 (unstructured active/foreground data)',
        records: vlogEntries.map(v => ({
          ...v,
          video_uri: v.video_uri ? v.video_uri.split('/').pop() : 'web_placeholder'
        })),
        metadata: stats.vlog,
      },
      location_entries: {
        dataType: 'gps_coordinates',
        description: 'GPS座標記錄 (structured passive/background data)',
        records: locationEntries,
        metadata: stats.location,
      },
    };
    
    if (isWeb) {
      // Web: Download as file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emogo_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, data: exportData };
    } else {
      // Native: Use sharing
      const FileSystem = require('expo-file-system');
      const Sharing = require('expo-sharing');
      
      const fileName = `emogo_export_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(exportData, null, 2));
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Export EmoGo Data',
        });
      }
      
      return { success: true, data: exportData, filePath };
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clear all data
 */
export async function clearAllData() {
  if (isWeb) {
    dataStore = {
      mood_entries: [],
      vlog_entries: [],
      location_entries: [],
    };
    localStorage.removeItem('emogo_data');
    console.log('All data cleared (Web)');
    return true;
  } else {
    try {
      await db.execAsync(`
        DELETE FROM mood_entries;
        DELETE FROM vlog_entries;
        DELETE FROM location_entries;
      `);
      console.log('All data cleared (SQLite)');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}
