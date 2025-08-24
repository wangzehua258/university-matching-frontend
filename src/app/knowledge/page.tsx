'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, GraduationCap, Users, Brain, ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  tags: string[];
}

const KnowledgePage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', icon: BookOpen },
    { id: 'application', name: '申请类型', icon: GraduationCap },
    { id: 'country', name: '国家对比', icon: Users },
    { id: 'strategy', name: '选校策略', icon: Brain },
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'EA/ED/RD申请类型详解',
      description: '详细解读美国本科申请的三种主要申请类型，包括申请时间、录取概率、绑定政策等关键信息。',
      category: 'application',
      readTime: '8分钟',
      tags: ['美国申请', '申请策略', '时间规划']
    },
    {
      id: '2',
      title: '美英加本科申请对比',
      description: '从申请流程、录取标准、学制特点等多个维度对比美国、英国、加拿大本科申请的区别。',
      category: 'country',
      readTime: '12分钟',
      tags: ['国家对比', '申请流程', '录取标准']
    },
    {
      id: '3',
      title: '如何选择适合自己的大学',
      description: '从学术实力、地理位置、校园文化、就业前景等角度分析如何做出明智的择校决策。',
      category: 'strategy',
      readTime: '10分钟',
      tags: ['择校策略', '决策方法', '个人匹配']
    },
    {
      id: '4',
      title: '只看排名好吗？',
      description: '深入分析大学排名的局限性，教你如何理性看待排名，结合个人需求做出选择。',
      category: 'strategy',
      readTime: '6分钟',
      tags: ['排名解读', '理性择校', '个人需求']
    },
    {
      id: '5',
      title: '夏校值不值得上？',
      description: '分析参加夏校的利弊，包括学术提升、申请加分、成本效益等方面的考虑。',
      category: 'application',
      readTime: '7分钟',
      tags: ['夏校', '背景提升', '申请加分']
    },
    {
      id: '6',
      title: '国际学生申请注意事项',
      description: '针对中国学生的申请指南，包括语言要求、材料准备、签证申请等关键环节。',
      category: 'application',
      readTime: '15分钟',
      tags: ['国际学生', '申请材料', '签证申请']
    }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">选校策略知识库</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            提供理性专业的选校基础知识，帮助您做出明智的留学决策。所有内容免费开放，无需注册即可阅读。
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {article.readTime}
                  </span>
                  <span className="text-xs text-gray-500">
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                  <span>阅读全文</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">不知道是否适合你？</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            知识库只是开始，每个人的情况都不同。让我们的AI助手为你生成个性化的评估报告，提供更精准的择校建议。
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => router.push('/parent-eval/start')}
              className="bg-white text-orange-600 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>开始家长评估</span>
            </button>
            {/* 学生测评按钮 - 暂时隐藏，后续开发 */}
            {/* <button
              onClick={() => router.push('/student-test/start')}
              className="bg-white text-orange-600 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>开始学生测评</span>
            </button> */}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">常见问题</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Q: 如何判断一所大学是否适合我？</h3>
              <p className="text-gray-600 text-sm">
                建议从学术实力、地理位置、校园文化、就业前景、费用等多个维度综合考虑，并结合个人兴趣和职业规划。
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Q: 申请时间应该如何规划？</h3>
              <p className="text-gray-600 text-sm">
                建议提前1-2年开始准备，包括语言考试、活动规划、材料准备等。不同申请类型有不同的截止时间。
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Q: 国际学生申请有什么特殊要求？</h3>
              <p className="text-gray-600 text-sm">
                通常需要语言成绩、推荐信、个人陈述等材料，部分学校还要求SAT/ACT成绩。签证申请也是重要环节。
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Q: 如何提高申请成功率？</h3>
              <p className="text-gray-600 text-sm">
                除了学术成绩，还要注重课外活动、领导力、志愿服务等软实力，同时要展现真实的个人特色。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            更多问题？欢迎联系我们的专业顾问团队
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              在线咨询
            </button>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              预约电话
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage; 