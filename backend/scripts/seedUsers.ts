import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Hash password for all demo users
    const hashedPassword = await bcrypt.hash('demo123', 12);

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@mindboost.cm' },
      update: {},
      create: {
        email: 'admin@mindboost.cm',
        firstName: 'Admin',
        lastName: 'Mindboost',
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

    // Create demo learner (can enroll in multiple courses)
    const learner = await prisma.user.upsert({
      where: { email: 'learner@mindboost.cm' },
      update: {},
      create: {
        email: 'learner@mindboost.cm',
        firstName: 'Marie',
        lastName: 'Étudiante',
        password: hashedPassword,
        role: 'LEARNER',
        isEmailVerified: true
      }
    });

    // Create preparatory classes instead of exam modules
    const enamClass = await prisma.preparatoryClass.upsert({
      where: { id: 'enam-class-1' },
      update: {},
      create: {
        id: 'enam-class-1',
        name: 'ENAM Preparation - Mathematics',
        description: 'Comprehensive mathematics preparation for ENAM entrance exam',
        examType: 'ENAM',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15'),
        price: 35000,
        isActive: true
      }
    });

    const ensClass = await prisma.preparatoryClass.upsert({
      where: { id: 'ens-class-1' },
      update: {},
      create: {
        id: 'ens-class-1',
        name: 'ENS Preparation - Literature',
        description: 'Essential literature concepts for ENS entrance exam',
        examType: 'ENS',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-01'),
        price: 40000,
        isActive: true
      }
    });

    const policeClass = await prisma.preparatoryClass.upsert({
      where: { id: 'police-class-1' },
      update: {},
      create: {
        id: 'police-class-1',
        name: 'Police Exam Preparation',
        description: 'Complete preparation for police academy entrance exam',
        examType: 'POLICE',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        price: 25000,
        isActive: true
      }
    });

    // Create subjects for the classes
    const mathSubject = await prisma.subject.upsert({
      where: { id: 'math-subject-1' },
      update: {},
      create: {
        id: 'math-subject-1',
        name: 'Mathematics',
        description: 'Advanced mathematics for ENAM preparation',
        classId: enamClass.id,
        order: 1
      }
    });

    const literatureSubject = await prisma.subject.upsert({
      where: { id: 'lit-subject-1' },
      update: {},
      create: {
        id: 'lit-subject-1',
        name: 'Literature',
        description: 'French literature for ENS preparation',
        classId: ensClass.id,
        order: 1
      }
    });

    const generalSubject = await prisma.subject.upsert({
      where: { id: 'gen-subject-1' },
      update: {},
      create: {
        id: 'gen-subject-1',
        name: 'General Knowledge',
        description: 'General knowledge for police exam',
        classId: policeClass.id,
        order: 1
      }
    });

    // Enroll the demo learner in classes
    await Promise.all([
      prisma.enrollment.upsert({
        where: { 
          userId_classId: {
            userId: learner.id,
            classId: enamClass.id
          }
        },
        update: {},
        create: {
          userId: learner.id,
          classId: enamClass.id,
          status: 'ACTIVE'
        }
      }),
      prisma.enrollment.upsert({
        where: { 
          userId_classId: {
            userId: learner.id,
            classId: policeClass.id
          }
        },
        update: {},
        create: {
          userId: learner.id,
          classId: policeClass.id,
          status: 'ACTIVE'
        }
      })
    ]);

    // Create sample chapters and lessons
    const mathChapter = await prisma.chapter.upsert({
      where: { id: 'math-chapter-1' },
      update: {},
      create: {
        id: 'math-chapter-1',
        title: 'Algebra Fundamentals',
        description: 'Basic algebra concepts for ENAM preparation',
        subjectId: mathSubject.id,
        order: 1
      }
    });

    await prisma.lesson.upsert({
      where: { id: 'math-lesson-1' },
      update: {},
      create: {
        id: 'math-lesson-1',
        title: 'Introduction to Algebra',
        content: 'Basic algebraic operations and equations',
        chapterId: mathChapter.id,
        order: 1,
        duration: 45,
        isPublished: true
      }
    });

    const litChapter = await prisma.chapter.upsert({
      where: { id: 'lit-chapter-1' },
      update: {},
      create: {
        id: 'lit-chapter-1',
        title: 'French Poetry',
        description: 'Classical French poetry analysis',
        subjectId: literatureSubject.id,
        order: 1
      }
    });

    await prisma.lesson.upsert({
      where: { id: 'lit-lesson-1' },
      update: {},
      create: {
        id: 'lit-lesson-1',
        title: 'Poetry Analysis Techniques',
        content: 'Methods for analyzing French poetry',
        chapterId: litChapter.id,
        order: 1,
        duration: 60,
        isPublished: true
      }
    });

    console.log('✅ Demo users and classes seeded successfully');
    console.log('\n📧 Demo Credentials:');
    console.log('Super Admin: admin@mindboost.cm / demo123');
    console.log('Teacher: teacher@mindboost.cm / demo123');
    console.log('Learner: learner@mindboost.cm / demo123');
    console.log('\n🎯 The learner is enrolled in preparatory classes:');
    console.log('- ENAM Preparation - Mathematics');
    console.log('- Police Exam Preparation');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
