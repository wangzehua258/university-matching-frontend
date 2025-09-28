import Link from 'next/link';
import { GraduationCap, Users, ArrowRight, Search } from 'lucide-react';

export default function HomePage() {
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
            <div className="flex space-x-4">
              <Link
                href="/universities"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                开始探索
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              智能择校，<span className="text-blue-600">精准匹配</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              帮助中国家长高效决策留学路径的智能择校辅助平台，结合权威学校数据、性格测评、家庭需求分析与AI推荐，提供系统化建议。
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="/parent-eval/start"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                开始家长评估
              </Link>
              <Link
                href="/universities"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                浏览大学库
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              两大核心功能
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              全方位满足您的留学规划需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 功能1：大学浏览 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                大学浏览
              </h3>
              <p className="text-gray-600 mb-4">
                浏览全球顶尖大学，了解学校特色、专业设置和录取要求。
              </p>
              <Link
                href="/universities"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                立即浏览
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* 功能3：家长评估 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                家长版评估
              </h3>
              <p className="text-gray-600 mb-4">
                生成系统化、个性化的择校建议，包含推荐学校和申请策略。
              </p>
              <Link
                href="/parent-eval/start"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                开始评估
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* 功能4：学生测评 - 暂时隐藏，后续开发 */}
            {/* <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                学生人格测评
              </h3>
              <p className="text-gray-600 mb-4">
                轻趣味但有指导意义的人格类型测评，帮助学生探索方向。
              </p>
              <Link
                href="/student-test/start"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                开始测评
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            开始您的留学规划之旅
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            让AI助手为您提供个性化的选校建议
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/parent-eval/start"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              立即开始
            </Link>
            <Link
              href="/universities"
              className="border border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              浏览大学
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">
              全球大学智能匹配与申请规划系统
            </h3>
            <p className="text-gray-400">
              帮助中国家长高效决策留学路径的智能择校辅助平台
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
