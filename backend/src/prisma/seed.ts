import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create super admin user
  const superAdminPassword = await bcrypt.hash("superadmin123", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@mindboost.com" },
    update: {
      password: superAdminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      isEmailVerified: true,
    },
    create: {
      email: "superadmin@mindboost.com",
      password: superAdminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      isEmailVerified: true,
    },
  });

  // Create prep admin user
  const prepAdminPassword = await bcrypt.hash("prepadmin123", 12);
  const prepAdmin = await prisma.user.upsert({
    where: { email: "prepadmin@mindboost.com" },
    update: {
      password: prepAdminPassword,
      firstName: "Prep",
      lastName: "Admin",
      role: "PREP_ADMIN",
      isEmailVerified: true,
    },
    create: {
      email: "prepadmin@mindboost.com",
      password: prepAdminPassword,
      firstName: "Prep",
      lastName: "Admin",
      role: "PREP_ADMIN",
      isEmailVerified: true,
    },
  });

  // Create teacher user
  const teacherPassword = await bcrypt.hash("teacher123", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@mindboost.com" },
    update: {
      password: teacherPassword,
      firstName: "Jean",
      lastName: "Professeur",
      role: "TEACHER",
      isEmailVerified: true,
    },
    create: {
      email: "teacher@mindboost.com",
      password: teacherPassword,
      firstName: "Jean",
      lastName: "Professeur",
      role: "TEACHER",
      isEmailVerified: true,
    },
  });

  // Create demo learner users
  const learner1Password = await bcrypt.hash("learner123", 12);
  const learner1 = await prisma.user.upsert({
    where: { email: "learner@mindboost.com" },
    update: {
      password: learner1Password,
      firstName: "Marie",
      lastName: "Étudiante",
      role: "LEARNER",
      isEmailVerified: true,
    },
    create: {
      email: "learner@mindboost.com",
      password: learner1Password,
      firstName: "Marie",
      lastName: "Étudiante",
      role: "LEARNER",
      isEmailVerified: true,
    },
  });

  const learner2Password = await bcrypt.hash("student123", 12);
  const learner2 = await prisma.user.upsert({
    where: { email: "student@mindboost.com" },
    update: {
      password: learner2Password,
      firstName: "Paul",
      lastName: "Étudiant",
      role: "LEARNER",
      isEmailVerified: true,
    },
    create: {
      email: "student@mindboost.com",
      password: learner2Password,
      firstName: "Paul",
      lastName: "Étudiant",
      role: "LEARNER",
      isEmailVerified: true,
    },
  });

  // Create sample preparatory classes with realistic Cameroon exam data
  const enamClass = await prisma.preparatoryClass.upsert({
    where: { id: "enam-math-2024" },
    update: {},
    create: {
      id: "enam-math-2024",
      name: "ENAM - Cycle A (Administration Générale)",
      description: "Préparation complète au concours d'entrée à l'École Nationale d'Administration et de Magistrature - Cycle A",
      examType: "ENAM",
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      price: 85000,
      isActive: true,
    },
  });

  const ensClass = await prisma.preparatoryClass.upsert({
    where: { id: "ens-lettres-2024" },
    update: {},
    create: {
      id: "ens-lettres-2024", 
      name: "ENS - Lettres Modernes Françaises",
      description: "Préparation au concours d'entrée à l'École Normale Supérieure - Département de Lettres Modernes Françaises",
      examType: "ENS",
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-07-15'),
      price: 75000,
      isActive: true,
    },
  });

  const policeClass = await prisma.preparatoryClass.upsert({
    where: { id: "police-officier-2024" },
    update: {},
    create: {
      id: "police-officier-2024",
      name: "Concours Police Nationale - Officier de Police",
      description: "Préparation au concours de recrutement d'Officiers de Police de la Sûreté Nationale",
      examType: "POLICE",
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-05-31'),
      price: 45000,
      isActive: true,
    },
  });

  const douanesClass = await prisma.preparatoryClass.upsert({
    where: { id: "douanes-inspecteur-2024" },
    update: {},
    create: {
      id: "douanes-inspecteur-2024",
      name: "Concours Douanes - Inspecteur des Douanes",
      description: "Préparation au concours de recrutement d'Inspecteurs des Douanes du Cameroun",
      examType: "CUSTOMS",
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-31'),
      price: 65000,
      isActive: true,
    },
  });

  // Create comprehensive subjects and content for ENAM class
  const mathSubject = await prisma.subject.upsert({
    where: { id: "enam-math-subject" },
    update: {},
    create: {
      id: "enam-math-subject",
      classId: enamClass.id,
      name: "Mathématiques Générales",
      description: "Mathématiques pour le concours ENAM - Algèbre, Analyse, Géométrie",
      order: 1,
    },
  });

  const frenchSubject = await prisma.subject.upsert({
    where: { id: "enam-french-subject" },
    update: {},
    create: {
      id: "enam-french-subject",
      classId: enamClass.id,
      name: "Français et Expression Écrite",
      description: "Maîtrise du français, dissertation, commentaire de texte",
      order: 2,
    },
  });

  const cultureSubject = await prisma.subject.upsert({
    where: { id: "enam-culture-subject" },
    update: {},
    create: {
      id: "enam-culture-subject",
      classId: enamClass.id,
      name: "Culture Générale",
      description: "Histoire, géographie, institutions camerounaises, actualités",
      order: 3,
    },
  });

  // Create subjects for ENS class
  const litteratureSubject = await prisma.subject.upsert({
    where: { id: "ens-litterature-subject" },
    update: {},
    create: {
      id: "ens-litterature-subject",
      classId: ensClass.id,
      name: "Littérature Française",
      description: "Analyse littéraire, histoire de la littérature française",
      order: 1,
    },
  });

  // Create chapters and lessons for math subject
  const algebraChapter = await prisma.chapter.upsert({
    where: { id: "algebra-chapter" },
    update: {},
    create: {
      id: "algebra-chapter",
      subjectId: mathSubject.id,
      title: "Algèbre et Équations",
      description: "Résolution d'équations, systèmes linéaires, polynômes",
      order: 1,
      isPublished: true,
    },
  });

  const geometryChapter = await prisma.chapter.upsert({
    where: { id: "geometry-chapter" },
    update: {},
    create: {
      id: "geometry-chapter",
      subjectId: mathSubject.id,
      title: "Géométrie Plane et dans l'Espace",
      description: "Géométrie euclidienne, trigonométrie, géométrie analytique",
      order: 2,
      isPublished: true,
    },
  });

  // Create lessons
  await prisma.lesson.upsert({
    where: { id: "algebra-lesson-1" },
    update: {},
    create: {
      id: "algebra-lesson-1",
      chapterId: algebraChapter.id,
      title: "Équations du Premier Degré",
      content: "Résolution d'équations linéaires à une et plusieurs inconnues. Méthodes de résolution et applications pratiques.",
      order: 1,
      duration: 90,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "algebra-lesson-2" },
    update: {},
    create: {
      id: "algebra-lesson-2",
      chapterId: algebraChapter.id,
      title: "Systèmes d'Équations Linéaires",
      content: "Résolution de systèmes par substitution, élimination et méthode de Cramer.",
      order: 2,
      duration: 120,
      isPublished: true,
    },
  });

  // Create enrollments with realistic data
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
      status: "ACTIVE",
      enrolledAt: new Date('2024-01-20'),
    },
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
      status: "ACTIVE",
      enrolledAt: new Date('2024-01-10'),
    },
  });

  // Create realistic payments
  await prisma.payment.upsert({
    where: { id: "payment-marie-enam" },
    update: {},
    create: {
      id: "payment-marie-enam",
      userId: learner1.id,
      classId: enamClass.id,
      amount: 85000,
      method: "MTN_MOMO",
      status: "PAID",
      phoneNumber: "+237690123456",
      transactionId: "MOMO240120001",
      paidAt: new Date('2024-01-20'),
    },
  });

  await prisma.payment.upsert({
    where: { id: "payment-paul-police" },
    update: {},
    create: {
      id: "payment-paul-police",
      userId: learner2.id,
      classId: policeClass.id,
      amount: 45000,
      method: "ORANGE_MONEY",
      status: "PAID",
      phoneNumber: "+237677987654",
      transactionId: "OM240110001",
      paidAt: new Date('2024-01-10'),
    },
  });

  // Create a pending payment for testing
  await prisma.payment.upsert({
    where: { id: "payment-pending-douanes" },
    update: {},
    create: {
      id: "payment-pending-douanes",
      userId: learner1.id,
      classId: douanesClass.id,
      amount: 65000,
      method: "MTN_MOMO",
      status: "PENDING",
      phoneNumber: "+237690123456",
      transactionId: "MOMO240301001",
    },
  });

  console.log("✅ Database seeding completed successfully!");
  console.log(`\n👥 Created users:`);
  console.log(`   Super Admin: ${superAdmin.email} / superadmin123`);
  console.log(`   Prep Admin: ${prepAdmin.email} / prepadmin123`);
  console.log(`   Teacher: ${teacher.email} / teacher123`);
  console.log(`   Learner 1: ${learner1.email} / learner123`);
  console.log(`   Learner 2: ${learner2.email} / student123`);
  console.log(`\n🎓 Created preparatory classes:`);
  console.log(`   ${enamClass.name} (${enamClass.price} FCFA)`);
  console.log(`   ${ensClass.name} (${ensClass.price} FCFA)`);
  console.log(`   ${policeClass.name} (${policeClass.price} FCFA)`);
  console.log(`   ${douanesClass.name} (${douanesClass.price} FCFA)`);
  console.log(`\n📚 Created subjects, chapters, and lessons with realistic content`);
  console.log(`\n💳 Created enrollments and payments for testing`);
  console.log(`\n🔐 All users can now login with their credentials!`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
