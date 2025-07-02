<script setup lang="ts">
// --- CORE IMPORTS ---
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { Icon } from "@iconify/vue";
// FIX: Import the type definition from the charting library.
import type { ApexOptions } from "apexcharts";

// --- PROPS ---
const props = defineProps<{
  jobs: Array<{ createdAt?: number | any; [key: string]: any }>;
}>();

// --- THEME MANAGEMENT ---
const isDarkMode = ref(false);
const updateTheme = () => {
  isDarkMode.value = document.documentElement.classList.contains("dark");
};
const getThemeColors = () => {
  const isDark = isDarkMode.value;
  const textColor = isDark
    ? "var(--text-color-dark)"
    : "var(--text-color-light)";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const accentColor = isDark
    ? "var(--green-accent-dark)"
    : "var(--green-accent-light)";
  return { textColor, gridColor, accentColor };
};

// --- CHART STATE AND DATA ---
const chartRef = ref<any>(null);
const renderChart = ref(false);
const currentView = ref<"3weeks" | "3months" | "yearly">("3weeks");
const jobCreationDates = computed(() => {
  return props.jobs
    .map((job) => {
      if (typeof job.createdAt === "number" && !isNaN(job.createdAt)) {
        return new Date(job.createdAt).toISOString();
      }
      return null;
    })
    .filter((date) => date !== null) as string[];
});

// --- LIFECYCLE HOOKS & WATCHERS ---
onMounted(() => {
  updateTheme();
  const observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  onUnmounted(() => observer.disconnect());
  renderNewChart();
});

watch(
  () => props.jobs,
  () => {
    renderNewChart();
  },
  { deep: true }
);

watch(isDarkMode, async (isDark) => {
  await nextTick();
  if (renderChart.value && chartRef.value) {
    applyChartTheme(isDark);
  }
});

const renderNewChart = async () => {
  renderChart.value = false;
  await nextTick();
  setInitialChartTheme();
  renderChart.value = true;
};

// --- DATA AGGREGATION & SERIES ---
// (This logic remains the same as before)
const threeWeeksData = computed(() =>
  aggregateData(jobCreationDates.value, "day", "3weeks")
);
const threeMonthData = computed(() =>
  aggregateData(jobCreationDates.value, "month", "3months")
);
const yearlyData = computed(() =>
  aggregateData(jobCreationDates.value, "month", "yearly")
);

const chartSeries = computed(() => {
  let dataToUse: { date: string; count: number }[];
  switch (currentView.value) {
    case "3weeks":
      dataToUse = threeWeeksData.value;
      break;
    case "3months":
      dataToUse = threeMonthData.value;
      break;
    case "yearly":
      dataToUse = yearlyData.value;
      break;
    default:
      dataToUse = threeWeeksData.value;
  }
  return [
    {
      name: "Applications",
      data: dataToUse.map((item) => [
        new Date(item.date).getTime(),
        item.count,
      ]),
    },
  ];
});

function aggregateData(
  dates: string[],
  groupBy: "day" | "month",
  viewType: "3weeks" | "3months" | "yearly"
) {
  const counts: { [key: string]: number } = {};
  dates.forEach((dateStr) => {
    const d = new Date(dateStr);
    let key: string;
    if (groupBy === "day") {
      key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getUTCDate()).padStart(2, "0")}`;
    } else {
      key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }
    counts[key] = (counts[key] || 0) + 1;
  });
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  let startDateUTC: Date;
  const endDateUTC = new Date(todayUTC);
  if (viewType === "3weeks") {
    startDateUTC = new Date(todayUTC);
    startDateUTC.setUTCDate(todayUTC.getUTCDate() - 20);
  } else if (viewType === "3months") {
    startDateUTC = new Date(todayUTC);
    startDateUTC.setUTCMonth(todayUTC.getUTCMonth() - 3);
  } else {
    startDateUTC = new Date(todayUTC);
    startDateUTC.setUTCFullYear(todayUTC.getUTCFullYear() - 1);
  }
  let currentDateIterUTC = new Date(startDateUTC);
  while (currentDateIterUTC <= endDateUTC) {
    if (groupBy === "day") {
      const key = `${currentDateIterUTC.getUTCFullYear()}-${String(
        currentDateIterUTC.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(currentDateIterUTC.getUTCDate()).padStart(
        2,
        "0"
      )}`;
      result.push({
        date: new Date(
          Date.UTC(
            currentDateIterUTC.getUTCFullYear(),
            currentDateIterUTC.getUTCMonth(),
            currentDateIterUTC.getUTCDate()
          )
        ).toISOString(),
        count: counts[key] || 0,
      });
      currentDateIterUTC.setUTCDate(currentDateIterUTC.getUTCDate() + 1);
    } else {
      const monthKey = `${currentDateIterUTC.getUTCFullYear()}-${String(
        currentDateIterUTC.getUTCMonth() + 1
      ).padStart(2, "0")}`;
      result.push({
        date: new Date(
          Date.UTC(
            currentDateIterUTC.getUTCFullYear(),
            currentDateIterUTC.getUTCMonth(),
            1
          )
        ).toISOString(),
        count: counts[monthKey] || 0,
      });
      currentDateIterUTC.setUTCMonth(currentDateIterUTC.getUTCMonth() + 1);
      currentDateIterUTC.setUTCDate(1);
    }
  }
  if (groupBy === "month") {
    const lastResultDate =
      result.length > 0 ? new Date(result[result.length - 1].date) : null;
    if (
      !lastResultDate ||
      lastResultDate.getUTCMonth() !== endDateUTC.getUTCMonth() ||
      lastResultDate.getUTCFullYear() !== endDateUTC.getUTCFullYear()
    ) {
      const monthKey = `${endDateUTC.getUTCFullYear()}-${String(
        endDateUTC.getUTCMonth() + 1
      ).padStart(2, "0")}`;
      result.push({
        date: new Date(
          Date.UTC(endDateUTC.getUTCFullYear(), endDateUTC.getUTCMonth(), 1)
        ).toISOString(),
        count: counts[monthKey] || 0,
      });
    }
  }
  return result;
}

// --- APEXCHARTS CONFIGURATION ---
// FIX: Explicitly type chartOptions with the imported ApexOptions type.
const chartOptions = ref<ApexOptions>({
  chart: {
    type: "line",
    height: 350,
    background: "transparent",
    zoom: { enabled: true },
    toolbar: { show: false, autoSelected: "zoom" },
  },
  xaxis: {
    type: "datetime",
    labels: {
      formatter: function (val: string, timestamp?: number) {
        if (timestamp) {
          const date = new Date(timestamp);
          if (
            currentView.value === "yearly" ||
            currentView.value === "3months"
          ) {
            return date
              .toLocaleString("en-US", { month: "short", year: "2-digit" })
              .replace(".", "");
          } else {
            return date.toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
            });
          }
        }
        return val;
      },
    },
    tooltip: { enabled: false },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => Math.round(val).toString(),
    },
    min: 0,
  },
  tooltip: {
    enabled: true,
    x: { format: "dd MMM" },
    y: { formatter: (val: number) => `${Math.round(val)} Applications` },
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 1.5,
  },
  markers: {
    size: 0,
    hover: { size: 4, sizeOffset: 3 },
  },
  grid: {
    row: { opacity: 0.1 },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: { height: 250 },
        xaxis: { labels: { rotate: -45 } },
      },
    },
  ],
});

// This function now works because TypeScript knows the full shape of chartOptions
const setInitialChartTheme = () => {
  const { textColor, gridColor, accentColor } = getThemeColors();
  chartOptions.value = {
    ...chartOptions.value,
    chart: {
      ...chartOptions.value.chart,
      background: isDarkMode.value
        ? "var(--background-color-dark)"
        : "var(--background-color-light)",
    },
    tooltip: {
      ...chartOptions.value.tooltip,
      theme: isDarkMode.value ? "dark" : "light",
      // style: { color: textColor }, // Removed unsupported property
      marker: { fillColors: [accentColor] },
    },
    stroke: { ...chartOptions.value.stroke, colors: [accentColor] },
    markers: {
      ...chartOptions.value.markers,
      colors: [accentColor],
      strokeColors: [accentColor],
    },
    xaxis: {
      ...chartOptions.value.xaxis,
      labels: {
        ...chartOptions.value.xaxis?.labels,
        style: { colors: Array(20).fill(textColor) },
      },
      axisBorder: { color: gridColor },
      axisTicks: { color: gridColor },
    },
    yaxis: Array.isArray(chartOptions.value.yaxis)
      ? chartOptions.value.yaxis.map((yAxisItem) => ({
          ...yAxisItem,
          labels: {
            ...(yAxisItem.labels || {}),
            style: { colors: Array(8).fill(textColor) },
          },
        }))
      : {
          ...chartOptions.value.yaxis,
          labels: {
            ...(chartOptions.value.yaxis &&
            (chartOptions.value.yaxis as any).labels
              ? (chartOptions.value.yaxis as any).labels
              : {}),
            style: { colors: Array(8).fill(textColor) },
          },
        },
    grid: {
      ...chartOptions.value.grid,
      row: {
        ...chartOptions.value.grid?.row,
        colors: [gridColor, "transparent"],
      },
      borderColor: gridColor,
    },
  };
};

const applyChartTheme = (isDark: boolean) => {
  if (!chartRef.value) return;
  const { textColor, gridColor, accentColor } = getThemeColors();
  chartRef.value.updateOptions({
    chart: {
      background: isDark
        ? "var(--background-color-dark)"
        : "var(--background-color-light)",
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      style: { color: textColor },
      marker: { colors: [accentColor] },
    },
    stroke: { colors: [accentColor] },
    markers: { colors: [accentColor], strokeColors: [accentColor] },
    xaxis: {
      labels: { style: { colors: Array(20).fill(textColor) } },
      axisBorder: { color: gridColor },
      axisTicks: { color: gridColor },
    },
    yaxis: { labels: { style: { colors: Array(8).fill(textColor) } } },
    grid: {
      row: { colors: [gridColor, "transparent"] },
      borderColor: gridColor,
    },
  });
};

const setTimeframe = (frame: "3weeks" | "3months" | "yearly") => {
  currentView.value = frame;
};
</script>

<template>
  <div class="border rounded border-color">
    <div class="mb-2 text-center">
      <button
        @click="setTimeframe('3weeks')"
        :class="[
          'p-2 mx-1 mt-3 ...',
          {
            'rounded bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)]':
              currentView === '3weeks',
          },
        ]">
        3 Weeks
      </button>
      <button
        @click="setTimeframe('3months')"
        :class="[
          'p-2 mx-1 mt-3 ...',
          {
            'rounded bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)]':
              currentView === '3months',
          },
        ]">
        3 Months
      </button>
      <button
        @click="setTimeframe('yearly')"
        :class="[
          'p-2 mx-1 mt-3 ...',
          {
            'rounded bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)]':
              currentView === 'yearly',
          },
        ]">
        Yearly
      </button>
    </div>

    <apexchart
      v-if="renderChart"
      ref="chartRef"
      type="line"
      height="350"
      :options="chartOptions"
      :series="chartSeries"></apexchart>

    <div v-else class="w-full">
      <div
        class="mt-3 mb-6 h-11 w-56 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded mx-auto animate-pulse"></div>
      <div
        class="flex mx-4 mb-6 h-54 sm:h-80 flex-col items-center justify-center rounded bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] animate-pulse">
        <Icon class="text-2xl text-gray-500" icon="svg-spinners:3-dots-fade" />
      </div>
    </div>
  </div>
  <p class="mb-0 text-center text-tiny sm:mb-4">applications / timeframe</p>
</template>
