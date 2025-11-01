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
  Users
} from 'lucide-react';
import Link from 'next/link';

interface AUUniversity {
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
  intakes: string;
  english_requirements: string;
  requires_english_test: boolean;
  group_of_eight: boolean;
  work_integrated_learning: boolean;
  placement_rate?: number | null;
  post_study_visa_years: number;
  scholarship_available: boolean;
  strengths: string[];
  tags: string[];
  intlRate: number;
  website: string;
}

interface AUDetailViewProps {
  university: AUUniversity;
  onBack: () => void;
}

export default function AUDetailView({ university, onBack }: AUDetailViewProps) {
  // 格式化学费显示
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'AUD') return `A$${amount.toLocaleString('en-AU')}`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  // 计算总费用估算（学费 + 生活费）
  const estimateTotalCost = () => {
    const annualLivingCost = 20000; // 约2万澳元/年生活费
    const totalTuition = university.tuition_local * university.study_length_years;
    const totalLiving = annualLivingCost * university.study_length_years;
    return {
      tuition: totalTuition,
      living: totalLiving,
      total: totalTuition + totalLiving
    };
  };

  const costs = estimateTotalCost();

  // 解析开学时间
  const parseIntakes = (intakes: string) => {
    return intakes.split(',').map(s => s.trim());
  };

  const intakeMonths = parseIntakes(university.intakes);

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
                  {university.group_of_eight && (
                    <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mt-2">
                      <Award className="h-4 w-4 mr-1" />
                      澳大利亚八校联盟（Go8）成员
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
                  <div className="text-sm text-blue-600 mt-1">每年学费</div>
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

            {/* 费用明细 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-green-600" />
                留学费用明细
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">学费（{university.study_length_years}年）</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(costs.tuition, university.currency)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    每年 {formatCurrency(university.tuition_local, university.currency)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">生活费（{university.study_length_years}年估算）</span>
                    <span className="text-lg font-bold text-gray-900">
                      A${costs.living.toLocaleString('en-AU')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    包括住宿、饮食、交通等，每年约 A$20,000
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">总费用估算</span>
                    <span className="text-2xl font-bold text-blue-900">
                      A${costs.total.toLocaleString('en-AU')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    约人民币 {Math.round(costs.total * 4.8).toLocaleString()} 元（按汇率4.8计算）
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>温馨提示：</strong>实际费用可能因个人消费习惯、住宿选择等因素有所差异。建议额外准备10-20%的应急资金。
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
                  <h4 className="font-semibold text-gray-900 mb-2">英语成绩要求</h4>
                  <div className="bg-red-50 rounded-lg p-3 mb-2">
                    <div className="text-gray-900 font-medium">{university.english_requirements}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {university.requires_english_test 
                        ? '需要提供官方英语考试成绩'
                        : '可通过其他方式满足要求'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>常见英语考试：</strong>IELTS（雅思）、TOEFL（托福）、PTE Academic
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">学术成绩要求</h4>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>• <strong>高考成绩：</strong>通常要求达到当地一本线以上</div>
                      <div>• <strong>IB成绩：</strong>通常要求28-38分（视专业而定）</div>
                      <div>• <strong>A-Level成绩：</strong>通常要求AAA-BBB（视专业而定）</div>
                      <div>• <strong>国内大学成绩：</strong>如果已完成大一，可使用大学成绩申请</div>
                    </div>
                  </div>
                </div>

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
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>护照复印件</span>
                      </div>
                      {university.group_of_eight && (
                        <div className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>部分专业可能需要作品集或面试</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 学制和开学时间 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-orange-600" />
                学制和开学时间
              </h3>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-900 font-medium">学制</span>
                    <span className="text-xl font-bold text-orange-900">
                      {university.study_length_years} 年制
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    澳大利亚本科学制通常为3年（部分专业如工程、医学等可能需要4-6年）
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="mb-2">
                    <span className="text-gray-900 font-medium">开学时间</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {intakeMonths.map((month, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg text-blue-900 font-medium"
                      >
                        {month}月
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>申请建议：</strong>建议提前6-12个月开始准备申请材料和英语考试
                  </div>
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

            {/* 工作机会和实习 */}
            {(university.work_integrated_learning || university.placement_rate) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-indigo-600" />
                  工作机会和实习
                </h3>
                <div className="space-y-4">
                  {university.work_integrated_learning && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="font-semibold text-indigo-900">工作综合学习（WIL）</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-2">
                        学校提供将理论学习与实践工作相结合的学习机会，帮助学生获得行业经验。
                      </div>
                    </div>
                  )}
                  {university.placement_rate && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-green-900">实习安置率</span>
                        <span className="text-xl font-bold text-green-900">
                          {(university.placement_rate * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        学校帮助学生找到实习机会的成功率
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：重要信息 */}
          <div className="space-y-6">
            {/* 毕业后工作许可 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                毕业后工作许可（PSW）
              </h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-green-900 mb-1">
                    {university.post_study_visa_years} 年
                  </div>
                  <div className="text-sm text-green-700">工作签证有效期</div>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>什么是PSW签证？</strong>
                  </p>
                  <p>
                    毕业后工作许可（Post-Study Work Visa）允许国际学生在完成澳大利亚学位后，在澳工作或寻找工作机会。
                  </p>
                  <p className="mt-2">
                    <strong>申请条件：</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>完成至少2年全日制学习</li>
                    <li>持有有效的学生签证</li>
                    <li>年龄在50岁以下</li>
                    <li>满足英语要求</li>
                  </ul>
                </div>
              </div>
            </div>

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
                    </ul>
                    <p className="mt-2">
                      <strong>申请建议：</strong>建议在提交入学申请时同时申请奖学金，通常需要额外的申请材料和成绩证明。
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
                  <div className="font-semibold text-gray-900">提前12-18个月</div>
                  <div className="text-gray-600">开始准备英语考试，了解学校和专业</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold text-gray-900">提前6-12个月</div>
                  <div className="text-gray-600">完成英语考试，准备申请材料</div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-gray-900">提前3-6个月</div>
                  <div className="text-gray-600">提交申请，等待录取通知</div>
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
                <p>• 申请前请确认专业的具体入学要求和申请截止日期</p>
                <p>• 签证申请建议咨询专业留学顾问或移民代理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

