import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Create a single demo learner who can enroll in multiple courses
    const learner = await prisma.user.upsert({
      where: { email: 'learner@mindboost.cm' },
      update: {},
      create: {
        email: 'learner@mindboost.cm',
        firstName: 'Marie',
        lastName: 'Kamga',
        password: hashedPassword,
        role: 'LEARNER',
        isEmailVerified: true
      }
    });

    // Create admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@mindboost.cm' },
      update: {},
      create: {
        email: 'admin@mindboost.cm',
        firstName: 'Admin',
        lastName: 'System',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isEmailVerified: true
      }
    });

    // Create instructor
    const instructor = await prisma.user.upsert({
      where: { email: 'teacher@mindboost.cm' },
      update: {},
      create: {
        email: 'teacher@mindboost.cm',
        firstName: 'Jean',
        lastName: 'Professeur',
        password: hashedPassword,
        role: 'TEACHER',
        isEmailVerified: true
      }
    });

    // Create courses for different exams
    const courses = [
      {
        id: 'enam-prep',
        title: 'Préparation ENAM',
        description: 'Cours complet pour la préparation du concours ENAM',
        examType: 'ENAM',
        difficulty: 'INTERMEDIATE',
        price: 35000,
        isPublished: true
      },
      {
        id: 'ens-prep',
        title: 'Préparation ENS',
        description: 'Formation pour le concours ENS',
        examType: 'ENS',
        difficulty: 'ADVANCED',
        price: 40000,
        isPublished: true
      },
      {
        id: 'police-prep',
        title: 'Concours Police',
        description: 'Préparation au concours de police',
        examType: 'POLICE',
        difficulty: 'BEGINNER',
        price: 20000,
        isPublished: true
      },
      {
        id: 'customs-prep',
        title: 'Concours Douanes',
        description: 'Formation pour les douanes',
        examType: 'CUSTOMS',
        difficulty: 'BEGINNER',
        price: 25000,
        isPublished: true
      }
    ];

    for (const courseData of courses) {
      await prisma.course.upsert({
        where: { id: courseData.id },
        update: {},
        create: courseData
      });
    }

    // Enroll the learner in multiple courses
    const enrollments = [
      { courseId: 'enam-prep', progress: 30 },
      { courseId: 'police-prep', progress: 75 },
      { courseId: 'customs-prep', progress: 15 }
    ];

    for (const enrollment of enrollments) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: learner.id,
            courseId: enrollment.courseId
          }
        },
        update: {},
        create: {
          userId: learner.id,
          courseId: enrollment.courseId,
          progress: enrollment.progress,
          status: 'ACTIVE'
        }
      });
    }

    console.log('✅ Demo users created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('👨‍🎓 Learner: learner@mindboost.cm / demo123');
    console.log('👨‍🏫 Teacher: teacher@mindboost.cm / demo123');
    console.log('👨‍💼 Admin: admin@mindboost.cm / demo123');
    console.log('\n📚 The learner is enrolled in multiple courses:');
    console.log('- ENAM Preparation (30% progress)');
    console.log('- Police Preparation (75% progress)');
    console.log('- Customs Preparation (15% progress)');

  } catch (error) {
    console.error('Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();
