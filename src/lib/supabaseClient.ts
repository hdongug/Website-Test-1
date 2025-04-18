import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 익명 키
// 실제 프로젝트에서는 환경 변수를 사용하는 것이 좋습니다
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

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
  // 이메일 생성
  const email = `${username}@example.com`;
  
  // Supabase Auth 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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
  // 이메일 생성
  const email = `${username}@example.com`;
  
  // Supabase Auth 로그인
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
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
