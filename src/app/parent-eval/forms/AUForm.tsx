'use client';

import React from 'react';

/**
 * AUForm - 澳大利亚家长评估问卷（10题）
 * 本组件仅负责渲染与收集澳洲所需字段，并通过 onChange 下发到父组件。
 * 字段命名严格对应后端 au_evaluation 逻辑：
 * - academic_band, interests[], budget_usd, wil_preference,
 * - go8_preference, psw_importance, english_readiness,
 * - city_preferences[], intl_community_importance,
 * - hard_english_required_exclude (bool), hard_budget_must_within (bool)
 */

export interface AUFormData {
  academic_band: string;
  interests: string[];
  budget_usd: number;
  wil_preference: string;
  go8_preference: string;
  psw_importance: string;
  english_readiness: string;
  city_preferences: string[];
  intl_community_importance: string;
  hard_english_required_exclude: boolean;
  hard_budget_must_within: boolean;
}

export function AUForm({ value, onChange }: { value: AUFormData; onChange: (v: Partial<AUFormData>) => void }) {
  // 简单兴趣库（可与现有映射一致）
  const interestOptions = ['CS', 'AI', 'Engineering', 'Business', 'Economics', 'Design'];
  const cityOptions = ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', '不限'];

  const toggleInArray = (field: keyof AUFormData, item: string) => {
    const arr = (value[field] as string[]) || [];
    if (arr.includes(item)) {
      onChange({ [field]: arr.filter((x) => x !== item) } as Partial<AUFormData>);
    } else {
      onChange({ [field]: [...arr, item] } as Partial<AUFormData>);
    }
  };

  return (
    <div className="space-y-6">
      {/* Q1 学术水平 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">学术水平</label>
        <select
          value={value.academic_band}
          onChange={(e) => onChange({ academic_band: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">请选择</option>
          <option value="3.9+">3.9+</option>
          <option value="3.8+">3.8+</option>
          <option value="3.6+">3.6+</option>
          <option value="3.6-">3.6-</option>
        </select>
      </div>

      {/* Q2 专业兴趣（多选） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">专业兴趣（多选）</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map((it) => (
            <label key={it} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value.interests.includes(it)}
                onChange={() => toggleInArray('interests', it)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">{it}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Q3 预算（USD） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">年度预算（USD）</label>
        <input
          type="number"
          min={0}
          value={value.budget_usd || 0}
          onChange={(e) => onChange({ budget_usd: parseInt(e.target.value || '0', 10) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="例如 30000"
        />
        <label className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={value.hard_budget_must_within}
            onChange={(e) => onChange({ hard_budget_must_within: e.target.checked })}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-700">必须 ≤ 预算（超出直接排除）</span>
        </label>
      </div>

      {/* Q4 WIL 取向 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">WIL（带薪实习/产业项目）</label>
        <select
          value={value.wil_preference}
          onChange={(e) => onChange({ wil_preference: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">请选择</option>
          <option value="必须">必须</option>
          <option value="加分">加分</option>
          <option value="不重要">不重要</option>
        </select>
      </div>

      {/* Q5 Go8 偏好 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Go8 偏好</label>
        <select
          value={value.go8_preference}
          onChange={(e) => onChange({ go8_preference: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">请选择</option>
          <option value="强">强</option>
          <option value="一般">一般</option>
          <option value="无">无</option>
        </select>
      </div>

      {/* Q6 城市偏好（多选或不限） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">目标城市（可多选/不限）</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cityOptions.map((it) => (
            <label key={it} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value.city_preferences.includes(it)}
                onChange={() => toggleInArray('city_preferences', it)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">{it}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Q7 PSW 重要性 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">毕业工签（PSW）重要性</label>
        <select
          value={value.psw_importance}
          onChange={(e) => onChange({ psw_importance: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">请选择</option>
          <option value="非常在意">非常在意</option>
          <option value="一般">一般</option>
          <option value="不在意">不在意</option>
        </select>
      </div>

      {/* Q8 英语可达成度 + 硬过滤开关 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">英语准备度（IELTS/TOEFL/PTE）</label>
        <select
          value={value.english_readiness}
          onChange={(e) => onChange({ english_readiness: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">请选择</option>
          <option value="已达标">已达标</option>
          <option value="3个月内可达">3个月内可达</option>
          <option value="需更长">需更长</option>
        </select>
        <label className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={value.hard_english_required_exclude}
            onChange={(e) => onChange({ hard_english_required_exclude: e.target.checked })}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-700">若短期无法提交且学校必须英语，直接排除</span>
        </label>
      </div>

      {/* Q9 国际生/华人社区 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">国际生/华人社区重要性</label>
        <select
          value={value.intl_community_importance}
          onChange={(e) => onChange({ intl_community_importance: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">请选择</option>
          <option value="重要">重要</option>
          <option value="一般">一般</option>
          <option value="不重要">不重要</option>
        </select>
      </div>

      {/* Q10 奖学金友好度 - 此项由父组件统一收集或此处扩展也可。此处维持9+硬过滤组合即可。*/}
    </div>
  );
}


