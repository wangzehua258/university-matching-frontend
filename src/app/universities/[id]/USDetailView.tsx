'use client';

import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  Users,
  Target,
  BookOpen,
  Building2,
  Lightbulb
} from 'lucide-react';

interface USUniversity {
  _id?: string;
  id: string;
  name: string;
  country: string;
  state: string;
  rank: number;
  tuition: number;
  intl_rate: number;
  type: string;
  strengths: string[];
  gpt_summary: string;
  supports_ed?: boolean;
  supports_ea?: boolean;
  supports_rd?: boolean;
  acceptance_rate?: number | null;
  sat_range?: string | null;
  act_range?: string | null;
  gpa_range?: string | null;
  application_deadline?: string | null;
  website?: string | null;
  has_internship_program?: boolean;
  has_research_program?: boolean;
  internship_support_score?: number | null;
  tags?: string[];
  school_size?: string | null;
}

interface USDetailViewProps {
  university: USUniversity;
  onBack: () => void;
}

export default function USDetailView({ university, onBack }: USDetailViewProps) {
  // 计算总费用估算（学费 + 生活费）
  // 计算逻辑说明：
  // 1. 生活费：根据地区和学校类型，通常每年约15,000-25,000美元
  //    - 大城市（如纽约、洛杉矶、波士顿）：约20,000-25,000美元/年
  //    - 中等城市：约15,000-20,000美元/年
  //    - 这里使用18,000美元作为平均值
  // 2. 学费：tuition（每年学费）× 4年（美国本科通常4年）
  // 3. 总费用 = 学费 + 生活费
  const estimateTotalCost = () => {
    const annualLivingCost = 18000; // 约1.8万美元/年生活费（估算值）
    const studyYears = 4; // 美国本科通常4年
    
    const totalTuition = university.tuition * studyYears;
    const totalLiving = annualLivingCost * studyYears;
    const totalCost = totalTuition + totalLiving;
    
    // 人民币换算（假设汇率1美元=7.2人民币）
    const exchangeRate = 7.2;
    
    return {
      tuition: totalTuition,
      living: totalLiving,
      total: totalCost,
      totalRMB: totalCost * exchangeRate,
      annualLiving: annualLivingCost
    };
  };

  const costs = estimateTotalCost();

  // 解析申请轮次
  const getApplicationRounds = () => {
    const rounds: Array<{name: string, deadline: string, binding: boolean, description: string}> = [];
    
    if (university.supports_ed) {
      rounds.push({
        name: 'ED (Early Decision)',
        deadline: '11月1日左右',
        binding: true,
        description: '具有约束力的早申，录取后必须入学'
      });
    }
    
    if (university.supports_ea) {
      rounds.push({
        name: 'EA (Early Action)',
        deadline: '11月1日左右',
        binding: false,
        description: '非约束性早申，录取后可选择是否入学'
      });
    }
    
    if (university.supports_rd !== false) { // 默认支持RD
      rounds.push({
        name: 'RD (Regular Decision)',
        deadline: university.application_deadline || '1月1日左右',
        binding: false,
        description: '常规申请，最常见的申请方式'
      });
    }
    
    return rounds;
  };

  const applicationRounds = getApplicationRounds();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <button 
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回大学列表
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{university.name}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{university.name}</h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{university.state}, 美国</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {university.type === 'private' ? '私立大学' : '公立大学'}
                    </div>
                    {university.school_size && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {university.school_size}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center bg-yellow-50 rounded-lg px-4 py-3 border border-yellow-200">
                  <Star className="h-5 w-5 text-yellow-500 fill-current mb-1" />
                  <span className="text-xl font-bold text-gray-900">#{university.rank}</span>
                  <span className="text-xs text-gray-600 mt-1">排名</span>
                </div>
              </div>

              {/* 核心数据 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">${university.tuition.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">年学费</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{(university.intl_rate * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">国际生比例</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">
                    {university.acceptance_rate ? (university.acceptance_rate * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">录取率</div>
                </div>
              </div>
            </div>

            {/* 留学费用明细 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                留学费用明细（4年本科）
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">学费（4年）</span>
                  <span className="font-semibold text-gray-900">${costs.tuition.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">生活费（4年，估算）</span>
                  <span className="font-semibold text-gray-900">${costs.living.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                  <span className="font-semibold text-gray-900">总费用估算</span>
                  <span className="text-2xl font-bold text-blue-600">${costs.total.toLocaleString()}</span>
                </div>
                <div className="text-center py-2 text-sm text-gray-600">
                  约人民币 <span className="font-semibold text-gray-900">{costs.totalRMB.toLocaleString()}</span> 元
                  <span className="text-xs text-gray-500 ml-2">（汇率：1美元≈7.2人民币）</span>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-xs text-gray-700">
                      <p className="font-medium mb-1">费用说明：</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>学费：实际费用可能因专业而异，商科、工程、医学等专业通常更高</li>
                        <li>生活费：包括住宿、餐饮、交通、保险等，大城市（如纽约、波士顿）可能更高</li>
                        <li>其他费用：可能包括书籍（约$1,000-2,000/年）、个人开支等</li>
                        <li>建议预留10-15%的额外预算</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 申请轮次说明 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                申请轮次与截止日期
              </h3>
              
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">美国大学申请系统说明</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>ED (Early Decision)：</strong>具有约束力的早申，一旦录取必须入学。适合目标明确的学生。</p>
                      <p><strong>EA (Early Action)：</strong>非约束性早申，录取后可选择是否入学，不影响申请其他学校。</p>
                      <p><strong>RD (Regular Decision)：</strong>常规申请，最常见的申请方式，截止日期通常在1月1日。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {applicationRounds.map((round, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{round.name}</h4>
                        <p className="text-sm text-gray-600">{round.description}</p>
                      </div>
                      {round.binding && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          约束性
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-700">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>截止日期：<span className="font-medium">{round.deadline}</span></span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-xs text-gray-700">
                    <p className="font-medium mb-1">申请建议：</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>ED通常适合非常想去的学校，但只能申请一所</li>
                      <li>EA可以同时申请多所，不影响其他申请</li>
                      <li>建议在10-12月完成标准化考试（SAT/ACT）</li>
                      <li>所有申请材料需在截止日期前提交，建议提前准备</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 申请要求 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                申请要求
              </h3>
              
              <div className="space-y-4">
                {university.acceptance_rate && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">录取率</span>
                      <span className="text-lg font-bold text-gray-900">{(university.acceptance_rate * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">录取率较低表示竞争激烈，需要更优秀的申请材料</p>
                  </div>
                )}

                {university.sat_range && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-700 font-medium">SAT分数范围</span>
                      <span className="font-semibold text-gray-900">{university.sat_range}</span>
                    </div>
                    <p className="text-xs text-gray-500">大部分被录取学生的SAT分数在此范围内</p>
                  </div>
                )}

                {university.act_range && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-700 font-medium">ACT分数范围</span>
                      <span className="font-semibold text-gray-900">{university.act_range}</span>
                    </div>
                    <p className="text-xs text-gray-500">大部分被录取学生的ACT分数在此范围内</p>
                  </div>
                )}

                {university.gpa_range && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-700 font-medium">GPA要求</span>
                      <span className="font-semibold text-gray-900">{university.gpa_range}</span>
                    </div>
                    <p className="text-xs text-gray-500">通常指未加权GPA，部分学校也考虑加权GPA</p>
                  </div>
                )}

                {!university.acceptance_rate && !university.sat_range && !university.act_range && !university.gpa_range && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>申请要求信息暂未更新</p>
                    <p className="text-xs mt-1">包括SAT/ACT分数范围、GPA要求等</p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">申请材料清单：</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>高中成绩单（GPA）</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>标准化考试成绩（SAT/ACT）</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>英语能力证明（TOEFL/IELTS）</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>个人陈述（Personal Statement）</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>推荐信（通常2-3封）</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>活动列表/简历</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>申请费（通常$50-100）</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>部分专业需作品集/额外材料</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 优势专业 */}
            {university.strengths && university.strengths.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  优势专业
                </h3>
                <div className="flex flex-wrap gap-2">
                  {university.strengths.map((strength, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-md border border-blue-200"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 学校介绍 */}
            {university.gpt_summary && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  学校介绍
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{university.gpt_summary}</p>
              </div>
            )}

            {/* 实习与研究机会 */}
            {(university.has_internship_program || university.has_research_program || university.internship_support_score) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  实习与研究机会
                </h3>
                <div className="space-y-3">
                  {university.has_internship_program && (
                    <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">提供实习项目</p>
                        <p className="text-sm text-gray-600">学校提供丰富的实习机会，帮助学生积累实践经验</p>
                      </div>
                    </div>
                  )}
                  
                  {university.has_research_program && (
                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">提供研究项目</p>
                        <p className="text-sm text-gray-600">本科生有机会参与教授的研究项目，提升学术能力</p>
                      </div>
                    </div>
                  )}
                  
                  {university.internship_support_score !== null && university.internship_support_score !== undefined && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">实习支持程度</span>
                        <span className="font-semibold text-gray-900">{university.internship_support_score.toFixed(1)}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(university.internship_support_score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：补充信息 */}
          <div className="space-y-6">
            {/* 关键信息摘要 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">关键信息</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">学制</div>
                  <div className="font-semibold text-gray-900">4年制本科</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">学校类型</div>
                  <div className="font-semibold text-gray-900">{university.type === 'private' ? '私立大学' : '公立大学'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">国际生比例</div>
                  <div className="font-semibold text-gray-900">{(university.intl_rate * 100).toFixed(1)}%</div>
                </div>
                {university.school_size && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">学校规模</div>
                    <div className="font-semibold text-gray-900">{university.school_size}</div>
                  </div>
                )}
              </div>
            </div>

            {/* 申请时间规划 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">申请时间规划建议</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-gray-900">高二下学期 - 高三上学期</p>
                    <p className="text-gray-600">准备标准化考试（SAT/ACT），参加托福/雅思考试</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-gray-900">高三上学期（10-11月）</p>
                    <p className="text-gray-600">完成ED/EA申请，准备推荐信、个人陈述等材料</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-gray-900">高三上学期末（12月-1月）</p>
                    <p className="text-gray-600">提交RD申请，所有材料需在截止日期前完成</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <p className="font-medium text-gray-900">高三下学期（3-5月）</p>
                    <p className="text-gray-600">收到录取通知，选择学校，提交入学意向</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 学校标签 */}
            {university.tags && university.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">学校特色</h3>
                <div className="flex flex-wrap gap-2">
                  {university.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 官网链接 */}
            {university.website && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">官方网站</h3>
                <a 
                  href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  <span className="text-sm break-all">访问学校官网</span>
                </a>
              </div>
            )}

            {/* 重要提示 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2 text-yellow-600" />
                重要提示
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>美国大学申请竞争激烈，建议提前1-2年开始准备</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>标准化考试成绩（SAT/ACT）通常需要多次考试才能达到理想分数</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>个人陈述和推荐信对申请结果影响很大，需要精心准备</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>不同专业的申请要求可能不同，建议查看学校官网具体信息</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>费用仅供参考，实际费用可能因专业、住宿选择等有所不同</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>建议咨询专业的留学顾问或学校招生办公室获取最新信息</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
