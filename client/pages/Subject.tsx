import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, ArrowRight, QuizIcon } from "@/lib/icons";
import { api } from "@shared/api";

export default function Subject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePdf, setActivePdf] = useState<{ lessonId: string; url: string } | null>(null);

  useEffect(() => {
    async function fetchSubject() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/learner/subjects/${id}`);
        if (res.success && res.data) {
          setSubject(res.data);
          // Auto-select first lesson PDF if available
          const firstChapter = res.data.chapters?.[0];
          const firstPdf = firstChapter?.lessons?.find((l: any) => l.pdfUrl && l.pdfUrl.endsWith(".pdf"));
          if (firstPdf) setActivePdf({ lessonId: firstPdf.id, url: firstPdf.pdfUrl });
        } else {
          setError(res.error || "Failed to load subject");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load subject");
      }
      setLoading(false);
    }
    if (id) fetchSubject();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!subject) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="outline" asChild size="sm">
          <Link to="/dashboard/learner">Back to Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-bold mb-4">{subject.name}</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chapters list */}
          <div className="lg:col-span-1 space-y-3">
            {subject.chapters.map((ch: any) => (
              <Card key={ch.id} className="border border-gray-200">
                <CardHeader>
                  <CardTitle>{ch.title}</CardTitle>
                  <CardDescription>{ch.lessons.length} lessons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold">Lessons:</h4>
                    {ch.lessons.map((lesson: any) => (
                      <Button
                        key={lesson.id}
                        variant="outline"
                        className="w-full mb-2 flex items-center"
                        onClick={() => lesson.pdfUrl ? setActivePdf({ lessonId: lesson.id, url: lesson.pdfUrl }) : navigate(`/lesson/${lesson.id}`)}
                      >
                        {lesson.pdfUrl ? <Download className="mr-2 h-4 w-4" /> : <BookOpen className="mr-2 h-4 w-4" />}
                        {lesson.title}
                        <ArrowRight className="ml-auto h-4 w-4" />
                        {lesson.isCompleted && <Badge className="ml-2 bg-green-100 text-green-800">Completed</Badge>}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold">Quizzes:</h4>
                    {ch.quizzes.map((quiz: any) => (
                      <Button
                        key={quiz.id}
                        variant="secondary"
                        className="mr-2 mb-2 flex items-center"
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                      >
                        <QuizIcon className="h-4 w-4 mr-1" />
                        {quiz.title}
                        {quiz.isAI ? <Badge className="ml-2 bg-blue-100 text-blue-800">AI</Badge> : <Badge className="ml-2 bg-gray-100 text-gray-800">Manual</Badge>}
                        {quiz.isCompleted && <Badge className="ml-2 bg-green-100 text-green-800">Completed</Badge>}
                        {quiz.score && <span className="ml-2 text-xs font-bold text-green-700">Score: {quiz.score}</span>}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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