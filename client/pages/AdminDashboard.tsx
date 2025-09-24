import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, CreditCard, BarChart3, Plus, Eye, Settings } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Class {
  id: string;
  name: string;
  studentCount: number;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users and classes from API
    const fetchData = async () => {
      try {
        // Mock data
        const mockUsers: User[] = [
          { id: '1', name: 'Marie Étudiante', email: 'learner@mindboost.com', role: 'Learner', status: 'Active' },
          { id: '2', name: 'Jean Professeur', email: 'teacher@mindboost.com', role: 'Instructor', status: 'Active' },
        ];

        const mockClasses: Class[] = [
          { id: 'ens-lettres-2024', name: 'ENS - Lettres Modernes Françaises', studentCount: 45, status: 'Active' },
          { id: 'enam-math-2024', name: 'ENAM - Cycle A (Administration Générale)', studentCount: 32, status: 'Active' },
        ];

        setUsers(mockUsers);
        setClasses(mockClasses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewUser = (userId: string) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleViewClass = (classId: string) => {
    navigate(`/admin/class/${classId}`);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, classes, and platform settings</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Newly registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                      <Button variant="outline" onClick={() => handleViewUser(user.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New User
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Classes</CardTitle>
                <CardDescription>Currently running preparatory classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{cls.name}</h3>
                        <p className="text-sm text-gray-600">{cls.studentCount} students</p>
                        <Badge variant={cls.status === 'Active' ? 'default' : 'secondary'}>{cls.status}</Badge>
                      </div>
                      <Button variant="outline" onClick={() => handleViewClass(cls.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Class
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary">{user.role}</Badge>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>{user.status}</Badge>
                  </div>
                  <Button variant="outline" onClick={() => handleViewUser(user.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Manage User
                  </Button>
                </CardContent>
              </Card>
            ))}
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
                    <Badge variant={cls.status === 'Active' ? 'default' : 'secondary'}>{cls.status}</Badge>
                  </div>
                  <Button variant="outline" onClick={() => handleViewClass(cls.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Manage Class
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Overall platform performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">User Engagement</h3>
                  <p className="text-sm text-gray-600">Average session time: 45 minutes</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Success Rate</h3>
                  <p className="text-sm text-gray-600">98% of students complete courses</p>
                </div>
              </div>
              <Button className="w-full mt-4">
                <Settings className="mr-2 h-4 w-4" />
                Configure Analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
