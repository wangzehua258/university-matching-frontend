'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Star, DollarSign, Users, GraduationCap, ArrowRight, Building2, Globe } from 'lucide-react';
import { universityAPI } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

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
}

function UniversitiesPageInner() {
  const searchParams = useSearchParams();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // 直接从URL参数初始化selectedCountry，避免先加载错误数据
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('country') || '';
    }
    return searchParams?.get('country') || '';
  });
  const [selectedType, setSelectedType] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [selectedStrength, setSelectedStrength] = useState('');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  // 更多筛选选项
  const [rankMin, setRankMin] = useState('');
  const [rankMax, setRankMax] = useState('');
  const [tuitionMax, setTuitionMax] = useState('');

  const loadUniversities = useCallback(async () => {
    try {
      // Always call unified paginated endpoint with country param
      // 优先使用URL参数中的country，如果没有则使用selectedCountry状态
      const countryFromUrl = searchParams?.get('country') || selectedCountry;
      const params: Record<string, string | number> = {
        page: currentPage,
        page_size: 9  // 每页9所学校
      };
      if (searchTerm) params.search = searchTerm;
      if (countryFromUrl) params.country = countryFromUrl;
      // 学校类型筛选只对美国大学有效
      const isUSA = countryFromUrl === 'USA' || countryFromUrl === 'United States' || countryFromUrl === 'US';
      if (selectedType && isUSA) params.type = selectedType;
      if (selectedStrength) params.strength = selectedStrength;
      if (rankMin) params.rank_min = parseInt(rankMin);
      if (rankMax) params.rank_max = parseInt(rankMax);
      if (tuitionMax) params.tuition_max = parseInt(tuitionMax);

      // 使用分页API端点
      const data = await universityAPI.getUniversitiesPaginated(params);
      // 分页API返回完整的分页信息
      setUniversities(data.universities);
      
      // 保存分页信息
      setTotalUniversities(data.total);
      setTotalPages(data.total_pages);
      setHasNext(data.has_next);
      setHasPrev(data.has_prev);
    } catch (error) {
      console.error('加载大学数据失败:', error);
      // 如果分页API失败，回退到普通API
      try {
        const countryFromUrl = searchParams?.get('country') || selectedCountry;
        const fallbackParams: Record<string, string | number> = {
          page: currentPage,
          page_size: 9
        };
        if (searchTerm) fallbackParams.search = searchTerm;
        if (countryFromUrl) fallbackParams.country = countryFromUrl;
        // 学校类型筛选只对美国大学有效
        const isUSA = countryFromUrl === 'USA' || countryFromUrl === 'United States' || countryFromUrl === 'US';
        if (selectedType && isUSA) fallbackParams.type = selectedType;
        if (selectedStrength) fallbackParams.strength = selectedStrength;
        if (rankMin) fallbackParams.rank_min = parseInt(rankMin);
        if (rankMax) fallbackParams.rank_max = parseInt(rankMax);
        if (tuitionMax) fallbackParams.tuition_max = parseInt(tuitionMax);
        
        const fallbackData = await universityAPI.getUniversities(fallbackParams);
        const universitiesData = fallbackData.universities || fallbackData;
        setUniversities(universitiesData);
        // 设置默认分页信息
        setTotalUniversities(universitiesData.length);
        setTotalPages(1);
        setHasNext(false);
        setHasPrev(false);
      } catch (fallbackError) {
        console.error('回退API也失败:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCountry, selectedType, selectedStrength, currentPage, rankMin, rankMax, tuitionMax, searchParams]);

  // 定义loadFilters函数，必须在useEffect之前
  const loadFilters = useCallback(async () => {
    try {
      // 获取当前选中的国家（优先使用URL参数）
      const currentCountry = searchParams?.get('country') || selectedCountry;
      
      const [countriesData, strengthsData] = await Promise.all([
        universityAPI.getCountries(),
        universityAPI.getStrengths(currentCountry || undefined)
      ]);
      const base = Array.isArray(countriesData.countries) ? countriesData.countries : [];
      const extras = ['Australia', 'United Kingdom', 'Singapore'];
      const merged = Array.from(new Set([...base, ...extras]));
      setCountries(merged);
      setStrengths(strengthsData.strengths || []);
    } catch (error) {
      console.error('加载筛选数据失败:', error);
    }
  }, [searchParams, selectedCountry]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);
  
  // 初始化时加载筛选选项
  useEffect(() => {
    loadFilters();
  }, [loadFilters]);
  
  // 同步URL参数到状态（当URL变化时更新状态）
  // loadFilters会在国家变化时自动触发（因为依赖searchParams和selectedCountry）
  useEffect(() => {
    const countryFromUrl = searchParams?.get('country') || '';
    if (countryFromUrl && countryFromUrl !== selectedCountry) {
      setSelectedCountry(countryFromUrl);
      setCurrentPage(1); // 切换国家时重置到第一页
      // 如果切换到非美国国家，清空类型筛选
      const isUSA = countryFromUrl === 'USA' || countryFromUrl === 'United States' || countryFromUrl === 'US';
      if (!isUSA) {
        setSelectedType('');
      }
    } else if (!countryFromUrl && selectedCountry) {
      // 如果URL中没有country参数，但状态中有，则清空状态（除非是用户手动选择的筛选）
      // 这里保持selectedCountry，因为可能是用户在页面上选择的筛选
    }
  }, [searchParams, selectedCountry]);

  const handleSearch = () => {
    setCurrentPage(1); // 搜索时重置到第一页
    loadUniversities();
  };

  const clearFilters = () => {
    setSearchTerm('');
    // 如果URL中有country参数，不清除国家筛选
    const countryFromUrl = searchParams?.get('country');
    if (countryFromUrl) {
      setSelectedCountry(countryFromUrl);
    } else {
      setSelectedCountry('');
    }
    // 切换国家时，如果不是美国，清空类型筛选
    const currentCountry = countryFromUrl || selectedCountry;
    const isUSA = currentCountry === 'USA' || currentCountry === 'United States' || currentCountry === 'US';
    if (!isUSA) {
      setSelectedType('');
    }
    setSelectedType('');
    setSelectedStrength('');
    setRankMin('');
    setRankMax('');
    setTuitionMax('');
    setCurrentPage(1); // 清除筛选时重置到第一页
    loadUniversities();
  };

  // 分页处理函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 筛选器变化处理
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1); // 筛选变化时重置到第一页
    
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'country':
        setSelectedCountry(value);
        break;
      case 'type':
        setSelectedType(value);
        break;
      case 'strength':
        setSelectedStrength(value);
        break;
      case 'rankMin':
        setRankMin(value);
        break;
      case 'rankMax':
        setRankMax(value);
        break;
      case 'tuitionMax':
        setTuitionMax(value);
        break;
    }
  };

  // 使用useEffect实现实时筛选和搜索
  // 搜索使用防抖，其他筛选立即生效
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUniversities();
    }, searchTerm ? 300 : 0); // 搜索框输入时使用300ms防抖，其他筛选立即生效

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCountry, selectedType, selectedStrength, currentPage, rankMin, rankMax, tuitionMax, loadUniversities]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                <span>返回首页</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">大学信息库</h1>
              </div>
            </div>
            {searchParams?.get('country') && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {searchParams.get('country') === 'Australia' ? '🇦🇺 澳大利亚' :
                   searchParams.get('country') === 'United Kingdom' ? '🇬🇧 英国' :
                   searchParams.get('country') === 'Singapore' ? '🇸🇬 新加坡' :
                   searchParams.get('country') === 'USA' ? '🇺🇸 美国' :
                   searchParams.get('country')}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* 搜索区域 */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索大学名称或专业..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Country Fixed: hide selector when URL 已指定 */}
            {!(searchParams?.get('country')) && (
              <div>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">所有国家</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Type Filter - 只对美国大学显示 */}
            {(() => {
              const currentCountry = searchParams?.get('country') || selectedCountry;
              const isUSA = currentCountry === 'USA' || currentCountry === 'United States' || currentCountry === 'US';
              if (!isUSA) return null;
              
              return (
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">所有类型</option>
                    <option value="private">私立</option>
                    <option value="public">公立</option>
                  </select>
                </div>
              );
            })()}
          </div>

          {/* Additional Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* 优势专业筛选 */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">优势专业</label>
                <select
                  value={selectedStrength}
                  onChange={(e) => handleFilterChange('strength', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">所有专业</option>
                  {strengths.map((strength) => (
                    <option key={strength} value={strength}>
                      {strength}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 排名范围筛选 */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">排名范围</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="最低"
                    value={rankMin}
                    onChange={(e) => handleFilterChange('rankMin', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="100"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="最高"
                    value={rankMax}
                    onChange={(e) => handleFilterChange('rankMax', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              
              {/* 学费范围筛选 */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">最高学费 (USD)</label>
                <input
                  type="number"
                  placeholder="输入金额"
                  value={tuitionMax}
                  onChange={(e) => handleFilterChange('tuitionMax', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-end space-x-2 lg:col-span-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  应用筛选
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                >
                  清除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universities List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <GraduationCap className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">正在加载大学数据...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <div
                key={university.id}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
              >
                <div className="p-6">
                  {/* 头部：名称和排名 */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {university.name}
                        </h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{university.state}, {university.country}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center px-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mb-1" />
                      <span className="text-sm font-bold text-gray-900">
                        #{university.rank}
                      </span>
                    </div>
                  </div>

                  {/* 核心信息 */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <span>学费: <span className="font-semibold text-gray-900">${university.tuition.toLocaleString()}/年</span></span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>国际生比例: <span className="font-semibold text-gray-900">{(university.intl_rate * 100).toFixed(1)}%</span></span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                      <span>类型: <span className="font-semibold text-gray-900">{university.type === 'private' ? '私立' : '公立'}</span></span>
                    </div>
                  </div>

                  {/* 优势专业 */}
                  {university.strengths && university.strengths.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">优势专业</div>
                      <div className="flex flex-wrap gap-1.5">
                        {university.strengths.slice(0, 6).map((strength, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                            title={strength}
                          >
                            {strength}
                          </span>
                        ))}
                        {university.strengths.length > 6 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                            +{university.strengths.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 描述 */}
                  {university.gpt_summary && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                      {university.gpt_summary}
                    </p>
                  )}

                  {/* 查看详情按钮 */}
                  <Link
                    href={(selectedCountry || searchParams?.get('country')) && ['Australia','United Kingdom','Singapore'].includes(selectedCountry || searchParams?.get('country') || '')
                      ? `/universities/${university.id}?country=${encodeURIComponent(selectedCountry || searchParams?.get('country') || '')}`
                      : `/universities/${university.id}`}
                    className="flex items-center justify-center w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors group"
                  >
                    <span>查看详情</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && universities.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到符合条件的大学</h3>
            <p className="text-gray-600 mb-6">请尝试调整筛选条件或搜索关键词</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              清除所有筛选
            </button>
          </div>
        )}

        {/* 分页组件 */}
        {!loading && universities.length > 0 && totalPages > 1 && (
          <div className="mt-8">
            <div className="flex flex-col items-center space-y-4">
              {/* 分页信息 */}
              <div className="text-sm text-gray-600">
                显示第 <span className="font-medium text-gray-900">{currentPage}</span> 页，共 <span className="font-medium text-gray-900">{totalPages}</span> 页，总计 <span className="font-medium text-gray-900">{totalUniversities}</span> 所大学
              </div>
              
              {/* 分页按钮 */}
              <div className="flex items-center space-x-2">
                {/* 上一页按钮 */}
                <button
                  onClick={handlePrevPage}
                  disabled={!hasPrev}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    hasPrev
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  上一页
                </button>

                {/* 页码按钮 */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* 下一页按钮 */}
                <button
                  onClick={handleNextPage}
                  disabled={!hasNext}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    hasNext
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <UniversitiesPageInner />
    </Suspense>
  );
} 