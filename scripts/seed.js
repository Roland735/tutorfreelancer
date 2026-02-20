import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import User from '../src/models/User.js';
import TutorProfile from '../src/models/TutorProfile.js';
import Job from '../src/models/Job.js';
import Session from '../src/models/Session.js';
import Review from '../src/models/Review.js';
import Message from '../src/models/Message.js';
import Category from '../src/models/Category.js';
import Notification from '../src/models/Notification.js';
import Transaction from '../src/models/Transaction.js';
import Blog from '../src/models/Blog.js';

// Configuration
const CONFIG = {
  USERS_COUNT: 50,
  TUTORS_COUNT: 30,
  JOBS_COUNT: 40,
  SESSIONS_COUNT: 60,
  REVIEWS_COUNT: 80,
  MESSAGES_COUNT: 200,
  TRANSACTIONS_COUNT: 30,
  CATEGORIES_COUNT: 20,
  BLOGS_COUNT: 8,
};

// Data Helpers
const universities = [
  'Harvard University', 'MIT', 'Stanford University', 'University of Oxford',
  'ETH Zurich', 'University of Toronto', 'NUS Singapore', 'University of Tokyo',
  'University of Melbourne', 'Tsinghua University', 'UC Berkeley', 'Imperial College London'
];

const majors = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Economics', 'Psychology', 'History', 'English Literature', 'Mechanical Engineering',
  'Electrical Engineering', 'Civil Engineering', 'Philosophy', 'Political Science'
];

const skillsList = [
  'Python', 'Java', 'Calculus', 'Organic Chemistry', 'React', 'Node.js',
  'Linear Algebra', 'Machine Learning', 'Statistics', 'Essay Writing',
  'Macroeconomics', 'Physics I', 'Thermodynamics', 'Data Structures', 'Algorithms'
];

const categoriesData = [
  { name: 'Mathematics', icon: 'FaCalculator', subjects: ['Calculus', 'Algebra', 'Geometry', 'Statistics', 'Trigonometry', 'Probability', 'Differential Equations', 'Linear Algebra'] },
  { name: 'Computer Science', icon: 'FaCode', subjects: ['Python', 'Java', 'Web Development', 'Algorithms', 'Data Structures', 'Database', 'Machine Learning', 'Cybersecurity'] },
  { name: 'Science', icon: 'FaFlask', subjects: ['Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Astronomy', 'Geology', 'Biochemistry', 'Neuroscience'] },
  { name: 'Languages', icon: 'FaGlobe', subjects: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic', 'Russian'] },
  { name: 'Business', icon: 'FaBriefcase', subjects: ['Accounting', 'Finance', 'Marketing', 'Economics', 'Management', 'Business Law', 'Entrepreneurship', 'Supply Chain'] },
  { name: 'Engineering', icon: 'FaCogs', subjects: ['Mechanical', 'Electrical', 'Civil', 'Chemical', 'Aerospace', 'Biomedical', 'Software', 'Industrial'] },
  { name: 'Humanities', icon: 'FaBook', subjects: ['History', 'Philosophy', 'Literature', 'Religion', 'Art History', 'Classics', 'Anthropology', 'Sociology'] },
  { name: 'Social Sciences', icon: 'FaUsers', subjects: ['Psychology', 'Political Science', 'Sociology', 'Geography', 'International Relations', 'Criminology', 'Social Work', 'Urban Studies'] },
  { name: 'Law', icon: 'FaGavel', subjects: ['Criminal Law', 'Civil Law', 'Contract Law', 'Constitutional Law', 'International Law', 'Corporate Law', 'Family Law', 'Property Law'] },
  { name: 'Medicine', icon: 'FaStethoscope', subjects: ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology', 'Immunology', 'Genetics', 'Microbiology', 'Public Health'] },
  { name: 'Design & Art', icon: 'FaPalette', subjects: ['Graphic Design', 'Illustration', 'UX/UI', 'Fashion Design', 'Photography', 'Interior Design', 'Animation', 'Fine Arts'] },
  { name: 'Music', icon: 'FaMusic', subjects: ['Music Theory', 'Piano', 'Guitar', 'Voice', 'Violin', 'Music Production', 'Composition', 'Music History'] },
  { name: 'Test Prep', icon: 'FaPencilAlt', subjects: ['SAT', 'ACT', 'GRE', 'GMAT', 'LSAT', 'MCAT', 'TOEFL', 'IELTS'] },
  { name: 'Writing', icon: 'FaPenFancy', subjects: ['Creative Writing', 'Academic Writing', 'Copywriting', 'Journalism', 'Screenwriting', 'Technical Writing', 'Poetry', 'Editing'] },
  { name: 'Data Science', icon: 'FaDatabase', subjects: ['Data Analysis', 'SQL', 'Tableau', 'Power BI', 'Big Data', 'R Programming', 'Excel', 'Data Visualization'] },
  { name: 'Marketing', icon: 'FaBullhorn', subjects: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing', 'Brand Management', 'Email Marketing', 'Market Research', 'Public Relations'] },
  { name: 'Accounting', icon: 'FaFileInvoiceDollar', subjects: ['Financial Accounting', 'Managerial Accounting', 'Taxation', 'Auditing', 'Bookkeeping', 'Corporate Finance', 'Cost Accounting', 'Forensic Accounting'] },
  { name: 'Architecture', icon: 'FaBuilding', subjects: ['Architectural Design', 'Urban Planning', 'Landscape Architecture', 'Sustainable Design', 'CAD', 'Revit', 'History of Architecture', 'Construction Management'] },
  { name: 'Psychology', icon: 'FaBrain', subjects: ['Cognitive Psychology', 'Developmental Psychology', 'Clinical Psychology', 'Social Psychology', 'Abnormal Psychology', 'Neuropsychology', 'Research Methods', 'Behavioral Science'] },
  { name: 'Economics', icon: 'FaChartLine', subjects: ['Microeconomics', 'Macroeconomics', 'Econometrics', 'Development Economics', 'International Economics', 'Labor Economics', 'Public Economics', 'Game Theory'] }
];

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  console.log('Clearing database...');
  await Promise.all([
    User.deleteMany({}),
    TutorProfile.deleteMany({}),
    Job.deleteMany({}),
    Session.deleteMany({}),
    Review.deleteMany({}),
    Message.deleteMany({}),
    Category.deleteMany({}),
    Notification.deleteMany({}),
    Transaction.deleteMany({}),
    Blog.deleteMany({})
  ]);
  console.log('Database cleared.');
}

async function seedBlogs() {
  console.log('Seeding blogs...');
  const blogTopics = [
    { title: "How to Find the Right Tutor for Calculus", category: "Tips" },
    { title: "How to Earn Money as a Student Tutor", category: "Guides" },
    { title: "The Benefits of Peer-to-Peer Learning", category: "Education" },
    { title: "Exam Prep Strategies for Finals Week", category: "Study Hacks" },
    { title: "Managing Time: Balancing Work and Study", category: "Productivity" },
    { title: "Top 5 Apps for Note Taking", category: "Tools" },
    { title: "Understanding React Hooks for Beginners", category: "Programming" },
    { title: "Why Python is the Best First Language", category: "Programming" }
  ];

  const blogs = blogTopics.map((topic, i) => ({
    title: topic.title,
    slug: faker.helpers.slugify(topic.title).toLowerCase(),
    excerpt: faker.lorem.paragraph(2),
    content: faker.lorem.paragraphs(5),
    image: `https://picsum.photos/seed/${i + 1}/800/600`,
    category: topic.category,
    author: {
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    },
    publishedAt: faker.date.past(),
    readTime: faker.number.int({ min: 3, max: 10 }),
    tags: faker.lorem.words(3).split(' '),
  }));

  return await Blog.insertMany(blogs);
}

async function seedCategories() {
  console.log('Seeding categories...');
  const categories = categoriesData.map(cat => ({
    name: cat.name,
    slug: faker.helpers.slugify(cat.name).toLowerCase(),
    icon: cat.icon,
    subjects: cat.subjects,
    themeColor: faker.color.rgb(),
    activeJobs: faker.number.int({ min: 0, max: 50 }),
    activeTutors: faker.number.int({ min: 0, max: 100 })
  }));

  return await Category.insertMany(categories);
}

async function seedUsersAndTutors() {
  console.log('Seeding users and tutors...');
  const users = [];
  const tutors = [];

  const password = await bcrypt.hash('password123', 10);

  for (let i = 0; i < CONFIG.USERS_COUNT; i++) {
    const isTutor = i < CONFIG.TUTORS_COUNT;
    const role = isTutor ? 'tutor' : (i % 5 === 0 ? 'both' : 'student');

    const user = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: password,
      role: role,
      avatar: faker.image.avatar(),
      university: faker.helpers.arrayElement(universities),
      major: faker.helpers.arrayElement(majors),
      yearOfStudy: faker.helpers.arrayElement(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Masters', 'PhD']),
      bio: faker.person.bio(),
      location: {
        city: faker.location.city(),
        country: faker.location.country(),
        timezone: faker.location.timeZone(),
      },
      languages: faker.helpers.arrayElements(['English', 'Spanish', 'French', 'German', 'Mandarin'], { min: 1, max: 3 }),
      isVerified: faker.datatype.boolean(0.7),
      isOnline: faker.datatype.boolean(0.3),
      lastLogin: faker.date.recent(),
      socialLinks: {
        linkedin: `https://linkedin.com/in/${faker.lorem.slug()}`,
        github: `https://github.com/${faker.lorem.slug()}`,
      }
    });

    const savedUser = await user.save();
    users.push(savedUser);

    if (isTutor || role === 'both') {
      const tutorProfile = new TutorProfile({
        user: savedUser._id,
        subjects: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }).map(() => ({
          name: faker.helpers.arrayElement(skillsList),
          category: faker.helpers.arrayElement(categoriesData).name,
          difficulty: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced'])
        })),
        hourlyRate: faker.number.int({ min: 10, max: 80 }),
        sessionType: faker.helpers.arrayElement(['Online', 'In-Person', 'Both']),
        availability: {
          monday: [{ start: '09:00', end: '17:00' }],
          wednesday: [{ start: '10:00', end: '18:00' }],
          friday: [{ start: '09:00', end: '15:00' }]
        },
        stats: {
          totalSessions: faker.number.int({ min: 0, max: 200 }),
          totalEarnings: faker.number.int({ min: 0, max: 10000 }),
          completionRate: faker.number.int({ min: 80, max: 100 }),
          avgResponseTime: faker.number.int({ min: 5, max: 120 }),
          rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
          reviewCount: faker.number.int({ min: 0, max: 50 })
        },
        education: [{
          institution: savedUser.university,
          degree: savedUser.yearOfStudy,
          field: savedUser.major,
          startDate: faker.date.past({ years: 4 }),
          endDate: faker.date.future({ years: 1 })
        }],
        badges: faker.helpers.arrayElements(['Top Rated', 'Rising Talent', 'Verified'], { min: 0, max: 2 }),
        isFeatured: i < 5 // First 5 tutors are featured
      });

      const savedTutor = await tutorProfile.save();
      tutors.push(savedTutor);

      savedUser.tutorProfile = savedTutor._id;
      await savedUser.save();
    }
  }

  return { users, tutors };
}

async function seedJobs(users, categories) {
  console.log('Seeding jobs...');
  const jobs = [];
  const studentUsers = users.filter(u => u.role === 'student' || u.role === 'both');

  for (let i = 0; i < CONFIG.JOBS_COUNT; i++) {
    const poster = faker.helpers.arrayElement(studentUsers);
    const category = faker.helpers.arrayElement(categories);
    const subject = faker.helpers.arrayElement(category.subjects);

    const job = new Job({
      postedBy: poster._id,
      title: `Help needed with ${subject}`,
      description: faker.lorem.paragraph(3),
      subject: subject,
      category: category.name,
      academicLevel: faker.helpers.arrayElement(['High School', 'Undergraduate', 'Graduate']),
      budget: {
        type: faker.helpers.arrayElement(['Hourly', 'Fixed']),
        min: faker.number.int({ min: 15, max: 30 }),
        max: faker.number.int({ min: 35, max: 100 })
      },
      sessionType: faker.helpers.arrayElement(['Online', 'In-Person']),
      duration: faker.helpers.arrayElement(['1 hour', '2 hours', 'Weekly']),
      urgency: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
      tags: faker.helpers.arrayElements(['Urgent', 'Exam Prep', 'Assignment'], { min: 1, max: 3 }),
      status: faker.helpers.arrayElement(['Open', 'In-Progress', 'Completed']),
      views: faker.number.int({ min: 10, max: 500 }),
      deadline: faker.date.future()
    });

    // Add applicants
    const numApplicants = faker.number.int({ min: 0, max: 5 });
    for (let j = 0; j < numApplicants; j++) {
      const applicant = faker.helpers.arrayElement(users.filter(u => u.role === 'tutor' || u.role === 'both'));
      if (applicant._id.toString() !== poster._id.toString()) {
        job.applicants.push({
          user: applicant._id,
          coverLetter: faker.lorem.sentences(2),
          bidAmount: faker.number.int({ min: 15, max: 50 })
        });
      }
    }

    jobs.push(await job.save());
  }
  return jobs;
}

async function seedSessionsAndReviews(users, jobs) {
  console.log('Seeding sessions and reviews...');
  const sessions = [];
  const completedJobs = jobs.filter(j => j.status === 'Completed' || j.status === 'In-Progress');

  for (const job of completedJobs) {
    if (job.applicants.length === 0) continue;

    const tutor = job.applicants[0].user; // Assume first applicant got the job
    const student = job.postedBy;

    const session = new Session({
      job: job._id,
      student: student,
      tutor: tutor,
      date: faker.date.recent(),
      duration: 60,
      status: job.status === 'Completed' ? 'Completed' : 'Scheduled',
      type: job.sessionType,
      meetingLink: faker.internet.url(),
      payment: {
        amount: job.budget.min, // Simplified
        status: job.status === 'Completed' ? 'Paid' : 'Pending'
      },
      notes: faker.lorem.sentence()
    });

    const savedSession = await session.save();
    sessions.push(savedSession);

    // Create Transaction for paid sessions
    if (savedSession.payment.status === 'Paid') {
      await Transaction.create({
        payer: student,
        receiver: tutor,
        session: savedSession._id,
        amount: savedSession.payment.amount,
        platformFee: savedSession.payment.amount * 0.1, // 10% fee
        netPayout: savedSession.payment.amount * 0.9,
        status: 'Completed',
        stripeTransactionId: `ch_${faker.string.alphanumeric(24)}`,
        method: 'Stripe'
      });

      // Create Review
      if (faker.datatype.boolean(0.8)) { // 80% chance of review
        await Review.create({
          session: savedSession._id,
          reviewer: student,
          reviewee: tutor,
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentences(2),
          tags: faker.helpers.arrayElements(['Patient', 'Knowledgeable', 'Clear', 'Punctual'], { min: 1, max: 3 }),
          helpfulVotes: faker.number.int({ min: 0, max: 10 })
        });
      }
    }
  }
}

async function seedMessages(users) {
  console.log('Seeding messages...');
  for (let i = 0; i < CONFIG.MESSAGES_COUNT; i++) {
    const sender = faker.helpers.arrayElement(users);
    const receiver = faker.helpers.arrayElement(users.filter(u => u._id !== sender._id));
    const conversationId = [sender._id, receiver._id].sort().join('_');

    await Message.create({
      conversationId,
      sender: sender._id,
      receiver: receiver._id,
      content: faker.lorem.sentence(),
      read: faker.datatype.boolean()
    });
  }
}

async function seedNotifications(users) {
  console.log('Seeding notifications...');
  for (const user of users) {
    const count = faker.number.int({ min: 0, max: 5 });
    for (let i = 0; i < count; i++) {
      await Notification.create({
        recipient: user._id,
        type: faker.helpers.arrayElement(['New Application', 'System', 'New Message']),
        content: faker.lorem.sentence(),
        read: faker.datatype.boolean()
      });
    }
  }
}

async function main() {
  await connectDB();
  await clearDatabase();

  const categories = await seedCategories();
  const { users, tutors } = await seedUsersAndTutors();
  const jobs = await seedJobs(users, categories);
  await seedSessionsAndReviews(users, jobs);
  await seedMessages(users);
  await seedNotifications(users);
  await seedBlogs();

  console.log('Seeding completed successfully!');
  process.exit(0);
}

main().catch(console.error);
