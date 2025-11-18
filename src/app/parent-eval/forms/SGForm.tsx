'use client';

import React from 'react';

/**
 * SGForm - 新加坡家长评估问卷（15题版本）
 * 严格按照用户提供的规范实现所有题目
 */

export interface SGFormData {
  // A. 学术与志愿
  academic_band: string; // Q1: 学术水平
  interests: string[]; // Q2: 专业兴趣（多选）
  reputation_vs_value: string; // Q3: 名气/性价比（权重调节，不单独计分）
  
  // B. 预算与TG
  budget_usd: number; // Q4: 年度学费预算
  hard_budget_must_within: boolean; // Q4: 必须≤预算
  bond_acceptance: string; // Q5: TG/服务期接受度（愿意/不愿意/视学费而定）
  tg_must: boolean; // Q6: 必须可申请TG（硬过滤）
  hard_refuse_bond: boolean; // Q7: 严格拒绝服务期（硬过滤）
  
  // C. 培养方式与选拔要求
  orientation: string; // Q8: 培养导向（产业/研究/均衡）
  interview_portfolio: string; // Q9: 是否接受面试/作品集（愿意/一般/不愿）
  hard_refuse_interview_or_portfolio: boolean; // Q10: 严格拒绝面试/作品集（硬过滤）
  
  // D. 课程机会与安全
  want_double_degree: boolean; // Q11: 希望有双学位/跨学科机会
  want_exchange: boolean; // Q12: 希望有海外交换/合作项目
  safety_importance: string; // Q13: 安全/舒适度重要性
  
  // E. 计算与把关
  budget_tolerance: string; // Q14: 预算容忍度（0%/10%/20%，不单独计分）
  main_concern: string; // Q15: 最担心的一点（不单独计分）
  
  // 其他（用于评分）
  scholarship_importance: string; // Q10: 奖学金友好度（用于评分）
}

export function SGForm({ value, onChange }: { value: SGFormData; onChange: (v: Partial<SGFormData>) => void }) {
  const interestOptions = ['CS', 'AI', 'Engineering', 'Business', 'Economics', 'Design', 'Medicine', 'Law', 'Arts'];

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
            1. 孩子的学业水平大致在哪一档？
            <span className="text-xs text-gray-500 ml-2">（用于rank目标带匹配，不代表硬门槛）</span>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">2. 感兴趣的方向（多选）</label>
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

      {/* B. 预算与TG */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">B</span>
          预算与TG（学费资助）
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
            placeholder="例如 25000"
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
          <p className="text-xs text-gray-500 mt-1">注：这里的预算是学费；生活费根据个人与城市会不同，建议额外预留</p>
        </div>

        {/* Q5-Q7: TG/Bond */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            5. 是否希望/接受&ldquo;学费资助（Tuition Grant，简称TG）&rdquo;？
          </label>
          <select
            value={value.bond_acceptance || ''}
            onChange={(e) => onChange({ bond_acceptance: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="愿意">愿意</option>
            <option value="不愿意">不愿意</option>
            <option value="视学费而定">视学费而定</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">TG是新加坡政府/学校提供的学费资助；通常需要签约毕业后在新加坡工作X年（Bond）</p>
        </div>

        <div className="mb-4 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value.tg_must || false}
              onChange={(e) => onChange({ tg_must: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">6. ✅ 必须可申请TG（若勾选，我们只保留能申请TG的学校）</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value.hard_refuse_bond || false}
              onChange={(e) => onChange({ hard_refuse_bond: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">7. ✅ 严格拒绝&ldquo;服务期&rdquo;（签约需在新加坡工作若干年）</span>
          </label>
        </div>
      </div>

      {/* C. 培养方式与选拔要求 */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">C</span>
          培养方式与选拔要求
        </h3>
        
        {/* Q8: 培养导向 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            8. 培养导向
          </label>
          <select
            value={value.orientation || ''}
            onChange={(e) => onChange({ orientation: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="产业">产业</option>
            <option value="研究">研究</option>
            <option value="均衡">均衡</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">产业=课程更强调企业项目/实践；研究=学术能力/研究体验更强；均衡=两者都有</p>
        </div>

        {/* Q9-Q10: 面试/作品集 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            9. 是否接受&ldquo;面试/作品集/小论文&rdquo;类要求？
          </label>
          <select
            value={value.interview_portfolio || ''}
            onChange={(e) => onChange({ interview_portfolio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="愿意">愿意</option>
            <option value="一般">一般</option>
            <option value="不愿">不愿</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">部分专业会用这些方式来综合评估，不代表录取更难，但需要时间准备</p>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={value.hard_refuse_interview_or_portfolio || false}
              onChange={(e) => onChange({ hard_refuse_interview_or_portfolio: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">10. ✅ 严格拒绝&ldquo;面试或作品集&rdquo;（若勾选就排除一切需要的专业/学校）</span>
          </label>
        </div>
      </div>

      {/* D. 课程机会与安全 */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">D</span>
          课程机会与安全
        </h3>
        
        {/* Q11: 双学位 */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value.want_double_degree || false}
              onChange={(e) => onChange({ want_double_degree: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">11. 希望有&ldquo;双学位/跨学科&rdquo;机会</span>
          </label>
        </div>

        {/* Q12: 交换 */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value.want_exchange || false}
              onChange={(e) => onChange({ want_exchange: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">12. 希望有&ldquo;海外交换/合作项目&rdquo;</span>
          </label>
        </div>

        {/* Q13: 安全 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">13. 校园与城市的安全/舒适度重要吗？</label>
          <select
            value={value.safety_importance || ''}
            onChange={(e) => onChange({ safety_importance: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="重要">重要</option>
            <option value="一般">一般</option>
            <option value="不重要">不重要</option>
          </select>
        </div>

        {/* Q10: 奖学金（用于评分） */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">10. 奖学金友好度</label>
          <select
            value={value.scholarship_importance || ''}
            onChange={(e) => onChange({ scholarship_importance: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">请选择</option>
            <option value="重要">重要</option>
            <option value="一般">一般</option>
            <option value="不重要">不重要</option>
          </select>
        </div>
      </div>

      {/* E. 计算与把关 */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">E</span>
          计算与把关
        </h3>
        
        {/* Q14: 预算容忍度 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            14. 对&ldquo;费用超预算但明显更优&rdquo;的容忍度？
            <span className="text-xs text-gray-500 ml-2">（用于回退时预算放宽的最大幅度）</span>
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
            <option value="TG服务期">TG服务期</option>
            <option value="需要面试">需要面试</option>
            <option value="就业实践机会不足">就业实践机会不足</option>
            <option value="安全">安全</option>
            <option value="不确定">不确定</option>
          </select>
        </div>
      </div>
    </div>
  );
}
