'use client';

import Link from 'next/link';

const countries = [
  { key: 'Australia', label: '澳大利亚' },
  { key: 'United Kingdom', label: '英国' },
  { key: 'Singapore', label: '新加坡' },
  { key: 'USA', label: '美国' },
];

export default function ParentEvalSelectCountry() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">选择目标国家</h1>
          <p className="text-gray-600 mt-2">请选择您要进行家长评估的留学国家</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {countries.map((c) => (
            <Link
              key={c.key}
              href={`/parent-eval/start?country=${encodeURIComponent(c.key)}`}
              className="block p-6 bg-white rounded-xl shadow hover:shadow-md border border-gray-200"
            >
              <div className="text-lg font-semibold text-gray-900">{c.label}</div>
              <div className="text-gray-600 mt-1 text-sm">进入该国家的家长评估</div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">← 返回首页</Link>
        </div>
      </div>
    </div>
  );
}


