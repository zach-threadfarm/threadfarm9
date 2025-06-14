import { useThreadCreation } from '@/contexts/ThreadCreationContext';
import { ThreadTone } from '@/types/threadTone';

export default function Settings() {
  const {
    tone,
    setTone,
    generateThread,
    isLoading,
    error
  } = useThreadCreation();

  const handleToneChange = (newTone: ThreadTone) => {
    setTone(newTone);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Thread Settings</h1>
      
      <div className="space-y-6">
        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thread Tone
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['comedic', 'casual', 'educational'] as const).map((toneOption) => (
              <button
                key={toneOption}
                onClick={() => handleToneChange(toneOption)}
                className={`p-4 rounded-lg border ${
                  tone === toneOption
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <h3 className="font-medium capitalize">{toneOption}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {toneOption === 'comedic' && 'Funny, engaging, and shareable'}
                  {toneOption === 'casual' && 'Relaxed and conversational'}
                  {toneOption === 'educational' && 'Clear and informative'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateThread}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Thread'}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 