import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Play, 
  Square, 
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface LiveSession {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  maxParticipants?: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  meetingUrl?: string;
  participantCount: number;
  class: {
    name: string;
    examType: string;
  };
  subject?: {
    name: string;
  };
}

const LiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    scheduledAt: '',
    duration: 60,
    maxParticipants: 30
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`/api/live-sessions/teacher/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    try {
      const response = await fetch('/api/live-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSession)
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(prev => [data.session, ...prev]);
        setShowCreateModal(false);
        setNewSession({
          title: '',
          description: '',
          classId: '',
          subjectId: '',
          scheduledAt: '',
          duration: 60,
          maxParticipants: 30
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      const response = await fetch(`/api/live-sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, status: status as any } : s
        ));
      }
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  };

  const joinSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/live-sessions/${sessionId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.meetingUrl, '_blank');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error joining session:', error);
      alert('Failed to join session');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'bg-red-100 text-red-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-CM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sessions Live
          </h1>
          <p className="text-gray-600">
            Gérez vos sessions d'enseignement en direct
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Session
        </button>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Aucune session programmée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {session.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>

              {session.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {session.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDateTime(session.scheduledAt)}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {session.duration} minutes
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {session.participantCount}/{session.maxParticipants || '∞'} participants
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium">{session.class.name}</p>
                <p>{session.class.examType}</p>
                {session.subject && <p>Matière: {session.subject.name}</p>}
              </div>

              <div className="flex gap-2">
                {session.status === 'SCHEDULED' && (
                  <>
                    <button
                      onClick={() => updateSessionStatus(session.id, 'LIVE')}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1"
                    >
                      <Play className="w-4 h-4" />
                      Démarrer
                    </button>
                    <button
                      onClick={() => updateSessionStatus(session.id, 'CANCELLED')}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50"
                    >
                      Annuler
                    </button>
                  </>
                )}
                
                {session.status === 'LIVE' && (
                  <>
                    <button
                      onClick={() => joinSession(session.id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Rejoindre
                    </button>
                    <button
                      onClick={() => updateSessionStatus(session.id, 'COMPLETED')}
                      className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </>
                )}
                
                {session.status === 'COMPLETED' && (
                  <button
                    disabled
                    className="flex-1 bg-gray-100 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed"
                  >
                    Terminée
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nouvelle Session Live
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la Session
                  </label>
                  <input
                    type="text"
                    value={newSession.title}
                    onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Révision Mathématiques"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optionnel)
                  </label>
                  <textarea
                    value={newSession.description}
                    onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Description de la session..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date et Heure
                  </label>
                  <input
                    type="datetime-local"
                    value={newSession.scheduledAt}
                    onChange={(e) => setNewSession(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée (minutes)
                    </label>
                    <input
                      type="number"
                      value={newSession.duration}
                      onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="15"
                      max="180"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={newSession.maxParticipants}
                      onChange={(e) => setNewSession(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID de la Classe
                  </label>
                  <input
                    type="text"
                    value={newSession.classId}
                    onChange={(e) => setNewSession(prev => ({ ...prev, classId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ID de la classe"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={createSession}
                  disabled={!newSession.title || !newSession.classId || !newSession.scheduledAt}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Créer Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSessions;
