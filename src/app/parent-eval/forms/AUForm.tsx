'use client';

import React from 'react';

/**
 * AUForm - 澳大利亚家长评估问卷（16题版本）
 * 完全按照新规范实现，包含所有16题和权重调节字段
 */

export interface AUFormData {
  // A. 学术与专业取向
  academic_band: string;  // Q1: 学术水平
  interests: string[];  // Q2: 专业兴趣（多选）
  reputation_vs_value: string;  // Q3: 名气/性价比（权重调节，不单独计分）
  
  // B. 费用与时间
  budget_usd: number;  // Q4: 年度学费预算
  hard_budget_must_within: boolean;  // Q4: 必须不超预算开关
  study_length_preference: string;  // Q11: 学制偏好
  intake_preference: string;  // Q12: 入学时间偏好
  
  // C. 实习与就业
  wil_preference: string;  // Q5: WIL需求
  psw_importance: string;  // Q8: PSW重要性
  career_focus: string;  // Q15: 就业口碑/带实习标签（权重调节）
  
  // D. 城市与社区
  city_preferences: string[];  // Q9: 意向城市
  intl_community_importance: string;  // Q10: 国际社区重要性
  
  // E. 英语与材料
  english_readiness: string;  // Q13: 英语准备度
  accept_language_course: boolean;  // Q14: 是否接受语言/过渡课（反向：不接受则开启hard_english_required_exclude）
  hard_english_required_exclude: boolean;  // Q14反向：不接受语言班则排除需英语学校
  
  // F. 学校类型与支持
  go8_preference: string;  // Q6: Go8偏好
  scholarship_importance: string;  // Q7: 奖学金重要性
  
  // G. 期望与顾虑
  main_concern: string;  // Q16: 最担心点（用于解释排序，不单独计分）
}

export function AUForm({ value, onChange }: { value: AUFormData; onChange: (v: Partial<AUFormData>) => void }) {
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
      {/* A. 学术与专业取向 */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">A. 学术与专业取向</h3>
        
        {/* Q1 学术水平 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            孩子学术水平大致在哪一档？
          </label>
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
          <p className="text-xs text-gray-500 mt-1">用作目标学校层级参考，不等于硬门槛</p>
        </div>

        {/* Q2 专业兴趣（多选） */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            感兴趣的专业方向（可多选）
          </label>
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

        {/* Q3 名气/性价比（权重调节） */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            更看重"名校名气"还是"综合性价比"？
          </label>
          <select
            value={value.reputation_vs_value}
            onChange={(e) => onChange({ reputation_vs_value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="名气优先">名气优先</option>
            <option value="均衡">均衡</option>
            <option value="性价比优先">性价比优先</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">用于调节排名得分的权重，不单独计分</p>
        </div>
      </div>

      {/* B. 费用与时间 */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">B. 费用与时间</h3>
        
        {/* Q4 预算 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            年度学费预算（USD）
          </label>
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
            <span className="text-sm text-gray-700">✅ 必须不超预算（超出直接排除）</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">本工具用的是学费预算；住宿/生活/保险费用会因城市不同而变化，建议另行预留。</p>
        </div>

        {/* Q11 学制偏好 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学习时长偏好
          </label>
          <select
            value={value.study_length_preference}
            onChange={(e) => onChange({ study_length_preference: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="越短越好">越短越好</option>
            <option value="可接受标准学制">可接受标准学制</option>
            <option value="不在意">不在意</option>
          </select>
        </div>

        {/* Q12 入学时间 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            计划入学时间
          </label>
          <select
            value={value.intake_preference}
            onChange={(e) => onChange({ intake_preference: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="越快越好（6–12个月内）">越快越好（6–12个月内）</option>
            <option value="1–2年内">1–2年内</option>
            <option value="不确定">不确定</option>
          </select>
        </div>
      </div>

      {/* C. 实习与就业 */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">C. 实习与就业</h3>
        
        {/* Q5 WIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            是否需要"带实习/产业项目（WIL）"？
          </label>
          <select
            value={value.wil_preference}
            onChange={(e) => onChange({ wil_preference: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="必须">必须</option>
            <option value="加分">加分项</option>
            <option value="不重要">不重要</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">WIL 是课程里安排企业项目或实习机会，但不等于保证拿到长期工作；好的院系和主动准备会提高成功率。</p>
        </div>

        {/* Q8 PSW */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            对毕业后工签（PSW）年限的重视程度？
          </label>
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
          <p className="text-xs text-gray-500 mt-1">PSW 是毕业后在澳洲可合法工作的年限，通常 2–4 年，不同学校/城市会有差异。</p>
        </div>

        {/* Q15 就业口碑/带实习标签（权重调节） */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            更看重"学校整体就业口碑"还是"明确的带实习标签"？
          </label>
          <select
            value={value.career_focus}
            onChange={(e) => onChange({ career_focus: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="就业口碑">就业口碑（placement数据/校友网络）</option>
            <option value="带实习标签">带实习标签（WIL）</option>
            <option value="均衡">均衡</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">用于细化WIL内部配重，不单独计分</p>
        </div>
      </div>

      {/* D. 城市与社区 */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">D. 城市与社区</h3>
        
        {/* Q9 城市偏好 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            意向城市（可多选/不限）
          </label>
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

        {/* Q10 国际社区 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            国际生/华人社区氛围重要吗？
          </label>
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
      </div>

      {/* E. 英语与材料 */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">E. 英语与材料</h3>
        
        {/* Q13 英语准备度 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            英语准备度（雅思/托福/PTE）
          </label>
          <select
            value={value.english_readiness}
            onChange={(e) => onChange({ english_readiness: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="已达标">已达标</option>
            <option value="3个月内可达">3个月内可达</option>
            <option value="需更长">需要更长时间</option>
          </select>
        </div>

        {/* Q14 是否接受语言/过渡课 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ✅ 若短期达不到英语分数，是否接受"先读语言/过渡课程再入学"方案？
          </label>
          <select
            value={value.accept_language_course ? 'accept' : 'reject'}
            onChange={(e) => {
              const accept = e.target.value === 'accept';
              onChange({
                accept_language_course: accept,
                hard_english_required_exclude: !accept  // 反向：不接受则开启排除
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="accept">接受</option>
            <option value="reject">不接受</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">大部分学校允许先读语言课程或过渡课程再入学；如你希望尽快入学可考虑这一方案。</p>
        </div>
      </div>

      {/* F. 学校类型与支持 */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">F. 学校类型与支持</h3>
        
        {/* Q6 Go8 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            是否偏好澳八校（Go8）？
          </label>
          <select
            value={value.go8_preference}
            onChange={(e) => onChange({ go8_preference: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="强烈偏好">强烈偏好</option>
            <option value="可以考虑">可以考虑</option>
            <option value="没有明确偏好">没有明确偏好</option>
          </select>
        </div>

        {/* Q7 奖学金 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            是否希望学校提供官方奖学金选项？
          </label>
          <select
            value={value.scholarship_importance}
            onChange={(e) => onChange({ scholarship_importance: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="很重要">很重要</option>
            <option value="一般">一般</option>
            <option value="不重要">不重要</option>
          </select>
        </div>
      </div>

      {/* G. 期望与顾虑 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">G. 期望与顾虑</h3>
        
        {/* Q16 最担心点（用于解释排序，不单独计分） */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            你最担心的一点是？
          </label>
          <select
            value={value.main_concern}
            onChange={(e) => onChange({ main_concern: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="超预算">超预算</option>
            <option value="英语来不及">英语来不及</option>
            <option value="没有实习机会">没有实习机会</option>
            <option value="毕业工签太短">毕业工签太短</option>
            <option value="城市不喜欢">城市不喜欢</option>
            <option value="我也不确定">我也不确定</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">用于解释层排序和结果页提示，不单独计分</p>
        </div>
      </div>
    </div>
  );
}
