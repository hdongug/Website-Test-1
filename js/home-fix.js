// 홈 페이지 추천 아이템 표시 문제 해결을 위한 스크립트
document.addEventListener('DOMContentLoaded', function() {
  console.log('홈 페이지 수정 스크립트 로드됨');
  
  // 1초 후 실행하여 다른 스크립트가 먼저 로드될 수 있도록 함
  setTimeout(function() {
    try {
      console.log('아이템 데이터 확인:', allItems ? `아이템 ${allItems.length}개 발견` : '아이템 데이터 없음');
      
      // 추천 아이템 컨테이너 확인
      const recommendedItemsContainer = document.getElementById('recommendedItems');
      
      if (!recommendedItemsContainer) {
        console.error('추천 아이템 컨테이너를 찾을 수 없습니다.');
        return;
      }
      
      // allItems 확인
      if (!allItems || !Array.isArray(allItems) || allItems.length === 0) {
        console.error('아이템 데이터를 찾을 수 없습니다.');
        displayDefaultItems(recommendedItemsContainer);
        return;
      }
      
      // 랜덤한 추천 아이템 4개 선택
      const recommendedItems = getRandomItems(allItems, 4);
      
      // 추천 아이템 표시
      displayRecommendedItemsFixed(recommendedItems, recommendedItemsContainer);
      
      // 시간 표시 업데이트
      updateTimeDisplayFixed();
      
      // 30분 마다 아이템 갱신 타이머 설정
      setupAutoRefresh();
      
    } catch (error) {
      console.error('홈 페이지 추천 아이템 표시 중 오류:', error);
    }
  }, 1000);
  
  // 랜덤 아이템 선택 함수
  function getRandomItems(items, count) {
    // 생성된 인덱스 추적
    const usedIndices = new Set();
    const result = [];
    
    // 언제나 최소 1개의 레어 이상 아이템을 포함
    const rareItems = items.filter(item => item.rarity && ['rare', 'epic', 'legendary', 'mythic'].includes(item.rarity));
    
    if (rareItems.length > 0) {
      const randomRareIndex = Math.floor(Math.random() * rareItems.length);
      const rareItemIndex = items.findIndex(item => item.id === rareItems[randomRareIndex].id);
      
      if (rareItemIndex !== -1) {
        result.push(items[rareItemIndex]);
        usedIndices.add(rareItemIndex);
      }
    }
    
    // 나머지 아이템 채우기
    while (result.length < count && usedIndices.size < items.length) {
      const randomIndex = Math.floor(Math.random() * items.length);
      
      if (!usedIndices.has(randomIndex)) {
        result.push(items[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }
    
    return result;
  }
  
  // 추천 아이템 표시 함수 (개선버전)
  function displayRecommendedItemsFixed(items, container) {
    // 컨테이너 비우기
    container.innerHTML = '';
    
    // ub4f1uae09 ud45cuc2dcuc6a9 ub9f5ud551 uc815ubcf4
    const rarityNameMap = {
      'mythic': '신화',
      'legendary': '전설',
      'epic': '에픽',
      'rare': '희귀',
      'uncommon': '레어',
      'common': '일반',
      'unique': '고유'
    };
    
    // 색상 매핑
    const rarityColorMap = {
      'mythic': 'bg-pink-500',
      'legendary': 'bg-yellow-500',
      'epic': 'bg-purple-500',
      'rare': 'bg-blue-500',
      'uncommon': 'bg-green-500',
      'common': 'bg-gray-500',
      'unique': 'bg-red-500'
    };
    
    // 각 아이템에 대해 카드 생성
    items.forEach(item => {
      try {
        // 아이템 등급 처리
        const rarity = item.rarity || 'common';
        const rarityText = rarityNameMap[rarity] || 'uc77cubc18';
        const rarityColor = rarityColorMap[rarity] || 'bg-gray-500';
        
        // 이미지 경로 처리
        let imgPath = item.imageUrl;
        if (imgPath) {
          if (imgPath.includes('http://') || imgPath.includes('https://')) {
            const urlParts = imgPath.split('/');
            imgPath = '/' + urlParts.slice(3).join('/');
          } else if (!imgPath.startsWith('/')) {
            imgPath = '/' + imgPath;
          }
        } else {
          imgPath = '/PNG/placeholder.jpg';
        }
        
        // HTML 생성
        const itemCard = document.createElement('div');
        itemCard.className = 'bg-white rounded-lg shadow-md overflow-hidden item-card';
        itemCard.setAttribute('data-id', item.id);
        itemCard.setAttribute('data-category', item.category || 'unknown');
        
        // 아이템 카드 HTML 구성
        itemCard.innerHTML = `
          <div class="p-2 flex justify-between items-center">
            <span class="${rarityColor} text-white px-2 py-1 rounded-full text-xs font-bold">${rarityText}</span>
          </div>
          <div class="p-4">
            <div class="flex flex-col items-center">
              <div class="bg-gray-100 w-full h-40 mb-3 flex items-center justify-center overflow-hidden">
                <img src="${imgPath}" alt="${item.name}" class="w-full h-full object-contain" onerror="this.src='/PNG/placeholder.jpg'">
              </div>
              <h3 class="text-lg font-bold mb-1">${item.name}</h3>
              <p class="text-sm font-semibold text-yellow-500 mb-3">${item.price.toLocaleString()} 골드</p>
              <a href="market.html" class="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 w-full text-center">
                거래소에서 보기
              </a>
            </div>
          </div>
        `;
        
        // 컨테이너에 추가
        container.appendChild(itemCard);
        
      } catch (err) {
        console.error('아이템 카드 생성 오류:', err, item);
      }
    });
    
    // uc5c5ub370uc774ud2b8 uc2dcuac04 ud45cuc2dc
    const updateTime = document.getElementById('updateTime');
    if (updateTime) {
      updateTime.textContent = new Date().toLocaleTimeString('ko-KR');
    }
  }
  
  // uae30ubcf8 uc544uc774ud15c ud45cuc2dc
  function displayDefaultItems(container) {
    // 기본 아이템 데이터
    const defaultItems = [
      {
        id: 'default1',
        name: 'ub9c8ubc95 uc2a4ud0dcud504',
        price: 1000,
        rarity: 'common',
        category: 'weapon',
        imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_01.jpg'
      },
      {
        id: 'default2',
        name: 'uc81cuad6d ub3c4ub07c',
        price: 1000,
        rarity: 'common',
        category: 'weapon',
        imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_05.png'
      },
      {
        id: 'default3',
        name: 'uac11uc637',
        price: 1000,
        rarity: 'common',
        category: 'armor',
        imageUrl: '/PNG/armor/KakaoTalk_20250510_205715529_01.png'
      },
      {
        id: 'default4',
        name: 'uccb4ub825ud68cubcf5',
        price: 2500,
        rarity: 'common',
        category: 'potion',
        imageUrl: '/PNG/KakaoTalk_20250510_213329962.png'
      }
    ];
    
    // 기본 아이템 표시
    displayRecommendedItemsFixed(defaultItems, container);
  }
  
  // uc2dcuac04 ud45cuc2dc uc5c5ub370uc774ud2b8
  function updateTimeDisplayFixed() {
    const now = new Date();
    const nextTime = getNextHalfHourTime();
    
    // 다음 갱신 시간까지 남은 시간(분) 계산
    const minutesUntilNextUpdate = Math.floor((nextTime - now) / (1000 * 60));
    
    // uc5c5ub370uc774ud2b8 uc2dcuac04 ud45cuc2dc
    const currentTimeElem = document.querySelector('.current-time');
    const nextTimeElem = document.querySelector('.next-time');
    
    if (currentTimeElem) {
      currentTimeElem.textContent = formatKoreanTime(now);
    }
    
    if (nextTimeElem) {
      nextTimeElem.textContent = formatKoreanTime(nextTime);
    }
    
    console.log('시간 표시 업데이트 - 현재:', formatKoreanTime(now), '다음 갱신:', formatKoreanTime(nextTime));
  }
  
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
  
  // 한국어 시간 형식(예: 1시 30분)
  function formatKoreanTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    
    const hourText = `${hours}시`;
    const minuteText = minutes > 0 ? ` ${minutes}분` : '';
    
    return `${hourText}${minuteText}`;
  }
  
  // 자동 새로고침 설정
  function setupAutoRefresh() {
    // 다음 30분 단위 시간까지 남은 시간
    const nextTime = getNextHalfHourTime();
    const now = new Date();
    const timeUntilNextUpdate = nextTime.getTime() - now.getTime();
    
    console.log(`${Math.floor(timeUntilNextUpdate/1000/60)}분 후 자동 새로고침 예약`);
    
    // 다음 업데이트 타이머 설정
    setTimeout(function() {
      console.log('추천 아이템 자동 새로고침');
      window.location.reload();
    }, timeUntilNextUpdate);
  }
});
