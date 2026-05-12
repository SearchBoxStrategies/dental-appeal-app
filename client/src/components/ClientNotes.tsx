import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, User } from 'lucide-react';
import api from '../lib/api';

interface Note {
  id: number;
  client_id: number;
  author_id: number;
  author_name: string;
  note: string;
  created_at: string;
}

interface ClientNotesProps {
  clientId: number;
}

export default function ClientNotes({ clientId }: ClientNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [clientId]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/admin/clients/${clientId}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setAdding(true);
    setError('');
    
    try {
      const response = await api.post(`/admin/clients/${clientId}/notes`, { note: newNote });
      setNotes([response.data, ...notes]);
      setNewNote('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add note');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.delete(`/admin/notes/${noteId}`);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="animate-pulse">Loading notes...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Client Notes
        </h3>
      </div>
      
      <div className="p-6">
        {/* Add Note Form */}
        <div className="mb-6">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a private note about this client..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            onClick={handleAddNote}
            disabled={adding || !newNote.trim()}
            className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {adding ? 'Adding...' : 'Add Note'}
          </button>
        </div>
        
        {/* Notes List */}
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notes yet. Add a note to track client information.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-3 h-3" />
                    <span className="font-medium text-gray-700">{note.author_name}</span>
                    <span>•</span>
                    <span>{formatDate(note.created_at)}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{note.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
