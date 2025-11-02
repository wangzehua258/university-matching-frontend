'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Star, DollarSign, Users } from 'lucide-react';
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
  const [selectedCountry, setSelectedCountry] = useState('');
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
      const params: Record<string, string | number> = {
        page: currentPage,
        page_size: 9  // 每页9所学校
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedCountry) params.country = selectedCountry;
      if (selectedType) params.type = selectedType;
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
        const fallbackParams: Record<string, string | number> = {
          page: currentPage,
          page_size: 9
        };
        if (searchTerm) fallbackParams.search = searchTerm;
        if (selectedCountry) fallbackParams.country = selectedCountry;
        if (selectedType) fallbackParams.type = selectedType;
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
  }, [searchTerm, selectedCountry, selectedType, selectedStrength, currentPage, rankMin, rankMax, tuitionMax]);

  useEffect(() => {
    loadUniversities();
    loadFilters();
  }, [loadUniversities]);

  // Initialize selected country from query
  useEffect(() => {
    const initial = searchParams?.get('country') || '';
    if (initial) {
      setSelectedCountry(initial);
    }
  }, [searchParams]);

  const loadFilters = async () => {
    try {
      const [countriesData, strengthsData] = await Promise.all([
        universityAPI.getCountries(),
        universityAPI.getStrengths()
      ]);
      const base = Array.isArray(countriesData.countries) ? countriesData.countries : [];
      const extras = ['Australia', 'United Kingdom', 'Singapore'];
      const merged = Array.from(new Set([...base, ...extras]));
      setCountries(merged);
      setStrengths(strengthsData.strengths);
    } catch (error) {
      console.error('加载筛选数据失败:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // 搜索时重置到第一页
    loadUniversities();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
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

  // 使用useEffect实现实时筛选
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUniversities();
    }, 300); // 300ms防抖

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCountry, selectedType, selectedStrength, currentPage, rankMin, rankMax, tuitionMax, loadUniversities]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                ← 返回首页
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">大学信息库</h1>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索大学名称或专业..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Country Fixed: hide selector when URL 已指定 */}
            {!(searchParams?.get('country')) && (
              <div>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">所有类型</option>
                <option value="private">私立</option>
                <option value="public">公立</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">优势专业筛选:</span>
            </div>
            <select
              value={selectedStrength}
              onChange={(e) => handleFilterChange('strength', e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有专业</option>
              {strengths.map((strength) => (
                <option key={strength} value={strength}>
                  {strength}
                </option>
              ))}
            </select>
            
            {/* 排名范围筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">排名:</span>
              <input
                type="number"
                placeholder="最低"
                value={rankMin}
                onChange={(e) => handleFilterChange('rankMin', e.target.value)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="100"
              />
              <span className="text-sm text-gray-500">-</span>
              <input
                type="number"
                placeholder="最高"
                value={rankMax}
                onChange={(e) => handleFilterChange('rankMax', e.target.value)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="100"
              />
            </div>
            
            {/* 学费范围筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">最高学费:</span>
              <input
                type="number"
                placeholder="美元"
                value={tuitionMax}
                onChange={(e) => handleFilterChange('tuitionMax', e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="1000"
              />
            </div>
            
            <button
              onClick={handleSearch}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              搜索
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-1 border border-gray-300 text-gray-600 text-sm rounded-md hover:bg-gray-50"
            >
              清除筛选
            </button>
          </div>
        </div>
      </div>

      {/* Universities List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <div
                key={university.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {university.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {university.state}, {university.country}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        #{university.rank}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>学费: ${university.tuition.toLocaleString()}/年</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>国际生比例: {(university.intl_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">类型:</span> {university.type === 'private' ? '私立' : '公立'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">优势专业:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {university.strengths.map((strength, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full text-center truncate"
                          title={strength}
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {university.gpt_summary}
                  </p>

                  <Link
                    href={selectedCountry && ['Australia','United Kingdom','Singapore'].includes(selectedCountry)
                      ? `/universities/${university.id}?country=${encodeURIComponent(selectedCountry)}`
                      : `/universities/${university.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && universities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">没有找到符合条件的大学</p>
          </div>
        )}

        {/* 分页组件 */}
        {!loading && universities.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              {/* 上一页按钮 */}
              <button
                onClick={handlePrevPage}
                disabled={!hasPrev}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  hasPrev
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
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
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  hasNext
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                下一页
              </button>
            </div>
          </div>
        )}

        {/* 分页信息 */}
        {!loading && universities.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            显示第 {currentPage} 页，共 {totalPages} 页，总计 {totalUniversities} 所大学
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