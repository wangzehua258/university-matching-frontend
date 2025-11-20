'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, GraduationCap, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { evaluationAPI } from '@/lib/api';
import { getAnonymousUserId } from '@/lib/useAnonymousUser';
import { AUForm, AUFormData } from '../forms/AUForm';
import { UKForm, UKFormData } from '../forms/UKForm';
import { SGForm, SGFormData } from '../forms/SGForm';

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
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  // AU/UK/SG 专用表单数据，单步提交（16题版本）
  const [auData, setAuData] = useState<AUFormData>({
    academic_band: '',
    interests: [],
    reputation_vs_value: '',
    budget_usd: 0,
    hard_budget_must_within: false,
    study_length_preference: '',
    intake_preference: '',
    wil_preference: '',
    psw_importance: '',
    city_preferences: [],
    intl_community_importance: '',
    english_readiness: '',
    accept_language_course: true,  // 默认接受语言班
    hard_english_required_exclude: false,
    go8_preference: '',
    scholarship_importance: '',
    career_focus: '',
    main_concern: '',
  });
  const [ukData, setUkData] = useState<UKFormData>({
    // A. 学术与志愿
    academic_band: '',
    interests: [],
    reputation_vs_value: '',
    // B. 费用与兜底
    budget_usd: 0,
    hard_budget_must_within: false,
    foundation_need: '',
    // C. UCAS路线与准备度
    ucas_route: '',
    oxbridge_must_cover: false,
    placement_year_pref: '',
    prep_level: '',
    // D. 学校类型与地区
    russell_pref: '',
    region_pref: '',
    intl_env_importance: '',
    // E. 节奏与确定性
    intake_preference: '',
    accept_foundation: true, // 默认接受
    budget_tolerance: '',
    main_concern: '',
  });
  const [sgData, setSgData] = useState<SGFormData>({
    // A. 学术与志愿
    academic_band: '',
    interests: [],
    reputation_vs_value: '',
    // B. 预算与TG
    budget_usd: 0,
    hard_budget_must_within: false,
    bond_acceptance: '',
    tg_must: false,
    hard_refuse_bond: false,
    // C. 培养方式与选拔要求
    orientation: '',
    interview_portfolio: '',
    hard_refuse_interview_or_portfolio: false,
    // D. 课程机会与安全
    want_double_degree: false,
    want_exchange: false,
    safety_importance: '',
    scholarship_importance: '',
    // E. 计算与把关
    budget_tolerance: '',
    main_concern: '',
  });
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

  // Lock country from query if provided
  useEffect(() => {
    const c = searchParams?.get('country') || '';
    if (c) {
      setFormData(prev => ({ ...prev, target_country: c }));
    } else {
      // 如果没有指定国家，默认是美国评估
      setFormData(prev => ({ ...prev, target_country: 'USA' }));
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = () => {
    const newErrors: {[key: string]: string} = {};
    const country = formData.target_country;
    
    // AU/UK/SG 使用单页表单，需要验证所有字段
    if (country === 'Australia') {
      if (!auData.academic_band) newErrors.academic_band = '请选择学术水平';
      if (auData.interests.length === 0) newErrors.interests = '请至少选择一个专业兴趣方向';
      if (!auData.reputation_vs_value) newErrors.reputation_vs_value = '请选择名气/性价比偏好';
      if (!auData.budget_usd || auData.budget_usd <= 0) newErrors.budget_usd = '请输入年度学费预算';
      if (!auData.study_length_preference) newErrors.study_length_preference = '请选择学制偏好';
      if (!auData.intake_preference) newErrors.intake_preference = '请选择入学时间偏好';
      if (!auData.wil_preference) newErrors.wil_preference = '请选择WIL需求';
      if (!auData.psw_importance) newErrors.psw_importance = '请选择PSW重要性';
      if (!auData.career_focus) newErrors.career_focus = '请选择就业口碑/带实习标签偏好';
      if (auData.city_preferences.length === 0) newErrors.city_preferences = '请至少选择一个意向城市';
      if (!auData.intl_community_importance) newErrors.intl_community_importance = '请选择国际社区重要性';
      if (!auData.english_readiness) newErrors.english_readiness = '请选择英语准备度';
      if (!auData.go8_preference) newErrors.go8_preference = '请选择Go8偏好';
      if (!auData.scholarship_importance) newErrors.scholarship_importance = '请选择奖学金重要性';
      if (!auData.main_concern) newErrors.main_concern = '请选择最担心的一点';
    } else if (country === 'United Kingdom') {
      if (!ukData.academic_band) newErrors.academic_band = '请选择学术水平';
      if (ukData.interests.length === 0) newErrors.interests = '请至少选择一个专业兴趣方向';
      if (!ukData.reputation_vs_value) newErrors.reputation_vs_value = '请选择名气/性价比偏好';
      if (!ukData.budget_usd || ukData.budget_usd <= 0) newErrors.budget_usd = '请输入年度学费预算';
      if (!ukData.foundation_need) newErrors.foundation_need = '请选择Foundation需求';
      if (!ukData.ucas_route) newErrors.ucas_route = '请选择UCAS路线';
      if (!ukData.placement_year_pref) newErrors.placement_year_pref = '请选择Placement Year偏好';
      if (!ukData.prep_level) newErrors.prep_level = '请选择材料/准备度';
      if (!ukData.russell_pref) newErrors.russell_pref = '请选择罗素集团偏好';
      if (!ukData.region_pref) newErrors.region_pref = '请选择地域偏好';
      if (!ukData.intl_env_importance) newErrors.intl_env_importance = '请选择国际环境重要性';
      if (!ukData.main_concern) newErrors.main_concern = '请选择最担心的一点';
    } else if (country === 'Singapore') {
      if (!sgData.academic_band) newErrors.academic_band = '请选择学术水平';
      if (sgData.interests.length === 0) newErrors.interests = '请至少选择一个专业兴趣方向';
      if (!sgData.reputation_vs_value) newErrors.reputation_vs_value = '请选择名气/性价比偏好';
      if (!sgData.budget_usd || sgData.budget_usd <= 0) newErrors.budget_usd = '请输入年度学费预算';
      if (!sgData.bond_acceptance) newErrors.bond_acceptance = '请选择TG/服务期接受度';
      if (!sgData.orientation) newErrors.orientation = '请选择培养导向';
      if (!sgData.interview_portfolio) newErrors.interview_portfolio = '请选择面试/作品集接受度';
      if (!sgData.safety_importance) newErrors.safety_importance = '请选择安全重要性';
      if (!sgData.scholarship_importance) newErrors.scholarship_importance = '请选择奖学金重要性';
      if (!sgData.main_concern) newErrors.main_concern = '请选择最担心的一点';
    } else {
      // 美国评估的多步表单验证
      if (currentStep === 1) {
        if (!formData.grade) newErrors.grade = '请选择年级';
        if (!formData.gpa_range) newErrors.gpa_range = '请选择GPA范围';
        if (formData.sat_score && parseInt(formData.sat_score) < 1350) {
          newErrors.sat_score = 'SAT分数不能低于1350分';
        }
        if (formData.activities.length < 2) {
          newErrors.activities = '请至少选择2项活动经历';
        }
      } else if (currentStep === 2) {
        if (formData.interest_fields.length < 3) {
          newErrors.interest_fields = '请至少选择3个兴趣方向';
        }
        if (!formData.school_type_preference) {
          newErrors.school_type_preference = '请选择学校类型偏好';
        }
      } else if (currentStep === 3) {
        if (!formData.budget) {
          newErrors.budget = '请选择预算范围';
        }
        if (!formData.family_expectation) {
          newErrors.family_expectation = '请选择家长期望';
        }
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
    // 先验证所有必填项
    if (!validateCurrentStep()) {
      // 滚动到顶部显示错误
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      setLoading(true);
      
      // 获取匿名用户ID
      const anonymousUserId = getAnonymousUserId();
      
      // 分国家提交
      const country = formData.target_country;
      let evaluationData: { user_id: string; input: Record<string, unknown> } | null = null;
      if (country === 'Australia') {
        evaluationData = {
          user_id: anonymousUserId,
          input: {
            target_country: 'Australia',
            // A. 学术与专业取向
            academic_band: auData.academic_band,
            interests: auData.interests,
            reputation_vs_value: auData.reputation_vs_value,
            // B. 费用与时间
            budget_usd: auData.budget_usd,
            hard_budget_must_within: auData.hard_budget_must_within,
            study_length_preference: auData.study_length_preference,
            intake_preference: auData.intake_preference,
            // C. 实习与就业
            wil_preference: auData.wil_preference,
            psw_importance: auData.psw_importance,
            career_focus: auData.career_focus,
            // D. 城市与社区
            city_preferences: auData.city_preferences,
            intl_community_importance: auData.intl_community_importance,
            // E. 英语与材料
            english_readiness: auData.english_readiness,
            accept_language_course: auData.accept_language_course,
            hard_english_required_exclude: auData.hard_english_required_exclude,
            // F. 学校类型与支持
            go8_preference: auData.go8_preference,
            scholarship_importance: auData.scholarship_importance,
            // G. 期望与顾虑
            main_concern: auData.main_concern,
          }
        };
      } else if (country === 'United Kingdom') {
        evaluationData = {
          user_id: anonymousUserId,
          input: {
            target_country: 'United Kingdom',
            // A. 学术与志愿 (Q1-Q3)
            academic_band: ukData.academic_band,
            interests: ukData.interests,
            reputation_vs_value: ukData.reputation_vs_value, // Q3: 权重调节
            // B. 费用与兜底 (Q4-Q5)
            budget_usd: ukData.budget_usd,
            hard_budget_must_within: ukData.hard_budget_must_within,
            foundation_need: ukData.foundation_need,
            // C. UCAS路线与准备度 (Q6-Q8)
            ucas_route: ukData.ucas_route,
            oxbridge_must_cover: ukData.oxbridge_must_cover,
            placement_year_pref: ukData.placement_year_pref,
            prep_level: ukData.prep_level,
            // D. 学校类型与地区 (Q9-Q11)
            russell_pref: ukData.russell_pref,
            region_pref: ukData.region_pref,
            intl_env_importance: ukData.intl_env_importance,
            // E. 节奏与确定性 (Q12-Q15)
            intake_preference: ukData.intake_preference, // Q12: 入学批次（小加分）
            accept_foundation: ukData.accept_foundation, // Q13: 接受预科路线
            budget_tolerance: ukData.budget_tolerance, // Q14: 预算容忍度
            main_concern: ukData.main_concern, // Q15: 最担心点
          }
        };
      } else if (country === 'Singapore') {
        evaluationData = {
          user_id: anonymousUserId,
          input: {
            target_country: 'Singapore',
            // A. 学术与志愿 (Q1-Q3)
            academic_band: sgData.academic_band,
            interests: sgData.interests,
            reputation_vs_value: sgData.reputation_vs_value, // Q3: 权重调节
            // B. 预算与TG (Q4-Q7)
            budget_usd: sgData.budget_usd,
            hard_budget_must_within: sgData.hard_budget_must_within,
            bond_acceptance: sgData.bond_acceptance, // Q5: TG/服务期接受度
            tg_must: sgData.tg_must, // Q6: 必须可申请TG
            hard_refuse_bond: sgData.hard_refuse_bond, // Q7: 严格拒绝服务期
            // C. 培养方式与选拔要求 (Q8-Q10)
            orientation: sgData.orientation, // Q8: 培养导向
            interview_portfolio: sgData.interview_portfolio, // Q9: 面试/作品集接受度
            hard_refuse_interview_or_portfolio: sgData.hard_refuse_interview_or_portfolio, // Q10: 严格拒绝
            // D. 课程机会与安全 (Q11-Q13)
            want_double_degree: sgData.want_double_degree, // Q11: 双学位机会
            want_exchange: sgData.want_exchange, // Q12: 交换机会
            safety_importance: sgData.safety_importance, // Q13: 安全重要性
            scholarship_importance: sgData.scholarship_importance, // Q10: 奖学金友好度
            // E. 计算与把关 (Q14-Q15)
            budget_tolerance: sgData.budget_tolerance, // Q14: 预算容忍度
            main_concern: sgData.main_concern, // Q15: 最担心点
          }
        };
      } else {
        // 默认美国旧表单
        evaluationData = {
          user_id: anonymousUserId,
          input: {
            grade: formData.grade,
            gpa_range: formData.gpa_range,
            sat_score: formData.sat_score ? parseInt(formData.sat_score) : null,
            activities: formData.activities,
            interest_fields: formData.interest_fields,
            target_country: formData.target_country || 'USA',
            school_type_preference: formData.school_type_preference,
            reputation_important: formData.reputation_important,
            budget: formData.budget,
            family_expectation: formData.family_expectation,
            internship_important: formData.internship_important,
          }
        };
      }

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
      {/* A. 学生基本信息 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">A</span>
          学生基本信息
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              年级
            </label>
            <select
              value={formData.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className={`w-full px-3 py-2 border rounded-md ${
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
              className={`w-full px-3 py-2 border rounded-md ${
                errors.sat_score ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例如: 1450"
            />
            {errors.sat_score && (
              <p className="mt-1 text-sm text-red-600">{errors.sat_score}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            活动经历 (可多选，最少选择2个)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['学术竞赛', '科研', '学生会', '社团活动', '志愿服务', '实习经历', '职业规划', '创业经历', '推荐信准备', '社区服务'].map((activity) => (
              <label key={activity} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* B. 兴趣偏好 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">B</span>
          兴趣偏好
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            兴趣方向 (可多选，最少选择3个)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-md">
            {['计算机科学', '公共政策', '经济学', '社会科学', '工程学', '物理学', '化学', '商科', '心理学', '艺术设计', '生物学', '创业', '人文社科', '医药学', '国际关系', '政治学', '农学', '自然科学', '教育学', '法学'].map((field) => (
              <label key={field} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
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
          <p className="text-xs text-gray-500 mt-2">已选择 {formData.interest_fields.length} 个兴趣方向</p>
          {errors.interest_fields && (
            <p className="mt-1 text-sm text-red-600">{errors.interest_fields}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学校类型偏好
          </label>
          <select
            value={formData.school_type_preference}
            onChange={(e) => handleInputChange('school_type_preference', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* C. 家庭取向 */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">C</span>
          家庭取向
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            家长期望
          </label>
          <select
            value={formData.family_expectation}
            onChange={(e) => handleInputChange('family_expectation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择期望</option>
            <option value="就业导向">希望孩子有明确的职业规划</option>
            <option value="探索导向">希望孩子能探索不同领域</option>
            <option value="学术导向">希望孩子专注学术研究</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            预算范围 (年)
          </label>
          <select
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
    </div>
  );

  const renderCurrentStep = () => {
    const c = formData.target_country;
    // AU/UK/SG 走单页问卷
    if (c === 'Australia') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">澳大利亚家长评估（16题）</h2>
          <AUForm value={auData} onChange={(v) => setAuData((prev) => ({ ...prev, ...v }))} />
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">请完成以下必填项：</p>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {Object.values(errors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={submitEvaluation} disabled={loading} className={`px-6 py-2 rounded-md font-medium ${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>提交评估</button>
          </div>
        </div>
      );
    }
    if (c === 'United Kingdom') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">英国家长评估（15题）</h2>
          <UKForm value={ukData} onChange={(v) => setUkData((prev) => ({ ...prev, ...v }))} />
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">请完成以下必填项：</p>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {Object.values(errors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={submitEvaluation} disabled={loading} className={`px-6 py-2 rounded-md font-medium ${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>提交评估</button>
          </div>
        </div>
      );
    }
    if (c === 'Singapore') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">新加坡家长评估（15题）</h2>
          <SGForm value={sgData} onChange={(v) => setSgData((prev) => ({ ...prev, ...v }))} />
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">请完成以下必填项：</p>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {Object.values(errors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={submitEvaluation} disabled={loading} className={`px-6 py-2 rounded-md font-medium ${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>提交评估</button>
          </div>
        </div>
      );
    }
    // 美国版：单页表单，合并所有步骤
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">美国家长评估</h2>
        {renderStep1()}
        {renderStep2()}
        {renderStep3()}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">请完成以下必填项：</p>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {Object.values(errors).map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end">
          <button onClick={submitEvaluation} disabled={loading} className={`px-6 py-2 rounded-md font-medium ${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>提交评估</button>
        </div>
      </div>
    );
  };

  // 获取当前国家名称用于显示
  const countryName = searchParams?.get('country') === 'Australia' ? '澳大利亚' :
                      searchParams?.get('country') === 'United Kingdom' ? '英国' :
                      searchParams?.get('country') === 'Singapore' ? '新加坡' :
                      searchParams?.get('country') === 'USA' ? '美国' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                全球大学智能匹配系统
              </h1>
            </div>
            <Link
              href="/parent-eval/select"
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回选择
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {countryName ? `${countryName}家长版评估` : '家长版个性化择校评估'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {countryName ? `请根据实际情况填写以下信息，我们将为您生成个性化的${countryName}大学推荐报告` : '请填写以下信息，我们将为您生成个性化的择校建议'}
          </p>
        </div>


        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 填写提示</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 请根据实际情况如实填写，这样我们才能为您提供最准确的推荐</li>
            <li>• 如果不确定某些信息，可以先填写大概范围，系统会根据您的选择进行调整</li>
            <li>• 所有信息仅用于评估，我们严格保护您的隐私安全</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function ParentEvalStartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <ParentEvalStart />
    </Suspense>
  );
} 