// 아이템 렌더링 문제 해결을 위한 스크립트
document.addEventListener('DOMContentLoaded', function() {
  console.log('아이템 렌더링 수정 스크립트 로드됨');
  
  // 페이지네이션 상태 관리
  let currentPage = 1;      // 현재 페이지
  const itemsPerPage = 8;   // 페이지당 최대 아이템 개수
  let filteredItems = [];    // 필터링된 아이템 목록
  
  // 아이템 필터링 함수
  function filterItems() {
    if (!allItems || !Array.isArray(allItems)) {
      console.error('필터링할 아이템 데이터가 없습니다.');
      filteredItems = [];
      return;
    }
    
    // 검색어 가져오기
    const searchQuery = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    
    // 필터 가져오기
    const gradeValue = document.getElementById('gradeFilter')?.value || 'all';
    const priceValue = document.getElementById('priceFilter')?.value || 'all';
    const categoryValue = document.getElementById('categoryFilter')?.value || 'all';
    const subcategoryValue = document.getElementById('subCategoryFilter')?.value || 'all';
    
    // 필터링 적용
    filteredItems = allItems.filter(item => {
      // 검색어 필터링
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) {
        return false;
      }
      
      // 등급 필터링
      if (gradeValue !== 'all' && item.rarity !== gradeValue) {
        return false;
      }
      
      // 카테고리 필터링
      if (categoryValue !== 'all' && item.category !== categoryValue) {
        return false;
      }
      
      // 서브 카테고리 필터링
      if (subcategoryValue !== 'all' && item.subcategory !== subcategoryValue) {
        return false;
      }
      
      // 가격 필터링
      if (priceValue !== 'all') {
        const price = item.price || 0;
        if (priceValue === 'under1000' && price >= 1000) return false;
        if (priceValue === '1000to10000' && (price < 1000 || price > 10000)) return false;
        if (priceValue === 'over10000' && price <= 10000) return false;
      }
      
      return true;
    });
    
    // 필터링 결과 배열의 길이 출력
    console.log(`필터링 결과: 총 ${filteredItems.length}개 아이템`);
    
    // 페이지 1로 초기화
    currentPage = 1;
    
    // 페이지 렌더링
    renderPage();
  }
  
  // 페이지네이션 UI 생성
  function createPagination() {
    // 페이지네이션 컨테이너 찾기 또는 생성
    let paginationContainer = document.getElementById('paginationContainer');
    
    // 컨테이너가 없으면 만들기
    if (!paginationContainer) {
      const itemContainer = document.getElementById('itemContainer');
      if (!itemContainer) return;
      
      paginationContainer = document.createElement('div');
      paginationContainer.id = 'paginationContainer';
      paginationContainer.className = 'flex justify-center items-center mt-6 space-x-2';
      itemContainer.parentNode.insertBefore(paginationContainer, itemContainer.nextSibling);
    }
    
    // 페이지 수 계산
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    if (totalPages <= 0) {
      paginationContainer.innerHTML = '';
      return;
    }
    
    // 현재 페이지가 최대 페이지보다 크면 조정
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    
    paginationContainer.innerHTML = '';
    
    // 10페이지 이전으로 이동하는 << 버튼
    const firstBtn = document.createElement('button');
    firstBtn.innerHTML = '&laquo;';
    firstBtn.className = 'px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed';
    firstBtn.disabled = currentPage <= 10;
    firstBtn.addEventListener('click', () => {
      currentPage = Math.max(1, Math.floor((currentPage - 1) / 10) * 10 - 9);
      renderPage();
    });
    paginationContainer.appendChild(firstBtn);
    
    // 이전 페이지로 이동하는 < 버튼
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&lsaquo;';
    prevBtn.className = 'px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed';
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', () => {
      currentPage--;
      renderPage();
    });
    paginationContainer.appendChild(prevBtn);
    
    // 페이지 번호 생성
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);
    
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.className = i === currentPage 
        ? 'px-3 py-1 rounded bg-purple-700 text-white font-bold'
        : 'px-3 py-1 rounded bg-gray-200 hover:bg-gray-300';
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderPage();
      });
      paginationContainer.appendChild(pageBtn);
    }
    
    // 다음 페이지로 이동하는 > 버튼
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&rsaquo;';
    nextBtn.className = 'px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => {
      currentPage++;
      renderPage();
    });
    paginationContainer.appendChild(nextBtn);
    
    // 10페이지 다음으로 이동하는 >> 버튼
    const lastBtn = document.createElement('button');
    lastBtn.innerHTML = '&raquo;';
    lastBtn.className = 'px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed';
    lastBtn.disabled = Math.ceil(currentPage / 10) * 10 >= totalPages;
    lastBtn.addEventListener('click', () => {
      currentPage = Math.min(totalPages, Math.ceil(currentPage / 10) * 10 + 1);
      renderPage();
    });
    paginationContainer.appendChild(lastBtn);
  }
  
  // 페이지 렌더링 함수
  function renderPage() {
    // 현재 페이지에 해당하는 아이템만 필터링
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
    
    renderItems(pageItems);
    createPagination();
  }

  // 아이템 렌더링 함수
  function renderItems(items) {
    // 컨테이너와 템플릿 확인
    const container = document.getElementById('itemContainer');
    const template = document.getElementById('itemTemplate');
    
    if (!container || !template) {
      console.error('렌더링에 필요한 요소를 찾을 수 없습니다:', 
        !container ? 'itemContainer' : 'itemTemplate');
      return;
    }
    
    // 컨테이너 비우기
    container.innerHTML = '';
    console.log(`아이템 렌더링 시작... 페이지 ${currentPage}, 총 ${items.length}개 아이템`);
    
    // 필터링된 아이템 렌더링
    items.forEach(item => {
      try {
        // 템플릿 복제
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.item-card');
        
        // 카드 속성 설정
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-category', item.category || 'unknown');
        card.setAttribute('data-subcategory', item.subcategory || 'unknown');
        
        // 등급에 따른 배경색 설정
        const gradeBg = card.querySelector('[data-grade-bg]');
        gradeBg.className = `p-2 flex justify-between items-center`;
        
        // 등급 텍스트 설정
        const grade = card.querySelector('[data-grade]');
        
        // 기본 등급 정보 정의 (원래 코드에 누락된 경우를 대비)
        const rarityNameMap = {
          'mythic': '신화',
          'legendary': '전설',
          'epic': '에픽',
          'rare': '희귀',
          'uncommon': '레어',
          'common': '일반',
          'unique': '고유'
        };
        
        const rarityColorMap = {
          'mythic': { bg: 'bg-pink-500' },
          'legendary': { bg: 'bg-yellow-500' },
          'epic': { bg: 'bg-purple-500' },
          'rare': { bg: 'bg-blue-500' },
          'uncommon': { bg: 'bg-green-500' },
          'common': { bg: 'bg-gray-500' },
          'unique': { bg: 'bg-red-500' }
        };
        
        // 등급에 따른 색상 설정
        const rarity = item.rarity || 'common';
        const colorData = rarityColorMap[rarity] || rarityColorMap['common'];
        const rarityColor = colorData.bg.replace('bg-', '');
        
        const rarityText = rarityNameMap[rarity] || '일반';
        grade.textContent = rarityText;
        grade.className = `bg-${rarityColor} text-white px-2 py-1 rounded-full text-xs font-bold grade-badge`;
        
        // 이미지 설정
        const img = card.querySelector('[data-img]');
        let imgPath;
        if (item.imageUrl) {
          // 모든 http URL 제거하고 상대 경로만 사용
          if (item.imageUrl.includes('http://') || item.imageUrl.includes('https://')) {
            // URL에서 도메인 이후 경로만 추출
            const urlParts = item.imageUrl.split('/');
            // 첫 3개 부분(http:, '', domain) 제외하고 나머지 경로 사용
            imgPath = '/' + urlParts.slice(3).join('/');
          } else {
            imgPath = item.imageUrl;
            // 슬래시로 시작하지 않으면 추가
            if (!imgPath.startsWith('/')) imgPath = '/' + imgPath;
          }
        } else {
          // 기본 이미지 경로
          imgPath = '/PNG/placeholder.jpg';
        }
        
        img.src = imgPath;
        img.alt = item.name;
        
        // 이미지 오류 처리
        img.onerror = function() {
          console.error('이미지 로드 실패:', imgPath);
          if (item.category === 'weapon') {
            this.src = '/PNG/weapon/KakaoTalk_20250510_205732390.jpg';
          } else if (item.category === 'armor') {
            this.src = '/PNG/armor/KakaoTalk_20250510_205715529.jpg';
          } else {
            this.src = '/PNG/KakaoTalk_20250510_213329962.png';
          }
          this.onerror = null; // 무한 루프 방지
        };
        
        // 이름과 가격 설정
        const name = card.querySelector('[data-name]');
        name.textContent = item.name;
        
        const price = card.querySelector('[data-price]');
        price.textContent = `${item.price.toLocaleString()} 골드`;
        
        // 버튼에 이벤트 추가
        const buyBtn = card.querySelector('button:first-child');
        buyBtn.addEventListener('click', function() {
          alert(`${item.name} 구매 기능은 현재 사용할 수 없습니다. 로그인이 필요합니다.`);
        });
        
        // 상세정보 버튼 - 모달창으로 표시
        const infoBtn = card.querySelector('button:nth-child(2)');
        infoBtn.textContent = '상세정보';
        infoBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 모달창에 아이템 정보 표시
          const modal = document.getElementById('itemDetailModal');
          if (modal) {
            // 모달 데이터 설정
            document.getElementById('modalItemName').textContent = item.name;
            
            // 이미지 설정
            const imgPath = item.imageUrl ? (
              item.imageUrl.startsWith('/') ? item.imageUrl : `/${item.imageUrl}`
            ) : '/PNG/placeholder.jpg';
            const modalImg = document.getElementById('modalItemImage');
            modalImg.src = imgPath;
            modalImg.alt = item.name;
            modalImg.onerror = function() {
              this.src = '/PNG/placeholder.jpg';
            };
            
            // 등급 설정
            const modalRarity = document.getElementById('modalItemRarity');
            const rarityClass = rarityColorMap[item.rarity] ? 
              rarityColorMap[item.rarity].bg : 
              'bg-gray-500';
              
            modalRarity.className = `inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${rarityClass}`;
            modalRarity.textContent = rarityText;
            
            // 가격 정보
            document.getElementById('modalItemPrice').textContent = `${item.price.toLocaleString()} 골드`;
            
            // 설명
            document.getElementById('modalItemDesc').textContent = item.description || '상세 정보가 없습니다.';
            
            // 스탯 정보
            document.getElementById('modalItemStats').textContent = item.stats || '스탯 정보가 없습니다.';
            
            // 카테고리
            const categoryMap = {
              'weapon': '무기',
              'armor': '방어구',
              'potion': '마법약',
              'accessory': '장신구'
            };
            
            document.getElementById('modalItemCategory').textContent = categoryMap[item.category] || item.category || 'Unknown';
            document.getElementById('modalItemSubcategory').textContent = item.subcategory || '';
            
            // 모달 표시
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // 버튼 이벤트 하나씩
            document.getElementById('closeModal').onclick = closeItemModal;
            document.getElementById('closeModalButton').onclick = closeItemModal;
            document.getElementById('buyItemButton').onclick = function() {
              alert(`${item.name} 구매 기능은 현재 사용할 수 없습니다. 로그인이 필요합니다.`);
            };
            
            // 배경 클릭시 모달 닫기
            document.querySelector('.modal-bg').onclick = closeItemModal;
          } else {
            // 모달이 없는 경우 기본 alert 사용
            alert(`${item.name}\n\n등급: ${rarityText}\n가격: ${item.price.toLocaleString()} 골드\n\n${item.description || '정보가 없습니다.'}\n\n${item.stats ? '스탯: ' + item.stats : ''}`);
          }
          
          return false;
        };
        
        // 컨테이너에 추가
        container.appendChild(clone);
        
      } catch (err) {
        console.error(`아이템 렌더링 오류: ${err.message}`, err);
        
        // 오류 발생 시 기본 카드 생성
        try {
          const errorCard = document.createElement('div');
          errorCard.className = 'bg-white rounded-lg shadow-md overflow-hidden item-card p-4';
          errorCard.innerHTML = `
            <div class="p-2 flex justify-between items-center bg-red-100">
              <span class="text-red-500 font-bold">오류 발생</span>
            </div>
            <div class="p-4">
              <div class="flex flex-col items-center">
                <h3 class="text-lg font-bold mb-1">${item.name || '아이템'}</h3>
                <p class="text-sm text-gray-500">이 아이템 표시에 문제가 발생했습니다</p>
              </div>
            </div>
          `;
          container.appendChild(errorCard);
        } catch (backupError) {
          console.error('오류 카드 생성 중 문제 발생:', backupError);
        }
      }
    });
    
    console.log('아이템 렌더링 완료!');
  }
  
  // 이벤트 리스너 연결
  function setupEventListeners() {
    // 검색 및 필터링 이벤트
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(filterItems, 300));
    }
    
    const filters = ['gradeFilter', 'priceFilter', 'categoryFilter', 'subCategoryFilter'];
    filters.forEach(filterId => {
      const filter = document.getElementById(filterId);
      if (filter) {
        filter.addEventListener('change', filterItems);
      }
    });
  }
  
  // 디바운스 함수 - 검색 성능 향상
  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }
  
  // 초기화 함수
  function initMarketplace() {
    // 전역 변수 allItems가 없을 경우 모듈에서 가져오기 시도
    if (typeof allItems === 'undefined' || !Array.isArray(allItems)) {
      console.log('아이템 데이터를 전역변수에서 읽어오려고 시도합니다...');
      
      // 5초 대기 후 재시도
      setTimeout(() => {
        if (typeof window.allItems !== 'undefined' && Array.isArray(window.allItems)) {
          console.log('아이템 데이터 로드 성공!');
          filteredItems = [...window.allItems];
          setupEventListeners();
          renderPage();
          initRecommendedItems();
        } else {
          console.error('아이템 데이터가 로드되지 않았습니다. 페이지를 새로고침해 보세요.');
          // 대체 아이템 데이터 설정
          window.allItems = window.allItems || [
            // 기본 아이템 데이터 대체
            {
              id: '1',
              name: '마법 스태프',
              price: 1000,
              description: '마법 협회에서 마법사들의 마력을 보조해주는 기본 아이템',
              stats: '마력 +10',
              rarity: 'common',
              category: 'weapon',
              subcategory: 'staff',
              imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_01.jpg'
            }
          ];
          filteredItems = [...window.allItems];
          setupEventListeners();
          renderPage();
        }
      }, 1000);
      return;
    }
    
    // 필터링 적용
    filteredItems = [...window.allItems];
    console.log(`총 ${filteredItems.length}개 아이템을 가져왔습니다.`);
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 아이템 렌더링
    renderPage();
    
    // 30분마다 추천 아이템 표시 초기화
    initRecommendedItems();
  }
  
  // 추천 아이템 표시 초기화 함수
  function initRecommendedItems() {
    // 30분마다 추천 아이템 업데이트
    showRecommendedItems();
    setInterval(showRecommendedItems, 30 * 60 * 1000); // 30분 간격
  }
  
  // 추천 아이템 표시 함수
  function showRecommendedItems() {
    if (!allItems || !Array.isArray(allItems) || allItems.length === 0) {
      console.log('추천할 아이템이 없습니다.');
      return;
    }
    
    // 랜덤한 고급 아이템을 추천
    const highGradeItems = allItems.filter(item => 
      item.rarity === 'legendary' || item.rarity === 'epic' || item.rarity === 'rare'
    );
    
    if (highGradeItems.length === 0) {
      console.log('추천할 고급 아이템이 없습니다.');
      return;
    }
    
    // 랜덤 아이템 1개 선택
    const randomItem = highGradeItems[Math.floor(Math.random() * highGradeItems.length)];
    
    // 추천 아이템 표시 영역 가져오기
    const recommendedSection = document.getElementById('recommendedItemSection');
    if (!recommendedSection) return;
    
    // 추천 아이템 정보 설정
    const itemName = recommendedSection.querySelector('.recommended-item-name');
    if (itemName) itemName.textContent = randomItem.name;
    
    const itemGrade = recommendedSection.querySelector('.recommended-item-grade');
    if (itemGrade) {
      const rarityMap = {
        'legendary': '전설',
        'epic': '에픽',
        'rare': '희귀',
        'uncommon': '레어',
        'common': '일반'
      };
      itemGrade.textContent = rarityMap[randomItem.rarity] || '일반';
    }
    
    // 추천 섬네일 이미지 표시
    const itemImage = recommendedSection.querySelector('.recommended-item-image');
    if (itemImage) {
      let imgPath;
      if (randomItem.imageUrl) {
        imgPath = randomItem.imageUrl.startsWith('/') ? randomItem.imageUrl : `/${randomItem.imageUrl}`;
      } else {
        imgPath = '/PNG/placeholder.jpg';
      }
      itemImage.src = imgPath;
      itemImage.alt = randomItem.name;
      itemImage.onerror = function() {
        this.src = '/PNG/placeholder.jpg';
      };
    }
    
    // 추천 영역 보이기
    recommendedSection.style.display = 'block';
  }
  
  // 시작 - 모든 초기화 함수 실행
  initMarketplace();
});
