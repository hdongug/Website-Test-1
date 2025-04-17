import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, MessageSquare, User, LogIn } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sword className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">게임 거래소</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/market" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <Sword className="h-5 w-5" />
              <span>거래소</span>
            </Link>
            <Link to="/forum" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <MessageSquare className="h-5 w-5" />
              <span>게시판</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <User className="h-5 w-5" />
              <span>프로필</span>
            </Link>
            <Link to="/auth" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <LogIn className="h-5 w-5" />
              <span>로그인</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;