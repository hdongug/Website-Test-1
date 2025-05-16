// 가격 기록을 저장하기 위한 구조
let priceHistory = {
  '일반': [],
  '레어': [],
  '희귀': [],
  '영웅': [],
  '전설': [],
  '신화': []
};

// 등급별 평균 가격 기록
let averagePriceHistory = {
  '일반': [],
  '레어': [],
  '희귀': [],
  '영웅': [],
  '전설': [],
  '신화': []
};

// 차트 객체 참조
let priceChart = null;

// 가격 기록 초기화 함수
function initializePriceHistory() {
  const grades = ['일반', '레어', '희귀', '영웅', '전설', '신화'];
  
  // 현재 시간에서 24시간 전부터 시작하는 가격 기록 초기화
  const now = new Date();
  const baseTime = now.getTime() - (24 * 60 * 60 * 1000); // 24시간 전
  
  // 각 등급별로 1시간 간격의 더미 데이터 생성
  grades.forEach(grade => {
    priceHistory[grade] = [];
    averagePriceHistory[grade] = [];
    
    // 24시간 동안의 가격 데이터 생성 (1시간 간격)
    for (let i = 0; i < 24; i++) {
      const entryTime = new Date(baseTime + (i * 60 * 60 * 1000));
      const timestamp = entryTime.getTime();
      const formattedTime = entryTime.toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'});
      
      // 등급에 따른 기본 가격 범위 설정
      let basePrice = 0;
      switch(grade) {
        case '일반': basePrice = 30000; break;
        case '레어': basePrice = 120000; break;
        case '희귀': basePrice = 250000; break;
        case '영웅': basePrice = 500000; break;
        case '전설': basePrice = 800000; break;
        case '신화': basePrice = 1200000; break;
      }
      
      // 약간의 랜덤 변동 추가
      const randomVariation = Math.random() * 0.1 - 0.05; // -5% ~ +5%
      const price = basePrice * (1 + randomVariation);
      
      // 가격 기록 추가
      priceHistory[grade].push({
        timestamp,
        time: formattedTime,
        price: Math.round(price)
      });
      
      // 평균 가격 기록 추가
      averagePriceHistory[grade].push({
        timestamp,
        time: formattedTime,
        price: Math.round(price)
      });
    }
  });
  
  console.log('가격 기록 초기화 완료');
}

// 차트 그리기 함수
function drawPriceChart(grade, hours = 24) {
  console.log(`${grade}급 아이템 차트 그리기 시작, 시간 범위: ${hours}시간`);
  
  const ctx = document.getElementById('price-chart').getContext('2d');
  
  // 데이터가 없는 경우 초기화
  if (!priceHistory[grade] || priceHistory[grade].length === 0) {
    console.warn('가격 기록이 없습니다. 초기화를 진행합니다.');
    initializePriceHistory();
  }
  
  // 시간 범위에 맞는 데이터 필터링
  const now = new Date().getTime();
  const timeLimit = now - (hours * 60 * 60 * 1000);
  const filteredData = priceHistory[grade].filter(entry => entry.timestamp >= timeLimit);
  const averageData = averagePriceHistory[grade].filter(entry => entry.timestamp >= timeLimit);
  
  // 차트 데이터 준비
  const chartData = {
    labels: filteredData.map(entry => entry.time),
    datasets: [
      {
        label: `${grade}급 아이템 가격`,
        data: filteredData.map(entry => entry.price),
        borderColor: getGradeColor(grade),
        backgroundColor: getGradeColor(grade, 0.2),
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.4,
        fill: true
      },
      {
        label: `${grade}급 평균 가격`,
        data: averageData.map(entry => entry.price),
        borderColor: getGradeColor(grade, 0.7),
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.4,
        fill: false
      }
    ]
  };
  
  // 이미 차트가 있는 경우 파괴
  if (priceChart) {
    priceChart.destroy();
  }
  
  // 새 차트 생성
  priceChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += numberWithCommas(context.parsed.y) + '골드';
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: '시간',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: true,
            text: '가격 (골드)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            callback: function(value) {
              return numberWithCommas(value);
            }
          }
        }
      }
    }
  });
  
  console.log(`${grade}급 아이템 차트 그리기 완료`);
}

// 등급에 따른 색상 반환 함수
function getGradeColor(grade, alpha = 1) {
  let color;
  
  switch(grade) {
    case '일반': color = `rgba(160, 160, 160, ${alpha})`; break; // 회색
    case '레어': color = `rgba(76, 175, 80, ${alpha})`; break;  // 녹색
    case '희귀': color = `rgba(33, 150, 243, ${alpha})`; break;  // 파랑
    case '영웅': color = `rgba(156, 39, 176, ${alpha})`; break;  // 보라
    case '전설': color = `rgba(244, 67, 54, ${alpha})`; break;   // 빨강
    case '신화': color = `rgba(255, 152, 0, ${alpha})`; break;   // 주황
    default: color = `rgba(160, 160, 160, ${alpha})`;
  }
  
  return color;
}

// 숫자에 콤마 추가 함수
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 차트 모달 열기 함수
function openChartModal(grade) {
  console.log('차트 모달 열기: ' + grade + ' 등급');
  
  // 현재 등급 및 시간 범위 설정
  const currentGrade = grade;
  const currentTimeRange = 24; // 기본값 24시간으로 설정
  
  // 차트 모달 타이틀 설정
  const modalTitle = document.querySelector('#price-chart-modal .p-4.border-b h2');
  if (modalTitle) {
    modalTitle.textContent = `${grade}급 아이템 가격 변동`;
    console.log('차트 모달 타이틀 설정: ' + modalTitle.textContent);
  }
  
  // 모달 표시
  const priceChartModal = document.getElementById('price-chart-modal');
  if (priceChartModal) {
    priceChartModal.classList.remove('hidden');
  }
  
  // 이미 모달 타이틀이 설정되어 있음
  
  // 현재 선택된 등급 버튼 표시
  document.querySelectorAll('.grade-btn').forEach(btn => {
    if (btn.getAttribute('data-grade') === grade) {
      btn.classList.add('bg-indigo-600');
      btn.classList.add('text-white');
      btn.classList.remove('bg-gray-200');
      btn.classList.remove('text-gray-700');
    } else {
      btn.classList.remove('bg-indigo-600');
      btn.classList.remove('text-white');
      btn.classList.add('bg-gray-200');
      btn.classList.add('text-gray-700');
    }
  });
  
  // 시간 범위 표시
  const timeRangeElement = document.getElementById('time-range');
  if (timeRangeElement) {
    timeRangeElement.value = currentTimeRange;
  }
  
  // 차트 그리기
  drawPriceChart(grade, currentTimeRange);
}

// 차트 업데이트 함수
function updateChart(grade, hours) {
  drawPriceChart(grade, hours);
}

// 가격 기록 업데이트 함수 - 실시간 업데이트에서 호출됨
function updatePriceHistory(grade, averagePrice) {
  const now = new Date();
  const timestamp = now.getTime();
  const formattedTime = now.toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'});
  
  // 새 가격 기록 추가
  priceHistory[grade].push({
    timestamp,
    time: formattedTime,
    price: averagePrice
  });
  
  // 1시간 간격으로 평균 가격 기록 추가
  const lastAvgEntry = averagePriceHistory[grade][averagePriceHistory[grade].length - 1];
  if (!lastAvgEntry || timestamp - lastAvgEntry.timestamp >= 60 * 60 * 1000) {
    averagePriceHistory[grade].push({
      timestamp, 
      time: formattedTime,
      price: averagePrice
    });
  }
  
  // 24시간 이상 된 데이터 제거
  const timeLimit = timestamp - (24 * 60 * 60 * 1000);
  priceHistory[grade] = priceHistory[grade].filter(entry => entry.timestamp >= timeLimit);
  averagePriceHistory[grade] = averagePriceHistory[grade].filter(entry => entry.timestamp >= timeLimit);
  
  // 현재 차트가 표시되고 있고 해당 등급의 차트라면 업데이트
  const priceChartModal = document.getElementById('price-chart-modal');
  const currentSelectedGrade = document.querySelector('.grade-btn.bg-indigo-600')?.getAttribute('data-grade');
  
  if (priceChartModal && !priceChartModal.classList.contains('hidden') && currentSelectedGrade === grade) {
    const timeRangeElement = document.getElementById('time-range');
    const hours = timeRangeElement ? parseInt(timeRangeElement.value) : 24;
    updateChart(grade, hours);
  }
}

// 모듈로 내보내기
export { 
  initializePriceHistory, 
  drawPriceChart, 
  openChartModal, 
  updateChart, 
  updatePriceHistory,
  getGradeColor,
  numberWithCommas
};
