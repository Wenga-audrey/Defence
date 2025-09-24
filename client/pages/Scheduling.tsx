import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimeSlot {
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
}

interface ScheduleSession {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: string;
}

const SchedulingPage: React.FC = () => {
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [studyGoals, setStudyGoals] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<ScheduleSession[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [targetExamDate, setTargetExamDate] = useState<string>('');

  useEffect(() => {
    // Fetch enrolled classes (mock data for now)
    const mockClasses = [
      { id: 'ens-2024', name: 'ENS 2024' },
      { id: 'enam-2024', name: 'ENAM 2024' },
    ];
    setEnrolledClasses(mockClasses);
  }, []);

  const addAvailability = () => {
    setAvailability([...availability, { day: 'MONDAY', startTime: '09:00', endTime: '10:00' }]);
  };

  const updateAvailability = (index: number, field: keyof TimeSlot, value: string) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const removeAvailability = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSetAvailability = async () => {
    if (availability.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/scheduler/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability }),
      });

      if (response.ok) {
        alert('Availability updated successfully!');
      } else {
        alert('Error updating availability');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    if (!selectedClassId || !targetExamDate) return;

    setLoading(true);
    try {
      const response = await fetch('/api/scheduler/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetExamDate }),
      });

      if (response.ok) {
        const data = await response.json();
        setSchedule(data.data);
      } else {
        alert('Error generating schedule');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSessions = async () => {
    if (!selectedClassId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/scheduler/sessions');
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.data);
      } else {
        alert('Error fetching sessions');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scheduler/daily-recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.data);
      } else {
        alert('Error fetching recommendations');
      }
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Intelligent Study Scheduler</h1>

      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="availability">Set Availability</TabsTrigger>
          <TabsTrigger value="generate">Generate Schedule</TabsTrigger>
          <TabsTrigger value="sessions">View Sessions</TabsTrigger>
          <TabsTrigger value="recommendations">Daily Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Availability</CardTitle>
              <CardDescription>Define your available time slots for study sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              {availability.map((slot, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-3 p-3 border rounded-lg">
                  <Select value={slot.day} onValueChange={(value) => updateAvailability(index, 'day', value)}>
                    <SelectTrigger className="w-full sm:w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONDAY">Monday</SelectItem>
                      <SelectItem value="TUESDAY">Tuesday</SelectItem>
                      <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                      <SelectItem value="THURSDAY">Thursday</SelectItem>
                      <SelectItem value="FRIDAY">Friday</SelectItem>
                      <SelectItem value="SATURDAY">Saturday</SelectItem>
                      <SelectItem value="SUNDAY">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeAvailability(index)} className="w-full sm:w-auto">
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={addAvailability} className="w-full sm:w-auto">Add Time Slot</Button>
              <Button onClick={handleSetAvailability} disabled={loading} className="mt-4 w-full">
                {loading ? 'Updating...' : 'Update Availability'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Schedule</CardTitle>
              <CardDescription>Create an optimal study schedule based on your availability and goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="class-select">Select Class</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrolledClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <Label htmlFor="exam-date">Target Exam Date (optional)</Label>
                <Input
                  id="exam-date"
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                />
              </div>
              <Button onClick={handleGenerateSchedule} disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Schedule'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Your Study Sessions</CardTitle>
              <CardDescription>View and manage your scheduled sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGetSessions} disabled={loading} className="w-full">
                {loading ? 'Loading...' : 'Fetch Sessions'}
              </Button>
              <div className="mt-4">
                {schedule.length > 0 ? (
                  <div className="space-y-2">
                    {schedule.map((session, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="font-medium">{session.day}</div>
                        <div className="text-sm text-gray-600">{session.startTime} - {session.endTime}</div>
                        <div className="text-sm">{session.topic}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No sessions available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Daily Recommendations</CardTitle>
              <CardDescription>Get personalized study suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGetRecommendations} disabled={loading} className="w-full">
                {loading ? 'Loading...' : 'Get Recommendations'}
              </Button>
              <div className="mt-4">
                {recommendations.length > 0 ? (
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-100 p-3 rounded">
                        {rec.suggestion}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recommendations available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulingPage;
