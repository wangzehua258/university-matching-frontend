'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { evaluationAPI } from '@/lib/api';
import { getAnonymousUserId } from '@/lib/useAnonymousUser';
import { GraduationCap, MapPin, DollarSign, Users, Calendar, Globe, Award } from 'lucide-react';

interface School {
  id: string;
  name: string;
  country: string;
  rank: number;
  tuition: number;
  intl_rate: number;
  type: string;
  schoolSize: string;
  strengths: string[];
  tags: string[];
  has_internship_program: boolean;
  has_research_program: boolean;
  gpt_summary: string;
  logoUrl: string;
  acceptanceRate: number;
  satRange: string;
  actRange: string;
  gpaRange: string;
  applicationDeadline: string;
  website: string;
}

interface StudentProfile {
  type: string;
  description: string;
}

interface EvaluationResult {
  id: string;
  user_id: string;
  studentProfile: StudentProfile;
  recommendedSchools: School[];
  edSuggestion: School | null;
  eaSuggestions: School[];
  rdSuggestions: School[];
  strategy: string;
  gptSummary: string;
  created_at: string;
}

const ParentEvalResult = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const evalId = searchParams.get('id');
        const userId = getAnonymousUserId();

        if (evalId) {
          // 如果有评估ID，直接获取该评估结果
          const data = await evaluationAPI.getParentEvaluation(evalId);
          setResult(data);
        } else {
          // 否则获取用户最新的评估结果
          const evaluations = await evaluationAPI.getParentEvaluationByUserId(userId);
          if (evaluations && evaluations.length > 0) {
            setResult(evaluations[0]);
          } else {
            setError('未找到评估结果');
          }
        }
      } catch (err) {
        console.error('获取评估结果失败:', err);
        setError('获取评估结果失败');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在生成您的个性化择校报告...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '未找到评估结果'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const formatTuition = (tuition: number) => {
    return `$${(tuition / 1000).toFixed(0)}k`;
  };

  const formatAcceptanceRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const getSchoolSizeText = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      'small': '小型',
      'medium': '中型',
      'large': '大型'
    };
    return sizeMap[size] || size;
  };

  const getSchoolTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'private': '私立',
      'public': '公立'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个性化择校报告</h1>
          <p className="text-gray-600">基于您的评估结果生成的专属建议</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：学生画像和策略 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 学生画像 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                学生画像
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                    {result.studentProfile.type}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {result.studentProfile.description}
                </p>
              </div>
            </div>

            {/* 申请策略 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-600" />
                申请策略
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {result.strategy}
              </p>
            </div>

            {/* GPT总结 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                专业建议
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {result.gptSummary}
              </p>
            </div>
          </div>

          {/* 右侧：推荐学校 */}
          <div className="lg:col-span-2 space-y-6">
            {/* ED建议 */}
            {result.edSuggestion && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                    ED建议
                  </span>
                  早决定申请
                </h2>
                <SchoolCard school={result.edSuggestion} />
              </div>
            )}

            {/* EA建议 */}
            {result.eaSuggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                    EA建议
                  </span>
                  早行动申请
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.eaSuggestions.map((school) => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              </div>
            )}

            {/* RD建议 */}
            {result.rdSuggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                    RD建议
                  </span>
                  常规申请
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.rdSuggestions.map((school) => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/parent-eval/start'}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
          >
            重新评估
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};

// 学校卡片组件
const SchoolCard = ({ school }: { school: School }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{school.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{school.country}</span>
            <span className="mx-2">•</span>
            <span>排名 #{school.rank}</span>
          </div>
        </div>
        {school.logoUrl && (
          <img src={school.logoUrl} alt={school.name} className="w-12 h-12 rounded" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>学费: {formatTuition(school.tuition)}/年</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-1" />
          <span>录取率: {formatAcceptanceRate(school.acceptanceRate)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span>类型: {getSchoolTypeText(school.type)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span>规模: {getSchoolSizeText(school.schoolSize)}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-1">优势专业:</div>
        <div className="flex flex-wrap gap-1">
          {school.strengths.slice(0, 3).map((strength, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {school.has_internship_program && (
        <div className="mb-2">
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            ✓ 实习项目
          </span>
        </div>
      )}

      {school.has_research_program && (
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            ✓ 研究项目
          </span>
        </div>
      )}

      {school.website && (
        <a
          href={school.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm hover:underline"
        >
          访问官网 →
        </a>
      )}
    </div>
  );
};

export default ParentEvalResult; 