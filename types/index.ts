export type Thread = {
  id: string;
  user_id: string;
  title: string;
  status: string;
  tone: 'comedic' | 'casual' | 'educational';
  transcript: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  thread_id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  post_order: number;
  created_at: string;
  updated_at: string;
};

export type Draft = {
  id: string;
  user_id: string;
  title: string;
  content?: string | null;
  settings?: any; // JSONB
  posts?: any; // JSONB array
  created_at: string;
  updated_at: string;
}; 