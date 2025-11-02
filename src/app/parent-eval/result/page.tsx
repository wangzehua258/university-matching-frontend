'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { evaluationAPI } from '@/lib/api';
import { GraduationCap, Award, Globe, MapPin, DollarSign } from 'lucide-react';
import { AUResultView } from './AUResultView';
import { UKResultView } from './UKResultView';
import { SGResultView } from './SGResultView';

// Utility functions - moved outside component scope
const formatTuition = (tuition: number) => {
  return `$${(tuition / 1000).toFixed(0)}k`;
};

const getSchoolSizeText = (size: string | null | undefined) => {
  if (!size) return '未知';
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

interface School {
  id: string;
  name: string;
  country: string;
  rank: number;
  tuition: number;
  intlRate: number;
  type: string;
  schoolSize?: string | null;
  strengths: string[];
  tags: string[];
  has_internship_program: boolean;
  has_research_program?: boolean;
  gptSummary?: string;
  logoUrl?: string | null;
  acceptanceRate?: number | null;
  satRange?: string | null;
  actRange?: string | null;
  gpaRange?: string | null;
  applicationDeadline?: string;
  website: string;
  // AU专用字段
  explanation?: string[] | null;
  matchScore?: number | null;
}

interface EvaluationResult {
  id: string;
  user_id: string;
  targetCountry?: string;  // 新增：用于区分国家
  studentProfile?: {
    type: string;
    description: string;
  };
  recommendedSchools: School[];
  edSuggestion?: School | null;
  eaSuggestions?: School[];
  rdSuggestions?: School[];
  strategy?: string | { plan: string; count: number };
  gptSummary?: string;
  // AU专用字段
  fallbackInfo?: {
    applied: boolean;
    steps: string[];
  };
  applicationGuidance?: {
    title: string;
    steps: string[];
    keyPoints: string[];
  };
  keyInfoSummary?: {
    budgetRange: string;
    englishRequirement: string;
    intakeTiming: string;
    pswInfo: string;
  };
  created_at: string;
}

const ParentEvalResultInner = () => {
  const searchParams = useSearchParams();
  const evalId = searchParams.get('id');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = useCallback(async () => {
    try {
      const data = await evaluationAPI.getParentEvaluation(evalId!);
      setResult(data);
    } catch (error) {
      console.error('获取评估结果失败:', error);
      setError('获取评估结果失败');
    } finally {
      setLoading(false);
    }
  }, [evalId]);

  useEffect(() => {
    if (evalId) {
      fetchResult();
    }
  }, [evalId, fetchResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    // 友好展示：即便获取失败，也给出正常页面骨架与提示
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">个性化择校报告</h1>
            <p className="text-gray-600">暂时未能获取评估结果，请稍后重试或更换条件</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-700 mb-6">{error || '未找到评估结果'}</p>
            <div className="space-x-3">
              <button onClick={() => window.location.href = '/parent-eval/start'} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">重新评估</button>
              <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">返回首页</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果是澳洲，使用专用视图
  if (result.targetCountry === 'Australia') {
    // 类型转换，确保字段匹配
    const auResult = {
      ...result,
      recommendedSchools: result.recommendedSchools.map(school => ({
        ...school,
        explanation: school.explanation || [],
        matchScore: school.matchScore || 0,
      })),
    };
    return <AUResultView result={auResult as unknown as Parameters<typeof AUResultView>[0]['result']} />;
  }

  // 如果是英国，使用专用视图
  if (result.targetCountry === 'United Kingdom') {
    return <UKResultView result={result as unknown as Parameters<typeof UKResultView>[0]['result']} />;
  }

  // 如果是新加坡，使用专用视图
  if (result.targetCountry === 'Singapore') {
    return <SGResultView result={result as unknown as Parameters<typeof SGResultView>[0]['result']} />;
  }

  // 其他国家（USA）使用原有视图
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
                    {result.studentProfile?.type || ' '}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {result.studentProfile?.description || ' '}
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
                {typeof result.strategy === 'string' ? result.strategy : ''}
              </p>
            </div>

            {/* GPT总结 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                专业建议
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {result.gptSummary || ''}
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
            {result.eaSuggestions && result.eaSuggestions.length > 0 && (
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
            {result.rdSuggestions && result.rdSuggestions.length > 0 && (
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
          <Image src={school.logoUrl} alt={school.name} width={48} height={48} className="w-12 h-12 rounded" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>学费: {formatTuition(school.tuition)}/年</span>
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

const ParentEvalResult = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <ParentEvalResultInner />
    </Suspense>
  );
};

export default ParentEvalResult; 