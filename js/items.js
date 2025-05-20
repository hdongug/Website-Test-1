// 아이템 데이터 정의 - itemsData.js의 데이터 사용
let items = [];

// itemsData.js의 allItems 사용
// 이 코드는 window.allItems가 있을 경우 가져옴
// 로드 순서에 따라 동작하도록 함수로 감싸고 DOMContentLoaded 이벤트에서 실행

function loadItemsData() {
  console.log('아이템 데이터 불러오기 시도');
  
  if (typeof window !== 'undefined' && window.allItems && Array.isArray(window.allItems)) {
    console.log('외부 allItems 데이터 사용, 개수:', window.allItems.length);
    
    // allItems의 데이터 형식을 로컬 items 형식에 맞게 변환
    items = window.allItems.map(item => {
      // 이름 형식 변환
      const formattedStats = {};
      if (item.stats) {
        // 문자열 형태의 stats를 객체 형태로 변환 시도
        const statParts = item.stats.split(' ');
        statParts.forEach(part => {
          const match = part.match(/([^+:\s]+)\s*([+:]\s*\d+%?)/);
          if (match) {
            formattedStats[match[1]] = match[2];
          }
        });
      }
      
      // 등급 이름 변환 (영문 -> 한글)
      const gradeMap = {
        'common': '일반',
        'uncommon': '희귀',
        'rare': '레어',
        'epic': '영웅',
        'legendary': '전설',
        'mythic': '신화',
        'unique': '고유'
      };
      
      const grade = gradeMap[item.rarity] || item.rarity;
      
      // 카테고리 변환 (영문 -> 한글)
      const categoryMap = {
        'weapon': '무기',
        'armor': '방어구',
        'potion': '물약',
        'accessory': '장신구'
      };
      
      const category = categoryMap[item.category] || item.category;
      
      return {
        id: parseInt(item.id) || Math.floor(Math.random() * 1000),
        name: item.name,
        type: item.subcategory || '',
        category: category,
        description: item.description || '',
        basePrice: item.price || 0,
        currentPrice: item.price || 0,
        grade: grade,
        stats: formattedStats,
        effect: item.effect || '',
        effect2: item.effect2 || '',
        set: item.set || '',
        imagePath: item.imageUrl || ''
      };
    });
    
    console.log('변환된 아이템 데이터:', items.length, '개');
  } else {
    console.warn('window.allItems 데이터가 없습니다. 공통 아이템 데이터 로드 오류');
  }
}

// 이미지 파일명 매핑 (실제 이미지 경로 지정)
const imageMap = {
  // 무기류
  1: '/PNG/weapon/KakaoTalk_20250510_205732390_01.jpg',  // 마법 스태프 - 일반
  2: '/PNG/weapon/KakaoTalk_20250510_205732390_05.png',  // 제국 도끼 - 일반
  3: '/PNG/weapon/KakaoTalk_20250510_205732390_02.jpg',  // 제국의 활 - 일반
  4: '/PNG/weapon/KakaoTalk_20250510_205732390_03.jpg',  // 칠흑의 양날 도끼 - 영웅
  5: '/PNG/weapon/KakaoTalk_20250510_205732390_04.jpg',  // 천공의 활 - 영웅
  6: '/PNG/weapon/KakaoTalk_20250510_205732390_07.jpg',  // 사무라이의 검 - 레어
  7: '/PNG/weapon/KakaoTalk_20250510_205732390_06.png',  // 심연의 칼 - 전설
  8: '/PNG/weapon/KakaoTalk_20250510_205732390_08.jpg',  // 다르킨 단검 - 신화
  9: '/PNG/weapon/KakaoTalk_20250510_205732390_09.jpg',  // 아르테미스의 활 - 신화
  // 방어구류
  10: '/PNG/armor/KakaoTalk_20250510_205715529_01.png', // 갑옷 - 일반
  11: '/PNG/armor/KakaoTalk_20250510_205715529_03.jpg', // 에테르 장갑 - 레어
  12: '/PNG/armor/KakaoTalk_20250510_205715529.jpg',     // 에테르 후드 - 레어
  // 물약류
  100: '/PNG/potion/KakaoTalk_20250510_213329962.png'    // 체력회복 - 일반
};

// 각 카테고리에 대한 서브카테고리 정의
const subcategories = {
  '무기': ['검', '도끼', '활', '단검', '지팡이'],
  '방어구': ['갑옷', '장갑', '모자'],
  '물약': ['회복약', '버프'],
  '장신구': ['반지', '목걸이', '팔찌']
};

// 아이템 초기화 함수
function initItems() {
  console.log('아이템 초기화 시작');
  
  items.forEach(item => {
    // 각 아이템에 초기 가격 설정
    item.currentPrice = item.basePrice;
    item.priceChange = 0;
    item.priceChangePercent = 0;
    
    // 실제 이미지 파일 사용 (PNG/weapon/ 폴더에 있는 이미지)
    // 해당 아이템 ID에 매핑된 이미지 경로 사용
    item.imagePath = imageMap[item.id] || `/PNG/weapon/KakaoTalk_20250510_205732390_01.jpg`;
    
    // 차트용 색상 설정 처리
    let bgColor = 'CCCCCC';
    switch(item.grade) {
      case '일반': bgColor = 'CCCCCC'; break;
      case '레어': bgColor = '4CAF50'; break;
      case '희귀': bgColor = '2196F3'; break;
      case '영웅': bgColor = '9C27B0'; break;
      case '전설': bgColor = 'F44336'; break;
      case '신화': bgColor = 'FF9800'; break;
      default: bgColor = 'CCCCCC';
    }
    
    // 이미지 로딩 오류 시 대체 처리를 위한 작업 (onerror 에서 처리될 것)
    item.gradeColor = bgColor; // 차트용 색상 저장
  });
  
  console.log('아이템 초기화 완료');
  return items;
}

// 페이지에 해당하는 아이템 가져오기
function getItemsForPage(page, filteredItems, itemsPerPage) {
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  return filteredItems.slice(startIdx, endIdx);
}

// 필터링 함수 - 카테고리, 서브카테고리, 등급에 따라 아이템 필터링
function filterItems(searchText, categoryFilter, subcategoryFilter, gradeFilter) {
  console.log('아이템 필터링 시작:');
  console.log('- 검색어:', searchText);
  console.log('- 카테고리:', categoryFilter);
  console.log('- 서브카테고리:', subcategoryFilter);
  console.log('- 등급:', gradeFilter);
  
  return items.filter(item => {
    // 검색어 필터링
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    // 카테고리 필터링
    if (categoryFilter && categoryFilter !== '전체' && item.category !== categoryFilter) {
      return false;
    }
    
    // 서브카테고리 필터링
    if (subcategoryFilter && subcategoryFilter !== '전체' && item.type !== subcategoryFilter) {
      return false;
    }
    
    // 등급 필터링
    if (gradeFilter && gradeFilter !== '전체' && item.grade !== gradeFilter) {
      return false;
    }
    
    return true;
  });
}

// 필터링 이벤트 리스너 설정을 위한 helper 함수
function updateSubcategories(categoryFilter) {
  const subcategorySelect = document.getElementById('subcategory-filter');
  if (!subcategorySelect) return;
  
  // 서브카테고리 옵션 초기화
  subcategorySelect.innerHTML = '<option value="전체">전체</option>';
  
  // 선택된 카테고리가 '전체'인 경우 모든 서브카테고리를 보여주지 않음
  if (categoryFilter === '전체') {
    subcategorySelect.disabled = true;
    return;
  }
  
  // 해당 카테고리의 서브카테고리 옵션 추가
  const subCats = subcategories[categoryFilter] || [];
  subCats.forEach(subcat => {
    const option = document.createElement('option');
    option.value = subcat;
    option.textContent = subcat;
    subcategorySelect.appendChild(option);
  });
  
  // 서브카테고리 선택 활성화
  subcategorySelect.disabled = false;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
  console.log('items.js DOM 로드 완료, 아이템 데이터 불러오기 시작');
  loadItemsData();
  initItems();
});

// 모듈로 내보내기
export { 
  items, 
  imageMap, 
  subcategories,
  initItems, 
  getItemsForPage, 
  filterItems, 
  updateSubcategories,
  loadItemsData
};
