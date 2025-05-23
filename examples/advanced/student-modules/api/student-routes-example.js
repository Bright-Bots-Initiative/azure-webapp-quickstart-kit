const express = require('express');
const router = express.Router();

const authMiddleware = require('../../../../middleware/auth');

/**
 * Student dashboard data endpoint
 * Returns lessons and activities specific to the authenticated student
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const studentId = req.user.id;
    const { lessons, studentActivities, users } = req.app.locals.db.data;

    const studentUser = users.find(user => user.id === studentId);
    const studentSpecificActivities = studentActivities.filter(activity => activity.studentId === studentId);

    const enrolledLessons = lessons.map(lesson => {
      const activity = studentSpecificActivities.find(sa => sa.lessonId === lesson.id);
      return {
        ...lesson,
        completed: activity ? activity.completed : false,
        grade: activity ? activity.grade : null
      };
    });

    res.json({
      message: 'Student dashboard data',
      studentName: studentUser ? studentUser.name : 'Student',
      enrolledLessons,
      activities: studentSpecificActivities
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ message: 'Error fetching student dashboard data' });
  }
});

/**
 * Mark activity as complete endpoint
 * Allows students to mark their assigned activities as completed
 */
router.post('/activities/:activityId/complete', authMiddleware, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const { activityId } = req.params;
    const studentId = req.user.id; // Ensure student can only mark their own activities

    const db = req.app.locals.db;
    await db.read();
    
    const activityIndex = db.data.studentActivities.findIndex(
      activity => activity.id === activityId && activity.studentId === studentId
    );

    if (activityIndex === -1) {
      return res.status(404).json({ message: 'Activity not found or not assigned to this student' });
    }

    db.data.studentActivities[activityIndex].completed = true;

    await db.write();
    res.json(db.data.studentActivities[activityIndex]);
  } catch (error) {
    console.error('Mark activity complete error:', error);
    res.status(500).json({ message: 'Error marking activity as complete' });
  }
});

module.exports = router;
