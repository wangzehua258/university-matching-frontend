'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Star, DollarSign, Users } from 'lucide-react';
import { universityAPI } from '@/lib/api';

interface University {
  id: string;
  name: string;
  country: string;
  state: string;
  rank: number;
  tuition: number;
  intlRate: number;  // Changed from intl_rate to match backend
  type: string;
  strengths: string[];
  gptSummary: string;  // Changed from gpt_summary to match backend
  logoUrl?: string;    // Changed from logo_url to match backend
  location?: string;
  personality_types?: string[];
  schoolSize?: string;
  description?: string;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [selectedStrength, setSelectedStrength] = useState('');

  useEffect(() => {
    loadUniversities();
    loadFilters();
  }, []);

  const loadUniversities = async () => {
    try {
      const params: Record<string, string | number> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCountry) params.country = selectedCountry;
      if (selectedType) params.type = selectedType;
      if (selectedStrength) params.strength = selectedStrength;

      const data = await universityAPI.getUniversities(params);
      setUniversities(data);
    } catch (error) {
      console.error('加载大学数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [countriesData, strengthsData] = await Promise.all([
        universityAPI.getCountries(),
        universityAPI.getStrengths()
      ]);
      setCountries(countriesData.countries);
      setStrengths(strengthsData.strengths);
    } catch (error) {
      console.error('加载筛选数据失败:', error);
    }
  };

  const handleSearch = () => {
    loadUniversities();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedType('');
    setSelectedStrength('');
    loadUniversities();
  };

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
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

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
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
              <span className="text-sm text-gray-600">专业筛选:</span>
            </div>
            <select
              value={selectedStrength}
              onChange={(e) => setSelectedStrength(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有专业</option>
              {strengths.map((strength) => (
                <option key={strength} value={strength}>
                  {strength}
                </option>
              ))}
            </select>
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
                      <span>国际生比例: {(university.intlRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">类型:</span> {university.type === 'private' ? '私立' : '公立'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">优势专业:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {university.strengths.slice(0, 3).map((strength, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {strength}
                        </span>
                      ))}
                      {university.strengths.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{university.strengths.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {university.gptSummary}
                  </p>

                  <Link
                    href={`/universities/${university.id}`}
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
      </div>
    </div>
  );
} 