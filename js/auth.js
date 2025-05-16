/**
 * 게임 거래소 - 로그인 상태 관리 및 동기화 시스템
 * 여러 페이지 간에 로그인 상태를 실시간으로 동기화합니다.
 */

// 실시간 로그인 상태 관리 모듈
const AuthManager = {
  // 현재 로그인한 사용자 정보 조회
  getUser: function() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },
  
  // 로그인 상태 여부 확인
  isLoggedIn: function() {
    return this.getUser() !== null;
  },
  
  // 로그인 처리
  login: function(userData) {
    // localStorage에 사용자 정보 저장
    localStorage.setItem('user', JSON.stringify(userData));
    // UI 업데이트
    this.updateUI();
  },
  
  // 로그아웃 처리
  logout: function() {
    // localStorage에서 사용자 정보 제거
    localStorage.removeItem('user');
    // UI 업데이트
    this.updateUI();
    return true;
  },
  
  // UI 업데이트
  updateUI: function() {
    const isLoggedIn = this.isLoggedIn();
    const loginBtn = document.getElementById('loginBtn');
    const profileLink = document.getElementById('profileLink');
    const logoutBtn = document.getElementById('logoutBtn');
    
    console.log('로그인 상태 업데이트:', isLoggedIn ? '로그인됨' : '로그아웃됨');
    
    // 필요한 요소가 없는 경우 무시 (페이지마다 구조가 다를 수 있음)
    if (loginBtn) {
      loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
      if(loginBtn.classList) {
        if (isLoggedIn) {
          loginBtn.classList.add('hidden');
        } else {
          loginBtn.classList.remove('hidden');
        }
      }
    }
    
    if (profileLink) {
      profileLink.style.display = isLoggedIn ? 'inline-block' : 'none';
      if(profileLink.classList) {
        if (isLoggedIn) {
          profileLink.classList.remove('hidden');
        } else {
          profileLink.classList.add('hidden');
        }
      }
    }
    
    if (logoutBtn) {
      // 로그아웃 버튼에 이벤트 리스너 추가 (이미 있을 수 있음)
      // 기존 이벤트 리스너 제거 (중복 방지)
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
      
      newLogoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (AuthManager.logout()) {
          // 토스트 메시지 표시 함수가 페이지에 있다면 호출
          if (typeof showToast === 'function') {
            showToast('로그아웃 되었습니다.');
          } else {
            alert('로그아웃 되었습니다.');
          }
          
          // 현재 페이지가 로그인이 필요한 페이지인 경우 홈으로 리디렉션
          if (window.location.pathname.includes('profile.html') || 
              window.location.pathname.includes('inventory.html')) {
            window.location.href = 'index.html';
          } else {
            // 그 외의 경우 페이지 새로고침 없이 UI만 업데이트
            console.log('로그아웃 UI 업데이트 완료');
            // 토스트 메시지 표시 함수가 있다면 호출
            if (typeof showToast === 'function') {
              showToast('로그아웃 되었습니다.');
            }
          }
        }
      });
    }
    
    // 구매 버튼 및 기타 로그인 필요 기능 처리
    this.updateBuyButtons();
  },
  
  // 구매 버튼 업데이트
  updateBuyButtons: function() {
    // 거래소 페이지에 있는 경우에만 처리
    if (window.location.pathname.includes('market.html')) {
      const buyButtons = document.querySelectorAll('.item-card button:first-child');
      if (buyButtons.length > 0) {
        const isLoggedIn = this.isLoggedIn();
        
        buyButtons.forEach(btn => {
          // 기존 이벤트 리스너 제거 (최선의 방법)
          const newBtn = btn.cloneNode(true);
          btn.parentNode.replaceChild(newBtn, btn);
          
          newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isLoggedIn) {
              alert('로그인이 필요합니다.');
              window.location.href = 'login.html';
              return;
            }
            
            const card = this.closest('.item-card');
            const itemName = card.querySelector('[data-name]').textContent;
            const itemPrice = card.querySelector('[data-price]').textContent;
            
            if (confirm(`${itemName}을(를) 구매하시겠습니까?`)) {
              // 토스트 메시지 표시 함수가 페이지에 있다면 호출
              if (typeof showToast === 'function') {
                showToast(`${itemName} 구매가 완료되었습니다!`);
              } else {
                alert(`${itemName} 구매가 완료되었습니다!`);
              }
            }
          });
        });
      }
    }
  },
  
  // 초기화
  init: function() {
    // 페이지 로드 시 UI 업데이트
    this.updateUI();
    
    // 다른 탭/창에서 로그인 상태 변경 감지
    window.addEventListener('storage', function(e) {
      if (e.key === 'user') {
        console.log('다른 탭/창에서 로그인 상태 변경 감지');
        AuthManager.updateUI();
      }
    });
    
    // 로그인 버튼에 기본 이벤트 리스너 연결
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', function(e) {
        window.location.href = 'login.html';
      });
    }
  }
};

// DOM이 로드된 후 AuthManager 초기화
document.addEventListener('DOMContentLoaded', function() {
  AuthManager.init();
});
