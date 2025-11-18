'use client';

import React from 'react';

/**
 * UKForm - 英国家长评估问卷（16题版本）
 * 严格按照用户提供的规范实现所有题目
 */

export interface UKFormData {
  // A. 学术与志愿
  academic_band: string; // Q1: 学术水平
  interests: string[]; // Q2: 专业兴趣（多选）
  reputation_vs_value: string; // Q3: 名气/性价比（权重调节，不单独计分）
  
  // B. 费用与兜底
  budget_usd: number; // Q4: 年度学费预算
  hard_budget_must_within: boolean; // Q4: 必须≤预算
  foundation_need: string; // Q5: Foundation/国际大一兜底
  
  // C. UCAS路线与准备度
  ucas_route: string; // Q6: UCAS路线
  oxbridge_must_cover: boolean; // Q6: 是否必须覆盖Oxbridge/Med
  placement_year_pref: string; // Q7: Placement Year偏好
  prep_level: string; // Q8: 材料/准备度（PS/拓展/入学测试）
  
  // D. 学校类型与地区
  russell_pref: string; // Q9: 罗素集团偏好
  region_pref: string; // Q10: 地域偏好
  intl_env_importance: string; // Q11: 国际学生/中文环境重要性
  
  // E. 节奏与确定性
  intake_preference: string; // Q12: 入学批次（不单独计分，小加分）
  accept_foundation: boolean; // Q13: 接受预科路线（不单独计分）
  budget_tolerance: string; // Q14: 预算容忍度（0%/10%/20%，不单独计分）
  main_concern: string; // Q15: 最担心的一点（不单独计分）
}

export function UKForm({ value, onChange }: { value: UKFormData; onChange: (v: Partial<UKFormData>) => void }) {
  const interestOptions = ['CS', 'AI', 'Engineering', 'Business', 'Economics', 'Design', 'Medicine', 'Law', 'Arts'];
  const regions = ['London', 'England', 'Scotland', 'Wales', 'Northern Ireland', '不限'];

  const toggleInterest = (item: string) => {
    const arr = value.interests || [];
    if (arr.includes(item)) {
      onChange({ interests: arr.filter((x) => x !== item) });
    } else {
      onChange({ interests: [...arr, item] });
    }
  };

  return (
    <div className="space-y-6">
      {/* A. 学术与志愿 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">A</span>
          学术与志愿
        </h3>
        
        {/* Q1: 学术水平 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1. 孩子学术水平大致在哪一档？
            <span className="text-xs text-gray-500 ml-2">（只是参考目标层级，不是硬门槛）</span>
          </label>
          <select
            value={value.academic_band || ''}
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

        {/* Q2: 专业兴趣 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">2. 感兴趣的专业方向（多选）</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((it) => (
              <label key={it} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(value.interests || []).includes(it)}
                  onChange={() => toggleInterest(it)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">{it}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q3: 名气/性价比 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            3. 更看重&ldquo;名校名气&rdquo;还是&ldquo;综合性价比&rdquo;？
            <span className="text-xs text-gray-500 ml-2">（用于权重调节，不单独计分）</span>
          </label>
          <select
            value={value.reputation_vs_value || ''}
            onChange={(e) => onChange({ reputation_vs_value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="名气优先">名气优先</option>
            <option value="均衡">均衡</option>
            <option value="性价比优先">性价比优先</option>
          </select>
        </div>
      </div>

      {/* B. 费用与兜底 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">B</span>
          费用与兜底
        </h3>
        
        {/* Q4: 预算 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            4. 年度学费预算（USD） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={value.budget_usd || ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange({ budget_usd: val === '' ? 0 : parseInt(val, 10) });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="例如 30000"
            required
          />
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={value.hard_budget_must_within || false}
              onChange={(e) => onChange({ hard_budget_must_within: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">✅ 必须≤预算（超出就排除）</span>
          </label>
        </div>

        {/* Q5: Foundation */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            5. 是否需要&ldquo;有 Foundation/国际大一兜底&rdquo;方案？
            <span className="text-xs text-gray-500 ml-2">（成绩或科目不够可先读预科/国际大一再衔接）</span>
          </label>
          <select
            value={value.foundation_need || ''}
            onChange={(e) => onChange({ foundation_need: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="必须">必须</option>
            <option value="可选">可选</option>
            <option value="不需要">不需要</option>
          </select>
        </div>
      </div>

      {/* C. UCAS路线与准备度 */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">C</span>
          UCAS路线与准备度
        </h3>
        
        {/* Q6: UCAS路线 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">6. UCAS 路线</label>
          <select
            value={value.ucas_route || ''}
            onChange={(e) => onChange({ ucas_route: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="Oxbridge/医学类">Oxbridge/医学类（10/15）</option>
            <option value="常规路线">常规路线（1/31）</option>
            <option value="不确定">不确定</option>
          </select>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={value.oxbridge_must_cover || false}
              onChange={(e) => onChange({ oxbridge_must_cover: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">✅ 是否必须覆盖 Oxbridge/医学类（只要保留这类学校）</span>
          </label>
        </div>

        {/* Q7: Placement Year */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            7. 是否偏好&ldquo;带实习/夹心年（Placement Year）&rdquo;？
            <span className="text-xs text-gray-500 ml-2">（第3年去企业，学制通常多 1 年）</span>
          </label>
          <select
            value={value.placement_year_pref || ''}
            onChange={(e) => onChange({ placement_year_pref: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="必须">必须</option>
            <option value="加分">加分</option>
            <option value="不重要">不重要</option>
          </select>
        </div>

        {/* Q8: 材料准备度 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            8. 材料/准备度（个人陈述/学术拓展/入学测试总体）
          </label>
          <select
            value={value.prep_level || ''}
            onChange={(e) => onChange({ prep_level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
        </div>
      </div>

      {/* D. 学校类型与地区 */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">D</span>
          学校类型与地区
        </h3>
        
        {/* Q9: 罗素集团 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">9. 罗素集团偏好（英国名校联盟）</label>
          <select
            value={value.russell_pref || ''}
            onChange={(e) => onChange({ russell_pref: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="强">强</option>
            <option value="中">中</option>
            <option value="弱">弱</option>
          </select>
        </div>

        {/* Q10: 地域偏好 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">10. 地域偏好</label>
          <select
            value={value.region_pref || ''}
            onChange={(e) => onChange({ region_pref: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Q11: 国际环境 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            11. 国际学生/中文环境是否重要？
            <span className="text-xs text-gray-500 ml-2">（比例高，适应更容易，但语言沉浸可能下降）</span>
          </label>
          <select
            value={value.intl_env_importance || ''}
            onChange={(e) => onChange({ intl_env_importance: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="重要">重要</option>
            <option value="一般">一般</option>
            <option value="不重要">不重要</option>
          </select>
        </div>
      </div>

      {/* E. 节奏与确定性 */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">E</span>
          节奏与确定性
        </h3>
        
        {/* Q12: 入学批次 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            12. 入学批次
            <span className="text-xs text-gray-500 ml-2">（不单独计分，用于小加分）</span>
          </label>
          <select
            value={value.intake_preference || ''}
            onChange={(e) => onChange({ intake_preference: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="尽快（下6–12个月）">尽快（下6–12个月）</option>
            <option value="1–2年内">1–2年内</option>
            <option value="不确定">不确定</option>
          </select>
        </div>

        {/* Q13: 接受预科路线 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            13. 接受&ldquo;先读预科/国际大一再衔接本科&rdquo;的路线吗？
            <span className="text-xs text-gray-500 ml-2">（与题5呼应，避免硬拒后结果为空）</span>
          </label>
          <select
            value={value.accept_foundation ? '是' : (value.accept_foundation === false ? '否' : '')}
            onChange={(e) => onChange({ accept_foundation: e.target.value === '是' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="是">接受</option>
            <option value="否">不接受</option>
          </select>
        </div>

        {/* Q14: 预算容忍度 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            14. 对&ldquo;费用超预算但显著更好选择&rdquo;的容忍度？
            <span className="text-xs text-gray-500 ml-2">（用于回退时预算放宽额度）</span>
          </label>
          <select
            value={value.budget_tolerance || ''}
            onChange={(e) => onChange({ budget_tolerance: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="0%">0%</option>
            <option value="10%">10%</option>
            <option value="20%">20%</option>
          </select>
        </div>

        {/* Q15: 最担心点 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            15. 你最担心的一点是？
            <span className="text-xs text-gray-500 ml-2">（不直接计分，用于解释排序和回退优先级）</span>
          </label>
          <select
            value={value.main_concern || ''}
            onChange={(e) => onChange({ main_concern: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="超预算">超预算</option>
            <option value="材料准备不足">材料准备不足</option>
            <option value="没有实习机会">没有实习机会</option>
            <option value="地区不喜欢">地区不喜欢</option>
            <option value="不确定">不确定</option>
          </select>
        </div>
      </div>
    </div>
  );
}
