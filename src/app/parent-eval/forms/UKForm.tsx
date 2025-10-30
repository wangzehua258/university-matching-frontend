'use client';

import React from 'react';

/**
 * UKForm - 英国家长评估问卷（10题 + 若干硬过滤开关）
 * 字段命名严格对应后端 uk_evaluation 逻辑：
 * - academic_band, interests[], budget_usd,
 * - ucas_route, foundation_need, placement_year_pref,
 * - russell_pref, prep_level, region_pref, intl_env_importance,
 * - hard_budget_must_within (bool), oxbridge_must_cover (bool)
 */

export interface UKFormData {
  academic_band: string;
  interests: string[];
  budget_usd: number;
  ucas_route: string;
  foundation_need: string;
  placement_year_pref: string;
  russell_pref: string;
  prep_level: string;
  region_pref: string;
  intl_env_importance: string;
  hard_budget_must_within: boolean;
  oxbridge_must_cover: boolean;
}

export function UKForm({ value, onChange }: { value: UKFormData; onChange: (v: Partial<UKFormData>) => void }) {
  const interestOptions = ['CS', 'AI', 'Engineering', 'Business', 'Economics', 'Design'];
  const regions = ['London', 'England', 'Scotland', 'Wales', 'Northern Ireland', '不限'];

  const toggle = (field: keyof UKFormData, item: string) => {
    const arr = (value[field] as string[]) || [];
    if (arr.includes(item)) onChange({ [field]: arr.filter((x) => x !== item) } as Partial<UKFormData>);
    else onChange({ [field]: [...arr, item] } as Partial<UKFormData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">学术水平</label>
        <select value={value.academic_band} onChange={(e) => onChange({ academic_band: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="3.9+">3.9+</option>
          <option value="3.8+">3.8+</option>
          <option value="3.6+">3.6+</option>
          <option value="3.6-">3.6-</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">专业兴趣（多选）</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map((it) => (
            <label key={it} className="flex items-center space-x-2">
              <input type="checkbox" checked={value.interests.includes(it)} onChange={() => toggle('interests', it)} className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">{it}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">年度预算（USD）</label>
        <input type="number" min={0} value={value.budget_usd || 0} onChange={(e) => onChange({ budget_usd: parseInt(e.target.value || '0', 10) })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <label className="flex items-center space-x-2 mt-2">
          <input type="checkbox" checked={value.hard_budget_must_within} onChange={(e) => onChange({ hard_budget_must_within: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
          <span className="text-sm text-gray-700">必须 ≤ 预算（超出直接排除）</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">UCAS 路线</label>
        <select value={value.ucas_route} onChange={(e) => onChange({ ucas_route: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="Oxbridge/医学类">Oxbridge/医学类（10/15）</option>
          <option value="常规路线">常规路线（1/31）</option>
          <option value="不确定">不确定</option>
        </select>
        <label className="flex items-center space-x-2 mt-2">
          <input type="checkbox" checked={value.oxbridge_must_cover} onChange={(e) => onChange({ oxbridge_must_cover: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
          <span className="text-sm text-gray-700">必须覆盖 Oxbridge/Med（10/15）</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Foundation/国际大一兜底</label>
        <select value={value.foundation_need} onChange={(e) => onChange({ foundation_need: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="必须">必须</option>
          <option value="可选">可选</option>
          <option value="不需要">不需要</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Placement Year 偏好</label>
        <select value={value.placement_year_pref} onChange={(e) => onChange({ placement_year_pref: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="必须">必须</option>
          <option value="加分">加分</option>
          <option value="不重要">不重要</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">罗素集团偏好</label>
        <select value={value.russell_pref} onChange={(e) => onChange({ russell_pref: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="强">强</option>
          <option value="中">中</option>
          <option value="弱">弱</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">材料/准备度（PS/拓展/入学测试）</label>
        <select value={value.prep_level} onChange={(e) => onChange({ prep_level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">地域偏好</label>
        <select value={value.region_pref} onChange={(e) => onChange({ region_pref: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">国际支持/环境</label>
        <select value={value.intl_env_importance} onChange={(e) => onChange({ intl_env_importance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="重要">重要</option>
          <option value="一般">一般</option>
          <option value="不重要">不重要</option>
        </select>
      </div>
    </div>
  );
}


