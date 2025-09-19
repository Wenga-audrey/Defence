import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create super admin user
  const superAdminPassword = await bcrypt.hash("superadmin123", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@mindboost.com" },
    update: {},
    create: {
      email: "superadmin@mindboost.com",
      password: superAdminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      isEmailVerified: true,
    },
  });

  // Create teacher user
  const teacherPassword = await bcrypt.hash("teacher123", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@mindboost.com" },
    update: {},
    create: {
      email: "teacher@mindboost.com",
      password: teacherPassword,
      firstName: "John",
      lastName: "Teacher",
      role: "TEACHER",
      isEmailVerified: true,
    },
  });

  // Create demo learner user
  const learnerPassword = await bcrypt.hash("learner123", 12);
  const learner = await prisma.user.upsert({
    where: { email: "learner@mindboost.com" },
    update: {},
    create: {
      email: "learner@mindboost.com",
      password: learnerPassword,
      firstName: "Marie",
      lastName: "Learner",
      role: "LEARNER",
      isEmailVerified: true,
    },
  });

  // Create sample preparatory classes
  const enamClass = await prisma.preparatoryClass.create({
    data: {
      name: "ENAM Preparation - Mathematics",
      description:
        "Comprehensive mathematics preparation for the National School of Administration (ENAM) entrance exam.",
      examType: "ENAM",
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-15'),
      price: 35000,
    },
  });

  const ensClass = await prisma.preparatoryClass.create({
    data: {
      name: "ENS Preparation - Literature",
      description:
        "Essential literature concepts for École Normale Supérieure entrance exam.",
      examType: "ENS",
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-01'),
      price: 40000,
    },
  });

  const policeClass = await prisma.preparatoryClass.create({
    data: {
      name: "Police Exam Preparation",
      description:
        "Complete preparation for police academy entrance exam.",
      examType: "POLICE",
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      price: 25000,
    },
  });

  // Create subjects for ENAM class
  const mathSubject = await prisma.subject.create({
    data: {
      classId: enamClass.id,
      name: "Mathematics",
      description: "Core mathematics concepts",
      order: 1,
    },
  });

  // Create chapters for math subject
  const algebraChapter = await prisma.chapter.create({
    data: {
      subjectId: mathSubject.id,
      title: "Algebraic Expressions",
      description: "Learn about algebraic expressions and equations",
      order: 1,
      isPublished: true,
    },
  });

  // Create lessons for algebra chapter
  await prisma.lesson.create({
    data: {
      chapterId: algebraChapter.id,
      title: "Introduction to Algebra",
      content: "Basic algebraic concepts and operations",
      order: 1,
      isPublished: true,
    },
  });

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      userId: learner.id,
      classId: enamClass.id,
      status: "ACTIVE",
    },
  });

  // Create a sample payment
  await prisma.payment.create({
    data: {
      userId: learner.id,
      classId: enamClass.id,
      amount: 35000,
      method: "MTN_MOMO",
      status: "PAID",
      phoneNumber: "+237123456789",
      paidAt: new Date(),
    },
  });

  console.log("✅ Database seeding completed successfully!");
  console.log(`Created users: ${superAdmin.email}, ${teacher.email}, ${learner.email}`);
  console.log(`Created classes: ${enamClass.name}, ${ensClass.name}, ${policeClass.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
