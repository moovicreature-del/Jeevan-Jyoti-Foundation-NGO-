// ============================================================================
// JEEVAN JYOTI FOUNDATION - HOME CONTENT REALTIME CONTEXT
// होम पेज सामग्री और नोटिस बोर्ड का लाइव रियल-टाइम स्टेट मैनेजर
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppHomeContent, NoticeItem } from '../types';
import {
  DEFAULT_HOME_CONTENT,
  subscribeToHomeContent,
  subscribeToNotices
} from '../services/adminService';

interface HomeContentContextType {
  content: AppHomeContent;
  notices: NoticeItem[];
  activeNotices: NoticeItem[];
  isLoading: boolean;
}

const HomeContentContext = createContext<HomeContentContextType>({
  content: DEFAULT_HOME_CONTENT,
  notices: [],
  activeNotices: [],
  isLoading: true
});

export const HomeContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppHomeContent>(DEFAULT_HOME_CONTENT);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. होम पेज कंटेंट का रियल-टाइम लिसनर
    const unsubContent = subscribeToHomeContent((updatedContent) => {
      setContent(updatedContent);
      setIsLoading(false);
    });

    // 2. नोटिस बोर्ड का रियल-टाइम लिसनर
    const unsubNotices = subscribeToNotices((updatedNotices) => {
      setNotices(updatedNotices);
    });

    return () => {
      try {
        if (typeof unsubContent === 'function') unsubContent();
      } catch (err) {
        console.warn('Unsub content notice:', err);
      }
      try {
        if (typeof unsubNotices === 'function') unsubNotices();
      } catch (err) {
        console.warn('Unsub notices notice:', err);
      }
    };
  }, []);

  const activeNotices = notices.filter((n) => n.isActive);

  return (
    <HomeContentContext.Provider
      value={{
        content,
        notices,
        activeNotices,
        isLoading
      }}
    >
      {children}
    </HomeContentContext.Provider>
  );
};

export const useHomeContent = () => {
  const context = useContext(HomeContentContext);
  return context;
};
