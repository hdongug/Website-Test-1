// 데이터베이스 동기화 관리 모듈
// 여러 컴퓨터에서 동일한 데이터를 공유할 수 있게 해줍니다.

// Supabase 클라이언트 설정
const supabaseUrl = 'https://vtcryiawujwchkzfzhsq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3J5aWF3dWp3Y2hremZ6aHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMDk1MDcsImV4cCI6MjAzMTc4NTUwN30.SCvnEiNvXAGKo5TF6TfTBOhuG2hFVR4WlxJGZWhoLUA';

// 앱 초기화 시 Supabase 객체 생성
let supabase = null;

// 디버그 모드 설정
const DEBUG = true;

// 디버그 로그 출력 함수
function logDebug(message, data = null) {
  if (DEBUG) {
    if (data) {
      console.log(`[DB] ${message}`, data);
    } else {
      console.log(`[DB] ${message}`);
    }
  }
}

// 데이터베이스 초기화 함수
async function initDatabase() {
  try {
    // 직접 스크립트 태그로 Supabase 라이브러리 사용
    if (typeof window.supabase !== 'undefined') {
      // CDN으로 이미 로드된 경우
      logDebug('Supabase 라이브러리 이미 로드됨');
    } else {
      logDebug('Supabase 라이브러리 종속성 누락')
      
      // 라이브러리 직접 로드
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.async = false;
      document.head.appendChild(script);
      
      // 스크립트 로드 대기
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        // 타임아웃 설정 (5초)
        setTimeout(resolve, 5000);
      });
    }
    
    // Supabase 클라이언트 생성
    // 객체 생성 확인
    if (typeof window.supabase === 'undefined') {
      // 기본 생성자 사용
      supabase = { createClient: (url, key) => {
        logDebug('임시 클라이언트 생성');
        return { 
          from: () => ({ select: () => ({ data: null, error: null }) }),
          auth: { signUp: () => ({}) }
        };
      }};
      logDebug('객체 생성 실패, 임시 객체 사용');
    } else {
      // 정상 객체 생성
      supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
      logDebug('데이터베이스 연결 성공');
    }
    
    // 앱 시작 시 데이터 동기화
    await syncData();
    
    // 상태 표시를 위한 이벤트 발생
    document.dispatchEvent(new CustomEvent('database-connected', { detail: { success: true } }));
    
    return true;
  } catch (error) {
    logDebug('데이터베이스 초기화 실패', error);
    
    // 에러 표시를 위한 이벤트 발생
    document.dispatchEvent(new CustomEvent('database-connected', { detail: { success: false, error: error.message } }));
    
    return false;
  }
}

// Supabase 라이브러리 동적 로드
async function loadSupabaseLibrary() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      // 올바르게 supabaseClient 객체 참조
      window.supabaseClient = window.supabase;
      resolve();
    };
    script.onerror = (error) => {
      console.error('Supabase 라이브러리 로드 실패:', error);
      reject(error);
    };
    document.head.appendChild(script);
  });
}

// 데이터 동기화 함수
async function syncData() {
  if (!supabase) {
    logDebug('데이터베이스가 초기화되지 않았습니다.');
    return false;
  }
  
  try {
    // 로컬 데이터 로드
    const localItems = loadLocalItems();
    const localAttendance = loadLocalAttendance();
    
    // 로컬 데이터가 없는 경우에만 클라우드에서 가져오기
    if (!localItems) {
      await fetchCloudData();
    } else {
      // 로컬 데이터 사용 (초기화 안함)
      logDebug('기존 로컬 데이터 사용');
      // 전역 변수에 할당
      if (localItems) {
        window.allItems = localItems;
        logDebug(`${localItems.length}개의 로컬 아이템 데이터 유지`);
      }
    }
    
    // 동기화 시간 저장
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    logDebug('데이터 동기화 완료');
    
    // 동기화 완료 이벤트 발생
    window.dispatchEvent(new Event('dbSyncComplete'));
    
    return true;
  } catch (error) {
    logDebug('데이터 동기화 실패', error);
    return false;
  }
}

// 로컬에 저장된 아이템 데이터 로드
function loadLocalItems() {
  try {
    const savedItems = localStorage.getItem('allItems');
    return savedItems ? JSON.parse(savedItems) : null;
  } catch (error) {
    logDebug('로컬 아이템 데이터 로드 실패', error);
    return null;
  }
}

// 로컬에 저장된 출석 데이터 로드
function loadLocalAttendance() {
  try {
    const savedAttendance = localStorage.getItem('attendanceData');
    return savedAttendance ? JSON.parse(savedAttendance) : null;
  } catch (error) {
    logDebug('로컬 출석 데이터 로드 실패', error);
    return null;
  }
}

// 클라우드에서 데이터 가져오기
async function fetchCloudData() {
  if (!supabase) {
    logDebug('데이터베이스가 초기화되지 않았습니다.');
    return false;
  }
  
  try {
    // 아이템 데이터 가져오기
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*');
      
    if (itemsError) throw itemsError;
    
    if (items && items.length > 0) {
      // 전역 변수에 할당
      window.allItems = items;
      // 로컬 스토리지에 저장
      localStorage.setItem('allItems', JSON.stringify(items));
      logDebug(`${items.length}개의 아이템 데이터 로드 완료`);
    }
    
    // 출석 데이터 가져오기 (사용자 로그인 시)
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.id) {
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id);
        
      if (attendanceError) throw attendanceError;
      
      if (attendance) {
        localStorage.setItem('attendanceData', JSON.stringify(attendance));
        logDebug('출석 데이터 로드 완료', attendance);
      }
    }
    
    return true;
  } catch (error) {
    logDebug('클라우드 데이터 가져오기 실패', error);
    return false;
  }
}

// 아이템 데이터 저장/업데이트 함수
async function saveItems(items) {
  if (!supabase) {
    logDebug('데이터베이스가 초기화되지 않았습니다.');
    return false;
  }
  
  try {
    // 로컬 스토리지에 저장
    localStorage.setItem('allItems', JSON.stringify(items));
    
    // 전역 변수 업데이트
    window.allItems = items;
    
    // 클라우드에 저장 - upsert 방식 사용
    const { data, error } = await supabase
      .from('items')
      .upsert(items, { onConflict: 'id' });
      
    if (error) throw error;
    
    logDebug('아이템 데이터 저장 완료');
    return true;
  } catch (error) {
    logDebug('아이템 데이터 저장 실패', error);
    // 에러가 발생해도 로컬에는 저장됨
    return false;
  }
}

// 출석 체크 데이터 저장/업데이트 함수
async function saveAttendance(attendanceData) {
  if (!supabase) {
    logDebug('데이터베이스가 초기화되지 않았습니다.');
    return false;
  }
  
  try {
    // 사용자 정보 확인
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user.id) {
      logDebug('로그인이 필요합니다.');
      return false;
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    
    // 클라우드에 저장
    const { data, error } = await supabase
      .from('attendance')
      .upsert({
        user_id: user.id,
        data: attendanceData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
    if (error) throw error;
    
    logDebug('출석 데이터 저장 완료');
    return true;
  } catch (error) {
    logDebug('출석 데이터 저장 실패', error);
    return false;
  }
}

// 주기적 데이터 동기화 설정 (5분마다)
function setupPeriodicSync(intervalMinutes = 5) {
  const intervalMs = intervalMinutes * 60 * 1000;
  // 주기적으로 동기화 실행
  setInterval(syncData, intervalMs);
  logDebug(`${intervalMinutes}분 간격으로 자동 동기화 설정 완료`);
}

// 마지막 동기화 시간 가져오기
function getLastSyncTime() {
  const lastSync = localStorage.getItem('lastSyncTime');
  return lastSync ? new Date(lastSync) : null;
}

// 데이터베이스 상태 확인
function isDatabaseConnected() {
  return supabase !== null;
}

// 내보내기
window.DB = {
  init: initDatabase,
  sync: syncData,
  saveItems: saveItems,
  saveAttendance: saveAttendance,
  setupPeriodicSync: setupPeriodicSync,
  getLastSyncTime: getLastSyncTime,
  isDatabaseConnected: isDatabaseConnected
};
