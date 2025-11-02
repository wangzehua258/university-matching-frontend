'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  DollarSign, 
  Users, 
  Building2, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  Globe,
  Target,
  Award
} from 'lucide-react';
import { universityAPI } from '@/lib/api';
import AUDetailView from './AUDetailView';
import SGDetailView from './SGDetailView';
import UKDetailView from './UKDetailView';

interface University {
  id: string;
  name: string;
  country: string;
  state: string;
  rank: number;
  tuition: number;
  intl_rate: number;  // 使用数据库中的正确字段名
  type: string;
  strengths: string[];
  gpt_summary: string;  // 使用数据库中的正确字段名
  logo_url?: string;    // 使用数据库中的正确字段名
  location?: string;
  personality_types?: string[];
  school_size?: string;  // 使用数据库中的正确字段名
  description?: string;
  supports_ed?: boolean;
  supports_ea?: boolean;
  supports_rd?: boolean;
  internship_support_score?: number;
  acceptance_rate?: number;  // 使用数据库中的正确字段名
  sat_range?: string;        // 使用数据库中的正确字段名
  act_range?: string;        // 使用数据库中的正确字段名
  gpa_range?: string;        // 使用数据库中的正确字段名
  application_deadline?: string;  // 使用数据库中的正确字段名
  website?: string;
  has_internship_program?: boolean;
  has_research_program?: boolean;
  tags?: string[];
}

interface AUUniversityResponse {
  _id?: string;
  id?: string;
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
  strengths: string[] | string;
  tags: string[] | string;
  intlRate: number;
  website: string;
}

interface UKUniversityResponse {
  _id?: string;
  id?: string;
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
  strengths: string[] | string;
  tags: string[] | string;
  intlRate: number | null;
  website: string;
  scholarship_available: boolean;
}

interface SGUniversityResponse {
  _id?: string;
  id?: string;
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
  strengths: string[] | string;
  tags: string[] | string;
  intlRate: number;
  website: string;
  scholarship_available: boolean;
}

type InternationalUniversityResponse = AUUniversityResponse | UKUniversityResponse | SGUniversityResponse;

// 辅助函数：将字符串或数组转换为字符串数组
function normalizeArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auData, setAuData] = useState<InternationalUniversityResponse | null>(null);

  useEffect(() => {
    const loadUniversity = async () => {
      try {
        if (params.id) {
          const country = searchParams?.get('country');
          const universityId = params.id as string;
          
          console.log('🔍 加载大学详情:', { id: universityId, country });
          
          if (country && ['Australia','United Kingdom','Singapore'].includes(country)) {
            // 对于国际大学，使用不同的API端点
            const endpoint = country === 'Australia' 
              ? `/international/au/${universityId}` 
              : country === 'United Kingdom' 
              ? `/international/uk/${universityId}` 
              : `/international/sg/${universityId}`;
            
            console.log('📡 API端点:', endpoint);
            
            const resp = await api.get(endpoint);
            const u = resp.data as InternationalUniversityResponse;
            console.log('✅ API响应成功:', u);
            
            // 如果是国际大学（澳大利亚、新加坡、英国），保存原始数据以便在详情页显示
            if (country === 'Australia' || country === 'Singapore' || country === 'United Kingdom') {
              setAuData(u);
              // 仍然映射到通用格式以兼容现有UI
              const mapped: University = {
                id: u._id || u.id || '',
                name: u.name,
                country: u.country,
                state: u.city || '',
                rank: typeof u.rank === 'number' ? u.rank : Math.round(parseFloat(u.rank) || 999),
                tuition: u.tuition_usd || 0,
                intl_rate: u.intlRate || 0,
                type: u.currency || 'public',
                strengths: Array.isArray(u.strengths) ? u.strengths : (typeof u.strengths === 'string' ? u.strengths.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
                gpt_summary: u.website || '',
                logo_url: undefined,
                location: undefined,
                personality_types: undefined,
                school_size: undefined,
                description: undefined,
                supports_ed: undefined,
                supports_ea: undefined,
                supports_rd: undefined,
                internship_support_score: undefined,
                acceptance_rate: undefined,
                sat_range: undefined,
                act_range: undefined,
                gpa_range: undefined,
                application_deadline: undefined,
                website: u.website,
                has_internship_program: undefined,
                has_research_program: undefined,
                tags: Array.isArray(u.tags) ? u.tags : (typeof u.tags === 'string' ? u.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
              };
              setUniversity(mapped);
            } else {
              // UK和SG的处理逻辑保持不变
              const mapped: University = {
                id: u._id || u.id || '',
                name: u.name,
                country: u.country,
                state: u.city || '',
                rank: typeof u.rank === 'number' ? u.rank : Math.round(parseFloat(u.rank) || 999),
                tuition: u.tuition_usd || 0,
                intl_rate: u.intlRate || 0,
                type: u.currency || 'public',
                strengths: Array.isArray(u.strengths) ? u.strengths : (typeof u.strengths === 'string' ? u.strengths.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
                gpt_summary: u.website || '',
                logo_url: undefined,
                location: undefined,
                personality_types: undefined,
                school_size: undefined,
                description: undefined,
                supports_ed: undefined,
                supports_ea: undefined,
                supports_rd: undefined,
                internship_support_score: undefined,
                acceptance_rate: undefined,
                sat_range: undefined,
                act_range: undefined,
                gpa_range: undefined,
                application_deadline: undefined,
                website: u.website,
                has_internship_program: undefined,
                has_research_program: undefined,
                tags: Array.isArray(u.tags) ? u.tags : (typeof u.tags === 'string' ? u.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
              };
              setUniversity(mapped);
            }
          } else {
            const data = await universityAPI.getUniversityById(params.id as string);
            setUniversity(data);
          }
        }
      } catch (err: unknown) {
        setError('加载大学信息失败');
        console.error('加载大学信息失败:', err);
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response?: { data?: unknown } };
          if (axiosError.response) {
            console.error('API响应:', axiosError.response.data);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUniversity();
  }, [params.id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '大学信息不存在'}</p>
          <Link href="/universities" className="text-blue-600 hover:text-blue-700">
            返回大学列表
          </Link>
        </div>
      </div>
    );
  }

  // 如果是国际大学且有详细数据，使用专门的详情页组件
  const country = searchParams?.get('country');
  if (country === 'Australia' && auData) {
    const au = auData as AUUniversityResponse;
    return (
      <AUDetailView 
        university={{
          ...au,
          id: au._id || au.id || '',
          strengths: normalizeArray(au.strengths),
          tags: normalizeArray(au.tags),
        }} 
        onBack={() => router.push('/universities')} 
      />
    );
  }

  if (country === 'Singapore' && auData) {
    const sg = auData as SGUniversityResponse;
    return (
      <SGDetailView 
        university={{
          ...sg,
          id: sg._id || sg.id || '',
          strengths: normalizeArray(sg.strengths),
          tags: normalizeArray(sg.tags),
        }} 
        onBack={() => router.push('/universities')} 
      />
    );
  }

  if (country === 'United Kingdom' && auData) {
    const uk = auData as UKUniversityResponse;
    return (
      <UKDetailView 
        university={{
          ...uk,
          id: uk._id || uk.id || '',
          strengths: normalizeArray(uk.strengths),
          tags: normalizeArray(uk.tags),
        }} 
        onBack={() => router.push('/universities')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                href="/universities" 
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回大学列表
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{university.name}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{university.name}</h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {university.state}, {university.country}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    {university.type === 'private' ? '私立大学' : '公立大学'}
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-2 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-bold text-yellow-700">#{university.rank}</span>
                </div>
              </div>

              {/* 核心数据 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">${university.tuition.toLocaleString()}</div>
                  <div className="text-sm text-blue-600">年学费</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{(university.intl_rate * 100).toFixed(1)}%</div>
                  <div className="text-sm text-green-600">国际生比例</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">
                    {university.acceptance_rate ? (university.acceptance_rate * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                  <div className="text-sm text-purple-600">录取率</div>
                </div>
              </div>
            </div>

            {/* 优势专业 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                优势专业
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {university.strengths.map((strength, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg text-center font-medium"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* 学校介绍 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                学校介绍
              </h3>
              <p className="text-gray-700 leading-relaxed">{university.gpt_summary}</p>
            </div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="space-y-6">
            {/* 申请信息 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-red-600" />
                申请信息
              </h3>
              <div className="space-y-3">
                {university.acceptance_rate ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">录取率</span>
                    <span className="font-medium">{(university.acceptance_rate * 100).toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>申请信息暂未更新</p>
                    <p className="text-xs mt-1">包括录取率、SAT/ACT范围、GPA要求等</p>
                  </div>
                )}
                {university.acceptance_rate && (
                  <>
                    {university.sat_range && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">SAT范围</span>
                        <span className="font-medium">{university.sat_range}</span>
                      </div>
                    )}
                    {university.act_range && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">ACT范围</span>
                        <span className="font-medium">{university.act_range}</span>
                      </div>
                    )}
                    {university.gpa_range && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">GPA范围</span>
                        <span className="font-medium">{university.gpa_range}</span>
                      </div>
                    )}
                    {university.application_deadline && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">申请截止</span>
                        <span className="font-medium">{university.application_deadline}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 申请类型支持 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                申请类型
              </h3>
              <div className="space-y-2">
                {university.supports_ed || university.supports_ea || university.supports_rd ? (
                  <>
                    {university.supports_ed && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        支持ED申请
                      </div>
                    )}
                    {university.supports_ea && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        支持EA申请
                      </div>
                    )}
                    {university.supports_rd && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        支持RD申请
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>申请类型信息暂未更新</p>
                    <p className="text-xs mt-1">包括ED、EA、RD等申请方式</p>
                  </div>
                )}
              </div>
            </div>

            {/* 项目支持 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                项目支持
              </h3>
              <div className="space-y-3">
                {university.has_internship_program || university.has_research_program || university.internship_support_score ? (
                  <>
                    {university.has_internship_program && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        实习项目
                      </div>
                    )}
                    {university.has_research_program && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        研究项目
                      </div>
                    )}
                    {university.internship_support_score && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">实习支持评分</span>
                        <span className="font-medium">{university.internship_support_score}/10</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>项目支持信息暂未更新</p>
                    <p className="text-xs mt-1">包括实习、研究项目等支持</p>
                  </div>
                )}
              </div>
            </div>

            {/* 学校规模 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-gray-600" />
                学校规模
              </h3>
              {university.school_size ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">规模类型</span>
                    <span className="font-medium capitalize">{university.school_size}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {(() => {
                      const size = university.school_size;
                      const type = university.type;
                      
                      if (size === 'small') {
                        if (type === 'private') {
                          return '小型私立大学，通常学生人数较少（10000人以下），师生比例低，提供个性化的学习体验和紧密的校园社区。';
                        } else {
                          return '小型公立大学，通常学生人数较少（15000人以下），注重本科教育质量，提供相对亲密的学术环境。';
                        }
                      } else if (size === 'medium') {
                        if (type === 'private') {
                          return '中型私立大学，学生人数适中（10000-45000人），平衡了资源丰富性和个性化关注，提供多样化的学术选择。';
                        } else {
                          return '中型公立大学，学生人数适中（15000-50000人），结合了公立大学的资源和适中的班级规模。';
                        }
                      } else if (size === 'large') {
                        if (type === 'private') {
                          return '大型私立大学，学生人数较多（45000人以上），提供广泛的学术资源和研究机会，但班级规模可能较大。';
                        } else {
                          return '大型公立大学，学生人数较多（50000人以上），资源丰富，课程选择多样，但需要学生主动寻求个性化支持。';
                        }
                      }
                      return '学校规模信息';
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>学校规模信息暂未更新</p>
                  <p className="text-xs mt-1">包括学生人数、校园面积等</p>
                </div>
              )}
            </div>

            {/* 网站链接 */}
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
                  className="text-blue-600 hover:text-blue-700 underline break-all"
                >
                  {university.website}
                </a>
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>官方网站链接暂未更新</p>
                  <p className="text-xs mt-1">建议直接搜索学校官网</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
