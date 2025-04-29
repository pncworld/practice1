<template>
  <div class="flex items-center ml-20 space-x-2">
    <span class="ml-10 font-semibold text-base text-nowrap"
      >{{ FirstName }} :
    </span>
    <!-- <select name="" id="" class="w-32 h-8 rounded-lg border border-gray-500" v-model="startyear" @change="setStartYear">
            <option :value="i" v-for="i in settingYears">{{ i }}</option>
        </select> -->
    <v-select
      v-model="startyear"
      :options="settingYears"
      :placeholder="'선택'"
      class="custom-select8 w-32 bg-white"
      :reduce="(year) => year"
      @click="resetSelect1" />
    <!-- <select name="" id="" class="w-10 h-8 rounded-lg border border-gray-500" v-model="startmonth"  @change="setStartMonth">
            <option :value="i" v-for="i in Months">{{ i }}</option>
        </select> -->
    <v-select
      v-model="startmonth"
      :options="Months"
      :placeholder="'선택'"
      class="custom-select8 w-28 bg-white"
      :reduce="(month) => Number(month)"
      @click="resetSelect2" />
    <div v-if="hideEndDates">~</div>

    <!-- <select name="" id="" class="w-32 h-8 rounded-lg border border-gray-500" v-model="endyear"  @change="setEndYear">
            <option :value="i" v-for="i in settingYears">{{ i }}</option>
        </select> -->
    <v-select
      v-model="endyear"
      :options="settingYears"
      :placeholder="'선택'"
      class="custom-select8 w-32 bg-white"
      @click="resetSelect3"
      v-if="hideEndDates" />
    <!-- <select name="" id="" class="w-10 h-8 rounded-lg border border-gray-500" v-model="endmonth"  @change="setEndMonth">
            <option :value="i" v-for="i in Months">{{ i }}</option>
        </select> -->

    <v-select
      v-model="endmonth"
      :options="Months"
      :placeholder="'선택'"
      class="custom-select8 w-28 bg-white"
      @click="resetSelect4"
      v-if="hideEndDates" />
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";

const emit = defineEmits([
  "startYear",
  "startMonth",
  "endYear",
  "endMonth",
  "excelDate",
]);

const props = defineProps({
  hideEndDate: {
    type: Boolean,
    default: true,
  },
  firstName: {
    type: String,
    default: "해당연월",
  },
  nextMonth: {
    type: Boolean,
    default: false,
  },
  prevMonth: {
    type: Boolean,
    default: false,
  },
  initMonth: {
    type: Number,
    default: 0,
  },
  stopLimit: {
    type: Boolean,
    default: false,
  },
});
const hideEndDates = ref(props.hideEndDate);
const FirstName = ref(props.firstName);
const startyear = ref(null);
const startmonth = ref(1);
const endyear = ref();
const endmonth = ref(1);

const settingYears = ref([]);

let Months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const tempStartDateStack = [];
const tempEndDateStack = [];

watch(
  () => props.prevMonth,
  () => {
    const currentDate = new Date(
      parseInt(startyear.value, 10),
      parseInt(startmonth.value, 10) - 1,
      1
    );
    currentDate.setMonth(currentDate.getMonth() - 1);

    const startyear2 = currentDate.getFullYear();
    const startmonth2 = currentDate.getMonth() + 1;

    startyear.value = startyear2;
    startmonth.value = startmonth2;

    emit("startYear", startyear.value);
    emit("startMonth", startmonth.value);

    emit("excelDate", "해당월 : " + startyear.value + "-" + startmonth.value);
  }
);
watch(
  () => props.nextMonth,
  () => {
    const currentDate = new Date(
      parseInt(startyear.value, 10),
      parseInt(startmonth.value, 10) - 1,
      1
    );
    currentDate.setMonth(currentDate.getMonth() + 1);

    const startyear2 = currentDate.getFullYear();
    const startmonth2 = currentDate.getMonth() + 1;

    startyear.value = startyear2;
    startmonth.value = startmonth2;

    emit("startYear", startyear.value);
    emit("startMonth", startmonth.value);

    emit("excelDate", "해당월 : " + startyear.value + "-" + startmonth.value);
  }
);
onMounted(() => {
  const today = new Date();
  const lastMonth = new Date(today);

  lastMonth.setMonth(today.getMonth() - 1 + props.initMonth);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  startyear.value = lastMonth.getFullYear();
  endyear.value = currentYear;
  startmonth.value = lastMonth.getMonth() + 1;
  endmonth.value = currentMonth;
  for (let i = currentYear - 8; i <= currentYear + 5; i++) {
    settingYears.value.push(i);
  }

  settingYears.value.sort((a, b) => b - a);

  emit("startYear", startyear.value);
  emit("startMonth", startmonth.value);
  emit("endYear", endyear.value);
  emit("endMonth", endmonth.value);
  const startDate = `${startyear.value}-${String(startmonth.value).padStart(
    2,
    "0"
  )}-01`;
  const endDate = `${endyear.value}-${String(endmonth.value).padStart(
    2,
    "0"
  )}-01`;
  tempStartDateStack.push(startDate);
  tempEndDateStack.push(endDate);
  emit(
    "excelDate",
    "해당월 : " +
      currentYear +
      "-" +
      currentMonth +
      "~" +
      currentYear +
      "-" +
      currentMonth
  );
});

watch([startyear, startmonth, endyear, endmonth], () => {
  //     const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //     const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //     if(startDate.getTime() > endDate.getTime()){
  //      Swal.fire({
  //       title: '시작일이 종료일을 앞섭니다.',
  //       text: '시작일과 종료일을 다시 선택하세요.',
  //       icon: 'error',
  //       confirmButtonText: '확인'
  //     })
  //     const temp = new Date(tempStartDateStack.pop())
  //     //console.log(temp)
  //     startyear.value = temp.getFullYear()
  //     //console.log(startyear.value)
  //      startmonth.value = temp.getMonth()+1
  //      const temp2 = tempEndDateStack.pop().toISOString()
  //      endyear.value = temp2.split('-')[0]
  //      endmonth.value = temp2.split('-')[1]
  //     const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //     const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //     tempStartDateStack.push(startDate)
  //     tempEndDateStack.push(endDate)
  //     return;
  //   } else {
  //     emit('startYear', startyear.value)
  //     emit('startMonth', startmonth.value)
  //     emit('endYear', endyear.value)
  //     emit('endMonth', endmonth.value)
  //     emit('excelDate',  '해당월 : '+startyear.value+'-'+startmonth.value +'~'+endyear.value+'-'+endmonth.value)
  //     tempStartDateStack.push(startDate)
  //     tempEndDateStack.push(endDate)
  //   }
  //   //console.log(startyear.value)
});

const setEndMonth = () => {
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   if(startDate.getTime() > endDate.getTime()){
  //    Swal.fire({
  //     title: '시작일이 종료일을 앞섭니다.',
  //     text: '시작일과 종료일을 다시 선택하세요.',
  //     icon: 'error',
  //     confirmButtonText: '확인'
  //   })
  //   const temp = new Date(tempStartDateStack.pop())
  //   //console.log(temp)
  //    startyear.value = temp.getFullYear()
  //    startmonth.value = temp.getMonth()+1
  //    const temp2 =  new Date(tempEndDateStack.pop())
  //    endyear.value = temp2.getFullYear()
  //    endmonth.value = temp2.getMonth()+1
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   tempStartDateStack.push(startDate)
  //   tempEndDateStack.push(endDate)
  //   return;
  // } else {
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   tempStartDateStack.push(startDate)
  //   tempEndDateStack.push(endDate)
  // }
  //   emit('endMonth', endmonth.value)
  //   emit('excelDate', '해당월 : '+startyear.value+'-'+startmonth.value +'~'+endyear.value+'-'+endmonth.value)
};

watch(endmonth, () => {
  if (endmonth.value == null) {
    emit("endMonth", endmonth.value);
    emit(
      "excelDate",
      "해당월 : " +
        startyear.value +
        "-" +
        startmonth.value +
        "~" +
        endyear.value +
        "-" +
        endmonth.value
    );
    return;
  }
  const startDate = new Date(
    `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
  );
  const endDate = new Date(
    `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
  );
  if (startDate.getTime() > endDate.getTime()) {
    Swal.fire({
      title: "시작일이 종료일을 앞섭니다.",
      text: "시작일과 종료일을 다시 선택하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });

    const temp = new Date(tempStartDateStack.pop());
    //console.log(temp);

    startyear.value = temp.getFullYear();
    startmonth.value = temp.getMonth() + 1;

    const temp2 = new Date(tempEndDateStack.pop());
    endyear.value = temp2.getFullYear();
    endmonth.value = temp2.getMonth() + 1;

    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );
    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
    return;
  } else {
    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );

    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
  }

  emit("endMonth", endmonth.value);
  emit(
    "excelDate",
    "해당월 : " +
      startyear.value +
      "-" +
      startmonth.value +
      "~" +
      endyear.value +
      "-" +
      endmonth.value
  );
});
const setEndYear = () => {
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   if(startDate.getTime() > endDate.getTime()){
  //    Swal.fire({
  //     title: '시작일이 종료일을 앞섭니다.',
  //     text: '시작일과 종료일을 다시 선택하세요.',
  //     icon: 'error',
  //     confirmButtonText: '확인'
  //   })
  //   const temp = new Date(tempStartDateStack.pop())
  //   //console.log(temp)
  //    startyear.value = temp.getFullYear()
  //    startmonth.value = temp.getMonth()+1
  //    const temp2 =  new Date(tempEndDateStack.pop())
  //    endyear.value = temp2.getFullYear()
  //    endmonth.value = temp2.getMonth()+1
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   tempStartDateStack.push(startDate)
  //   tempEndDateStack.push(endDate)
  //   return;
  // } else {
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   tempStartDateStack.push(startDate)
  //   tempEndDateStack.push(endDate)
  // }
  //   emit('endYear', endyear.value)
  //   emit('excelDate', '해당월 : '+startyear.value+'-'+startmonth.value +'~'+endyear.value+'-'+endmonth.value)
};
watch(endyear, () => {
  if (endyear.value == null) {
    emit("endYear", endyear.value);
    emit(
      "excelDate",
      "해당월 : " +
        startyear.value +
        "-" +
        startmonth.value +
        "~" +
        endyear.value +
        "-" +
        endmonth.value
    );
    return;
  }
  const startDate = new Date(
    `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
  );
  const endDate = new Date(
    `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
  );
  if (startDate.getTime() > endDate.getTime()) {
    Swal.fire({
      title: "시작일이 종료일을 앞섭니다.",
      text: "시작일과 종료일을 다시 선택하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });

    const temp = new Date(tempStartDateStack.pop());
    //console.log(temp);

    startyear.value = temp.getFullYear();
    startmonth.value = temp.getMonth() + 1;

    const temp2 = new Date(tempEndDateStack.pop());
    endyear.value = temp2.getFullYear();
    endmonth.value = temp2.getMonth() + 1;

    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );
    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
    return;
  } else {
    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );

    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
  }

  emit("endYear", endyear.value);
  emit(
    "excelDate",
    "해당월 : " +
      startyear.value +
      "-" +
      startmonth.value +
      "~" +
      endyear.value +
      "-" +
      endmonth.value
  );
});
const setStartMonth = () => {
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   if(startDate.getTime() > endDate.getTime()){
  //    Swal.fire({
  //     title: '시작일이 종료일을 앞섭니다.',
  //     text: '시작일과 종료일을 다시 선택하세요.',
  //     icon: 'error',
  //     confirmButtonText: '확인'
  //   })
  //   const temp = new Date(tempStartDateStack.pop())
  //   //console.log(temp)
  //    startyear.value = temp.getFullYear()
  //    startmonth.value = temp.getMonth()+1
  //    const temp2 =  new Date(tempEndDateStack.pop())
  //    endyear.value = temp2.getFullYear()
  //    endmonth.value = temp2.getMonth()+1
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   tempStartDateStack.push(startDate)
  //   tempEndDateStack.push(endDate)
  //   return;
  // } else {
  //   const startDate = new Date(`${startyear.value}-${String(startmonth.value).padStart(2, '0')}-01`)
  //   const endDate = new Date(`${endyear.value}-${String(endmonth.value).padStart(2, '0')}-01`)
  //   tempStartDateStack.push(startDate)
  //   tempEndDateStack.push(endDate)
  // }
  //   emit('startMonth', startmonth.value)
  //   emit('excelDate', '해당월 : '+startyear.value+'-'+startmonth.value +'~'+endyear.value+'-'+endmonth.value)
};

watch(startmonth, () => {
  if (startmonth.value == null) {
    emit("startMonth", startmonth.value);
    emit(
      "excelDate",
      "해당월 : " +
        startyear.value +
        "-" +
        startmonth.value +
        "~" +
        endyear.value +
        "-" +
        endmonth.value
    );
    return;
  }
  const startDate = new Date(
    `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
  );
  const endDate = new Date(
    `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
  );
  if (startDate.getTime() > endDate.getTime() && !props.stopLimit) {
    Swal.fire({
      title: "시작일이 종료일을 앞섭니다.",
      text: "시작일과 종료일을 다시 선택하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });

    const temp = new Date(tempStartDateStack.pop());
    //console.log(temp);

    startyear.value = temp.getFullYear();
    startmonth.value = temp.getMonth() + 1;

    const temp2 = new Date(tempEndDateStack.pop());
    endyear.value = temp2.getFullYear();
    endmonth.value = temp2.getMonth() + 1;

    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );
    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
    return;
  } else {
    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );

    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
  }

  emit("startMonth", startmonth.value);
  emit(
    "excelDate",
    "해당월 : " +
      startyear.value +
      "-" +
      startmonth.value +
      "~" +
      endyear.value +
      "-" +
      endmonth.value
  );
});

const setStartYear = () => {};
watch(startyear, () => {
  if (startyear.value == null) {
    emit("startYear", startyear.value);
    emit(
      "excelDate",
      "해당월 : " +
        startyear.value +
        "-" +
        startmonth.value +
        "~" +
        endyear.value +
        "-" +
        endmonth.value
    );
    return;
  }
  const startDate = new Date(
    `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
  );
  const endDate = new Date(
    `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
  );
  if (startDate.getTime() > endDate.getTime() && !props.stopLimit) {
    Swal.fire({
      title: "시작일이 종료일을 앞섭니다.",
      text: "시작일과 종료일을 다시 선택하세요.",
      icon: "error",
      confirmButtonText: "확인",
    });

    const temp = new Date(tempStartDateStack.pop());
    //console.log(temp);

    startyear.value = temp.getFullYear();
    startmonth.value = temp.getMonth() + 1;

    const temp2 = new Date(tempEndDateStack.pop());
    endyear.value = temp2.getFullYear();
    endmonth.value = temp2.getMonth() + 1;

    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );

    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
    return;
  } else {
    const startDate = new Date(
      `${startyear.value}-${String(startmonth.value).padStart(2, "0")}-01`
    );
    const endDate = new Date(
      `${endyear.value}-${String(endmonth.value).padStart(2, "0")}-01`
    );

    tempStartDateStack.push(startDate);
    tempEndDateStack.push(endDate);
  }

  emit("startYear", startyear.value);
  emit(
    "excelDate",
    "해당월 : " +
      startyear.value +
      "-" +
      startmonth.value +
      "~" +
      endyear.value +
      "-" +
      endmonth.value
  );
});
const resetSelect1 = (e) => {
  startyear.value = null;
};
const resetSelect2 = (e) => {
  startmonth.value = null;
};
const resetSelect3 = (e) => {
  endyear.value = null;
};
const resetSelect4 = (e) => {
  endmonth.value = null;
};
const handleEnter1 = (e) => {
  //console.log(e);
};
</script>
