'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brain, Star, MapPin, Users, Share2, Download } from 'lucide-react';
import { evaluationAPI } from '@/lib/api';

interface University {
  id: string;
  name: string;
  country: string;
  rank: number;
  matchReason: string;
}

interface PersonalityResult {
  id: string;
  type: string;
  title: string;
  description: string;
  characteristics: string[];
  recommendedSchools: University[];
  gptAnalysis: string;
}

const StudentTestResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testId = searchParams.get('id');
    if (testId) {
      loadTestResult(testId);
    } else {
      // 如果没有ID，说明是直接访问，显示错误
      setError('未找到测评结果');
      setLoading(false);
    }
  }, [searchParams]);

  const loadTestResult = async (testId: string) => {
    try {
      setLoading(true);
      const data = await evaluationAPI.getStudentTest(testId);
      setResult(data);
    } catch (error) {
      console.error('加载测评结果失败:', error);
      setError('加载测评结果失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在分析您的人格类型...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || '无法加载测评结果'}</p>
          <button
            onClick={() => router.push('/student-test/start')}
            className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700"
          >
            重新开始测评
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">你的测评结果</h1>
          </div>
          <p className="text-gray-600">基于你的回答，我们为你生成了个性化分析</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：人格分析 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 人格类型卡片 */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Brain className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">人格类型</h2>
              </div>
              <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
              <p className="text-purple-100 leading-relaxed">{result.description}</p>
            </div>

            {/* 特征分析 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">你的特征</h3>
              <ul className="space-y-2">
                {result.characteristics.map((characteristic, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{characteristic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI分析 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">AI分析</h3>
              <p className="text-gray-700 leading-relaxed">{result.gptAnalysis}</p>
            </div>

            {/* 分享和下载 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">分享结果</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>分享到朋友圈</span>
                </button>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>保存结果</span>
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：推荐学校 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              为你推荐的学校
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
                      </div>
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      匹配度 95%
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{school.matchReason}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">想了解更多择校建议？</h3>
              <p className="text-purple-100 mb-4">我们为该人格类型设计了专属的选校策略</p>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-md font-medium hover:bg-gray-50">
                获取详细方案
              </button>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/student-test/start')}
            className="px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700"
          >
            重新测评
          </button>
          <button
            onClick={() => router.push('/universities')}
            className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700"
          >
            浏览更多学校
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTestResult; 