import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@shared/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, ChevronDown, ChevronRight, ArrowLeft } from '@/lib/icons';

interface Lesson {
  id: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  documentUrl?: string | null;
  order: number;
}

interface Chapter {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  lessons: Lesson[];
}

interface SubjectResponse {
  id: string;
  name: string;
  description?: string | null;
  class: { id: string; name: string; examType: string };
  chapters: Chapter[];
}

export default function Subject() {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<SubjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);
  const [activePdf, setActivePdf] = useState<{ lessonId: string; url: string } | null>(null);

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<SubjectResponse>(`/api/subjects/${id}`);
        if (res.success && res.data) {
          setSubject(res.data as any);
          // Default open first chapter
          const first = (res.data as any).chapters?.[0];
          if (first) setOpenChapterId(first.id);
          // If first lesson has a PDF, show it
          const firstPdf = first?.lessons?.find((l: Lesson) => (l.documentUrl || '').toLowerCase().endsWith('.pdf'));
          if (firstPdf?.documentUrl) setActivePdf({ lessonId: firstPdf.id, url: firstPdf.documentUrl });
        } else {
          setError(res.error || 'Failed to load subject');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load subject');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSubject();
  }, [id]);

  const title = useMemo(() => subject?.name || 'Subject', [subject]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-600 font-semibold">{error}</p>
        <Button asChild className="mt-4"><Link to="/dashboard/learner">Back to Dashboard</Link></Button>
      </div>
    );
  }

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild size="sm">
              <Link to="/dashboard/learner"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
            </Button>
            <h1 className="text-2xl font-black text-gray-900">{title}</h1>
            {subject.class?.examType && (
              <Badge variant="outline">{subject.class.examType}</Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chapters list */}
          <div className="lg:col-span-1 space-y-3">
            {subject.chapters.map((ch) => {
              const opened = openChapterId === ch.id;
              return (
                <Card key={ch.id} className="border border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{ch.title}</div>
                        {ch.description && <div className="text-xs text-gray-500 line-clamp-1">{ch.description}</div>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setOpenChapterId(opened ? null : ch.id)}>
                      {opened ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CardHeader>
                  {opened && (
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {ch.lessons.length === 0 && (
                          <div className="text-xs text-gray-500">No lessons published yet.</div>
                        )}
                        {ch.lessons.map((lsn) => {
                          const hasPdf = (lsn.documentUrl || '').toLowerCase().endsWith('.pdf');
                          return (
                            <div key={lsn.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-gray-200 rounded flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-gray-700" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{lsn.title}</div>
                                  <div className="text-xs text-gray-500">{hasPdf ? 'PDF Document' : 'No PDF available'}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant={hasPdf ? 'default' : 'outline'}
                                  disabled={!hasPdf}
                                  onClick={() => hasPdf && setActivePdf({ lessonId: lsn.id, url: lsn.documentUrl! })}
                                >
                                  {hasPdf ? 'Read' : 'Unavailable'}
                                </Button>
                                {hasPdf && (
                                  <>
                                    <a
                                      href={lsn.documentUrl!}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      Open in New Tab
                                    </a>
                                    <a
                                      href={lsn.documentUrl!}
                                      download
                                      className="text-sm text-gray-700 hover:underline"
                                    >
                                      Download
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* PDF viewer */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {activePdf ? 'Reading PDF document' : 'Select a lesson PDF on the left'}
                  </div>
                  {activePdf && (
                    <div className="flex items-center gap-4">
                      <a
                        href={activePdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Open in New Tab
                      </a>
                      <a
                        href={activePdf.url}
                        download
                        className="text-sm text-gray-700 hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {activePdf ? (
                  <iframe
                    title="Lesson PDF"
                    src={activePdf.url}
                    className="w-full h-[75vh]"
                  />
                ) : (
                  <div className="p-6 text-sm text-gray-500">No document selected.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
