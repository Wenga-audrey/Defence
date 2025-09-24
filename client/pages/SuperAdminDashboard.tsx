import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, CreditCard, BarChart3, Settings, Shield, Database, Globe } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';

interface SystemMetric {
  name: string;
  value: string;
  change: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch system metrics from API
    const fetchData = async () => {
      try {
        // Mock data
        const mockMetrics: SystemMetric[] = [
          { name: 'Total Users', value: '1,247', change: '+12%' },
          { name: 'Active Classes', value: '8', change: '+2' },
          { name: 'Revenue', value: '€45,230', change: '+15%' },
          { name: 'System Uptime', value: '99.9%', change: 'Stable' },
        ];

        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600">Oversee all platform operations and system health</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current status of all services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Services</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Gateway</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CDN</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">New User Registration</h3>
                    <p className="text-sm text-gray-600">5 minutes ago</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Class Created</h3>
                    <p className="text-sm text-gray-600">1 hour ago</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Payment Processed</h3>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage database, servers, and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Database Management</h3>
                  <p className="text-sm text-gray-600">Backup, migrations, and optimization</p>
                  <Button className="mt-2">
                    <Database className="mr-2 h-4 w-4" />
                    Manage Database
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Server Settings</h3>
                  <p className="text-sm text-gray-600">Configure servers and load balancing</p>
                  <Button className="mt-2">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Servers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Center</CardTitle>
              <CardDescription>Monitor and manage security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Access Control</h3>
                  <p className="text-sm text-gray-600">Manage user permissions and roles</p>
                  <Button className="mt-2">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Audit Logs</h3>
                  <p className="text-sm text-gray-600">Review system activities</p>
                  <Button className="mt-2">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Platform-wide configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Localization</h3>
                  <p className="text-sm text-gray-600">Language and regional settings</p>
                  <Button className="mt-2">
                    <Globe className="mr-2 h-4 w-4" />
                    Configure Localization
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Feature Flags</h3>
                  <p className="text-sm text-gray-600">Enable/disable platform features</p>
                  <Button className="mt-2">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Features
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
