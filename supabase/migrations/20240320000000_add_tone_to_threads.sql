-- Add tone column to threads table
ALTER TABLE threads
ADD COLUMN tone TEXT NOT NULL DEFAULT 'casual'
CHECK (tone IN ('comedic', 'casual', 'educational'));

-- Update existing rows to have the default tone
UPDATE threads
SET tone = 'casual'
WHERE tone IS NULL; 