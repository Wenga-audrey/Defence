import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedPlatform() {
  try {
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Create Prep Admin
    const prepAdmin = await prisma.user.upsert({
      where: { email: 'admin@mindboost.cm' },
      update: {},
      create: {
        email: 'admin@mindboost.cm',
        firstName: 'Marie',
        lastName: 'Administrateur',
        password: hashedPassword,
        role: 'PREP_ADMIN',
        phone: '+237670123456',
        paymentStatus: 'PAID',
        isEmailVerified: true
      }
    });

    // Create Teachers
    const mathTeacher = await prisma.user.upsert({
      where: { email: 'math.teacher@mindboost.cm' },
      update: {},
      create: {
        email: 'math.teacher@mindboost.cm',
        firstName: 'Jean',
        lastName: 'Mathematique',
        password: hashedPassword,
        role: 'TEACHER',
        phone: '+237670234567',
        paymentStatus: 'PAID',
        isEmailVerified: true
      }
    });

    const frenchTeacher = await prisma.user.upsert({
      where: { email: 'french.teacher@mindboost.cm' },
      update: {},
      create: {
        email: 'french.teacher@mindboost.cm',
        firstName: 'Claire',
        lastName: 'Francais',
        password: hashedPassword,
        role: 'TEACHER',
        phone: '+237670345678',
        paymentStatus: 'PAID',
        isEmailVerified: true
      }
    });

    // Create Learners
    const learner1 = await prisma.user.upsert({
      where: { email: 'learner1@mindboost.cm' },
      update: {},
      create: {
        email: 'learner1@mindboost.cm',
        firstName: 'Paul',
        lastName: 'Etudiant',
        password: hashedPassword,
        role: 'LEARNER',
        phone: '+237670456789',
        paymentStatus: 'PAID',
        isEmailVerified: true
      }
    });

    const learner2 = await prisma.user.upsert({
      where: { email: 'learner2@mindboost.cm' },
      update: {},
      create: {
        email: 'learner2@mindboost.cm',
        firstName: 'Sophie',
        lastName: 'Apprenante',
        password: hashedPassword,
        role: 'LEARNER',
        phone: '+237670567890',
        paymentStatus: 'PENDING',
        isEmailVerified: true
      }
    });

    // Create Preparatory Classes
    const enamClass = await prisma.preparatoryClass.upsert({
      where: { id: 'enam-2024' },
      update: {},
      create: {
        id: 'enam-2024',
        name: 'Préparation ENAM 2024',
        description: 'Classe préparatoire pour le concours ENAM - École Nationale d\'Administration et de Magistrature',
        examType: 'ENAM',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-11-30'),
        price: 150000,
        maxStudents: 30,
        isActive: true
      }
    });

    const ensClass = await prisma.preparatoryClass.upsert({
      where: { id: 'ens-2024' },
      update: {},
      create: {
        id: 'ens-2024',
        name: 'Préparation ENS 2024',
        description: 'Classe préparatoire pour l\'École Normale Supérieure',
        examType: 'ENS',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-15'),
        price: 120000,
        maxStudents: 25,
        isActive: true
      }
    });

    const policeClass = await prisma.preparatoryClass.upsert({
      where: { id: 'police-2024' },
      update: {},
      create: {
        id: 'police-2024',
        name: 'Concours Police 2024',
        description: 'Préparation au concours de la Police Nationale',
        examType: 'POLICE',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-10-30'),
        price: 75000,
        maxStudents: 50,
        isActive: true
      }
    });

    // Create Subjects for ENAM Class
    const mathSubject = await prisma.subject.upsert({
      where: { id: 'enam-math' },
      update: {},
      create: {
        id: 'enam-math',
        classId: enamClass.id,
        name: 'Mathématiques',
        description: 'Mathématiques générales et appliquées',
        order: 1,
        isActive: true
      }
    });

    const frenchSubject = await prisma.subject.upsert({
      where: { id: 'enam-french' },
      update: {},
      create: {
        id: 'enam-french',
        classId: enamClass.id,
        name: 'Français',
        description: 'Expression écrite et orale, littérature',
        order: 2,
        isActive: true
      }
    });

    const historySubject = await prisma.subject.upsert({
      where: { id: 'enam-history' },
      update: {},
      create: {
        id: 'enam-history',
        classId: enamClass.id,
        name: 'Histoire-Géographie',
        description: 'Histoire du Cameroun et géographie',
        order: 3,
        isActive: true
      }
    });

    // Create Chapters for Math Subject
    const algebraChapter = await prisma.chapter.upsert({
      where: { id: 'math-algebra' },
      update: {},
      create: {
        id: 'math-algebra',
        subjectId: mathSubject.id,
        title: 'Algèbre Linéaire',
        description: 'Matrices, déterminants, systèmes d\'équations',
        order: 1,
        duration: 120,
        isPublished: true
      }
    });

    const calculusChapter = await prisma.chapter.upsert({
      where: { id: 'math-calculus' },
      update: {},
      create: {
        id: 'math-calculus',
        subjectId: mathSubject.id,
        title: 'Analyse Mathématique',
        description: 'Dérivées, intégrales, limites',
        order: 2,
        duration: 150,
        isPublished: true
      }
    });

    // Create Lessons for Algebra Chapter
    await prisma.lesson.createMany({
      data: [
        {
          id: 'lesson-matrices',
          chapterId: algebraChapter.id,
          title: 'Introduction aux Matrices',
          content: 'Les matrices sont des tableaux rectangulaires de nombres...',
          order: 1,
          duration: 45,
          isPublished: true
        },
        {
          id: 'lesson-determinants',
          chapterId: algebraChapter.id,
          title: 'Calcul des Déterminants',
          content: 'Le déterminant d\'une matrice est un scalaire...',
          videoUrl: 'https://example.com/video/determinants.mp4',
          order: 2,
          duration: 60,
          isPublished: true
        },
        {
          id: 'lesson-systems',
          chapterId: algebraChapter.id,
          title: 'Résolution de Systèmes Linéaires',
          content: 'Méthodes de résolution par substitution et élimination...',
          documentUrl: 'https://example.com/docs/systems.pdf',
          order: 3,
          duration: 75,
          isPublished: true
        }
      ],
      skipDuplicates: true
    });

    // Assign Teachers to Classes
    await prisma.classTeacher.upsert({
      where: {
        classId_teacherId_subjectId: {
          classId: enamClass.id,
          teacherId: mathTeacher.id,
          subjectId: mathSubject.id
        }
      },
      update: {},
      create: {
        classId: enamClass.id,
        teacherId: mathTeacher.id,
        subjectId: mathSubject.id,
        role: 'TEACHER'
      }
    });

    await prisma.classTeacher.upsert({
      where: {
        classId_teacherId_subjectId: {
          classId: enamClass.id,
          teacherId: frenchTeacher.id,
          subjectId: frenchSubject.id
        }
      },
      update: {},
      create: {
        classId: enamClass.id,
        teacherId: frenchTeacher.id,
        subjectId: frenchSubject.id,
        role: 'TEACHER'
      }
    });

    // Enroll Learners
    await prisma.enrollment.upsert({
      where: {
        userId_classId: {
          userId: learner1.id,
          classId: enamClass.id
        }
      },
      update: {},
      create: {
        userId: learner1.id,
        classId: enamClass.id,
        status: 'ACTIVE'
      }
    });

    await prisma.enrollment.upsert({
      where: {
        userId_classId: {
          userId: learner2.id,
          classId: policeClass.id
        }
      },
      update: {},
      create: {
        userId: learner2.id,
        classId: policeClass.id,
        status: 'ACTIVE'
      }
    });

    // Create Chapter Quiz
    const algebraQuiz = await prisma.chapterQuiz.upsert({
      where: { id: 'quiz-algebra' },
      update: {},
      create: {
        id: 'quiz-algebra',
        chapterId: algebraChapter.id,
        title: 'Quiz Algèbre Linéaire',
        description: 'Évaluation des connaissances en algèbre',
        timeLimit: 30,
        passingScore: 70,
        isActive: true
      }
    });

    // Create Quiz Questions
    await prisma.quizQuestion.createMany({
      data: [
        {
          chapterQuizId: algebraQuiz.id,
          question: 'Quelle est la dimension d\'une matrice 3x4?',
          type: 'multiple-choice',
          options: JSON.stringify(['3 lignes et 4 colonnes', '4 lignes et 3 colonnes', '12 éléments', 'Aucune de ces réponses']),
          correctAnswer: '3 lignes et 4 colonnes',
          explanation: 'Une matrice 3x4 a 3 lignes et 4 colonnes par définition.',
          difficulty: 'EASY',
          points: 2,
          order: 1,
          isAIGenerated: false
        },
        {
          chapterQuizId: algebraQuiz.id,
          question: 'Comment calcule-t-on le déterminant d\'une matrice 2x2?',
          type: 'multiple-choice',
          options: JSON.stringify(['ad - bc', 'ab - cd', 'ac - bd', 'a + d - b - c']),
          correctAnswer: 'ad - bc',
          explanation: 'Pour une matrice [[a,b],[c,d]], le déterminant est ad - bc.',
          difficulty: 'MEDIUM',
          points: 3,
          order: 2,
          isAIGenerated: false
        }
      ],
      skipDuplicates: true
    });

    // Create Sample Progress
    await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId: learner1.id,
          chapterId: algebraChapter.id
        }
      },
      update: {},
      create: {
        userId: learner1.id,
        chapterId: algebraChapter.id,
        isCompleted: true,
        completedAt: new Date(),
        timeSpent: 180
      }
    });

    // Create Payment Records
    await prisma.payment.upsert({
      where: { id: 'payment-learner1-enam' },
      update: {},
      create: {
        id: 'payment-learner1-enam',
        userId: learner1.id,
        classId: enamClass.id,
        amount: 150000,
        method: 'ORANGE_MONEY',
        status: 'PAID',
        transactionId: 'OM240101001',
        phoneNumber: '+237670456789',
        paidAt: new Date('2024-01-10')
      }
    });

    // Create Announcements
    await prisma.announcement.upsert({
      where: { id: 'announcement-1' },
      update: {},
      create: {
        id: 'announcement-1',
        classId: enamClass.id,
        authorId: prepAdmin.id,
        title: 'Début des cours ENAM 2024',
        content: 'Les cours de préparation au concours ENAM débutent le 15 janvier 2024. Tous les étudiants inscrits sont priés de se connecter à la plateforme.',
        isUrgent: true
      }
    });

    // Create Forum Topics
    await prisma.forumTopic.upsert({
      where: { id: 'topic-math-help' },
      update: {},
      create: {
        id: 'topic-math-help',
        title: 'Aide en Mathématiques',
        content: 'Espace d\'entraide pour les questions de mathématiques',
        category: 'MATHEMATICS',
        authorId: learner1.id,
        views: 15
      }
    });

    console.log('✅ Platform seeded successfully!');
    console.log('\n🔑 Demo Accounts:');
    console.log('📋 Prep Admin: admin@mindboost.cm / demo123');
    console.log('👨‍🏫 Math Teacher: math.teacher@mindboost.cm / demo123');
    console.log('👩‍🏫 French Teacher: french.teacher@mindboost.cm / demo123');
    console.log('👨‍🎓 Learner 1: learner1@mindboost.cm / demo123 (PAID)');
    console.log('👩‍🎓 Learner 2: learner2@mindboost.cm / demo123 (PENDING)');
    
    console.log('\n📚 Preparatory Classes:');
    console.log('- ENAM 2024 (150,000 FCFA)');
    console.log('- ENS 2024 (120,000 FCFA)');
    console.log('- Police 2024 (75,000 FCFA)');
    
    console.log('\n🎯 Features Available:');
    console.log('- Structured course delivery (chapter by chapter)');
    console.log('- AI-powered quizzes after each chapter');
    console.log('- Subject-level comprehensive quizzes');
    console.log('- Payment integration (Orange Money, MTN MoMo)');
    console.log('- Forum for learner collaboration');
    console.log('- Teacher content management');
    console.log('- Progress tracking and analytics');

  } catch (error) {
    console.error('Error seeding platform:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPlatform();
