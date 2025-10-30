'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function ParentEvalIndex() {
  useEffect(() => {
    redirect('/parent-eval/select');
  }, []);
  return null;
}


