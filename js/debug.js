// 한글 표시 & 추천 아이템 업데이트 디버깅 스크립트
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ 디버그 스크립트 로드됨 - 한글 출력 & 추천 아이템 문제 해결');
  
  // 1초 후 실행하여 다른 스크립트가 먼저 로드될 수 있도록 함
  setTimeout(function() {
    try {
      console.log('디버깅 시작...');
      
      // 1. 메타 태그 확인 및 추가
      ensureMetaCharset();
      
      // 2. 한글 표시 테스트
      koreanDisplayTest();
      
      // 3. 아이템 데이터 확인
      checkItemsData();
      
      // 4. 디버그 패널 추가
      addDebugPanel();
      
      // 5. 추천 아이템 업데이트 문제 해결
      fixRecommendationUpdates();
      
      console.log('디버깅 완료');
    } catch (error) {
      console.error('디버깅 중 오류 발생:', error);
    }
  }, 1000);
  
  // 메타 태그 확인 및 추가
  function ensureMetaCharset() {
    const charset = document.querySelector('meta[charset]');
    if (!charset) {
      console.warn('charset 메타 태그가 없습니다. 추가합니다.');
      const meta = document.createElement('meta');
      meta.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(meta, document.head.firstChild);
    } else {
      console.log('charset 메타 태그 확인:', charset.getAttribute('charset'));
    }
  }
  
  // 한글 표시 테스트
  function koreanDisplayTest() {
    console.log('한글 표시 테스트:');
    console.log('- 등급: 일반, 레어, 희귀, 에픽, 전설, 신화');
    console.log('- 통화: 1,000 골드, 10,000 골드');
    
    // 디버그 버튼과 패널 제거됨
    console.log('디버그 버튼 및 패널이 제거되었습니다.');
  }
  
  // 아이템 데이터 확인
  function checkItemsData() {
    if (typeof allItems !== 'undefined' && Array.isArray(allItems)) {
      console.log('아이템 데이터 확인:', allItems.length);
      
      // 첫 번째 아이템 확인
      const item = allItems[0];
      console.log('첫 번째 아이템:', {
        id: item.id,
        name: item.name,
        price: item.price,
        rarity: item.rarity
      });
      
      // 등급별 아이템 수 계산
      const rarities = {};
      allItems.forEach(item => {
        if (!rarities[item.rarity]) rarities[item.rarity] = 0;
        rarities[item.rarity]++;
      });
      console.log('등급별 아이템 수:', rarities);
    } else {
      console.error('allItems 데이터를 찾을 수 없습니다.');
    }
  }
  
  // 디버그 패널 추가
  function addDebugPanel() {
    // 페이지가 거래소인 경우에만 실행
    if (window.location.pathname.includes('market.html')) {
      fixMarketItemDisplay();
    }
    
    // 페이지가 홈인 경우에만 실행
    if (window.location.pathname === '/' || 
        window.location.pathname.includes('index.html')) {
      fixHomeItemDisplay();
    }
  }
  
  // 거래소 아이템 표시 수정
  function fixMarketItemDisplay() {
    console.log('거래소 아이템 디스플레이 수정 중...');
    
    // 템플릿 내의 등급 및 가격 표시 요소 스타일 강제 적용
    const template = document.getElementById('itemTemplate');
    if (template) {
      // 템플릿 내부의 가격 표시 스타일 강화
      const priceElement = template.content.querySelector('[data-price]');
      if (priceElement) {
        priceElement.classList.add('font-bold');
        priceElement.style.visibility = 'visible';
        priceElement.style.display = 'block';
      }
      
      console.log('템플릿 수정 완료');
    }
    
    // 이미 렌더링된 아이템들 수정
    const items = document.querySelectorAll('.item-card');
    console.log(`이미 렌더링된 아이템 ${items.length}개 수정 중...`);
    
    items.forEach((item, index) => {
      const priceElement = item.querySelector('[data-price]');
      if (priceElement) {
        // 가격 정보 강제 업데이트
        const itemId = item.getAttribute('data-id');
        const itemData = allItems ? allItems.find(i => i.id === itemId) : null;
        
        if (itemData) {
          priceElement.textContent = `${itemData.price.toLocaleString()} 골드`;
          priceElement.style.color = '#eab308';  // text-yellow-500
          priceElement.style.visibility = 'visible';
          priceElement.style.display = 'block';
          priceElement.style.fontWeight = 'bold';
          console.log(`아이템 #${index}(${itemData.name}) 가격 정보 업데이트: ${itemData.price.toLocaleString()} 골드`);
        }
      }
      
      // 등급 표시 강제 업데이트
      const gradeElement = item.querySelector('[data-grade]');
      if (gradeElement) {
        const itemId = item.getAttribute('data-id');
        const itemData = allItems ? allItems.find(i => i.id === itemId) : null;
        
        if (itemData && itemData.rarity) {
          const rarityMap = {
            'mythic': '신화',
            'legendary': '전설',
            'epic': '에픽',
            'rare': '희귀',
            'uncommon': '레어',
            'common': '일반',
            'unique': '고유'
          };
          
          gradeElement.textContent = rarityMap[itemData.rarity] || '일반';
        }
      }
    });
  }
  
  // 홈 아이템 표시 수정
  function fixHomeItemDisplay() {
    console.log('홈 아이템 디스플레이 수정 중...');
    
    // 추천 아이템 컨테이너
    const recommendedItemsContainer = document.getElementById('recommendedItems');
    if (!recommendedItemsContainer) {
      console.log('추천 아이템 컨테이너를 찾을 수 없습니다.');
      return;
    }
    
    // 추천 아이템 카드들
    const items = recommendedItemsContainer.querySelectorAll('.item-card');
    console.log(`추천 아이템 ${items.length}개 수정 중...`);
    
    items.forEach((item, index) => {
      // 가격 요소 찾기
      const priceElement = item.querySelector('.text-yellow-500');
      if (priceElement) {
        // 기존 텍스트 확인
        const oldText = priceElement.textContent;
        console.log(`아이템 #${index} 가격 원본:`, oldText);
        
        // 텍스트에 골드가 없다면 추가
        if (!oldText.includes('골드')) {
          const priceNum = parseInt(oldText.replace(/,/g, ''));
          if (!isNaN(priceNum)) {
            priceElement.textContent = `${priceNum.toLocaleString()} 골드`;
            console.log(`아이템 #${index} 가격 수정:`, priceElement.textContent);
          }
        }
      }
    });
  }
  
  // 추천 아이템 업데이트 문제 해결
  function fixRecommendationUpdates() {
    console.log('추천 아이템 업데이트 문제 해결 중...');
    
    // 페이지가 홈인 경우에만 실행
    if (window.location.pathname === '/' || 
        window.location.pathname.includes('index.html')) {
      
      // 전역 함수 확인 및 오버라이드
      if (window.updateRecommendedItems) {
        console.log('updateRecommendedItems 함수 찾음 - 안전 패치 적용');
        
        // 원래 함수 백업
        const originalUpdateFn = window.updateRecommendedItems;
        
        // 안전한 버전으로 대체
        window.updateRecommendedItems = async function(forceUpdate = false) {
          try {
            console.log('✅ 패치된 updateRecommendedItems 함수 실행 중');
            return await originalUpdateFn.call(window, forceUpdate);
          } catch (error) {
            console.error('🚨 추천 아이템 업데이트 중 오류 발생 (패치된 핸들러):', error instanceof Error ? error.message : '알 수 없는 오류');
            console.error('🔍 오류 상세 정보:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            
            // 안전하게 기본값 호출
            try {
              if (typeof window.getDefaultItems === 'function') {
                const defaultItems = window.getDefaultItems();
                if (typeof window.displayRecommendedItems === 'function') {
                  window.displayRecommendedItems(defaultItems);
                  console.log('✅ 기본 아이템으로 복구됨');
                }
              }
              
              // 로딩 표시기가 있으면 숨김
              if (typeof window.showLoading === 'function') {
                window.showLoading(false);
              }
              
              return null; // 무언가 반환해야 함
            } catch (backupError) {
              console.error('🚨 기본 아이템 표시 중 추가 오류:', backupError);
              return null;
            }
          }
        };
        
        console.log('✅ updateRecommendedItems 함수 패치 완료');
      } else {
        console.warn('⚠️ updateRecommendedItems 함수를 찾을 수 없음');
      }
      
      // 30분마다 추천 아이템 표시 확인
      // 원래 코드에서 설정된 타이머를 더 안전하게 만듦
      const safeTimerCheck = setInterval(function() {
        try {
          // 타이머 확인
          if (!window.updateTimer && typeof window.updateRecommendedItems === 'function') {
            console.log('✅ 누락된 타이머 감지 - 새로운 타이머 설정');
            
            // 다음 30분 단위 시간 계산
            function getNextHalfHourTime() {
              const now = new Date();
              const minutes = now.getMinutes();
              const nextMinutes = minutes < 30 ? 30 : 0;
              const nextHour = minutes < 30 ? now.getHours() : now.getHours() + 1;
              
              const nextTime = new Date(now);
              nextTime.setHours(nextHour, nextMinutes, 0, 0);
              
              return nextTime;
            }
            
            // 다음 업데이트 시간 계산
            const nextScheduledUpdate = getNextHalfHourTime();
            const timeUntilNextUpdate = nextScheduledUpdate.getTime() - new Date().getTime();
            
            // 안전한 타이머 설정
            window.updateTimer = setTimeout(() => {
              if (typeof window.updateRecommendedItems === 'function') {
                window.updateRecommendedItems(true);
              }
            }, timeUntilNextUpdate);
            
            console.log(`✅ 새 타이머 설정됨: ${Math.floor(timeUntilNextUpdate/1000/60)}분 후 업데이트`);
          }
        } catch (error) {
          console.error('🚨 타이머 검사 중 오류:', error);
        }
      }, 60000); // 1분마다 검사
      
      console.log('✅ 추천 아이템 타이머 검사 설정됨');
    }
  }
});
