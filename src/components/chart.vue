<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
const chartRef = ref(null);
let chartInstance = null;

const props = defineProps({
  type: {
    type: String,
    default: "bar",
  },
  labels: {
    type: Array,
    default: [],
  }
  ,
  label: {
    type: Array,
    default: [],
  }
  ,
  datas: {
    type: Array,
    default: [[]],
  }
  ,
  chartName: {
    type: String,
    default: '',
  }
  ,
  getJson: {
    type: String,
    default: '',
  }
  ,
  colors: {
    type: Array,
    default: [],
  }
  ,
  print: {
    type: Boolean,
    default: false,
  }
})
onMounted(() => {
  if (chartRef.value) {
    Chart.register(ChartDataLabels);
    console.log(props.datas)
    console.log(props.label)
    console.log(props.labels)
    const dataSet = ref([])
    for(let i=0 ; i < props.datas.length ; i++){
        dataSet.value.push({
          label: props.label[i],
          data: props.datas[i],
          borderColor: props.colors[i],
          backgroundColor: props.colors[i],
          borderWidth: 2,
        })
  
    }
    console.log(dataSet.labels)
    chartInstance = new Chart(chartRef.value, {
      type: props.type,
      data: {
        labels: props.labels,
        datasets: dataSet.value,
      },
      options: {
        responsive: true,
        plugins: {
         title: {
        display: props.chartName != '' ? true : false,        // 제목 표시 여부
        text: props.chartName,     // 차트 제목 텍스트
      },

      datalabels: {
            display: true,      // 항상 표시
            color: 'black',     // 텍스트 색상
            anchor: 'end',      // 데이터 포인트의 끝에 라벨을 붙임
            align: 'top',       // 위쪽 정렬
            clip : false ,
            formatter: (value) => value.toLocaleString(), // 표시할 값 포맷 (여기서는 그대로 표시)
      }
    },
    layout: {
      padding: {
        right: 40,  // 오른쪽 여백을 더 추가
        left: 20,
        top: 20,
        bottom: 20
      }
    },
        maintainAspectRatio: false,
      },
      backgroundColor: 'white',
    });
  }
});

watch(() => props.datas , () => {
    if (chartRef.value) {
    Chart.register(ChartDataLabels);
const dataSet = ref([])
for(let i=0 ; i < props.datas.length ; i++){
    dataSet.value.push({
      label: props.label[i],
      data: props.datas[i],
      borderColor: props.colors[i],
      backgroundColor: props.colors[i],
      borderWidth: 2,
    })

}
if(chartInstance) {
    chartInstance.destroy()
}
chartInstance = new Chart(chartRef.value, {
  type: props.type,
  data: {
    labels: props.labels,
    datasets: dataSet.value,
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: props.chartName != '' ? true : false,        // 제목 표시 여부
        text: props.chartName,     // 차트 제목 텍스트
      },
      datalabels: {
            display: true,      // 항상 표시
            color: 'black',     // 텍스트 색상
            anchor: 'end',      // 데이터 포인트의 끝에 라벨을 붙임
            align: 'top',       // 위쪽 정렬
            clip : false ,
            formatter: (value) => value.toLocaleString() // 표시할 값 포맷 (여기서는 그대로 표시)
      }
    },
    layout: {
      padding: {
        right: 40,  // 오른쪽 여백을 더 추가
        left: 20,
        top: 20,
        bottom: 20
      }
    },
  },
});
}
});

watch(() => props.print , ()=>{
    const imageUrl = chartInstance.toBase64Image();

// 새로운 창에 이미지를 표시
const printWindow = window.open('', '', 'width=800,height=600');

// 프린트할 컨텐츠를 새로운 창에 삽입
printWindow.document.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Print Chart</title>
    </head>
    <body>
      <img src="${imageUrl}" style="max-width:100%; display:block; margin: 0 auto;">
    </body>
  </html>
`);

// document.close() 후, 인쇄 명령을 호출
printWindow.document.close();

// 인쇄 명령 호출
printWindow.onload = function() {
  printWindow.focus(); // 프린트 창에 포커스
  printWindow.print(); // 인쇄
  printWindow.close(); // 인쇄 후 창 닫기
};
})
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartRef" ></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
}
</style>
