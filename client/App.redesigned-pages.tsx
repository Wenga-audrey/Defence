import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import redesigned pages
import Courses from './pages/Courses';
import Forums from './pages/Forums';
import ForumTopic from './pages/ForumTopic';
import LearnerDashboard from './pages/LearnerDashboard';
import LessonPlayer from './pages/LessonPlayer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/forum/:topicId" element={<ForumTopic />} />
          <Route path="/dashboard/learner" element={<LearnerDashboard />} />
          <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;