import React from 'react';
import { Sword, Shield, Trophy } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          게임 아이템 거래 플랫폼에 오신 것을 환영합니다
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          희귀 아이템을 거래하고, 다른 플레이어와 소통하며, 컬렉션을 완성하세요.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Sword className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">아이템 거래</h2>
          <p className="text-gray-600">다른 플레이어와 안전하고 신뢰할 수 있는 거래를 시작하세요.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">안전한 거래</h2>
          <p className="text-gray-600">모든 사용자를 위한 안전하고 신뢰할 수 있는 거래 시스템을 제공합니다.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Trophy className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">희귀 아이템</h2>
          <p className="text-gray-600">전설급, 신화급 아이템으로 컬렉션을 완성하세요.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;