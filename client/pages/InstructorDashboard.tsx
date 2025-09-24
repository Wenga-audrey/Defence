import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, BarChart3, Calendar, Star, Plus, Eye, MessageCircle, FileText, Brain } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';

interface Class {
  id: string;
  name: string;
  studentCount: number;
  subjects: number;
  lastActivity: string;
}

interface Student {
  id: string;
  name: string;
  progress: number;
  lastSeen: string;
}

const InstructorDashboard: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch classes and students from API
    const fetchData = async () => {
      try {
        // Mock data for ENS class
        const mockClasses: Class[] = [
          {
            id: 'ens-lettres-2024',
            name: 'ENS - Lettres Modernes Françaises',
            studentCount: 45,
            subjects: 3,
            lastActivity: '2 hours ago',
          },
          {
            id: 'enam-math-2024',
            name: 'ENAM - Cycle A (Administration Générale)',
            studentCount: 32,
            subjects: 4,
            lastActivity: '1 day ago',
          },
        ];

        const mockStudents: Student[] = [
          { id: '1', name: 'Marie Étudiante', progress: 65, lastSeen: '2 hours ago' },
          { id: '2', name: 'Paul Étudiant', progress: 78, lastSeen: '1 day ago' },
        ];

        setClasses(mockClasses);
        setStudents(mockStudents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewClass = (classId: string) => {
    navigate(`/course/${classId}`);
  };

  const handleViewStudent = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Instructor Dashboard</h1>
        <p className="text-gray-600">Manage your classes and track student progress</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Classes you are teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{cls.name}</h3>
                        <p className="text-sm text-gray-600">
                          {cls.studentCount} students • {cls.subjects} subjects
                        </p>
                        <p className="text-xs text-gray-500">Last activity: {cls.lastActivity}</p>
                      </div>
                      <Button variant="outline" onClick={() => handleViewClass(cls.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Quiz Manually
                </Button>
                <Button variant="outline" className="w-full mt-2">
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Quiz with AI
                </Button>
                <Button variant="outline" className="w-full mt-2">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Quiz Results
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Recent student activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-gray-600">Progress: {student.progress}%</p>
                        <p className="text-xs text-gray-500">Last seen: {student.lastSeen}</p>
                      </div>
                      <Button variant="outline" onClick={() => handleViewStudent(student.id)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>{cls.studentCount} students enrolled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary">{cls.subjects} subjects</Badge>
                    <span className="text-sm text-gray-600">Last activity: {cls.lastActivity}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleViewClass(cls.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button>
                      <Star className="mr-2 h-4 w-4" />
                      Rate Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <CardTitle>{student.name}</CardTitle>
                  <CardDescription>Progress: {student.progress}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => handleViewStudent(student.id)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Student
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorDashboard;
