import Link from 'next/link';
import { GraduationCap, Users, ArrowRight, Search, Globe, Award, Building2, MapPin, Star, CheckCircle, Zap, Shield, BookOpen, TrendingUp, Clock, Target } from 'lucide-react';

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
                href="/universities/select"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                开始探索
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-4">
              智能择校，<span className="text-blue-600">精准匹配</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              帮助中国家长高效决策留学路径的智能择校辅助平台，结合权威学校数据、性格测评、家庭需求分析与AI推荐，提供系统化建议。
            </p>
            
            {/* 国家标签 */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center space-x-2">
                <span className="text-lg">🇺🇸</span>
                <span className="text-sm font-medium text-gray-700">美国</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center space-x-2">
                <span className="text-lg">🇦🇺</span>
                <span className="text-sm font-medium text-gray-700">澳洲</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center space-x-2">
                <span className="text-lg">🇬🇧</span>
                <span className="text-sm font-medium text-gray-700">英国</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center space-x-2">
                <span className="text-lg">🇸🇬</span>
                <span className="text-sm font-medium text-gray-700">新加坡</span>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/parent-eval/select"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                开始家长评估
              </Link>
              <Link
                href="/universities/select"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                浏览大学库
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1 text-white">4</div>
              <div className="text-sm font-medium text-gray-200">国家支持</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-white">100+</div>
              <div className="text-sm font-medium text-gray-200">顶尖大学</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-white">AI</div>
              <div className="text-sm font-medium text-gray-200">智能推荐</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-white">免费</div>
              <div className="text-sm font-medium text-gray-200">全程免费</div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Introduction Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              覆盖四大热门留学国家
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              每个国家都有独特的申请体系和教育特色，我们为您提供针对性的指导和匹配
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 美国 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🇺🇸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">美国</h3>
              <p className="text-gray-600 text-sm mb-4">ED/EA/RD灵活申请，顶尖名校云集</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>多元化的申请策略</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>世界排名前列名校</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>灵活的课程体系</span>
                </li>
              </ul>
              <Link
                href="/universities?country=USA"
                className="mt-4 inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
              >
                查看美国大学 <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>

            {/* 澳洲 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🇦🇺</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">澳洲</h3>
              <p className="text-gray-600 text-sm mb-4">Go8名校联盟，工签政策友好</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Go8名校联盟</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>2-4年毕业工签</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>WIL实习机会</span>
                </li>
              </ul>
              <Link
                href="/universities?country=Australia"
                className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
              >
                查看澳洲大学 <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>

            {/* 英国 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🇬🇧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">英国</h3>
              <p className="text-gray-600 text-sm mb-4">UCAS统一申请，Russell Group名校</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Russell Group名校</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>UCAS统一申请</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Foundation预科支持</span>
                </li>
              </ul>
              <Link
                href="/universities?country=United Kingdom"
                className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                查看英国大学 <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>

            {/* 新加坡 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🇸🇬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">新加坡</h3>
              <p className="text-gray-600 text-sm mb-4">亚洲顶尖教育，Tuition Grant资助</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>NUS/NTU世界名校</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tuition Grant资助</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>双语环境优势</span>
                </li>
              </ul>
              <Link
                href="/universities?country=Singapore"
                className="mt-4 inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                查看新加坡大学 <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              为什么选择我们
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              专业、智能、便捷的留学规划助手
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">快速智能匹配</h3>
              <p className="text-gray-600">
                AI算法快速分析学生背景和家庭需求，精准推荐最适合的大学
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">权威数据支持</h3>
              <p className="text-gray-600">
                100+所顶尖大学的详细数据，包括排名、学费、申请要求等完整信息
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">详细申请指导</h3>
              <p className="text-gray-600">
                每个国家都有专门的申请指南，帮助家长了解完整的申请流程和要求
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">个性化推荐</h3>
              <p className="text-gray-600">
                根据学生学术水平、兴趣爱好、家庭预算等综合因素提供个性化建议
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">申请时间规划</h3>
              <p className="text-gray-600">
                清晰的申请时间线，帮助家长合理安排申请准备和时间节点
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">精准目标定位</h3>
              <p className="text-gray-600">
                科学的评估体系，帮助学生确定合适的申请目标和冲刺策略
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              如何使用
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              简单三步，获得专业的留学规划建议
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">填写评估问卷</h3>
              <p className="text-gray-600">
                根据实际情况填写学生信息、学术背景、兴趣方向和家庭需求
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI智能分析</h3>
              <p className="text-gray-600">
                系统自动分析您的需求，匹配最适合的大学和申请策略
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">获取推荐报告</h3>
              <p className="text-gray-600">
                查看详细的推荐学校列表、申请指导和建议，开始您的留学规划
              </p>
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                大学浏览
              </h3>
              <p className="text-gray-600 mb-4">
                浏览全球顶尖大学，了解学校特色、专业设置和录取要求。
              </p>
              
              {/* 四个国家展示 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link
                  href="/universities?country=USA"
                  className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <Globe className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">🇺🇸 美国</span>
                </Link>
                <Link
                  href="/universities?country=Australia"
                  className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <MapPin className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">🇦🇺 澳洲</span>
                </Link>
                <Link
                  href="/universities?country=United Kingdom"
                  className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <Building2 className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">🇬🇧 英国</span>
                </Link>
                <Link
                  href="/universities?country=Singapore"
                  className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <Star className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">🇸🇬 新加坡</span>
                </Link>
              </div>
              
              <Link
                href="/universities/select"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                立即浏览
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* 功能3：家长评估 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                家长版评估
              </h3>
              <p className="text-gray-600 mb-4">
                生成系统化、个性化的择校建议，包含推荐学校和申请策略。
              </p>
              
              {/* 评估特色 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 flex items-center">
                  <Award className="h-3 w-3 mr-1 text-green-600" />
                  个性化推荐
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 flex items-center">
                  <Star className="h-3 w-3 mr-1 text-green-600" />
                  智能匹配
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 flex items-center">
                  <Globe className="h-3 w-3 mr-1 text-green-600" />
                  四国支持
                </span>
              </div>
              
              <Link
                href="/parent-eval/select"
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
          <p className="text-xl text-gray-100 mb-8">
            让AI助手为您提供个性化的选校建议
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/parent-eval/select"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              立即开始
            </Link>
            <Link
              href="/universities/select"
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
