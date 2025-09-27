import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";

export default function PrepClassAdminDashboard() {
  const [prepClasses, setPrepClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [pendingStudents, setPendingStudents] = useState([]);

  useEffect(() => {
    async function fetchClasses() {
      const res = await api.get("/api/prepClassAdmin/prep-classes");
      if (res.success) setPrepClasses(res.prepClasses);
    }
    fetchClasses();
  }, []);

  async function handleSelectClass(classId) {
    setSelectedClass(classId);
    const res = await api.get(`/api/prepClassAdmin/prep-classes/${classId}/pending-students`);
    if (res.success) setPendingStudents(res.students);
  }

  async function handleValidateStudent(studentId) {
    await api.post(`/api/prepClassAdmin/prep-classes/${selectedClass}/validate-student`, { studentId });
    setPendingStudents(pendingStudents.filter(s => s.id !== studentId));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Preparatory Class Admin Dashboard</h1>
      <ul>
        {prepClasses.map(cls => (
          <li key={cls.id}>
            <Button onClick={() => handleSelectClass(cls.id)}>{cls.name}</Button>
          </li>
        ))}
      </ul>
      {selectedClass && (
        <div>
          <h2 className="font-semibold">Pending Student Validations</h2>
          <ul>
            {pendingStudents.map(s => (
              <li key={s.id}>
                {s.name} <Button onClick={() => handleValidateStudent(s.id)}>Validate</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}