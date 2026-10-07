const bcrypt = require("bcryptjs");
const { User, Course, Lesson } = require("./models");
const SALT = 12;

const users = {
  admin: {
    fullName: "Your_Name",
    email: "Your_Email",
    password: "Your_Password",
  },
  instructor: {
    fullName: "Your_Name",
    email: "Your_Email",
    password: "Your_Password",
  },
  student: {
    fullName: "Your_Name",
    email: "Your_Email",
    password: "Your_Password",
  },
};

const createDev = async (role = "admin") => {
  if (!["student", "instructor", "admin"].includes(role)) process.exit(1);
  // role -> student / instructor / admin
  const info = users[role];
  try {
    const user = await User.findOne({
      where: { email: info.email },
    });

    if (user) {
      console.log(`${role} already exists`);
      return user;
    }

    const passHash = await bcrypt.hash(info.password, SALT);
    const createdUser = await User.create({
      fullName: info.fullName,
      email: info.email,
      password: passHash,
      role,
    });
    return createdUser;
  } catch (err) {
    console.error(`Failed to create ${role}: ${err.message}`);
    throw err;
  }
};

const createCourse = async (instructorId) => {
  const existsCourse = await Course.findOne({ where: { instructorId } });
  if (existsCourse) return existsCourse;

  const courseInfo = {
    instructorId,
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript",
    category: "Web Development",
    level: "beginner", // level -->  beginner / intermediate / advanced
    price: 5000,
    isPublished: true,
  };
  const course = await Course.create(courseInfo);
  return course;
};

const createLessons = async (courseId) => {
  const lessons = await Lesson.findAll({ where: { courseId } });
  if (lessons.length) return lessons;

  const lessonsInfo = [
    {
      title: "Introduction to JavaScript",
      content: "JavaScript basics...",
      duration: 20,
    },
    {
      title: "Variables and Data Types",
      content: "Learn about variables and data types...",
      duration: 30,
    },
    {
      title: "Functions",
      content: "Learn how functions work...",
      duration: 25,
    },
  ];

  let i = 1;
  const createdLessons = []
  for(const lesson of lessonsInfo){
    const createdLesson = await Lesson.create({...lesson, courseId, order: i++});
    createdLessons.push(createdLesson);
  }
  return createdLessons;
};

const run = async () => {
  await createDev("admin");
  const instructor = await createDev("instructor");
  await createDev("student");

  const course = await createCourse(instructor.id);
  await createLessons(course.id);
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/* SCRIPT --> ( npm run seed ) */
