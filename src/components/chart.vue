<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";
import { onMounted, ref, watch } from "vue";

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
  },
  label: {
    type: Array,
    default: [],
  },
  datas: {
    type: Array,
    default: [[]],
  },
  chartName: {
    type: String,
    default: "",
  },
  getJson: {
    type: String,
    default: "",
  },
  colors: {
    type: Array,
    default: [],
  },
  print: {
    type: Boolean,
    default: false,
  },
  showLegend: {
    type: Boolean,
    default: true,
  },
  changePieData: {
    type: Boolean,
    default: false,
  },
});
Chart.register(zoomPlugin);

onMounted(() => {
  if (chartRef.value) {
    Chart.register(ChartDataLabels);
    console.log(props.datas);
    console.log(props.label);
    console.log(props.labels);
    const dataSet = ref([]);
    for (let i = 0; i < props.datas.length; i++) {
      dataSet.value.push({
        label: props.label[i],
        data: props.datas[i],
        borderColor: props.colors[i],
        backgroundColor: props.colors[i],
        borderWidth: 2,
      });
    }
    console.log(dataSet.labels);
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
            display: props.chartName != "" ? true : false, // 제목 표시 여부
            text: props.chartName, // 차트 제목 텍스트
          },
          legend: {
            display: props.showLegend, // 범례를 표시하지 않도록 설정
          },

          datalabels: {
            display: true, // 항상 표시
            color: "black", // 텍스트 색상
            anchor: "end", // 데이터 포인트의 끝에 라벨을 붙임
            align: "top", // 위쪽 정렬
            clip: false,
            formatter: (value) => value.toLocaleString(), // 표시할 값 포맷 (여기서는 그대로 표시)
          },
        },
        layout: {
          padding: {
            right: 40, // 오른쪽 여백을 더 추가
            left: 20,
            top: 20,
            bottom: 20,
          },
        },
        maintainAspectRatio: false,
      },
      backgroundColor: "white",
    });
  }
});

watch(
  () => props.datas,
  () => {
    if (chartRef.value && props.type != "pie") {
      Chart.register(ChartDataLabels);
      const dataSet = ref([]);
      for (let i = 0; i < props.datas.length; i++) {
        dataSet.value.push({
          label: props.label[i],
          data: props.datas[i],
          borderColor: props.colors[i],
          backgroundColor: props.colors[i],
          borderWidth: 2,
        });
      }
      if (chartInstance) {
        chartInstance.destroy();
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
              display: props.chartName != "" ? true : false, // 제목 표시 여부
              text: props.chartName, // 차트 제목 텍스트
            },
            legend: {
              display: props.showLegend, // 범례를 표시하지 않도록 설정
            },
            datalabels: {
              display: true, // 항상 표시
              color: "black", // 텍스트 색상
              anchor: "end", // 데이터 포인트의 끝에 라벨을 붙임
              align: "top", // 위쪽 정렬
              clip: false,
              offset: 10,
              formatter: (value) => value.toLocaleString(), // 표시할 값 포맷 (여기서는 그대로 표시)
            },
          },

          layout: {
            padding: {
              right: 40, // 오른쪽 여백을 더 추가
              left: 20,
              top: 20,
              bottom: 20,
            },
          },
          scales:
            props.type === "pie"
              ? {}
              : {
                  y: {
                    min: 0, // y축의 최소값을 0으로 설정
                  },
                },
        },
      });
    } else if (props.changePieData == false && props.type == "pie") {
      Chart.register(ChartDataLabels);
      const dataSet = ref({}); // 객체로 선언 (배열이 아니라)

      // 데이터 누적 처리
      let data = Array(props.label.length).fill(0); // 0으로 초기화

      for (let i = 0; i < props.label.length; i++) {
        for (let j = 0; j < props.datas[i].length; j++) {
          data[i] += props.datas[i][j]; // 정상적으로 누적
        }
      }

      if (chartInstance) {
        chartInstance.destroy();
      }
      console.log(data);

      chartInstance = new Chart(chartRef.value, {
        type: props.type,
        data: {
          labels: props.label, // labels를 key 값으로 사용
          datasets: [
            {
              data: data, // 각 항목의 데이터 값
              backgroundColor: props.colors, // 각 항목에 대한 배경 색상
              hoverBackgroundColor: props.colors, // 마우스 오버 시 색상
            },
          ], // 객체를 배열로 변환
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: props.chartName !== "",
              text: props.chartName,
            },
            datalabels: {
              display: true,
              color: "black",
              anchor: "end",
              align: "top",
              clip: false,
              offset: 10,
              formatter: (value) => value.toLocaleString(),
            },
          },
          layout: {
            padding: {
              right: 40,
              left: 20,
              top: 20,
              bottom: 20,
            },
          },
        },
      });
    } else if (props.changePieData == true && props.type == "pie") {
      Chart.register(ChartDataLabels);
      const dataSet = ref([]);
      for (let i = 0; i < props.datas.length; i++) {
        dataSet.value.push({
          label: props.label[i],
          data: props.datas[i],
          borderColor: props.colors,
          backgroundColor: props.colors,
          borderWidth: 2,
        });
      }
      if (chartInstance) {
        chartInstance.destroy();
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
              display: props.chartName != "" ? true : false, // 제목 표시 여부
              text: props.chartName, // 차트 제목 텍스트
            },
            legend: {
              display: props.showLegend, // 범례를 표시하지 않도록 설정
            },
            outlabels: {
              text: "%l %p",
              color: "white",
              stretch: 35,
              font: {
                resizable: true,
                minSize: 12,
                maxSize: 18,
              },
            },
            datalabels: {
              display: true, // 항상 표시
              color: "black", // 텍스트 색상
              anchor: "end", // 데이터 포인트의 끝에 라벨을 붙임
              align: "top", // 위쪽 정렬
              offset: 20,
              clip: false,
              formatter: (value) => value.toLocaleString(), // 표시할 값 포맷 (여기서는 그대로 표시)
            },
          },

          layout: {
            padding: {
              right: 40, // 오른쪽 여백을 더 추가
              left: 20,
              top: 20,
              bottom: 20,
            },
          },
          scales:
            props.type === "pie"
              ? {}
              : {
                  y: {
                    min: 0, // y축의 최소값을 0으로 설정
                  },
                },
        },
      });
    }
  }
);

watch(
  () => props.print,
  () => {
    const imageUrl = chartInstance.toBase64Image();

    // 새로운 창에 이미지를 표시
    const printWindow = window.open("", "", "width=800,height=600");

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
    printWindow.onload = function () {
      printWindow.focus(); // 프린트 창에 포커스
      printWindow.print(); // 인쇄
      printWindow.close(); // 인쇄 후 창 닫기
    };
  }
);
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
}
</style>
