import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BoardProvider, useBoard } from '../context/BoardContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto
if (!window.crypto) {
  window.crypto = {};
}
window.crypto.randomUUID = () => Math.random().toString(36).substring(2);

const wrapper = ({ children }) => <BoardProvider>{children}</BoardProvider>;

describe('BoardContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initially have no tasks', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });
    expect(result.current.tasks).toHaveLength(0);
  });

  it('should add a task correctly', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });
    
    act(() => {
      result.current.addTask({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'High'
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
  });
});
