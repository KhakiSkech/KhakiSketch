'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTodayTodos } from '@/lib/firestore-quotes';
import type { LeadTodo } from '@/types/admin';

export default function TodayTodos(): React.ReactElement {
  const [todos, setTodos] = useState<LeadTodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setIsLoading(true);
    const result = await getTodayTodos();
    if (result.success && result.data) {
      setTodos(result.data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-brand-primary/10 rounded w-1/3"></div>
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-brand-primary/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="font-bold text-brand-primary">오늘의 할 일</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-brand-muted">오늘 마감인 할 일이 없습니다 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="font-bold text-brand-primary">오늘의 할 일</h3>
          <span className="px-2 py-0.5 bg-brand-secondary text-white text-xs font-bold rounded-full">
            {todos.length}
          </span>
        </div>
        <Link
          href="/admin/quotes"
          className="text-sm text-brand-secondary hover:text-brand-primary transition-colors"
        >
          견적 관리 →
        </Link>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <Link
            key={todo.id}
            href={`/admin/quotes/${todo.leadId}`}
            className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl hover:bg-brand-primary/5 transition-colors group"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              todo.priority === 'HIGH' ? 'bg-red-500' : 
              todo.priority === 'MEDIUM' ? 'bg-orange-400' : 'bg-gray-400'
            }`} />
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-brand-text truncate group-hover:text-brand-primary transition-colors">
                {todo.title}
              </p>
              {todo.description && (
                <p className="text-sm text-brand-muted truncate">{todo.description}</p>
              )}
            </div>

            <svg className="w-4 h-4 text-brand-muted group-hover:text-brand-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
