'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Users, Brain, BookOpen, Star, MapPin, DollarSign, Users as UsersIcon } from 'lucide-react';
import { evaluationAPI, universityAPI } from '@/lib/api';

interface University {
  id: string;
  name: string;
  country: string;
  rank: number;
  tuition: number;
  intl_rate: number;
  gpt_summary: string;
}

interface EvaluationResult {
  id: string;
  studentProfile: {
    type: string;
    description: string;
  };
  recommendedSchools: University[];
  edSuggestion: University;
  eaSuggestions: University[];
  rdSuggestions: University[];
  strategy: string;
  gptSummary: string;
}

const ParentEvalResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const evaluationId = searchParams.get('id');
    if (evaluationId) {
      loadEvaluationResult(evaluationId);
    } else {
      // 如果没有ID，说明是直接访问，显示错误
      setError('未找到评估结果');
      setLoading(false);
    }
  }, [searchParams]);

  const loadEvaluationResult = async (evaluationId: string) => {
    try {
      setLoading(true);
      const data = await evaluationAPI.getParentEvaluation(evaluationId);
      setResult(data);
    } catch (error) {
      console.error('加载评估结果失败:', error);
      setError('加载评估结果失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载您的个性化评估报告...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || '无法加载评估结果'}</p>
          <button
            onClick={() => router.push('/parent-eval/start')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            重新开始评估
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">您的个性化择校评估报告</h1>
          <p className="text-gray-600">基于您的输入，我们为您生成了以下建议</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：学生画像和策略 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 学生画像 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                学生画像
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">类型</span>
                  <p className="text-lg font-semibold text-blue-600">{result.studentProfile.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">描述</span>
                  <p className="text-gray-700">{result.studentProfile.description}</p>
                </div>
              </div>
            </div>

            {/* 申请策略 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                申请策略
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">ED (Early Decision)</h3>
                  <p className="text-sm text-gray-700">{result.edSuggestion.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-600 mb-2">EA (Early Action)</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {result.eaSuggestions.map((school, index) => (
                      <li key={index}>• {school.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-600 mb-2">RD (Regular Decision)</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {result.rdSuggestions.map((school, index) => (
                      <li key={index}>• {school.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI分析 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                AI分析
              </h2>
              <p className="text-gray-700 leading-relaxed">{result.gptSummary}</p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">希望获取完整申请规划？</h3>
              <p className="text-blue-100 mb-4">我们的专业顾问将在24小时内为您提供详细方案</p>
              <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-50">
                立即咨询
              </button>
            </div>
          </div>

          {/* 右侧：推荐学校 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              推荐学校 (Top {result.recommendedSchools.length})
            </h2>
            <div className="space-y-6">
              {result.recommendedSchools.map((school, index) => (
                <div key={school.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {index + 1}. {school.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          排名 #{school.rank}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {school.country}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${school.tuition.toLocaleString()}/年
                        </span>
                        <span className="flex items-center">
                          <UsersIcon className="w-4 h-4 mr-1" />
                          {Math.round(school.intl_rate * 100)}% 国际生
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{school.gpt_summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/parent-eval/start')}
            className="px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700"
          >
            重新评估
          </button>
          <button
            onClick={() => router.push('/universities')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
          >
            浏览更多学校
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentEvalResult; 