/**
 * QuizzesTabStudent - 個人測驗紀錄 Tab
 */

import { AlertTriangle } from 'lucide-react';
import type { MOCK_STUDENTS } from '../../../mocks/analyticsData';

interface Props {
    student: typeof MOCK_STUDENTS[0];
}

export function QuizzesTabStudent({ student }: Props) {
    const quiz = student.quizzes;

    return (
        <div className="space-y-6">
            {quiz.knowledgeMastery.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">知識點掌握度</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {quiz.knowledgeMastery.map(kp => (
                            <div key={kp.id} className="text-center">
                                <div
                                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-lg font-bold"
                                    style={{
                                        backgroundColor: kp.mastery >= 80 ? '#dcfce7' : kp.mastery >= 60 ? '#fef9c3' : '#fee2e2',
                                        color: kp.mastery >= 80 ? '#16a34a' : kp.mastery >= 60 ? '#ca8a04' : '#dc2626'
                                    }}
                                >
                                    {kp.mastery}%
                                </div>
                                <p className="mt-2 text-sm text-gray-700">{kp.name}</p>
                                <p className="text-xs text-gray-500">{kp.attempts} 次練習</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {quiz.weakPoints.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        需加強項目
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {quiz.weakPoints.map((wp, idx) => (
                            <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
                                <span className="font-medium text-orange-800">{wp.point}</span>
                                <span className="ml-2 text-sm text-orange-600">
                                    ({Math.round(wp.errorRate * 100)}% 錯誤，{wp.count} 次)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {quiz.attempts.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">測驗紀錄</h3>
                    <div className="space-y-2">
                        {quiz.attempts.map(attempt => (
                            <div key={attempt.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${attempt.score >= 80 ? 'bg-green-100 text-green-600' :
                                    attempt.score >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {attempt.score}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{attempt.quizName}</p>
                                    <p className="text-sm text-gray-500">
                                        {attempt.date} · {attempt.correctCount}/{attempt.totalQuestions} 正確 · {attempt.timeSpent} 分鐘
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
