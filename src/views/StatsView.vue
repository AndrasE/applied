<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
import { useAppStore } from "@/stores/jobs";

// Initialize the store
const appStore = useAppStore();

// --- Theme Detection (Unchanged) ---
const isDarkMode = ref(false);
const updateTheme = () => {
  isDarkMode.value = document.documentElement.classList.contains("dark");
};

onMounted(() => {
  updateTheme();
  const observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  onUnmounted(() => observer.disconnect());
});

// --- NEW: Ref for the chart instance ---
const chartRef = ref<any>(null);

// Reactive flag to control chart visibility (for ApexCharts re-render)
const renderChart = ref(false);

// --- Data & State from Store (Unchanged) ---
const currentView = ref<"3weeks" | "3months" | "yearly">("3weeks");
const jobCreationDatesFromStore = computed(() => {
  return appStore.jobs
    .map((job) => {
      if (typeof job.createdAt === "number" && !isNaN(job.createdAt)) {
        return new Date(job.createdAt).toISOString();
      }
      return null;
    })
    .filter((date) => date !== null) as string[];
});

// Watchers for data fetching and logging (Unchanged)
watch(
  jobCreationDatesFromStore,
  (newDates) => {
    // ... (your console logs are fine here)
  },
  { immediate: true }
);

watch(
  () => appStore.isCurrentlyFetching,
  (newVal) => {
    if (!newVal) {
      nextTick(() => {
        renderChart.value = true;
      });
    } else {
      renderChart.value = false;
    }
  },
  { immediate: true }
);

onMounted(() => {
  window.scrollTo(0, 0);
  appStore.ensureJobsListenerActive();
});

// Computed properties for data aggregation (Unchanged)
const threeWeeksData = computed(() =>
  aggregateData(jobCreationDatesFromStore.value, "day", "3weeks")
);
const threeMonthData = computed(() =>
  aggregateData(jobCreationDatesFromStore.value, "month", "3months")
);
const yearlyData = computed(() =>
  aggregateData(jobCreationDatesFromStore.value, "year", "yearly")
);

// Computed property for chart SERIES data (Unchanged - this is correct)
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

// --- REVISED: Chart Options are now a static ref ---
// This object is created only ONCE and will not cause re-renders.
// Theme-dependent properties are omitted and will be set by a watcher.
const chartOptions = ref({
  chart: {
    type: "line",
    height: 350,
    background: "transparent", // Set dynamically
    zoom: { enabled: true },
    toolbar: { show: false, autoSelected: "zoom" },
  },
  xaxis: {
    type: "datetime",
    labels: {
      datetimeFormatter: { year: "yyyy", month: "MMM 'yy", day: "dd MMM" },
      style: { fontSize: "12px", fontWeight: 400 }, // Colors set dynamically
    },
    tooltip: { enabled: true },
    axisBorder: { show: true }, // Color set dynamically
    axisTicks: { show: true }, // Color set dynamically
  },
  yaxis: {
    title: {
      text: "Applications",
      style: { fontSize: "14px", fontWeight: 400 }, // Color set dynamically
    },
    labels: {
      formatter: (val: number) => Math.round(val).toString(),
      style: { fontSize: "12px", fontWeight: 400 }, // Colors set dynamically
    },
    min: 0,
  },
  tooltip: {
    enabled: true,
    x: { format: "dd MMM" },
    theme: "light", // Set dynamically
    style: { fontSize: "12px", fontFamily: "inherit" },
    marker: { show: true, strokeWidth: 0, radius: 2 }, // Colors set dynamically
    y: { formatter: (val: number) => `${Math.round(val)} Applications` },
    fillSeriesColor: false,
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 1.5,
    // Colors set dynamically
  },
  markers: {
    size: 0,
    strokeWidth: 0,
    shape: "circle",
    radius: 2,
    hover: { size: 4, sizeOffset: 3 },
    // Colors set dynamically
  },
  grid: {
    // Colors set dynamically
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

// --- NEW: Watcher to surgically update chart options on theme change ---
// This is the key to fixing the flicker. It only updates what's needed.
watch(
  isDarkMode,
  (isDark) => {
    // Wait until the chart is mounted (`renderChart` is true)
    if (!chartRef.value) {
      return;
    }

    const textColor = isDark
      ? "var(--text-color-dark)"
      : "var(--text-color-light)";
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const accentColor = isDark
      ? "var(--green-accent-dark)"
      : "var(--green-accent-light)";

    chartRef.value.updateOptions({
      chart: {
        background: isDark
          ? "var(--background-color-dark)"
          : "var(--background-color-light)",
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
      },
      stroke: {
        colors: [accentColor],
      },
      markers: {
        colors: [accentColor],
        strokeColors: [accentColor],
      },
      xaxis: {
        labels: { style: { colors: textColor } },
        axisBorder: { color: gridColor },
        axisTicks: { color: gridColor },
      },
      yaxis: {
        title: { style: { color: textColor } },
        labels: { style: { colors: textColor } },
      },
      grid: {
        row: { colors: [gridColor, "transparent"] },
        borderColor: gridColor,
      },
    });
  },
  {
    // `immediate: true` ensures the theme is applied on the initial chart load
    immediate: true,
  }
);

// Method to switch the timeframe (Unchanged)
const setTimeframe = (frame: "3weeks" | "3months" | "yearly") => {
  currentView.value = frame;
};

// Data Aggregation Logic (Unchanged)
function aggregateData(
  dates: string[],
  groupBy: "day" | "month" | "year",
  viewType: "3weeks" | "3months" | "yearly"
) {
  // Your existing aggregation logic is fine and does not need to be changed.
  // ...
  const counts: { [key: string]: number } = {};
  dates.forEach((dateStr) => {
    const d = new Date(dateStr);
    let key: string;
    if (groupBy === "day") {
      key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getUTCDate()).padStart(2, "0")}`;
    } else if (groupBy === "month") {
      key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } else {
      // year
      key = d.getUTCFullYear().toString();
    }
    counts[key] = (counts[key] || 0) + 1;
  });

  const result: { date: string; count: number }[] = [];
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const loopEndDateUTC = new Date(todayUTC);
  loopEndDateUTC.setUTCDate(todayUTC.getUTCDate() + 1);

  let startDateUTC: Date;
  if (viewType === "3weeks") {
    startDateUTC = new Date(todayUTC);
    startDateUTC.setUTCDate(todayUTC.getUTCDate() - 20);
  } else if (viewType === "3months") {
    startDateUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1)
    );
  } else {
    // yearly
    startDateUTC = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1));
  }

  let currentDateIterUTC = new Date(startDateUTC);
  while (currentDateIterUTC < loopEndDateUTC) {
    let key: string;
    let chartDateForApex: Date;
    if (groupBy === "day") {
      key = `${currentDateIterUTC.getUTCFullYear()}-${String(
        currentDateIterUTC.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(currentDateIterUTC.getUTCDate()).padStart(
        2,
        "0"
      )}`;
      chartDateForApex = new Date(
        Date.UTC(
          currentDateIterUTC.getUTCFullYear(),
          currentDateIterUTC.getUTCMonth(),
          currentDateIterUTC.getUTCDate()
        )
      );
      currentDateIterUTC.setUTCDate(currentDateIterUTC.getUTCDate() + 1);
    } else if (groupBy === "month") {
      key = `${currentDateIterUTC.getUTCFullYear()}-${String(
        currentDateIterUTC.getUTCMonth() + 1
      ).padStart(2, "0")}`;
      chartDateForApex = new Date(
        Date.UTC(
          currentDateIterUTC.getUTCFullYear(),
          currentDateIterUTC.getUTCMonth(),
          1
        )
      );
      currentDateIterUTC.setUTCMonth(currentDateIterUTC.getUTCMonth() + 1);
    } else {
      // year
      key = currentDateIterUTC.getUTCFullYear().toString();
      chartDateForApex = new Date(
        Date.UTC(currentDateIterUTC.getUTCFullYear(), 0, 1)
      );
      currentDateIterUTC.setUTCFullYear(
        currentDateIterUTC.getUTCFullYear() + 1
      );
    }
    result.push({
      date: chartDateForApex.toISOString(),
      count: counts[key] || 0,
    });
  }
  return result;
}
</script>

<template>
  <Container>
    <PageHeader label="Stats" />
    <Divider label="applied metrics" labelPosition="top" />

    <div
      class="flex padding950and640 flex-col items-center justify-between w-full margin950and640">
      <template v-if="appStore.isCurrentlyFetching">
        <div class="my-5 border rounded border-color animate-pulse w-full">
          <div
            class="mb-4 h-8 w-2/3 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded mx-auto"></div>
          <div
            class="h-[350px] w-full bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded"></div>
        </div>
      </template>

      <template v-else>
        <div class="w-full my-5 border rounded border-color">
          <div class="padding950and640">
            <div class="mb-2 text-center">
              <button
                @click="setTimeframe('3weeks')"
                :class="[
                  'p-2 mx-1 mt-3 border rounded cursor-pointer text-sm transition-all duration-200 ease-in-out',
                  'border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)]',
                  {
                    'bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)]':
                      currentView === '3weeks',
                  },
                  {
                    'text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]':
                      currentView !== '3weeks',
                  },
                ]">
                3 Weeks
              </button>
              <button
                @click="setTimeframe('3months')"
                :class="[
                  'p-2 mx-1 border rounded cursor-pointer text-sm transition-all duration-200 ease-in-out',
                  'border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)]',
                  {
                    'bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)]':
                      currentView === '3months',
                  },
                  {
                    'text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]':
                      currentView !== '3months',
                  },
                ]">
                3 Months
              </button>
              <button
                @click="setTimeframe('yearly')"
                :class="[
                  'p-2 mx-1 border rounded cursor-pointer text-sm transition-all duration-200 ease-in-out',
                  'border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)]',
                  {
                    'bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)]':
                      currentView === 'yearly',
                  },
                  {
                    'text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]':
                      currentView !== 'yearly',
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

            <div
              v-else
              class="text-center p-4 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
              Loading chart data...
            </div>
          </div>
        </div>
      </template>
    </div>
    <Divider label="good luck" labelPosition="bottom" />
  </Container>
</template>
