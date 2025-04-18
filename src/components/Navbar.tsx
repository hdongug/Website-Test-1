import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sword, MessageSquare, User, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // 사용자 로그인 여부 확인
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      } else {
        setUser(null);
      }
    };

    // 초기화
    checkUserLoggedIn();

    // 로컬 스토리지 변경 감지 (다른 탭/창에서 변경 시)
    window.addEventListener('storage', checkUserLoggedIn);
    
    // userLogin 이벤트 감지 (같은 창에서 변경 시)
    window.addEventListener('userLogin', checkUserLoggedIn);

    return () => {
      window.removeEventListener('storage', checkUserLoggedIn);
      window.removeEventListener('userLogin', checkUserLoggedIn);
    };
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('로그아웃되었습니다.');
    navigate('/');
    // 페이지 리로드
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sword className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">게임 거래소</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/market" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <Sword className="h-5 w-5" />
              <span>거래소</span>
            </Link>
            <Link to="/forum" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <MessageSquare className="h-5 w-5" />
              <span>게시판</span>
            </Link>
            
            {/* 사용자 로그인 정보 표시 */}
            <Link to="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <User className="h-5 w-5" />
              <span>사용자 정보</span>
            </Link>
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 bg-gray-100 px-3 py-1 rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span>로그아웃</span>
              </button>
            ) : (
              <Link to="/auth" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 bg-indigo-100 px-3 py-1 rounded-md">
                <LogIn className="h-5 w-5" />
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;