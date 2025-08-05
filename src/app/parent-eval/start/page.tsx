'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, GraduationCap, Users, Brain, BookOpen } from 'lucide-react';
import { evaluationAPI, userAPI } from '@/lib/api';
import { getAnonymousUserId } from '@/lib/useAnonymousUser';

interface FormData {
  grade: string;
  gpa: string;
  sat: string;
  activities: string[];
  targetCountry: string;
  interest: string[];
  familyBudget: string;
  familyExpectation: string;
  internship: boolean;
}

const ParentEvalStart = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    grade: '',
    gpa: '',
    sat: '',
    activities: [],
    targetCountry: '',
    interest: [],
    familyBudget: '',
    familyExpectation: '',
    internship: false,
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
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
          student_info: {
            grade: formData.grade,
            gpa: parseFloat(formData.gpa) || 0,
            sat_score: formData.sat ? parseInt(formData.sat) : null,
            activities: formData.activities,
            target_country: formData.targetCountry,
            interests: formData.interest,
          },
          family_info: {
            budget: formData.familyBudget,
            expectation: formData.familyExpectation,
            internship_important: formData.internship,
          }
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
            GPA (4.0制)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="4"
            value={formData.gpa}
            onChange={(e) => handleInputChange('gpa', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如: 3.8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SAT分数 (可选)
          </label>
          <input
            type="number"
            min="400"
            max="1600"
            value={formData.sat}
            onChange={(e) => handleInputChange('sat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如: 1450"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标国家
          </label>
          <select
            value={formData.targetCountry}
            onChange={(e) => handleInputChange('targetCountry', e.target.value)}
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
          活动经历 (可多选)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['竞赛获奖', '学生会', '社团活动', '志愿服务', '实习经历', '艺术特长', '体育特长', '科研项目', '创业经历'].map((activity) => (
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
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">兴趣偏好</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          学科方向 (可多选)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['计算机科学', '工程学', '商科', '医学', '艺术设计', '人文社科', '自然科学', '教育学', '法学'].map((subject) => (
            <label key={subject} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.interest.includes(subject)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange('interest', [...formData.interest, subject]);
                  } else {
                    handleInputChange('interest', formData.interest.filter(i => i !== subject));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{subject}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          学校偏好
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="schoolPreference"
              value="reputation"
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">重视学校声誉和排名</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="schoolPreference"
              value="environment"
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">重视校园环境和生活质量</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="schoolPreference"
              value="balanced"
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">平衡考虑各方面因素</span>
          </label>
        </div>
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
          value={formData.familyExpectation}
          onChange={(e) => handleInputChange('familyExpectation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择期望</option>
          <option value="career">希望孩子有明确的职业规划</option>
          <option value="exploration">希望孩子能探索不同领域</option>
          <option value="academic">希望孩子专注学术研究</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          预算范围 (年)
        </label>
        <select
          value={formData.familyBudget}
          onChange={(e) => handleInputChange('familyBudget', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择预算</option>
          <option value="20-30w">20-30万</option>
          <option value="30-50w">30-50万</option>
          <option value="50-80w">50-80万</option>
          <option value="80w+">80万以上</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.internship}
            onChange={(e) => handleInputChange('internship', e.target.checked)}
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