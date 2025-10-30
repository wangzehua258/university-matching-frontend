'use client';

import React from 'react';

/**
 * SGForm - 新加坡家长评估问卷（10题 + 若干硬过滤）
 * 对应后端 sg_evaluation 字段：
 * - academic_band, interests[], budget_usd,
 * - orientation, bond_acceptance, interview_portfolio,
 * - want_double_degree (bool), want_exchange (bool),
 * - safety_importance, scholarship_importance,
 * - hard_budget_must_within (bool), tg_must (bool),
 * - hard_refuse_bond (bool), hard_refuse_interview_or_portfolio (bool)
 */

export interface SGFormData {
  academic_band: string;
  interests: string[];
  budget_usd: number;
  orientation: string;
  bond_acceptance: string;
  interview_portfolio: string;
  want_double_degree: boolean;
  want_exchange: boolean;
  safety_importance: string;
  scholarship_importance: string;
  hard_budget_must_within: boolean;
  tg_must: boolean;
  hard_refuse_bond: boolean;
  hard_refuse_interview_or_portfolio: boolean;
}

export function SGForm({ value, onChange }: { value: SGFormData; onChange: (v: Partial<SGFormData>) => void }) {
  const interestOptions = ['CS', 'AI', 'Engineering', 'Business', 'Economics', 'Design'];

  const toggle = (field: keyof SGFormData, item: string) => {
    const arr = (value[field] as string[]) || [];
    if (arr.includes(item)) onChange({ [field]: arr.filter((x) => x !== item) } as Partial<SGFormData>);
    else onChange({ [field]: [...arr, item] } as Partial<SGFormData>);
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
          {['CS','AI','Engineering','Business','Economics','Design'].map((it) => (
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
        <label className="block text-sm font-medium text-gray-700 mb-2">培养导向</label>
        <select value={value.orientation} onChange={(e) => onChange({ orientation: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="产业">产业</option>
          <option value="研究">研究</option>
          <option value="均衡">均衡</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">TG/服务期接受度</label>
        <select value={value.bond_acceptance} onChange={(e) => onChange({ bond_acceptance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="接受">接受</option>
          <option value="希望避免">希望避免</option>
          <option value="无所谓">无所谓</option>
        </select>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={value.tg_must} onChange={(e) => onChange({ tg_must: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-700">必须可申请 TG（硬过滤）</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={value.hard_refuse_bond} onChange={(e) => onChange({ hard_refuse_bond: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-700">严格拒绝服务期（硬过滤）</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">是否接受面试/作品集</label>
        <select value={value.interview_portfolio} onChange={(e) => onChange({ interview_portfolio: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="愿意">愿意</option>
          <option value="一般">一般</option>
          <option value="不愿">不愿</option>
        </select>
        <label className="flex items-center space-x-2 mt-2">
          <input type="checkbox" checked={value.hard_refuse_interview_or_portfolio} onChange={(e) => onChange({ hard_refuse_interview_or_portfolio: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
          <span className="text-sm text-gray-700">严格拒绝面试/作品集（硬过滤）</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">双学位/跨学科</label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={value.want_double_degree} onChange={(e) => onChange({ want_double_degree: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
          <span className="text-sm text-gray-700">希望有双学位/跨学科机会</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">交换/海外机会</label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={value.want_exchange} onChange={(e) => onChange({ want_exchange: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
          <span className="text-sm text-gray-700">希望有丰富交换/海外机会</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">安全/舒适度</label>
        <select value={value.safety_importance} onChange={(e) => onChange({ safety_importance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="重要">重要</option>
          <option value="一般">一般</option>
          <option value="不重要">不重要</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">奖学金友好度</label>
        <select value={value.scholarship_importance} onChange={(e) => onChange({ scholarship_importance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">请选择</option>
          <option value="重要">重要</option>
          <option value="一般">一般</option>
          <option value="不重要">不重要</option>
        </select>
      </div>
    </div>
  );
}


