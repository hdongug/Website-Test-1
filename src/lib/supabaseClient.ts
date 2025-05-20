import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 익명 키
const supabaseUrl = 'https://vtcryiawujwchkzfzhsq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3J5aWF3dWp3Y2hremZ6aHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMDk1MDcsImV4cCI6MjAzMTc4NTUwN30.SCvnEiNvXAGKo5TF6TfTBOhuG2hFVR4WlxJGZWhoLUA';

// 이 설정은 예시용으로, 실제 서비스에서는 환경 변수 또는 안전한 방법으로 관리해야 합니다.

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 로컬 스토리지에 사용자 정보 저장
export const saveUserToLocalStorage = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
  // 로그인 이벤트 발생
  window.dispatchEvent(new Event('userLogin'));
};

// 로컬 스토리지에서 사용자 정보 가져오기
export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// 로컬 스토리지에서 사용자 정보 삭제
export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

// 회원가입
export const signUpUser = async (username: string, password: string, nickname: string) => {
  // Supabase Auth 회원가입 - 사용자명을 이메일 인증 없이 직접 사용
  const { data, error } = await supabase.auth.signUp({
    email: username, // Supabase에서는 email 필드가 필요하지만, 이를 사용자명으로 활용
    password,
    options: {
      emailRedirectTo: undefined, // 이메일 검증 안함
      data: {
        username,
        nickname,
        created_at: new Date().toISOString()
      }
    }
  });

  if (!error && data.user) {
    // 프로필 생성
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id, 
          username, 
          nickname,
          created_at: new Date().toISOString()
        }
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
  }
  
  return { data, error };
};

// 로그인
export const signInUser = async (username: string, password: string) => {
  // Supabase Auth 로그인 (사용자명을 이메일 필드에 사용)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username, // 사용자명을 이메일 대신 사용
    password
  });

  if (!error && data.user) {
    // 프로필 가져오기
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    } else if (profileData) {
      // 로컬 스토리지에 사용자 정보 저장
      saveUserToLocalStorage({
        id: data.user.id,
        username: profileData.username,
        nickname: profileData.nickname
      });
      
      // 로그인 이벤트 발생
      window.dispatchEvent(new Event('userLogin'));
    }
  }
  
  return { data, error };
};

// 로그아웃
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (!error) {
    // 로컬 스토리지에서 사용자 정보 삭제
    removeUserFromLocalStorage();
    
    // 로그인 이벤트 발생
    window.dispatchEvent(new Event('userLogin'));
  }
  
  return { error };
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (!error && data.user) {
    // 프로필 가져오기
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    } else if (profileData) {
      return { user: profileData, error: null };
    }
  }
  
  return { user: null, error };
};
