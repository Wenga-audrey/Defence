import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Download, ArrowRight } from '@/lib/icons';

const SubjectDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  // Mock data for subjects (same as in LearnerDashboard)
  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      chapters: [
        {
          id: 'math-chapter-1',
          title: 'Algebra and Equations',
          lessons: [
            { id: 'math-lesson-1', title: 'Linear Equations', duration: 60, pdfUrl: '/pdfs/math-algebra.pdf' },
          ],
          quizzes: [
            { id: 'math-quiz-1', title: 'Algebra Quiz', chapterId: 'math-chapter-1', isCompleted: false },
          ],
        },
      ],
    },
    {
      id: 'physics',
      name: 'Physics',
      chapters: [
        {
          id: 'physics-chapter-1',
          title: 'Mechanics',
          lessons: [
            { id: 'physics-lesson-1', title: 'Newton\'s Laws', duration: 75, pdfUrl: '/pdfs/physics-mechanics.pdf' },
          ],
          quizzes: [
            { id: 'physics-quiz-1', title: 'Mechanics Quiz', chapterId: 'physics-chapter-1', isCompleted: true, score: 85 },
          ],
        },
      ],
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      chapters: [
        {
          id: 'chemistry-chapter-1',
          title: 'Organic Chemistry',
          lessons: [
            { id: 'chemistry-lesson-1', title: 'Hydrocarbons', duration: 90, pdfUrl: '/pdfs/chemistry-organic.pdf' },
          ],
          quizzes: [
            { id: 'chemistry-quiz-1', title: 'Organic Chemistry Quiz', chapterId: 'chemistry-chapter-1', isCompleted: false },
          ],
        },
      ],
    },
    {
      id: 'biology',
      name: 'Biology',
      chapters: [
        {
          id: 'biology-chapter-1',
          title: 'Cell Biology',
          lessons: [
            { id: 'biology-lesson-1', title: 'Cell Structure', duration: 60, pdfUrl: '/pdfs/biology-cells.pdf' },
          ],
          quizzes: [
            { id: 'biology-quiz-1', title: 'Cell Biology Quiz', chapterId: 'biology-chapter-1', isCompleted: true, score: 90 },
          ],
        },
      ],
    },
    {
      id: 'literature',
      name: 'Literature',
      chapters: [
        {
          id: 'lit-chapter-1',
          title: 'French Poetry',
          lessons: [
            { id: 'lit-lesson-1', title: 'Romanticism', duration: 60, pdfUrl: '/pdfs/literature-poetry.pdf' },
          ],
          quizzes: [
            { id: 'lit-quiz-1', title: 'Poetry Quiz', chapterId: 'lit-chapter-1', isCompleted: false },
          ],
        },
      ],
    },
    {
      id: 'philosophy',
      name: 'Philosophy',
      chapters: [
        {
          id: 'philosophy-chapter-1',
          title: 'Ethics',
          lessons: [
            { id: 'philosophy-lesson-1', title: 'Moral Philosophy', duration: 75, pdfUrl: '/pdfs/philosophy-ethics.pdf' },
          ],
          quizzes: [
            { id: 'philosophy-quiz-1', title: 'Ethics Quiz', chapterId: 'philosophy-chapter-1', isCompleted: true, score: 78 },
          ],
        },
      ],
    },
  ];

  if (!subjectId) {
    return <div>Subject ID not provided</div>;
  }

  const subject = subjects.find((s) => s.id.toLowerCase() === subjectId?.toLowerCase());

  if (!subject) {
    console.log('Subject not found for ID:', subjectId);
    console.log('Available subjects:', subjects.map(s => s.id));
    return <div>Subject not found. Available subjects: {subjects.map(s => s.id).join(', ')}</div>;
  }

  const handleChapterClick = (chapterId: string) => {
    navigate(`/chapter/${chapterId}`);
  };

  const handleLessonClick = (lessonId: string, pdfUrl: string | null) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      navigate(`/lesson/${lessonId}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate('/dashboard/learner')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold mb-4">{subject.name}</h1>
      <div className="space-y-4">
        {subject.chapters.map((chapter) => (
          <Card key={chapter.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleChapterClick(chapter.id)}>
            <CardHeader>
              <CardTitle>{chapter.title}</CardTitle>
              <CardDescription>{chapter.lessons.length} lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {chapter.lessons.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant="outline"
                    className="justify-start w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLessonClick(lesson.id, lesson.pdfUrl);
                    }}
                  >
                    {lesson.pdfUrl ? (
                      <Download className="mr-2 h-4 w-4" />
                    ) : (
                      <BookOpen className="mr-2 h-4 w-4" />
                    )}
                    {lesson.title}
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Quizzes:</h4>
                {chapter.quizzes.map((quiz) => (
                  <Badge key={quiz.id} variant="outline" className="mr-2">
                    {quiz.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectDetail;
