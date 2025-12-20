// mocks/reviewMocks.ts

export interface StudentLog {
  id: number;
  student: string;
  query: string;
  status: 'safe' | 'flagged';
  time: string;
}

export const MOCK_STUDENT_LOGS: StudentLog[] = [
  { id: 1, student: '王小明', query: '什麼是一元二次方程式？', status: 'safe', time: '10:05' },
  { id: 2, student: '陳小美', query: '幫我寫這題作業的答案', status: 'flagged', time: '10:12' },
  { id: 3, student: '林大華', query: '判別式的公式是什麼？', status: 'safe', time: '10:15' },
];
