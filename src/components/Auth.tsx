import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 사용자 정보를 로컬 스토리지에 저장하는 함수
const saveUserToLocalStorage = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
  // 로그인 이벤트를 발생시킵니다.
  window.dispatchEvent(new Event('userLogin'));
};

// 사용자 데이터를 로컬 스토리지에 저장하는 함수
const saveUserData = (userData: any) => {
  // 로컬 스토리지에서 사용자 데이터를 가져옵니다.
  const usersJson = localStorage.getItem('users');
  const users = usersJson ? JSON.parse(usersJson) : [];
  
  // 사용자 데이터를 추가합니다.
  users.push(userData);
  
  // 로컬 스토리지에 사용자 데이터를 저장합니다.
  localStorage.setItem('users', JSON.stringify(users));
};

// 사용자 인증을 처리하는 함수
const authenticateUser = (username: string, password: string) => {
  const usersJson = localStorage.getItem('users');
  if (!usersJson) return null;
  
  const users = JSON.parse(usersJson);
  return users.find((user: any) => user.username === username && user.password === password);
};

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      setLoading(true);
      
      // 로컬 스토리지에서 사용자 데이터를 가져옵니다.
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      if (users.some((user: any) => user.username === username)) {
        setError('이미 존재하는 아이디입니다');
        return;
      }
      
      // 사용자 데이터를 생성합니다.
      const userData = {
        id: Date.now().toString(),
        username,
        password, // 비밀번호를 저장합니다.
        nickname,
        createdAt: new Date().toISOString()
      };
      
      // 사용자 데이터를 로컬 스토리지에 저장합니다.
      saveUserData(userData);
      
      console.log('회원가입 데이터:', userData);
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      
      // 회원가입 후 로그인 화면으로 유지하고 로그인 폼으로 전환
      setIsSignUp(false);
      setUsername('');
      setPassword('');
    } catch (error: any) {
      setError('회원가입 중 오류가 발생했습니다');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      
      // 사용자 인증을 처리합니다.
      const user = authenticateUser(username, password);
      
      if (!user) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다');
        return;
      }
      
      // 로그인 정보를 저장합니다.
      const userForStorage = {
        id: user.id,
        username: user.username,
        nickname: user.nickname
      };
      
      // 로그인 정보를 로컬 스토리지에 저장합니다.
      saveUserToLocalStorage(userForStorage);
      
      console.log('로그인 데이터:', userForStorage);
      alert('로그인에 성공했습니다!');
      
      // 로그인 후 홈 페이지로 이동
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 500);
    } catch (error: any) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setUsername('');
    setPassword('');
    setPasswordConfirm('');
    setNickname('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">게임 거래 플랫폼</h1>
      <p className="text-center text-gray-600 mb-6">{isSignUp ? '새 계정 만들기' : '로그인'}</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {isSignUp && (
          <>
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </>
        )}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </button>
        </div>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleForm}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </button>
        </div>
      </form>
    </div>
  );
}
