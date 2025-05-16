// 다른 모듈에서 함수와 객체 가져오기
import { 
  items, 
  imageMap, 
  subcategories,
  initItems, 
  getItemsForPage, 
  filterItems, 
  updateSubcategories 
} from './items.js';

import { 
  initializePriceHistory, 
  drawPriceChart, 
  openChartModal, 
  updateChart, 
  updatePriceHistory,
  getGradeColor,
  numberWithCommas
} from './chart.js';

// 페이지네이션 설정
const itemsPerPage = 8; // 페이지당 8개 아이템
let currentPage = 1;
let initialized = false;

// 필터링 상태 저장 변수
let currentFilters = {
  searchText: '',
  category: '전체',
  subcategory: '전체',
  grade: '전체'
};

// 현재 선택된 등급 및 시간 범위
let currentGrade = '신화';
let currentTimeRange = 24;

// 가격 업데이트 주기 관리
let priceUpdateInterval = null;

// 아이템 렌더링 함수
function renderItems(page, filteredItems) {
  console.log('renderItems 호출, 페이지: ' + page);
  const itemsToShow = getItemsForPage(page, filteredItems, itemsPerPage);
  
  console.table(itemsToShow.map(item => ({
    id: item.id,
    name: item.name,
    grade: item.grade,
    price: item.currentPrice,
    category: item.category,
    type: item.type
  })));
  
  // HTML 구조 확인
  console.log('페이지 HTML 구조 출력:');
  const mainContainers = document.querySelectorAll('.container');
  console.log('컨테이너 개수:', mainContainers.length);
  
  // container > div.space-y-8 > div.mt-8 요소 찾기
  const marketSection = document.querySelector('.container .mt-8');
  if (!marketSection) {
    console.error('아이템 그리드를 생성할 섹션(mt-8)을 찾을 수 없습니다.');
    return;
  }
  
  // 실제 item-grid 요소 확인
  let itemGrid = document.getElementById('item-grid');
  
  // item-grid가 없으면 새로 생성
  if (!itemGrid) {
    console.log('item-grid 요소를 찾을 수 없어 새로 생성합니다.');
    
    // HTML 구조 생성
    const h2 = document.createElement('h2');
    h2.className = 'text-2xl font-bold mb-4';
    h2.textContent = '거래 가능한 아이템';
    marketSection.appendChild(h2);
    
    const gridDiv = document.createElement('div');
    gridDiv.id = 'item-grid';
    gridDiv.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
    marketSection.appendChild(gridDiv);
    
    console.log('item-grid 요소 생성 완료');
    itemGrid = gridDiv;
  } else {
    console.log('기존 item-grid 요소 발견');
  }
  
  // 그리드 초기화
  itemGrid.innerHTML = '';
  console.log('아이템 그리드 초기화 완료');
  
  // 아이템이 없는 경우 메시지 표시
  if (itemsToShow.length === 0) {
    console.log('표시할 아이템이 없습니다.');
    itemGrid.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-gray-500 text-lg">검색 결과가 없습니다.</p>
      </div>
    `;
    return;
  }
  
  // 각 아이템 렌더링
  itemsToShow.forEach(item => {
    // 아이템 요소 생성
    const itemElement = document.createElement('div');
    itemElement.id = `item-${item.id}`;
    itemElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 item-card';
    
    // 등급 컬러 처리
    let gradeColorBg = 'bg-gray-100';
    let gradeColorText = 'text-gray-800';
    
    // 등급별 색상 설정
    switch(item.grade) {
      case '일반': 
        gradeColorBg = 'bg-gray-100';
        gradeColorText = 'text-gray-800';
        break;
      case '레어': 
        gradeColorBg = 'bg-green-100';
        gradeColorText = 'text-green-800';
        break;
      case '희귀': 
        gradeColorBg = 'bg-blue-100';
        gradeColorText = 'text-blue-800';
        break;
      case '영웅': 
        gradeColorBg = 'bg-purple-100';
        gradeColorText = 'text-purple-800';
        break;
      case '전설': 
        gradeColorBg = 'bg-red-100';
        gradeColorText = 'text-red-800';
        break;
      case '신화': 
        gradeColorBg = 'bg-yellow-100';
        gradeColorText = 'text-yellow-800';
        break;
      default: 
        gradeColorBg = 'bg-gray-100';
        gradeColorText = 'text-gray-800';
    }
    
    // 가격 변동 색상 및 표시 계산
    const priceChangeClass = item.priceChange > 0 ? 'text-green-500' : item.priceChange < 0 ? 'text-red-500' : 'text-gray-500';
    const priceChangeArrow = item.priceChange > 0 ? '↑' : item.priceChange < 0 ? '↓' : '';
    const priceChangePercent = item.priceChangePercent ? (item.priceChangePercent > 0 ? `+${item.priceChangePercent.toFixed(2)}%` : `${item.priceChangePercent.toFixed(2)}%`) : '0.00%';
    
    // 소속품 표시 범례
    const statsList = item.stats ? Object.entries(item.stats).map(([key, value]) => {
      return `<li class="text-xs text-gray-600"><span class="font-medium">${key}:</span> ${value}</li>`;
    }).join('') : '';

    // 아이템 HTML 생성
    itemElement.innerHTML = `
      <div class="relative pt-[100%] overflow-hidden">
        <img src="${item.imagePath}" alt="${item.name}" class="absolute top-0 left-0 w-full h-full object-contain p-2"
             onerror="this.onerror=null; this.src='https://dummyimage.com/300x300/${item.gradeColor}/FFFFFF&text=${encodeURIComponent(item.name)}'; console.log('이미지 로딩 오류: ' + this.alt);">
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">${item.name}</h3>
        <div class="flex items-center space-x-1 mb-1">
          <span class="${gradeColorBg} ${gradeColorText} text-xs px-2 py-1 rounded cursor-pointer show-chart-btn" data-grade="${item.grade}">${item.grade}</span>
          <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">${item.category || item.type || ''}</span>
        </div>
        <p class="text-sm text-gray-600 mb-2">${item.description || ''}</p>
        
        <div class="flex justify-between items-center">
          <div>
            <div class="text-lg font-bold">${numberWithCommas(item.currentPrice)} 골드</div>
            <div class="${priceChangeClass} text-xs">${priceChangeArrow} ${priceChangePercent}</div>
          </div>
          <button class="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors" data-item-id="${item.id}">구매</button>
        </div>
        ${item.stats ? `
          <div class="mt-2 pt-2 border-t border-gray-100">
            <h4 class="text-xs font-semibold text-gray-700 mb-1">속성</h4>
            <ul class="text-xs space-y-1">
              ${statsList}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    
    itemGrid.appendChild(itemElement);
    
    // 차트 버튼 클릭 이벤트 추가
    const chartBtn = itemElement.querySelector('.show-chart-btn');
    if (chartBtn) {
      chartBtn.addEventListener('click', () => {
        const grade = chartBtn.getAttribute('data-grade');
        console.log(`아이템 ${item.name}의 ${grade}등급 차트 버튼 클릭됨`);
        openChartModal(grade);
      });
    }
    
    // 구매 버튼 클릭 이벤트 추가
    const buyBtn = itemElement.querySelector('button[data-item-id]');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        showToast(`${item.name} 아이템을 구매했습니다!`);
      });
    }
  });
}

// 페이지네이션 렌더링 함수
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationElement = document.getElementById('pagination');
  
  if (!paginationElement) return;
  
  paginationElement.innerHTML = '';
  
  // 페이지가 5개 이하면 모든 페이지 표시
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      addPageButton(i, paginationElement);
    }
  } else {
    // 5개 초과시 현재 페이지 주변 페이지만 표시
    if (currentPage <= 3) {
      // 1, 2, 3, ... 마지막
      for (let i = 1; i <= 3; i++) {
        addPageButton(i, paginationElement);
      }
      addEllipsis(paginationElement);
      addPageButton(totalPages, paginationElement);
      
    } else if (currentPage >= totalPages - 2) {
      // 1, ... 마지막-2, 마지막-1, 마지막
      addPageButton(1, paginationElement);
      addEllipsis(paginationElement);
      for (let i = totalPages - 2; i <= totalPages; i++) {
        addPageButton(i, paginationElement);
      }
      
    } else {
      // 1, ... 현재-1, 현재, 현재+1, ... 마지막
      addPageButton(1, paginationElement);
      addEllipsis(paginationElement);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        addPageButton(i, paginationElement);
      }
      addEllipsis(paginationElement);
      addPageButton(totalPages, paginationElement);
    }
  }
  
  updateNavigationButtons(totalPages);
}

// 페이지 버튼 생성 헬퍼 함수
function addPageButton(pageNum, container) {
  const button = document.createElement('button');
  button.textContent = pageNum;
  button.className = pageNum === currentPage ? 
    'px-3 py-1 bg-indigo-600 text-white rounded' : 
    'px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200';
  
  button.addEventListener('click', () => {
    if (pageNum !== currentPage) {
      currentPage = pageNum;
      applyFilters();
    }
  });
  
  container.appendChild(button);
}

// 페이지 버튼 사이 줄임표(...) 추가 함수
function addEllipsis(container) {
  const span = document.createElement('span');
  span.textContent = '...';
  span.className = 'px-2 text-gray-500';
  container.appendChild(span);
}

// 이전/다음 버튼 업데이트 함수
function updateNavigationButtons(totalPages) {
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  
  if (prevBtn) {
    prevBtn.disabled = currentPage === 1;
  }
  
  if (nextBtn) {
    nextBtn.disabled = currentPage === totalPages;
  }
}

// 시계 업데이트 함수
function updateClock() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString('ko-KR');
  }
}

// 토스트 메시지 표시 함수
function showToast(message) {
  console.log('토스트 메시지:', message);
  const toastElement = document.getElementById('toast-message');
  
  if (toastElement) {
    toastElement.textContent = message;
    toastElement.classList.remove('opacity-0');
    toastElement.classList.add('opacity-100');
    
    // 3초 후 사라짐
    setTimeout(() => {
      toastElement.classList.remove('opacity-100');
      toastElement.classList.add('opacity-0');
    }, 3000);
  } else {
    console.error('토스트 메시지 요소를 찾을 수 없습니다.');
  }
}

// 실시간 가격 업데이트 시작 함수
function startRealTimePriceUpdates() {
  console.log('실시간 가격 업데이트 시작');
  
  // 이미 실행 중인 경우 중지
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
  }
  
  // 초기 가격 업데이트
  updateItemPrices();
  
  // 1초마다 가격 업데이트 (5초에서 더 빠른 1초로 변경)
  priceUpdateInterval = setInterval(() => {
    updateItemPrices();
  }, 1000);
  
  // 등급 버튼 클릭 이벤트 리스너 추가
  document.querySelectorAll('.grade-button').forEach(button => {
    button.addEventListener('click', function() {
      const grade = this.getAttribute('data-grade');
      console.log(`등급 버튼 클릭 발생: ${grade}`);
      currentGrade = grade;
      openChartModal(grade);
    });
    console.log(`등급 버튼 이벤트 추가 완료: ${button.getAttribute('data-grade')}`);
  });
  
  console.log('실시간 가격 업데이트 및 이벤트 리스너 설정 완료');
}

// 실시간 가격 업데이트 중지 함수
function stopRealTimePriceUpdates() {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
    priceUpdateInterval = null;
    console.log('실시간 가격 업데이트 중지됨');
  }
}

// 아이템 가격 업데이트 함수
function updateItemPrices() {
  const now = new Date();
  const timestamp = now.getTime();
  const formattedTime = now.toLocaleTimeString('ko-KR');
  
  // 등급별 변동 폭 설정
  const volatility = {
    '일반': 0.05,   // 5%
    '레어': 0.10,   // 10%
    '희귀': 0.15,   // 15%
    '영웅': 0.20,   // 20%
    '전설': 0.25,   // 25%
    '신화': 0.30    // 30%
  };
  
  // 등급별 평균 가격 추적
  const totalPriceByGrade = {};
  const countByGrade = {};
  
  items.forEach(item => {
    // 등급에 따른 변동성 설정
    const maxChange = volatility[item.grade] || 0.05;
    
    // 랜덤 가격 변동 (-maxChange% ~ +maxChange%)
    const changePercent = (Math.random() * maxChange * 2) - maxChange;
    const previousPrice = item.currentPrice;
    const newPrice = Math.round(previousPrice * (1 + changePercent));
    
    // 가격이 0 이하로 내려가지 않도록 보장
    item.currentPrice = Math.max(1, newPrice);
    
    // 가격 변동 및 퍼센트 계산
    item.priceChange = item.currentPrice - previousPrice;
    item.priceChangePercent = (item.priceChange / previousPrice) * 100;
    
    // HTML 업데이트
    const itemElement = document.getElementById(`item-${item.id}`);
    if (itemElement) {
      const priceElement = itemElement.querySelector('.font-bold');
      const changeElement = itemElement.querySelector('.text-xs');
      
      if (priceElement) {
        // 이전 애니메이션 클래스 제거
        priceElement.classList.remove('price-up', 'price-down');
        
        // 새 가격으로 업데이트
        priceElement.textContent = `${numberWithCommas(item.currentPrice)} 골드`;
        
        // 가격 변동에 따른 애니메이션 클래스 추가
        if (item.priceChange > 0) {
          priceElement.classList.add('price-up');
        } else if (item.priceChange < 0) {
          priceElement.classList.add('price-down');
        }
      }
      
      if (changeElement) {
        const priceChangeClass = item.priceChange > 0 ? 'text-green-500' : item.priceChange < 0 ? 'text-red-500' : 'text-gray-500';
        const priceChangeArrow = item.priceChange > 0 ? '↑' : item.priceChange < 0 ? '↓' : '';
        const priceChangePercent = item.priceChangePercent ? (item.priceChangePercent > 0 ? `+${item.priceChangePercent.toFixed(2)}%` : `${item.priceChangePercent.toFixed(2)}%`) : '0.00%';
        
        // 클래스 업데이트
        changeElement.className = `${priceChangeClass} text-xs`;
        
        // 텍스트 업데이트
        changeElement.textContent = `${priceChangeArrow} ${priceChangePercent}`;
      }
    }
    
    // 등급별 평균 가격 계산을 위한 데이터 수집
    const grade = item.grade;
    if (!totalPriceByGrade[grade]) totalPriceByGrade[grade] = 0;
    if (!countByGrade[grade]) countByGrade[grade] = 0;
    
    totalPriceByGrade[grade] += item.currentPrice;
    countByGrade[grade]++;
  });
  
  // 등급별 평균 가격 업데이트
  Object.keys(totalPriceByGrade).forEach(grade => {
    if (countByGrade[grade] > 0) {
      const averagePrice = Math.round(totalPriceByGrade[grade] / countByGrade[grade]);
      // 가격 기록 저장 및 차트 업데이트
      updatePriceHistory(grade, averagePrice);
    }
  });
}

// 필터 적용 함수
function applyFilters() {
  const searchText = document.getElementById('search-input').value || '';
  const categoryFilter = document.getElementById('category-filter').value;
  const subcategoryFilter = document.getElementById('subcategory-filter').value;
  const gradeFilter = document.getElementById('grade-filter').value;
  
  currentFilters = {
    searchText,
    category: categoryFilter,
    subcategory: subcategoryFilter,
    grade: gradeFilter
  };
  
  const filteredItems = filterItems(
    searchText,
    categoryFilter,
    subcategoryFilter,
    gradeFilter
  );
  
  console.log('필터링 결과:', filteredItems.length);
  renderItems(currentPage, filteredItems);
  renderPagination(filteredItems.length);
}

// 페이지 초기화 함수
function initializeMarketPage() {
  console.log('시장 페이지 초기화 시작');
  
  // 아이템 초기화
  initItems();
  
  // 가격 기록 초기화
  initializePriceHistory();
  
  // 필터 적용
  applyFilters();
  
  // 실시간 가격 업데이트 시작
  startRealTimePriceUpdates();
  
  initialized = true;
  console.log('시장 페이지 초기화 완료');
}

// 페이지 로드 시 이벤트 설정
document.addEventListener('DOMContentLoaded', function() {
  console.log('페이지 로드 완료 - 이벤트 리스너 설정 시작');
  
  // 필터링 이벤트 리스너 설정
  document.getElementById('search-button')?.addEventListener('click', applyFilters);
  document.getElementById('search-input')?.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      applyFilters();
    }
  });
  
  document.getElementById('category-filter')?.addEventListener('change', function() {
    const categoryFilter = this.value;
    updateSubcategories(categoryFilter);
    applyFilters();
  });
  
  document.getElementById('subcategory-filter')?.addEventListener('change', applyFilters);
  document.getElementById('grade-filter')?.addEventListener('change', applyFilters);
  
  // 이전 페이지 버튼 클릭 이벤트
  document.getElementById('prev-page')?.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  });
  
  // 다음 페이지 버튼 클릭 이벤트
  document.getElementById('next-page')?.addEventListener('click', function() {
    const totalFilteredItems = filterItems(
      currentFilters.searchText,
      currentFilters.category,
      currentFilters.subcategory,
      currentFilters.grade
    ).length;
    
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
    
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
    }
  });
  
  // 차트 모달 닫기 버튼 클릭 이벤트
  document.getElementById('close-chart-modal')?.addEventListener('click', function() {
    const priceChartModal = document.getElementById('price-chart-modal');
    if (priceChartModal) {
      priceChartModal.classList.add('hidden');
    }
  });
  
  // 차트 시간 범위 변경 이벤트
  document.getElementById('time-range')?.addEventListener('change', function() {
    const hours = parseInt(this.value);
    const gradeBtn = document.querySelector('.grade-btn.bg-indigo-600');
    const grade = gradeBtn ? gradeBtn.getAttribute('data-grade') : currentGrade;
    
    currentTimeRange = hours;
    updateChart(grade, hours);
  });
  
  // 모달 내부 등급 버튼 클릭 이벤트
  document.querySelectorAll('.grade-btn')?.forEach(btn => {
    btn.addEventListener('click', function() {
      const grade = this.getAttribute('data-grade');
      currentGrade = grade;
      
      // 다른 버튼들의 선택 상태 해제
      document.querySelectorAll('.grade-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-gray-200', 'text-gray-700');
      });
      
      // 현재 버튼 선택 상태로 변경
      this.classList.remove('bg-gray-200', 'text-gray-700');
      this.classList.add('bg-indigo-600', 'text-white');
      
      // 차트 업데이트
      updateChart(grade, currentTimeRange);
    });
  });
  
  // 시장 페이지 초기화 실행
  if (!initialized) {
    initializeMarketPage();
  }
  
  // 시계 업데이트
  setInterval(updateClock, 1000);
  updateClock();
  
  console.log('이벤트 리스너 설정 완료');
});

// 최초 실행
initializeMarketPage();
