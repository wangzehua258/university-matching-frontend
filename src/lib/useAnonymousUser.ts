import { v4 as uuidv4 } from 'uuid';

// 生成简单的匿名用户ID
function generateAnonymousId(): string {
  return 'anon_' + uuidv4();
}

export function getAnonymousUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let id = localStorage.getItem('anonymous_user_id');
  if (!id) {
    id = generateAnonymousId();
    localStorage.setItem('anonymous_user_id', id);
  }
  return id;
}

export function clearAnonymousUserId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('anonymous_user_id');
}

export function hasAnonymousUserId(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('anonymous_user_id');
} 