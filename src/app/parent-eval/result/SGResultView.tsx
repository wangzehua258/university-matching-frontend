'use client';

import React from 'react';
import { MapPin, DollarSign, GraduationCap, Clock, FileText, AlertCircle, Award, Building2 } from 'lucide-react';

interface SGSchool {
  id: string;
  name: string;
  country: string;
  rank: number;
  tuition: number;
  intlRate: number;
  type: string;
  strengths: string[];
  tags: string[];
  has_internship_program: boolean;
  website: string;
  explanation: string[];
  matchScore: number;
}

interface SGResultData {
  id: string;
  user_id: string;
  targetCountry: string;
  recommendedSchools: SGSchool[];
  fallbackInfo?: {
    applied: boolean;
    steps: string[];
  };
  applicationGuidance: {
    title: string;
    steps: string[];
    keyPoints: string[];
  };
  keyInfoSummary: {
    budgetRange: string;
    tgInfo: string;
    applicationTiming: string;
    visaInfo: string;
  };
  created_at: string;
}

export function SGResultView({ result }: { result: SGResultData }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">新加坡大学推荐报告</h1>
          <p className="text-gray-600">基于您的评估结果生成的专属推荐</p>
        </div>

        {/* 回退信息提示（如果有） */}
        {result.fallbackInfo?.applied && result.fallbackInfo.steps.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">为保证结果不为空，已执行以下放宽：</h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  {result.fallbackInfo.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 关键信息汇总 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-600" />
            关键信息汇总
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">预算范围</p>
                <p className="text-sm text-gray-600">{result.keyInfoSummary.budgetRange}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Award className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Tuition Grant (TG)</p>
                <p className="text-sm text-gray-600">{result.keyInfoSummary.tgInfo}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">申请时间</p>
                <p className="text-sm text-gray-600">{result.keyInfoSummary.applicationTiming}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900">签证信息</p>
                <p className="text-sm text-gray-600">{result.keyInfoSummary.visaInfo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 推荐学校列表 */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">推荐学校 ({result.recommendedSchools.length} 所)</h2>
          {result.recommendedSchools.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4">暂无推荐学校，请调整筛选条件后重新评估</p>
              <button
                onClick={() => window.location.href = '/parent-eval/start'}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                重新评估
              </button>
            </div>
          ) : (
            result.recommendedSchools.map((school, index) => (
              <SGSchoolCard key={school.id} school={school} rank={index + 1} />
            ))
          )}
        </div>

        {/* 申请流程指导 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
            {result.applicationGuidance.title}
          </h2>
          <div className="space-y-3">
            {result.applicationGuidance.steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">重要提示：</h3>
            <ul className="space-y-2">
              {result.applicationGuidance.keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/parent-eval/start'}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-4"
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
}

function SGSchoolCard({ school, rank }: { school: SGSchool; rank: number }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 学校头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              推荐 #{rank}
            </span>
            {school.matchScore > 0 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                匹配度: {school.matchScore.toFixed(1)}/100
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{school.name}</h3>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {school.country}
            </span>
            <span>全球排名 #{school.rank}</span>
            <span className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              S${school.tuition.toLocaleString()}/年
            </span>
          </div>
        </div>
      </div>

      {/* 详细解释 */}
      {school.explanation && school.explanation.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">为什么推荐这所学校：</h4>
          <div className="space-y-2">
            {school.explanation.map((line, idx) => (
              <p key={idx} className="text-sm text-gray-700 leading-relaxed">{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* 优势专业 */}
      {school.strengths && school.strengths.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">优势专业：</p>
          <div className="flex flex-wrap gap-2">
            {school.strengths.slice(0, 6).map((strength, idx) => (
              <span
                key={idx}
                className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 标签 */}
      {school.tags && school.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {school.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 网站链接 */}
      {school.website && (
        <div className="pt-4 border-t border-gray-200">
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 text-sm hover:underline flex items-center"
          >
            访问学校官网 →
          </a>
        </div>
      )}
    </div>
  );
}

