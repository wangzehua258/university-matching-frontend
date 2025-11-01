'use client';

import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar,
  BookOpen,
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
  Plane,
  Building
} from 'lucide-react';

interface SGUniversity {
  _id?: string;
  id: string;
  name: string;
  country: string;
  city: string;
  rank: number;
  tuition_local: number;
  currency: string;
  tuition_usd: number;
  study_length_years: number;
  tuition_grant_available: boolean;
  tuition_grant_bond_years?: number | null;
  interview_required: boolean;
  essay_or_portfolio_required: boolean;
  coop_or_internship_required: boolean;
  industry_links_score: number;
  exchange_opportunities_score?: number | null;
  strengths: string[];
  tags: string[];
  intlRate: number;
  website: string;
  scholarship_available: boolean;
}

interface SGDetailViewProps {
  university: SGUniversity;
  onBack: () => void;
}

export default function SGDetailView({ university, onBack }: SGDetailViewProps) {
  // 格式化学费显示
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'SGD') return `S$${amount.toLocaleString('en-SG')}`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  // 计算总费用估算（学费 + 生活费）
  // 计算逻辑说明：
  // 1. 生活费：固定每年18,000 SGD（包括住宿、饮食、交通等基础开支）
  // 2. 无TG学费：tuition_local（每年学费） × study_length_years（学制年数）
  // 3. 有TG学费：无TG学费 × (1 - 减免比例)
  //    - TG通常减免50-60%，这里使用55%作为平均值
  //    - 注意：实际减免比例可能因专业而异，建议咨询学校确认
  // 4. 总费用 = 学费 + 生活费
  const estimateTotalCost = () => {
    const annualLivingCost = 18000; // 约1.8万新币/年生活费（估算值）
    
    // 无TG的学费：每年学费 × 学制年数
    const totalTuitionWithoutTG = university.tuition_local * university.study_length_years;
    
    // 有TG的学费：减免约50-60%，使用55%作为估算值
    // 注意：实际TG减免比例可能因专业和学校政策而异
    const tgDiscountRate = 0.55; // TG减免55%（50-60%的平均值）
    const tuitionWithTG = totalTuitionWithoutTG * (1 - tgDiscountRate);
    
    // 总生活费：年生活费 × 学制年数
    const totalLiving = annualLivingCost * university.study_length_years;
    
    return {
      tuitionWithoutTG: totalTuitionWithoutTG,
      tuitionWithTG: tuitionWithTG,
      living: totalLiving,
      totalWithoutTG: totalTuitionWithoutTG + totalLiving,
      totalWithTG: tuitionWithTG + totalLiving,
      savings: totalTuitionWithoutTG - tuitionWithTG
    };
  };

  const costs = estimateTotalCost();

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
            {/* 学校基本信息 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{university.name}</h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-lg">{university.city}, {university.country}</span>
                  </div>
                  {university.tuition_grant_available && (
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mt-2">
                      <Award className="h-4 w-4 mr-1" />
                      提供学费资助（Tuition Grant）
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-3 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <div>
                    <div className="text-xs text-yellow-700">世界排名</div>
                    <div className="text-2xl font-bold text-yellow-800">#{Math.round(university.rank)}</div>
                  </div>
                </div>
              </div>

              {/* 核心数据卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-5 bg-blue-50 rounded-lg border border-blue-100">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-900">
                    {formatCurrency(university.tuition_local, university.currency)}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">每年学费（无TG）</div>
                </div>
                <div className="text-center p-5 bg-green-50 rounded-lg border border-green-100">
                  <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-green-900">
                    {university.study_length_years} 年
                  </div>
                  <div className="text-sm text-green-600 mt-1">学制</div>
                </div>
                <div className="text-center p-5 bg-purple-50 rounded-lg border border-purple-100">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-purple-900">
                    {(university.intlRate * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-purple-600 mt-1">国际学生比例</div>
                </div>
              </div>
            </div>

            {/* 学费资助（TG）说明 - 新加坡特色 */}
            {university.tuition_grant_available && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 border-2 border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-green-600" />
                  学费资助（Tuition Grant）- 新加坡政府资助计划
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900 font-semibold text-lg">什么是Tuition Grant？</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        Tuition Grant（学费资助）是新加坡政府为国际学生提供的学费减免计划。选择接受TG的学生可以享受大幅度的学费减免（通常可减免约50-60%的学费），但毕业后需要在新加坡注册的公司工作一定年限。
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-900">学费减免</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        通常可减免约 <strong>50-60%</strong> 的学费，具体比例根据专业和学校而定。
                      </div>
                    </div>

                    {university.tuition_grant_bond_years && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center mb-2">
                          <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-blue-900">工作合约</span>
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          毕业后需在新加坡工作 <strong>{university.tuition_grant_bond_years}年</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <strong>重要提示：</strong>TG是可选项目，学生可以选择是否接受。如果不接受TG，需要支付全额学费。接受TG后，如果毕业后不想履行工作合约，需要退还已减免的学费。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 费用明细 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-green-600" />
                留学费用明细
              </h3>
              <div className="space-y-4">
                {/* 无TG费用 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">学费（{university.study_length_years}年，无TG）</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(costs.tuitionWithoutTG, university.currency)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    每年 {formatCurrency(university.tuition_local, university.currency)}
                  </div>
                </div>

                {/* 有TG费用 */}
                {university.tuition_grant_available && (
                  <>
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-900 font-bold">学费（{university.study_length_years}年，接受TG）</span>
                        <span className="text-xl font-bold text-green-900">
                          {formatCurrency(costs.tuitionWithTG, university.currency)}
                        </span>
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        节省 {formatCurrency(costs.savings, university.currency)} （按55%减免估算）
                        <span className="text-xs text-gray-500 block mt-1">
                          * 实际TG减免比例可能因专业而异（通常50-60%），建议咨询学校确认
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* 生活费 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">生活费（{university.study_length_years}年估算）</span>
                    <span className="text-lg font-bold text-gray-900">
                      S${costs.living.toLocaleString('en-SG')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    包括住宿、饮食、交通等，每年约 S$18,000
                  </div>
                </div>

                {/* 总费用对比 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                    <div className="text-xs text-gray-600 mb-1">总费用（无TG）</div>
                    <div className="text-2xl font-bold text-gray-900">
                      S${costs.totalWithoutTG.toLocaleString('en-SG')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      约人民币 {Math.round(costs.totalWithoutTG * 5.4).toLocaleString()} 元
                    </div>
                  </div>
                  {university.tuition_grant_available && (
                    <div className="bg-green-100 rounded-lg p-4 border-2 border-green-400">
                      <div className="text-xs text-green-700 mb-1">总费用（接受TG）</div>
                      <div className="text-2xl font-bold text-green-900">
                        S${costs.totalWithTG.toLocaleString('en-SG')}
                      </div>
                      <div className="text-xs text-green-700 mt-1">
                        约人民币 {Math.round(costs.totalWithTG * 5.4).toLocaleString()} 元
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>温馨提示：</strong>以上费用为估算值，实际费用可能因个人消费习惯、住宿选择、是否接受TG等因素有所差异。建议额外准备10-20%的应急资金。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 申请要求 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-red-600" />
                申请要求和材料
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">学术成绩要求</h4>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>• <strong>高考成绩：</strong>通常要求达到当地985/211分数线以上，或一本线+50分以上</div>
                      <div>• <strong>IB成绩：</strong>通常要求38-42分（HL 666或更高）</div>
                      <div>• <strong>A-Level成绩：</strong>通常要求AAA-A*AA</div>
                      <div>• <strong>SAT/ACT：</strong>部分学校接受SAT 1450+或ACT 32+</div>
                      <div>• <strong>国内大学成绩：</strong>如果已完成大一，通常要求GPA 3.5/4.0或85/100以上</div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">英语成绩要求</h4>
                  <div className="bg-blue-50 rounded-lg p-3 mb-2">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>• <strong>IELTS：</strong>通常要求总分6.5-7.0，单项不低于6.0</div>
                      <div>• <strong>TOEFL：</strong>通常要求90-100分（iBT）</div>
                      <div>• <strong>其他：</strong>部分学校也接受PTE Academic、Duolingo等</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>注意：</strong>新加坡国立大学和南洋理工大学对英语要求较高，建议尽早准备。
                  </div>
                </div>

                {/* 特殊要求 */}
                {(university.interview_required || university.essay_or_portfolio_required) && (
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">特殊申请要求</h4>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="space-y-2 text-sm text-gray-700">
                        {university.interview_required && (
                          <div className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span><strong>需要面试：</strong>部分专业或优秀申请人可能需要参加面试（通常为在线面试）</span>
                          </div>
                        )}
                        {university.essay_or_portfolio_required && (
                          <div className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span><strong>需要论文或作品集：</strong>艺术、设计、建筑等专业需要提交作品集；部分专业需要提交个人陈述或研究计划</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">需要准备的材料</h4>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>高中毕业证书和成绩单（中英文公证件）</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>英语成绩单（IELTS/TOEFL/PTE）</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>个人陈述（Personal Statement）</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>推荐信（1-2封，通常来自老师或学校）</span>
                      </div>
                      {university.essay_or_portfolio_required && (
                        <div className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>作品集或研究计划（如适用）</span>
                        </div>
                      )}
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>护照复印件</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>其他证明材料（获奖证书、竞赛证书等，如有）</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 学制说明 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-orange-600" />
                学制
              </h3>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-medium">本科学制</span>
                  <span className="text-xl font-bold text-orange-900">
                    {university.study_length_years} 年制
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  新加坡本科学制通常为4年（荣誉学位），部分专业如医学、法律可能需要5-6年。学制相比澳大利亚的3年制更长，但课程设置更为深入和系统化。
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>开学时间：</strong>通常在每年8月（主学期），部分专业可能有1月入学。
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>申请建议：</strong>建议提前12-18个月开始准备申请材料和英语考试。新加坡大学申请竞争激烈，建议尽早提交申请。
                </div>
              </div>
            </div>

            {/* 优势专业 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-6 w-6 mr-2 text-purple-600" />
                优势专业
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {university.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg text-center"
                  >
                    <span className="text-purple-900 font-medium">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 实习和行业联系 */}
            {(university.coop_or_internship_required || university.industry_links_score > 0) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-indigo-600" />
                  实习和行业联系
                </h3>
                <div className="space-y-4">
                  {university.coop_or_internship_required && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="font-semibold text-indigo-900">要求实习或合作教育</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-2">
                        学校要求学生完成实习或合作教育项目，提供将理论学习与实践工作相结合的学习机会。
                      </div>
                    </div>
                  )}
                  {university.industry_links_score > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-green-900">行业联系评分</span>
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-green-600 mr-1" />
                          <span className="text-xl font-bold text-green-900">
                            {university.industry_links_score}/10
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        反映学校与行业的合作关系和就业支持程度。评分越高，说明学校与企业的联系越紧密，学生更容易获得实习和就业机会。
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 交换机会 */}
            {university.exchange_opportunities_score && university.exchange_opportunities_score > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Plane className="h-6 w-6 mr-2 text-blue-600" />
                  国际交换机会
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-900">交换项目评分</span>
                    <div className="flex items-center">
                      <Plane className="h-5 w-5 text-blue-600 mr-1" />
                      <span className="text-xl font-bold text-blue-900">
                        {university.exchange_opportunities_score}/10
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mt-2">
                    反映学校提供的国际交换项目丰富程度。评分越高，说明学校与更多海外大学有交换协议，学生有更多机会体验不同国家的教育环境。
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：重要信息 */}
          <div className="space-y-6">
            {/* TG快速提醒（简化版，详细说明在左侧） */}
            {university.tuition_grant_available && (
              <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  学费资助提醒
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    ✅ 此学校提供<strong>Tuition Grant</strong>，可减免约<strong>50-60%</strong>学费
                  </p>
                  {university.tuition_grant_bond_years && (
                    <p>
                      📋 需在新加坡工作 <strong>{university.tuition_grant_bond_years}年</strong>
                    </p>
                  )}
                  <p>
                    💡 <strong>建议：</strong>如计划在新加坡工作，接受TG可大幅节省费用。详见左侧详细说明。
                  </p>
                </div>
              </div>
            )}

            {/* 奖学金信息 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                奖学金
              </h3>
              {university.scholarship_available ? (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">提供奖学金</span>
                  </div>
                  <div className="text-sm text-gray-700 mt-2">
                    <p>学校为优秀国际学生提供多种奖学金机会，包括：</p>
                    <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                      <li>学术优秀奖学金</li>
                      <li>国际学生奖学金</li>
                      <li>专业特定奖学金</li>
                      <li>政府奖学金（如SM奖学金）</li>
                    </ul>
                    <p className="mt-2">
                      <strong>申请建议：</strong>新加坡的奖学金竞争激烈，建议在提交入学申请时同时申请奖学金，通常需要优异的学术成绩和额外的申请材料。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">暂未提供奖学金</div>
                </div>
              )}
            </div>

            {/* 学校特色标签 */}
            {university.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-600" />
                  学校特色
                </h3>
                <div className="flex flex-wrap gap-2">
                  {university.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 申请时间线 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                申请时间线建议
              </h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold text-gray-900">提前18-24个月</div>
                  <div className="text-gray-600">开始准备英语考试，了解学校和专业</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold text-gray-900">提前12-18个月</div>
                  <div className="text-gray-600">完成英语考试，准备申请材料</div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-gray-900">提前6-12个月</div>
                  <div className="text-gray-600">提交申请（通常在10月-次年2月）</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="font-semibold text-gray-900">收到录取后</div>
                  <div className="text-gray-600">申请学生签证，准备行前事宜</div>
                </div>
              </div>
            </div>

            {/* 官方网站 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                官方网站
              </h3>
              {university.website ? (
                <a 
                  href={university.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline break-all flex items-center"
                >
                  <span className="truncate">{university.website}</span>
                  <Globe className="h-4 w-4 ml-2 flex-shrink-0" />
                </a>
              ) : (
                <div className="text-sm text-gray-500">官方网站链接暂未提供</div>
              )}
            </div>

            {/* 重要提示 */}
            <div className="bg-blue-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                重要提示
              </h3>
              <div className="text-sm text-blue-900 space-y-2">
                <p>• 以上信息仅供参考，具体要求和政策可能随时变化</p>
                <p>• 建议直接联系学校招生办公室或访问官方网站获取最新信息</p>
                <p>• 新加坡大学申请竞争激烈，建议提前充分准备</p>
                <p>• Tuition Grant的选择需要慎重考虑，建议咨询专业留学顾问</p>
                <p>• 签证申请建议咨询专业留学顾问或移民代理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

