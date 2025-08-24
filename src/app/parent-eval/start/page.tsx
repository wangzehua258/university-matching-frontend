'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { evaluationAPI } from '@/lib/api';
import { getAnonymousUserId } from '@/lib/useAnonymousUser';

interface FormData {
  grade: string;
  gpa_range: string;
  sat_score: string;
  activities: string[];
  interest_fields: string[];
  target_country: string;
  school_type_preference: string;
  reputation_important: boolean;
  budget: string;
  family_expectation: string;
  internship_important: boolean;
}

const ParentEvalStart = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<FormData>({
    grade: '',
    gpa_range: '',
    sat_score: '',
    activities: [],
    interest_fields: [],
    target_country: '',
    school_type_preference: '',
    reputation_important: true,
    budget: '',
    family_expectation: '',
    internship_important: true,
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      // 验证基本信息
      if (!formData.grade) {
        newErrors.grade = '请选择年级';
      }
      if (!formData.gpa_range) {
        newErrors.gpa_range = '请选择GPA范围';
      }
      if (formData.sat_score && parseInt(formData.sat_score) < 1350) {
        newErrors.sat_score = 'SAT分数不能低于1350分';
      }
      if (formData.activities.length < 2) {
        newErrors.activities = '请至少选择2项活动经历';
      }
      if (!formData.target_country) {
        newErrors.target_country = '请选择目标国家';
      }
    } else if (currentStep === 2) {
      // 验证兴趣偏好
      if (formData.interest_fields.length < 3) {
        newErrors.interest_fields = '请至少选择3个兴趣方向';
      }
      if (!formData.school_type_preference) {
        newErrors.school_type_preference = '请选择学校类型偏好';
      }
    } else if (currentStep === 3) {
      // 验证家庭取向
      if (!formData.budget) {
        newErrors.budget = '请选择预算范围';
      }
      if (!formData.family_expectation) {
        newErrors.family_expectation = '请选择家长期望';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return; // 验证失败，不继续
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // 提交表单到API
      await submitEvaluation();
    }
  };

  const submitEvaluation = async () => {
    try {
      setLoading(true);
      
      // 获取匿名用户ID
      const anonymousUserId = getAnonymousUserId();
      
      // 准备提交数据
      const evaluationData = {
        user_id: anonymousUserId,
        input: {
          grade: formData.grade,
          gpa_range: formData.gpa_range,
          sat_score: formData.sat_score ? parseInt(formData.sat_score) : null,
          activities: formData.activities,
          interest_fields: formData.interest_fields,
          target_country: formData.target_country,
          school_type_preference: formData.school_type_preference,
          reputation_important: formData.reputation_important,
          budget: formData.budget,
          family_expectation: formData.family_expectation,
          internship_important: formData.internship_important,
        }
      };

      // 调用API创建评估
      const result = await evaluationAPI.createParentEvaluation(evaluationData);
      
      // 跳转到结果页面，传递评估ID
      router.push(`/parent-eval/result?id=${result.id}`);
    } catch (error) {
      console.error('提交评估失败:', error);
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">学生基本信息</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            年级
          </label>
          <select
            value={formData.grade}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择年级</option>
            <option value="高一">高一</option>
            <option value="高二">高二</option>
            <option value="高三">高三</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPA范围
          </label>
          <select
            value={formData.gpa_range}
            onChange={(e) => handleInputChange('gpa_range', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.gpa_range ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">请选择GPA范围</option>
            <option value="3.9+">3.9+</option>
            <option value="3.8+">3.8+</option>
            <option value="3.6+">3.6+</option>
            <option value="3.6-">3.6-</option>
          </select>
          {errors.gpa_range && (
            <p className="mt-1 text-sm text-red-600">{errors.gpa_range}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SAT分数 (可选，最低1350)
          </label>
          <input
            type="number"
            min="1350"
            max="1600"
            value={formData.sat_score}
            onChange={(e) => handleInputChange('sat_score', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sat_score ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="例如: 1450"
          />
          {errors.sat_score && (
            <p className="mt-1 text-sm text-red-600">{errors.sat_score}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标国家
          </label>
          <select
            value={formData.target_country}
            onChange={(e) => handleInputChange('target_country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择国家</option>
            <option value="USA">美国</option>
            <option value="UK">英国</option>
            <option value="Canada">加拿大</option>
            <option value="Australia">澳大利亚</option>
          </select>
        </div>
      </div>

              <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            活动经历 (可多选，最少选择2个)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['学术竞赛', '科研', '学生会', '社团活动', '志愿服务', '实习经历', '职业规划', '创业经历', '推荐信准备', '社区服务'].map((activity) => (
              <label key={activity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.activities.includes(activity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange('activities', [...formData.activities, activity]);
                    } else {
                      handleInputChange('activities', formData.activities.filter(a => a !== activity));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{activity}</span>
              </label>
            ))}
          </div>
          {errors.activities && (
            <p className="mt-1 text-sm text-red-600">{errors.activities}</p>
          )}
        </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">兴趣偏好</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          兴趣方向 (可多选，最少选择3个)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['计算机科学', '公共政策', '经济学', '社会科学', '工程学', '物理学', '化学', '商科', '心理学', '艺术设计', '生物学', '创业', '人文社科', '医药学', '国际关系', '政治学', '农学', '自然科学', '教育学', '法学'].map((field) => (
            <label key={field} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.interest_fields.includes(field)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange('interest_fields', [...formData.interest_fields, field]);
                  } else {
                    handleInputChange('interest_fields', formData.interest_fields.filter(f => f !== field));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{field}</span>
            </label>
          ))}
                  </div>
          {errors.interest_fields && (
            <p className="mt-1 text-sm text-red-600">{errors.interest_fields}</p>
          )}
        </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          学校类型偏好
        </label>
        <select
          value={formData.school_type_preference}
          onChange={(e) => handleInputChange('school_type_preference', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择学校类型</option>
          <option value="小型私立">小型私立</option>
          <option value="中型私立">中型私立</option>
          <option value="大型私立">大型私立</option>
          <option value="公立大学">公立大学</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.reputation_important}
            onChange={(e) => handleInputChange('reputation_important', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">重视学校声誉和排名</span>
        </label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">家庭取向</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          家长期望
        </label>
        <select
          value={formData.family_expectation}
          onChange={(e) => handleInputChange('family_expectation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择期望</option>
          <option value="就业导向">希望孩子有明确的职业规划</option>
          <option value="探索导向">希望孩子能探索不同领域</option>
          <option value="学术导向">希望孩子专注学术研究</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          预算范围 (年)
        </label>
        <select
          value={formData.budget}
          onChange={(e) => handleInputChange('budget', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择预算</option>
          <option value="35万-40万">35万-40万</option>
          <option value="40万-50万">40万-50万</option>
          <option value="50万-60万">50万-60万</option>
          <option value="60万+">60万+</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.internship_important}
            onChange={(e) => handleInputChange('internship_important', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">重视实习机会和就业前景</span>
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">家长版个性化择校评估</h1>
          <p className="text-gray-600">请填写以下信息，我们将为您生成个性化的择校建议</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">步骤 {currentStep} / 3</span>
            <span className="text-sm text-gray-500">完成度 {Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderCurrentStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-md font-medium ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className={`px-6 py-2 rounded-md font-medium flex items-center space-x-2 ${
                loading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === 3 ? '生成评估报告' : '下一步'}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentEvalStart; 