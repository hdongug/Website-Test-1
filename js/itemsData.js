// 모든 아이템 데이터
const allItems = [
  {
    id: '1',
    name: '마법 스태프',
    price: 1000,
    description: '맘법 협회에서 마법사들의 마력을 보조를 해주기 우이나 기본 아이템이다.',
    stats: '마력 +10 마나 회복: 5%',
    rarity: 'common',
    category: 'weapon',
    subcategory: 'staff',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_01.jpg'
  },
  {
    id: '2',
    name: '제국 도끼',
    price: 1000,
    description: '어느 제국의 근접전을 쓰는 이반 병사들의 무기이다.',
    stats: '공격력 +15 체력 +100',
    rarity: 'common',
    category: 'weapon',
    subcategory: 'axe',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_05.png'
  },
  {
    id: '3',
    name: '제국의 활',
    price: 1000,
    description: '아르카 제국의 궁수들이 사용하던 무기이다.',
    stats: '공격력 +10 치명타 데미지 5%',
    rarity: 'common',
    category: 'weapon',
    subcategory: 'bow',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_02.jpg'
  },
  {
    id: '4',
    name: '칠흑의 양날 도끼',
    price: 100000,
    description: '옛 어느 제국 국가에서 장군이 쓰던 도끼이다.',
    stats: '공격력 +100 체력 + 450 스킬 감소 25%',
    effect: '스킬 및 평타를 떄리면 방어력이 감소한다.(중첩횟수 5회, 최대 방어력 감소 25% 감소)',
    rarity: 'epic',
    category: 'weapon',
    subcategory: 'axe',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_03.jpg'
  },
  {
    id: '5',
    name: '천공의 활',
    price: 100000,
    description: '천공 제국 대장장이가 제작한 아이템이다.',
    stats: '공격력 +75 치명타 확률 +50 치명타 추가 데미지 25%',
    effect: '치명타가 터지면 5초 동안 공격속도가 200% 증가한다.',
    rarity: 'epic',
    category: 'weapon',
    subcategory: 'bow',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_04.jpg'
  },
  {
    id: '6',
    name: '사무라이의 검',
    price: 5000,
    description: '베른 제국의 권력층 사무라이들이 쓰던 검이다.',
    stats: '공격력 +50 공격속도 5% 치명타 +10%',
    rarity: 'rare',
    category: 'weapon',
    subcategory: 'sword',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_07.jpg'
  },
  {
    id: '7',
    name: '심연의 칼',
    price: 125000,
    description: '공허한 심연속에 있는 이름 모를 어느 황제 의 검이다.',
    stats: '공격력 +250 공격 속도 +75%',
    effect: '평타를 5번 이상 때리면 광폭화로 방마저가 10%깍이는 대신 공격력 이 200%증가한다.',
    effect2: '공격력이 750 이상일 경우 공격력을 추가적으로 500을 더 얻는다.',
    rarity: 'legendary',
    category: 'weapon',
    subcategory: 'sword',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_06.png'
  },
  {
    id: '8',
    name: '다르킨 단검',
    price: 125000,
    description: '이 아이템은 악마의 아이템으로 검으로 다르킨이라는 장비로 무기에 따라 특수 능력을 사용을 할 수 있다.',
    stats: '공격력 +1,500 공격속도 +250% 스킬 감속 +100',
    effect: '1중첩당 공격력의 10% 추가적으로 출혈 데미지와 최대 중첩까지 쌓으면 공격력을 25% 추가적으로 얻을 수 있다. 출 수 있다(최대 중첩 5회 + 최대 출혈 데미지 50% )',
    effect2: '다르킨 효과 : 다르킨의 장비로 맞추면 사신의 힘을 개방을 할 수 있으며, 1% 확률로 즉사를 시킬수 있다.',
    rarity: 'mythic',
    category: 'weapon',
    subcategory: 'dagger',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_08.jpg'
  },
  {
    id: '9',
    name: '아르테미스의 활',
    price: 500000,
    description: '아르테미스가 주로 쓰던 활이다.',
    stats: '공격력 + 2,000 공격속도 +200% 치명타 확률 +75 치명타 데미지 200%',
    effect: '치명타로 데미지 입을 시 1.5초간 출혈효과가 생긴다 (출혈 데미지 공격력 10%)',
    effect2: '25% 확률로 관통을 해서 뒤에 있는 몬스터도 맞출수 있다.',
    rarity: 'mythic',
    category: 'weapon',
    subcategory: 'bow',
    imageUrl: '/PNG/weapon/KakaoTalk_20250510_205732390_09.jpg'
  },
  {
    id: '10',
    name: '갑옷',
    price: 1000,
    description: '어느 제국의 갑옷이다.',
    stats: '방어력 +10 체력 +10',
    rarity: 'common',
    category: 'armor',
    subcategory: 'body',
    imageUrl: '/PNG/armor/KakaoTalk_20250510_205715529_01.png'
  },
  {
    id: '11',
    name: '에테르 장갑',
    price: 50000,
    description: '마검사들이 좋아하는 장갑이다.',
    stats: '방어력 +50 공격력 +50 체력 +50 공격속도 50% 마력 50%',
    effect: '공격력인 아이템을 마력으로 치환된다.',
    set: '에테르 장갑 + 에테르 후드 착용시 마력 100추가, 마력 100 추가',
    rarity: 'rare',
    category: 'armor',
    subcategory: 'gloves',
    imageUrl: '/PNG/armor/KakaoTalk_20250510_205715529_03.jpg'
  },
  {
    id: '12',
    name: '에테르 후드',
    price: 50000,
    description: '마검사들이 좋아하는 후드갑옷이다.',
    stats: '방어력 +150 체력 +450 마력 50%',
    effect: '스킬 감속 +20% 마력 +100',
    set: '에테르 장갑 + 에테르 후드 착용시 마력 100추가, 마력 100 추가',
    rarity: 'rare',
    category: 'armor',
    subcategory: 'body',
    imageUrl: '/PNG/armor/KakaoTalk_20250510_205715529.jpg'
  },
  {
    id: '100',
    name: '체력회복',
    price: 2500,
    description: '일반 물약이다.',
    effect: '10초 동안 전체 체력의 5%씩 체력을 회복을 한다.',
    rarity: 'common',
    category: 'potion',
    subcategory: 'healing',
    imageUrl: '/PNG/potion/KakaoTalk_20250510_213329962.png'
  }
];

// 등급 표시 색상 맵핑
const rarityColors = {
  'common': 'gray-500',
  'uncommon': 'green-500',
  'rare': 'blue-500',
  'epic': 'purple-500',
  'legendary': 'orange-500',
  'mythic': 'pink-500',
  'unique': 'red-500'
};

// 등급 표시 이름 맵핑
const rarityNameMap = {
  'common': '일반',
  'uncommon': '희귀',
  'rare': '레어',
  'epic': '에픽',
  'legendary': '전설',
  'mythic': '신화',
  'unique': '고유'
};
