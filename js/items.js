// 아이템 데이터 정의
const items = [
  {
    id: 1,
    name: '빛과 어둠',
    type: '쌍검',
    category: '무기',
    description: '빛과 어둠의 힘이 깃든 전설적인 쌍검. 어둠의 균형을 맞추어 사용하면 엄청난 위력을 발휘한다.',
    basePrice: 1250000,
    grade: '신화',
    stats: {
      '공격력': '+120',
      '크리티컬': '+15%',
      '공격속도': '+8%'
    }
  },
  {
    id: 2,
    name: '엘프의 활',
    type: '활',
    category: '무기',
    description: '엘프 장인이 만든 활. 가볍고 정확한 사격이 가능하다.',
    basePrice: 450000,
    grade: '영웅',
    stats: {
      '공격력': '+75',
      '명중률': '+12%',
      '사거리': '+15%'
    }
  },
  {
    id: 3,
    name: '다르킨의 낫',
    type: '낫',
    category: '무기',
    description: '다르킨 종족의 전통 무기. 넓은 범위의 공격이 가능하다.',
    basePrice: 820000,
    grade: '전설',
    stats: {
      '공격력': '+95',
      '광역공격': '+25%',
      '생명력 흡수': '+5%'
    }
  },
  {
    id: 4,
    name: '암흑군주의 활',
    type: '활',
    category: '무기',
    description: '암흑군주가 사용했던 활. 어둠의 힘을 담아 화살을 쏠 수 있다.',
    basePrice: 1120000,
    grade: '신화',
    stats: {
      '공격력': '+112',
      '어둠 속성': '+30%',
      '침투력': '+18%'
    }
  },
  {
    id: 5,
    name: '다르킨의 검',
    type: '단검',
    category: '무기',
    description: '다르킨 종족의 의식용 단검. 빠른 공격이 가능하다.',
    basePrice: 750000,
    grade: '전설',
    stats: {
      '공격력': '+85',
      '공격속도': '+15%',
      '회피율': '+10%'
    }
  },
  {
    id: 6,
    name: '일본도',
    type: '양손검',
    category: '무기',
    description: '동양의 기술로 만들어진, 균형 잡힌 검.',
    basePrice: 120000,
    grade: '레어',
    stats: {
      '공격력': '+48',
      '정확도': '+8%',
      '방어 관통': '+5%'
    }
  },
  {
    id: 7,
    name: '산적 두목의 검',
    type: '한손검',
    category: '무기',
    description: '산적 두목이 사용했던 검. 약탈의 행운이 깃들어 있다.',
    basePrice: 85000,
    grade: '희귀',
    stats: {
      '공격력': '+35',
      '골드 획득': '+8%',
      '치명타 확률': '+6%'
    }
  },
  {
    id: 8,
    name: '녹서스의 떠돌이 도끼',
    type: '도끼',
    category: '무기',
    description: '녹서스 영토를 떠돌며 쓰였던 평범한 도끼.',
    basePrice: 25000,
    grade: '일반',
    stats: {
      '공격력': '+20',
      '방어구 파괴': '+5%',
      '단단함': '+3%'
    }
  },
  {
    id: 9,
    name: '신의 활',
    type: '활',
    category: '무기',
    description: '신의 힘을 담은 활. 빛의 화살을 쏠 수 있다.',
    basePrice: 1200000,
    grade: '신화',
    stats: {
      '공격력': '+115',
      '빛 속성': '+30%',
      '치유력': '+10%'
    }
  },
  {
    id: 10,
    name: '칠흑의 양날도끼',
    type: '도끼',
    category: '무기',
    description: '칠흑 같은 어둠의 금속으로 만들어진 양날도끼. 강력한 파괴력을 가지고 있다.',
    basePrice: 820000,
    grade: '전설',
    stats: {
      '공격력': '+98',
      '방어구 파괴': '+22%',
      '어둠 속성': '+15%'
    }
  },
  {
    id: 11,
    name: '빙결 활',
    type: '활',
    category: '무기',
    description: '얼음의 힘이 깃든 활. 대상을 얼려버릴 수 있다.',
    basePrice: 450000,
    grade: '영웅',
    stats: {
      '공격력': '+78',
      '얼음 속성': '+25%',
      '슬로우 효과': '+15%'
    }
  },
  {
    id: 12,
    name: '떠돌이 지팡이',
    type: '지팡이',
    category: '무기',
    description: '떠돌이 마법사가 사용했던 평범한 지팡이.',
    basePrice: 28000,
    grade: '일반',
    stats: {
      '마법 공격력': '+25',
      '마나 재생': '+5%',
      '마법 속도': '+3%'
    }
  }
];

// 이미지 파일명 매핑 (실제 이미지 경로 지정)
const imageMap = {
  1: '/PNG/weapon/KakaoTalk_20250510_205732390.jpg',     // 빛과 어둠(쌍검) - 신화
  2: '/PNG/weapon/KakaoTalk_20250510_205732390_11.jpg', // 엘프의 활(활) - 영웅
  3: '/PNG/weapon/KakaoTalk_20250510_205732390_10.jpg', // 다르킨의 낫(낫) - 전설
  4: '/PNG/weapon/KakaoTalk_20250510_205732390_09.jpg', // 암흑군주의 활(활) - 신화
  5: '/PNG/weapon/KakaoTalk_20250510_205732390_08.jpg', // 다르킨의 검(단검) - 전설
  6: '/PNG/weapon/KakaoTalk_20250510_205732390_07.jpg', // 일본도(양손검) - 레어
  7: '/PNG/weapon/KakaoTalk_20250510_205732390_06.png', // 산적 두목의 검(한손검) - 희귀
  8: '/PNG/weapon/KakaoTalk_20250510_205732390_05.png', // 녹서스의 떠돌이 도끼(도끼) - 일반
  9: '/PNG/weapon/KakaoTalk_20250510_205732390_04.jpg', // 신의 활(활) - 신화
  10: '/PNG/weapon/KakaoTalk_20250510_205732390_03.jpg', // 칠흑의 양날도끼(도끼) - 전설
  11: '/PNG/weapon/KakaoTalk_20250510_205732390_02.jpg', // 빙결 활(활) - 영웅
  12: '/PNG/weapon/KakaoTalk_20250510_205732390_01.jpg'  // 떠돌이 지팡이(지팡이) - 일반
};

// 각 카테고리에 대한 서브카테고리 정의
const subcategories = {
  '무기': ['쌍검', '활', '낫', '단검', '양손검', '한손검', '도끼', '지팡이'],
  '방어구': ['투구', '갑옷', '모자', '장갑', '전신 방어구', '부적'],
  '악세서리': ['반지', '귀걸이', '목걸이', '팔찌'],
  '소비아이템': ['포션', '스크롤', '룬', '엘릭서']
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

// 모듈로 내보내기
export { 
  items, 
  imageMap, 
  subcategories,
  initItems, 
  getItemsForPage, 
  filterItems, 
  updateSubcategories 
};
