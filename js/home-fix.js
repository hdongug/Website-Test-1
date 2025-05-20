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
      
      // 추천 아이템 선택 - 각 등급별로 1개씩 총 6개
      const recommendedItems = getRecommendedItemsByRarity(allItems);
      
      // 추천 아이템 표시
      displayRecommendedItemsFixed(recommendedItems, recommendedItemsContainer);
      
      // 시간 표시 업데이트
      updateTimeDisplayFixed();
      
      // 24시간 마다 아이템 갱신 타이머 설정
      setupAutoRefreshDaily();
      
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
    const nextTime = getNextDayTime();
    
    // 다음 갱신 시간까지 남은 시간 계산
    const hoursUntilUpdate = Math.floor((nextTime - now) / (1000 * 60 * 60));
    const minutesUntilUpdate = Math.floor(((nextTime - now) % (1000 * 60 * 60)) / (1000 * 60));
    
    try {
      // 시간 표시 컨테이너 확인 및 생성
      let timeDisplayContainer = document.getElementById('timeDisplay');
      
      // 시간 표시 컨테이너가 없으면 생성
      if (!timeDisplayContainer) {
        timeDisplayContainer = document.createElement('div');
        timeDisplayContainer.id = 'timeDisplay';
        timeDisplayContainer.className = 'flex justify-between bg-gray-100 p-2 rounded-md text-sm mb-4';
        timeDisplayContainer.innerHTML = `
          <div>현재 시간: <span class="current-time font-semibold"></span></div>
          <div>다음 갱신: <span class="next-time font-semibold"></span> (매일 자정 갱신)</div>
        `;
        
        // 추천 아이템 섹션 찾기 (여러 가지 클래스 및 ID 시도)
        const recommendedItemsContainer = document.getElementById('recommendedItems') || 
                                     document.querySelector('.recommended-items') || 
                                     document.querySelector('.featured-items') || 
                                     document.querySelector('.item-section');
        
        if (recommendedItemsContainer) {
          recommendedItemsContainer.parentNode.insertBefore(timeDisplayContainer, recommendedItemsContainer);
          console.log('시간 표시 요소 추가 성공');
        } else {
          // 컨테이너를 찾을 수 없는 경우 메인 콘텐츠 영역에 추가
          const mainContent = document.querySelector('main') || document.body;
          const firstChild = mainContent.firstChild;
          mainContent.insertBefore(timeDisplayContainer, firstChild);
          console.log('메인 콘텐츠에 시간 표시 요소 추가');
        }
      }
    } catch (error) {
      console.log('시간 표시 요소 생성 중 오류:', error);
    }
    
    // 시간 표시 요소 얻기
    let timeDisplayContainer = document.getElementById('timeDisplay');
    if (!timeDisplayContainer) {
      console.log('시간 표시 요소를 찾을 수 없어 탐색 중단');
      return;
    }
    
    const currentTimeElem = timeDisplayContainer.querySelector('.current-time');
    const nextTimeElem = timeDisplayContainer.querySelector('.next-time');
    
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
  
  // 등급별 아이템 선택 함수 (신화, 전설, 영웅, 희소, 레어, 일반)
  function getRecommendedItemsByRarity(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return [];
    }
    
    // 등급 정의
    const rarities = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
    const rarityNames = {
      'mythic': '신화',
      'legendary': '전설',
      'epic': '영웅',
      'rare': '희소',
      'uncommon': '레어',
      'common': '일반'
    };
    
    // 결과 배열
    const result = [];
    
    // 등급별로 필터링하여 각 등급에서 1개씩 선택
    for (const rarity of rarities) {
      // 해당 등급의 아이템만 필터링
      const rarityItems = items.filter(item => item.rarity === rarity);
      
      if (rarityItems.length > 0) {
        // 각 등급에서 랜덤하게 하나 선택
        const randomIndex = Math.floor(Math.random() * rarityItems.length);
        const selectedItem = rarityItems[randomIndex];
        
        // 디버그 정보 출력
        console.log(`${rarityNames[rarity] || rarity} 등급 아이템 선택: ${selectedItem.name}`);
        
        // 결과 배열에 추가
        result.push(selectedItem);
      } else {
        console.log(`${rarityNames[rarity] || rarity} 등급 아이템 없음`);
      }
    }
    
    // 아이템이 6개 미만이면 나머지는 일반 아이템으로 채우기
    const remaining = 6 - result.length;
    if (remaining > 0) {
      // 일반 아이템이 부족한 경우, 다른 모든 아이템 중 랜덤 선택
      const additionalItems = getRandomItems(items, remaining);
      result.push(...additionalItems);
      console.log(`추가 아이템 ${remaining}개 선택`);
    }
    
    return result;
  }

  // 다음 날 0시 0분 계산
  function getNextDayTime() {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    
    return nextDay;
  }
  
  // 24시간 주기 자동 새로고침 설정
  function setupAutoRefreshDaily() {
    // 다음 날 0시까지 남은 시간
    const nextTime = getNextDayTime();
    const now = new Date();
    const timeUntilNextUpdate = nextTime.getTime() - now.getTime();
    
    // 시간 표시 (시간, 분)
    const hoursUntilUpdate = Math.floor(timeUntilNextUpdate / (1000 * 60 * 60));
    const minutesUntilUpdate = Math.floor((timeUntilNextUpdate % (1000 * 60 * 60)) / (1000 * 60));
    
    console.log(`다음 갱신: ${hoursUntilUpdate}시간 ${minutesUntilUpdate}분 후 (매일 0시 갱신)`);
    
    // 다음 업데이트 타이머 설정
    setTimeout(function() {
      console.log('추천 아이템 일간 갱신');
      window.location.reload();
    }, timeUntilNextUpdate);
  }

  // 자동 새로고침 설정 (30분 주기) - 이전 함수, 하위 호환을 위해 유지
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
