import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Video, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

interface LessonContent {
  id: string;
  title: string;
  documentUrl?: string;
  videoUrl?: string;
  isPublished: boolean;
  hasDocument: boolean;
  hasVideo: boolean;
  contentComplete: boolean;
}

const ContentUpload: React.FC = () => {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [uploadType, setUploadType] = useState<'document' | 'video' | 'both'>('document');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchLessonContent = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/uploads/lesson/${lessonId}/content`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.lesson;
      }
    } catch (error) {
      console.error('Error fetching lesson content:', error);
    }
    return null;
  };

  const handleFileUpload = async (files: FileList | null, lessonId: string) => {
    if (!files || files.length === 0 || !lessonId) return;

    try {
      setUploading(true);
      const formData = new FormData();

      if (uploadType === 'both') {
        // Handle multiple files for both document and video
        Array.from(files).forEach(file => {
          const isVideo = file.type.startsWith('video/');
          const isDocument = file.type.includes('pdf') || 
                           file.type.includes('powerpoint') || 
                           file.type.includes('presentation');
          
          if (isVideo) {
            formData.append('video', file);
          } else if (isDocument) {
            formData.append('document', file);
          }
        });

        const response = await fetch(`/api/uploads/lesson/${lessonId}/content`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          alert('Contenu uploadé avec succès!');
          // Refresh lesson content
          const updatedLesson = await fetchLessonContent(lessonId);
          if (updatedLesson) {
            setLessons(prev => prev.map(l => 
              l.id === lessonId ? updatedLesson : l
            ));
          }
        }
      } else {
        // Handle single file type
        formData.append(uploadType === 'document' ? 'document' : 'video', files[0]);

        const endpoint = uploadType === 'document' ? 'document' : 'video';
        const response = await fetch(`/api/uploads/lesson/${lessonId}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          alert(`${uploadType === 'document' ? 'Document' : 'Vidéo'} uploadé avec succès!`);
          // Refresh lesson content
          const updatedLesson = await fetchLessonContent(lessonId);
          if (updatedLesson) {
            setLessons(prev => prev.map(l => 
              l.id === lessonId ? updatedLesson : l
            ));
          }
        } else {
          const error = await response.json();
          alert(`Erreur: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const deleteContent = async (lessonId: string, type: 'document' | 'video') => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ce ${type === 'document' ? 'document' : 'vidéo'}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/uploads/lesson/${lessonId}/content/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert(`${type === 'document' ? 'Document' : 'Vidéo'} supprimé avec succès!`);
        // Refresh lesson content
        const updatedLesson = await fetchLessonContent(lessonId);
        if (updatedLesson) {
          setLessons(prev => prev.map(l => 
            l.id === lessonId ? updatedLesson : l
          ));
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, selectedLesson);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Upload de Contenu
        </h1>
        <p className="text-gray-600">
          Ajoutez des documents et vidéos à vos leçons
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner une Leçon
            </label>
            <input
              type="text"
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              placeholder="ID de la leçon"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de Contenu
            </label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="document">Document (PDF/PPT)</option>
              <option value="video">Vidéo (MP4/AVI/MOV)</option>
              <option value="both">Document + Vidéo</option>
            </select>
          </div>
        </div>

        {/* Drag & Drop Upload Area */}
        <div
          className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Glissez-déposez vos fichiers ici
          </h3>
          <p className="text-gray-600 mb-4">
            ou cliquez pour sélectionner
          </p>
          
          <input
            type="file"
            multiple={uploadType === 'both'}
            accept={
              uploadType === 'document' 
                ? '.pdf,.ppt,.pptx,.doc,.docx'
                : uploadType === 'video'
                ? '.mp4,.avi,.mov,.wmv,.flv'
                : '.pdf,.ppt,.pptx,.doc,.docx,.mp4,.avi,.mov,.wmv,.flv'
            }
            onChange={(e) => handleFileUpload(e.target.files, selectedLesson)}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Sélectionner Fichiers
          </label>

          {uploading && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Upload en cours...</p>
            </div>
          )}
        </div>

        {/* File Type Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium">Documents acceptés:</p>
              <p>PDF, PowerPoint (.ppt, .pptx), Word (.doc, .docx)</p>
              <p className="text-xs">Taille max: 50MB</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Video className="w-4 h-4 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Vidéos acceptées:</p>
              <p>MP4, AVI, MOV, WMV, FLV</p>
              <p className="text-xs">Taille max: 500MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Contenu des Leçons
          </h2>
        </div>
        
        <div className="p-6">
          {lessons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun contenu uploadé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">ID: {lesson.id}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {lesson.contentComplete && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complet
                        </span>
                      )}
                      
                      {lesson.isPublished && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Publié
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Document Section */}
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Document</span>
                        </div>
                        
                        {lesson.hasDocument ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => window.open(lesson.documentUrl, '_blank')}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteContent(lesson.id, 'document')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Non uploadé</span>
                        )}
                      </div>
                      
                      {lesson.hasDocument ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Document disponible
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <AlertCircle className="w-4 h-4" />
                          Aucun document
                        </div>
                      )}
                    </div>

                    {/* Video Section */}
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Vidéo</span>
                        </div>
                        
                        {lesson.hasVideo ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => window.open(lesson.videoUrl, '_blank')}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteContent(lesson.id, 'video')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Non uploadée</span>
                        )}
                      </div>
                      
                      {lesson.hasVideo ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Vidéo disponible
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <AlertCircle className="w-4 h-4" />
                          Aucune vidéo
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Guidelines d'Upload</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Les documents doivent être en format PDF ou PowerPoint</li>
          <li>• Les vidéos doivent être en format MP4, AVI, ou MOV</li>
          <li>• Taille maximale: 50MB pour documents, 500MB pour vidéos</li>
          <li>• Assurez-vous que le contenu est approprié et éducatif</li>
          <li>• Les fichiers sont automatiquement sécurisés et optimisés</li>
        </ul>
      </div>
    </div>
  );

  async function deleteContent(lessonId: string, type: 'document' | 'video') {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ce ${type === 'document' ? 'document' : 'vidéo'}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/uploads/lesson/${lessonId}/content/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert(`${type === 'document' ? 'Document' : 'Vidéo'} supprimé avec succès!`);
        // Refresh lesson content
        const updatedLesson = await fetchLessonContent(lessonId);
        if (updatedLesson) {
          setLessons(prev => prev.map(l => 
            l.id === lessonId ? updatedLesson : l
          ));
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression');
    }
  }
};

export default ContentUpload;
