// mocks/index.ts

// Dashboard mocks
export {
  STATS_DATA,
  STUDENTS_DATA,
  HOMEWORK_DATA,
  QUIZ_QUESTIONS,
  getStatusStyle,
  getStatusLabel,
  getScoreColor,
  type StatItem,
  type StudentItem,
  type HomeworkItem,
  type QuizQuestion,
} from './dashboardMocks';

// Review mocks
export { MOCK_STUDENT_LOGS, type StudentLog } from './reviewMocks';

// APOS Lesson mocks
export {
  ALGEBRA_APOS_LESSON,
  ARITHMETIC_APOS_LESSON,
  GEOMETRY_APOS_LESSON,
  MOCK_APOS_LESSON,
  getAllActivitiesFromAlgebra,
  findAlgebraStageByActivityId,
  findAlgebraActivityById,
} from './aposLessonMocks';

// Differentiated Lesson mocks
export { MOCK_DIFFERENTIATED_LESSON } from './lessonPlanMocks';

// Student Progress mocks
export { MOCK_DIFFERENTIATED_STUDENT_PROGRESS } from './studentProgressMocks';

// Learning Path mocks
export { MOCK_STUDENT_RECORDS } from './learningPathMocks';

