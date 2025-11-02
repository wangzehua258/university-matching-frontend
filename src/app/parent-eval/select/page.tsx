'use client';

import Link from 'next/link';
import { ArrowRight, GraduationCap, Globe, Building2, MapPin, Star, Users } from 'lucide-react';

const countries = [
  { key: 'Australia', label: '澳大利亚', icon: MapPin, color: 'green', flag: '🇦🇺', desc: 'Go8名校联盟，工签政策友好' },
  { key: 'United Kingdom', label: '英国', icon: Building2, color: 'purple', flag: '🇬🇧', desc: 'UCAS统一申请，Russell Group名校' },
  { key: 'Singapore', label: '新加坡', icon: Star, color: 'orange', flag: '🇸🇬', desc: '亚洲顶尖教育，Tuition Grant资助' },
  { key: 'USA', label: '美国', icon: Globe, color: 'red', flag: '🇺🇸', desc: 'ED/EA/RD灵活申请，顶尖名校云集' },
];

export default function ParentEvalSelectCountry() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                全球大学智能匹配系统
              </h1>
            </div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            家长版评估
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            选择目标国家，开始个性化的择校评估。我们将根据您的需求推荐最适合的大学。
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {countries.map((c) => {
            const IconComponent = c.icon;
            const getColorClasses = (color: string) => {
              switch (color) {
                case 'green':
                  return {
                    bg: 'from-green-50 to-emerald-50 border-green-200 hover:border-green-400',
                    icon: 'text-green-600'
                  };
                case 'purple':
                  return {
                    bg: 'from-purple-50 to-violet-50 border-purple-200 hover:border-purple-400',
                    icon: 'text-purple-600'
                  };
                case 'orange':
                  return {
                    bg: 'from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400',
                    icon: 'text-orange-600'
                  };
                case 'red':
                  return {
                    bg: 'from-red-50 to-pink-50 border-red-200 hover:border-red-400',
                    icon: 'text-red-600'
                  };
                default:
                  return {
                    bg: 'from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400',
                    icon: 'text-blue-600'
                  };
              }
            };
            
            const colors = getColorClasses(c.color);
            
            return (
              <Link
                key={c.key}
                href={`/parent-eval/start?country=${encodeURIComponent(c.key)}`}
                className={`group block bg-gradient-to-br ${colors.bg} border-2 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{c.flag}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{c.label}</h3>
                      <p className="text-sm text-gray-600">{c.desc}</p>
                    </div>
                  </div>
                  <IconComponent className={`h-6 w-6 ${colors.icon} group-hover:scale-110 transition-transform`} />
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">开始评估</span>
                  <ArrowRight className="h-5 w-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">评估说明</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>每个国家的评估问题会根据该国家的教育体系特点定制</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>评估完成后，系统将为您生成个性化的大学推荐报告</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>所有数据仅用于评估，我们严格保护您的隐私</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


