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
  Building,
  Target,
  GraduationCap as CapIcon
} from 'lucide-react';

interface UKUniversity {
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
  ucas_deadline_type: string;
  typical_offer_alevel: string;
  typical_offer_ib: string;
  foundation_available: boolean;
  russell_group: boolean;
  placement_year_available: boolean;
  interview_required: boolean;
  admissions_tests: string;
  personal_statement_weight: number;
  strengths: string[];
  tags: string[];
  intlRate: number | null;
  website: string;
  scholarship_available: boolean;
}

interface UKDetailViewProps {
  university: UKUniversity;
  onBack: () => void;
}

export default function UKDetailView({ university, onBack }: UKDetailViewProps) {
  // 格式化学费显示
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'GBP') return `£${amount.toLocaleString('en-GB')}`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  // 计算总费用估算（学费 + 生活费）
  // 计算逻辑说明：
  // 1. 生活费：伦敦地区约15,000-20,000 GBP/年，其他地区约10,000-15,000 GBP/年
  // 2. 学费：tuition_local（每年学费） × study_length_years（学制年数，通常3年）
  // 3. 总费用 = 学费 + 生活费
  const estimateTotalCost = () => {
    // 根据城市判断生活费（伦敦较高，其他城市较低）
    const isLondon = university.city.toLowerCase().includes('london');
    const annualLivingCost = isLondon ? 18000 : 13000; // 伦敦约1.8万英镑，其他城市约1.3万英镑
    
    const totalTuition = university.tuition_local * university.study_length_years;
    const totalLiving = annualLivingCost * university.study_length_years;
    
    return {
      tuition: totalTuition,
      living: totalLiving,
      total: totalTuition + totalLiving,
      annualLiving: annualLivingCost
    };
  };

  const costs = estimateTotalCost();

  // 解析UCAS截止日期类型
  const parseUCASDeadline = (deadlineType: string) => {
    if (deadlineType.includes('Early') || deadlineType.includes('10/15')) {
      return { type: '早申请', date: '10月15日', description: '医学、牙医、兽医等专业' };
    }
    if (deadlineType.includes('Regular') || deadlineType.includes('1/31') || deadlineType.includes('1/26')) {
      return { type: '常规申请', date: '1月26日或31日', description: '大部分专业' };
    }
    return { type: '常规申请', date: '1月31日', description: '大部分专业' };
  };

  const ucasInfo = parseUCASDeadline(university.ucas_deadline_type);

  // 解析入学考试
  const parseAdmissionsTests = (tests: string) => {
    if (!tests || tests === 'None' || tests.toLowerCase() === 'none') {
      return [];
    }
    return tests.split(',').map(t => t.trim()).filter(Boolean);
  };

  const admissionTests = parseAdmissionsTests(university.admissions_tests);

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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {university.russell_group && (
                      <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        <Award className="h-4 w-4 mr-1" />
                        罗素集团（Russell Group）
                      </div>
                    )}
                    {university.foundation_available && (
                      <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <CapIcon className="h-4 w-4 mr-1" />
                        提供预科课程（Foundation）
                      </div>
                    )}
                    {university.placement_year_available && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <Briefcase className="h-4 w-4 mr-1" />
                        提供实习年（Placement Year）
                      </div>
                    )}
                  </div>
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
                    {university.intlRate ? (university.intlRate * 100).toFixed(0) + '%' : 'N/A'}
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
                      {formatCurrency(costs.living, university.currency)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    包括住宿、饮食、交通等，每年约 {formatCurrency(costs.annualLiving, university.currency)}
                    {university.city.toLowerCase().includes('london') && (
                      <span className="text-blue-600 font-medium">（伦敦地区）</span>
                    )}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">总费用估算</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {formatCurrency(costs.total, university.currency)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    约人民币 {Math.round(costs.total * 9.2).toLocaleString()} 元（按汇率9.2计算）
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>温馨提示：</strong>实际费用可能因个人消费习惯、住宿选择、城市等因素有所差异。伦敦地区生活费通常较高。建议额外准备10-20%的应急资金。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UCAS申请系统说明 - 英国特色 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                UCAS申请系统 - 英国统一申请平台
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="mb-3">
                    <span className="text-gray-900 font-semibold text-lg">什么是UCAS？</span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      UCAS（Universities and Colleges Admissions Service）是英国大学和学院的统一申请系统。所有申请英国本科的学生都必须通过UCAS提交申请。
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-900">申请截止日期</span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      <strong>{ucasInfo.date}</strong>
                      <div className="mt-1">{ucasInfo.description}</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-semibold text-purple-900">申请数量限制</span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      每位学生最多可以申请 <strong>5所大学</strong>（同一专业或不同专业）
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>重要提示：</strong>UCAS申请通常需要提前一年开始准备（即高二或高三上学期）。建议尽早注册UCAS账号并准备申请材料。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 学术成绩要求 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-6 w-6 mr-2 text-red-600" />
                学术成绩要求
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">A-Level成绩要求</h4>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-red-900 mb-1">
                      {university.typical_offer_alevel}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>说明：</strong>A-Level是英国的高中课程体系。成绩从高到低分为 A*, A, B, C, D, E。大多数英国大学要求AAA到A*AA。
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">IB成绩要求</h4>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-blue-900 mb-1">
                      {university.typical_offer_ib}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>说明：</strong>IB（International Baccalaureate）是国际文凭课程。总分45分，大多数英国大学要求36-42分，具体分数要求通常包括Higher Level（HL）的具体成绩。
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">其他成绩体系</h4>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>• <strong>高考成绩：</strong>部分大学接受，通常要求达到当地985/211分数线，或一本线+50分以上</div>
                      <div>• <strong>国内大学成绩：</strong>如果已完成大一，通常要求GPA 3.5/4.0或85/100以上</div>
                      <div>• <strong>预科课程（Foundation）：</strong>如果成绩不达标，可以先读预科，完成后升入本科</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 预科课程（Foundation） */}
            {university.foundation_available && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CapIcon className="h-6 w-6 mr-2 text-orange-600" />
                  预科课程（Foundation）
                </h3>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-orange-900">此学校提供预科课程</span>
                  </div>
                  <div className="text-sm text-gray-700 mt-3 space-y-2">
                    <p>
                      <strong>什么是Foundation？</strong>
                    </p>
                    <p>
                      预科课程是为国际学生设计的衔接课程，通常为期1年。如果学生的A-Level或IB成绩未达到直接录取要求，可以申请预科课程，完成后可以直接升入该大学的本科一年级。
                    </p>
                    <p className="mt-2">
                      <strong>优势：</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>帮助国际学生适应英国教育体系</li>
                      <li>提高英语水平和学术能力</li>
                      <li>完成预科后可直接升入本科，无需重新申请</li>
                      <li>申请要求相对较低，适合成绩略有差距的学生</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 申请要求和材料 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-red-600" />
                申请要求和材料
              </h3>
              <div className="space-y-4">
                {/* 个人陈述 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    个人陈述（Personal Statement）
                    {university.personal_statement_weight > 0 && (
                      <span className="text-purple-600 text-sm ml-2">
                        （重要性评分: {university.personal_statement_weight}/10）
                      </span>
                    )}
                  </h4>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        个人陈述是UCAS申请的重要组成部分，需要写一篇约4000字符（约600-800字）的文章，说明：
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>为什么选择这个专业</li>
                        <li>你的相关经历和兴趣</li>
                        <li>为什么适合学习这个专业</li>
                        <li>未来的职业规划</li>
                      </ul>
                      {university.personal_statement_weight >= 7 && (
                        <p className="mt-2 text-purple-900 font-medium">
                          ⚠️ 此学校非常重视个人陈述，建议认真准备并多次修改。
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 入学考试 */}
                {admissionTests.length > 0 && (
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">入学考试要求</h4>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>
                          <strong>需要参加的入学考试：</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {admissionTests.map((test, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white border-2 border-orange-300 rounded-lg text-orange-900 font-medium"
                            >
                              {test}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-sm">
                          <strong>常见入学考试：</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                          <li><strong>BMAT/UKCAT：</strong>医学相关专业</li>
                          <li><strong>LNAT：</strong>法律专业</li>
                          <li><strong>STEP/MAT：</strong>数学相关专业</li>
                          <li><strong>PAT：</strong>物理相关专业</li>
                          <li><strong>TSA：</strong>部分社会科学专业</li>
                        </ul>
                        <p className="mt-2 text-xs text-orange-900">
                          ⚠️ 入学考试通常在10-11月进行，需要提前注册和准备。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 面试 */}
                {university.interview_required && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">面试要求</h4>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">此专业可能需要面试</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-2">
                        部分专业（如医学、法律、部分罗素集团大学）可能会邀请优秀申请人参加面试。面试通常在11-12月进行，可能是面对面或在线面试。
                      </div>
                    </div>
                  </div>
                )}

                {/* 英语要求 */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">英语成绩要求</h4>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>• <strong>IELTS：</strong>通常要求总分6.5-7.5，单项不低于6.0-7.0（视专业而定）</div>
                      <div>• <strong>TOEFL：</strong>通常要求90-110分（iBT）</div>
                      <div>• <strong>其他：</strong>部分学校也接受PTE Academic、Cambridge English等</div>
                      <div className="mt-2 text-xs text-gray-600">
                        <strong>注意：</strong>英国大学对英语要求较高，建议尽早准备。部分专业（如医学、法律）对英语要求更高。
                      </div>
                    </div>
                  </div>
                </div>

                {/* 材料清单 */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">需要准备的材料</h4>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>UCAS申请表（在线填写）</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>个人陈述（Personal Statement，约4000字符）</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>学术成绩单（A-Level/IB/高考成绩等）</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>推荐信（1-2封，通常来自老师或学校）</span>
                      </div>
                      {admissionTests.length > 0 && (
                        <div className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>入学考试成绩（如适用）</span>
                        </div>
                      )}
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>英语成绩单（IELTS/TOEFL/PTE）</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>护照复印件</span>
                      </div>
                      {university.russell_group && (
                        <div className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>其他证明材料（获奖证书、竞赛证书等，如有）</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 学制说明 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-orange-600" />
                学制和开学时间
              </h3>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-medium">本科学制</span>
                  <span className="text-xl font-bold text-orange-900">
                    {university.study_length_years} 年制
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  英国本科学制通常为3年（苏格兰地区为4年）。部分专业如工程、医学、法律可能需要4-6年。
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>开学时间：</strong>通常在每年9月或10月（秋季学期）
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>申请建议：</strong>建议提前12-18个月开始准备申请材料和英语考试。UCAS申请通常在10月15日（早申请）或1月26日/31日（常规申请）截止。
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

            {/* 实习年（Placement Year） */}
            {university.placement_year_available && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-indigo-600" />
                  实习年（Placement Year）
                </h3>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-semibold text-indigo-900">此学校提供实习年选项</span>
                  </div>
                  <div className="text-sm text-gray-700 mt-3 space-y-2">
                    <p>
                      <strong>什么是Placement Year？</strong>
                    </p>
                    <p>
                      实习年是学生在本科期间（通常是第三年）暂停学业，到企业或机构进行为期一年的全职实习工作，然后返回学校完成最后一年的学习。有些专业提供4年制（含1年实习）的选项。
                    </p>
                    <p className="mt-2">
                      <strong>优势：</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>获得实际工作经验，增强就业竞争力</li>
                      <li>了解行业实际情况，明确职业方向</li>
                      <li>建立行业人脉网络</li>
                      <li>通常能获得实习工资，部分可以抵消学费</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：重要信息 */}
          <div className="space-y-6">
            {/* Russell Group说明 */}
            {university.russell_group && (
              <div className="bg-red-50 rounded-lg shadow-md p-6 border-2 border-red-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-red-600" />
                  罗素集团（Russell Group）
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        <strong>什么是Russell Group？</strong>
                      </p>
                      <p>
                        罗素集团是英国24所顶尖研究型大学组成的联盟，相当于英国的"常春藤联盟"。这些大学在研究和教学方面享有很高的声誉。
                      </p>
                      <p className="mt-2">
                        <strong>特点：</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>研究实力强，学术声誉高</li>
                        <li>申请竞争激烈，录取要求较高</li>
                        <li>毕业生就业前景好</li>
                        <li>校友网络强大</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="text-xs text-yellow-800">
                      <strong>💡 建议：</strong>申请罗素集团大学需要优异的学术成绩和精心准备的申请材料。如果成绩略有差距，可以考虑申请Foundation预科课程。
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Foundation快速提醒 */}
            {university.foundation_available && (
              <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CapIcon className="h-5 w-5 mr-2 text-blue-600" />
                  预科课程提醒
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    ✅ 此学校提供<strong>Foundation预科课程</strong>
                  </p>
                  <p>
                    📋 适合成绩未达到直接录取要求的学生
                  </p>
                  <p>
                    💡 <strong>优势：</strong>完成预科后可直接升入本科，无需重新申请。详见左侧详细说明。
                  </p>
                </div>
              </div>
            )}

            {/* Placement Year提醒 */}
            {university.placement_year_available && (
              <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                  实习年提醒
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    ✅ 此学校提供<strong>Placement Year实习年</strong>选项
                  </p>
                  <p>
                    📋 通常在第三年进行，为期1年
                  </p>
                  <p>
                    💡 <strong>优势：</strong>获得实际工作经验，增强就业竞争力。详见左侧详细说明。
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
                      <li>政府奖学金（如Chevening奖学金）</li>
                    </ul>
                    <p className="mt-2">
                      <strong>申请建议：</strong>英国大学的奖学金竞争激烈，建议在提交UCAS申请时同时关注学校官网的奖学金信息，通常需要额外的申请材料。
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

            {/* UCAS申请时间线 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                UCAS申请时间线
              </h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold text-gray-900">提前18-24个月</div>
                  <div className="text-gray-600">开始准备英语考试，了解UCAS系统和学校</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold text-gray-900">提前12-18个月</div>
                  <div className="text-gray-600">完成英语考试，准备A-Level/IB考试，开始撰写个人陈述</div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-gray-900">9月-1月</div>
                  <div className="text-gray-600">
                    提交UCAS申请
                    <br />
                    <span className="text-xs">• 10月15日：早申请（医学等）</span>
                    <br />
                    <span className="text-xs">• 1月26日/31日：常规申请</span>
                  </div>
                </div>
                {admissionTests.length > 0 && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <div className="font-semibold text-gray-900">10-11月</div>
                    <div className="text-gray-600">参加入学考试（如适用）</div>
                  </div>
                )}
                <div className="border-l-4 border-red-500 pl-4">
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
                <p>• UCAS是所有英国本科申请的必经之路，需提前注册账号</p>
                <p>• 每位学生最多只能申请5所大学，选择需慎重</p>
                <p>• 个人陈述非常重要，建议多次修改完善</p>
                <p>• 入学考试（如适用）需提前注册和准备</p>
                <p>• 建议直接联系学校招生办公室或访问官方网站获取最新信息</p>
                <p>• 签证申请建议咨询专业留学顾问或移民代理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

