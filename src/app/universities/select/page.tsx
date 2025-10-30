'use client';

import Link from 'next/link';

export default function SelectCountryPage() {
  const countries = [
    { key: 'USA', label: 'United States' },
    { key: 'Australia', label: 'Australia' },
    { key: 'United Kingdom', label: 'United Kingdom' },
    { key: 'Singapore', label: 'Singapore' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">选择想要浏览的国家</h1>
          <p className="text-gray-600 mt-2">选择后将进入该国家的大学信息库</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {countries.map((c) => (
            <Link
              key={c.key}
              href={c.key === 'USA' ? '/universities?country=USA' : `/universities?country=${encodeURIComponent(c.key)}`}
              className="block p-6 bg-white rounded-xl shadow hover:shadow-md border border-gray-200"
            >
              <div className="text-lg font-semibold text-gray-900">{c.label}</div>
              <div className="text-gray-600 mt-1 text-sm">
                {c.key === 'USA' ? '美国大学库（现有）' : '国际大学库（新）'}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">← 返回首页</Link>
        </div>
      </main>
    </div>
  );
}


