'use client';

import { useState, useEffect } from 'react';
import { getLeadTodos, createTodo, updateTodo, completeTodo, deleteTodo } from '@/lib/firestore-quotes';
import type { LeadTodo, TodoStatus, TodoPriority } from '@/types/admin';

interface TodoListProps {
  leadId: string;
  userEmail: string;
}

const STATUS_LABELS: Record<TodoStatus, { label: string; color: string }> = {
  PENDING: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
  IN_PROGRESS: { label: '진행중', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: '완료', color: 'bg-green-100 text-green-700' },
  OVERDUE: { label: '기한초과', color: 'bg-red-100 text-red-700' },
};

const PRIORITY_LABELS: Record<TodoPriority, { label: string; color: string }> = {
  LOW: { label: '낮음', color: 'bg-gray-100 text-gray-600' },
  MEDIUM: { label: '보통', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: '높음', color: 'bg-orange-100 text-orange-700' },
};

export default function TodoList({ leadId, userEmail }: TodoListProps): React.ReactElement {
  const [todos, setTodos] = useState<LeadTodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TodoPriority,
    dueDate: '',
  });

  useEffect(() => {
    loadTodos();
  }, [leadId]);

  const loadTodos = async () => {
    setIsLoading(true);
    const result = await getLeadTodos(leadId);
    if (result.success && result.data) {
      setTodos(result.data);
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newTodo.title.trim()) return;

    setIsCreating(true);
    const result = await createTodo({
      leadId,
      title: newTodo.title,
      description: newTodo.description,
      status: 'PENDING',
      priority: newTodo.priority,
      dueDate: newTodo.dueDate || undefined,
      createdBy: userEmail,
    });

    if (result.success) {
      setNewTodo({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
      await loadTodos();
    }
    setIsCreating(false);
  };

  const handleComplete = async (id: string) => {
    await completeTodo(id);
    await loadTodos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 할 일을 삭제하시겠습니까?')) return;
    await deleteTodo(id);
    await loadTodos();
  };

  const handleStatusChange = async (id: string, status: TodoStatus) => {
    await updateTodo(id, { status });
    await loadTodos();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return '기한 없음';
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays < 0) return `${Math.abs(diffDays)}일 초과`;
    return `${diffDays}일 후`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-brand-bg rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const pendingTodos = todos.filter((t) => t.status !== 'COMPLETED');
  const completedTodos = todos.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="space-y-4">
      {/* Create New Todo */}
      <div className="p-4 bg-brand-bg rounded-xl space-y-3">
        <input
          type="text"
          placeholder="새 할 일 추가..."
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        />
        <div className="flex gap-2">
          <select
            value={newTodo.priority}
            onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as TodoPriority })}
            className="px-3 py-2 rounded-lg border border-brand-primary/10 text-sm"
          >
            <option value="LOW">낮음</option>
            <option value="MEDIUM">보통</option>
            <option value="HIGH">높음</option>
          </select>
          <input
            type="date"
            value={newTodo.dueDate}
            onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
            className="px-3 py-2 rounded-lg border border-brand-primary/10 text-sm"
          />
          <button
            onClick={handleCreate}
            disabled={isCreating || !newTodo.title.trim()}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 disabled:opacity-50"
          >
            {isCreating ? '추가중...' : '추가'}
          </button>
        </div>
      </div>

      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-brand-muted">
            진행중 ({pendingTodos.length})
          </h4>
          {pendingTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-3 bg-white rounded-xl border-2 transition-all ${
                isOverdue(todo.dueDate)
                  ? 'border-red-200 bg-red-50'
                  : 'border-transparent hover:border-brand-primary/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(todo.id)}
                  className="mt-1 w-5 h-5 rounded-full border-2 border-brand-primary/30 hover:border-brand-secondary hover:bg-brand-secondary/10 transition-colors flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-text">{todo.title}</p>
                  {todo.description && (
                    <p className="text-sm text-brand-muted mt-1">{todo.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${PRIORITY_LABELS[todo.priority].color}`}>
                      {PRIORITY_LABELS[todo.priority].label}
                    </span>
                    {todo.dueDate && (
                      <span className={`text-xs ${isOverdue(todo.dueDate) ? 'text-red-600 font-medium' : 'text-brand-muted'}`}>
                        {formatDueDate(todo.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-brand-muted">
            완료 ({completedTodos.length})
          </h4>
          {completedTodos.map((todo) => (
            <div
              key={todo.id}
              className="p-3 bg-gray-50 rounded-xl opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="flex-1 line-through text-brand-muted">{todo.title}</p>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1.5 text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {todos.length === 0 && (
        <div className="text-center py-8 text-brand-muted">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p>할 일이 없습니다</p>
          <p className="text-sm mt-1">위에서 새 할 일을 추가하세요</p>
        </div>
      )}
    </div>
  );
}
