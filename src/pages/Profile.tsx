import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 로그인 여부 확인
  const checkUserLoggedIn = () => {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 로딩 상태 초기화
    setLoading(true);
    
    // 로그인 여부 확인
    checkUserLoggedIn();
    
    // 로컬 스토리지 변경 이벤트监听 (로그인/로그아웃)
    window.addEventListener('storage', checkUserLoggedIn);
    
    // 사용자 로그인 이벤트监听 (로그인/로그아웃)
    window.addEventListener('userLogin', checkUserLoggedIn);
    
    return () => {
      window.removeEventListener('storage', checkUserLoggedIn);
      window.removeEventListener('userLogin', checkUserLoggedIn);
    };
  }, [navigate]);

  // 사용자 정보 가져오기
  const getUserDetails = () => {
    const usersJson = localStorage.getItem('users');
    if (!usersJson || !user) return null;
    
    const users = JSON.parse(usersJson);
    return users.find((u: any) => u.id === user.id);
  };

  const userDetails = getUserDetails();

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }
  
  // 사용자 로그인 정보가 없으면 null 반환
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div className="flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400 mb-4">
              <LogIn />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">사용자 로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">로그인 정보가 없으면 로그인 페이지로 이동합니다.</p>
            
            <Link 
              to="/auth" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md flex items-center space-x-2 transition duration-150 ease-in-out"
            >
              <LogIn className="h-5 w-5" />
              <span>로그인하기</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">사용자 프로필</h1>
      
      {user && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
              {user.nickname ? user.nickname.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.nickname || user.username}</h2>
              <p className="text-gray-600">아이디: {user.username}</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">계정 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">닉네임</p>
                <p>{user.nickname || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">가입일</p>
                <p>{userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">게시물 통계</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-gray-600">게시물 수</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-gray-600">댓글 수</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;