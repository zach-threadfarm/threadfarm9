import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThreadTone } from '@/types/threadTone';

type Post = {
  id: string;
  content: string;
  image_url?: string;
};

interface ThreadCreationContextType {
  transcript: string;
  setTranscript: (transcript: string) => void;
  tone: ThreadTone;
  setTone: (tone: ThreadTone) => void;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  generateThread: () => Promise<void>;
}

const ThreadCreationContext = createContext<ThreadCreationContextType | undefined>(undefined);

export function ThreadCreationProvider({ children }: { children: ReactNode }) {
  const [transcript, setTranscript] = useState('');
  const [tone, setTone] = useState<ThreadTone>('casual');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateThread = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/generate-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript, tone }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate thread');
      }

      const data = await response.json();
      // Convert string posts to Post objects
      const formattedPosts = data.posts.map((content: string) => ({
        id: crypto.randomUUID(),
        content,
      }));
      setPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThreadCreationContext.Provider
      value={{
        transcript,
        setTranscript,
        tone,
        setTone,
        posts,
        setPosts,
        isLoading,
        setIsLoading,
        error,
        setError,
        generateThread,
      }}
    >
      {children}
    </ThreadCreationContext.Provider>
  );
}

export function useThreadCreation() {
  const context = useContext(ThreadCreationContext);
  if (context === undefined) {
    throw new Error('useThreadCreation must be used within a ThreadCreationProvider');
  }
  return context;
} 