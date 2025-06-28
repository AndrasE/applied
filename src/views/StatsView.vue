<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
import { useAppStore } from "@/stores/jobs";

// Initialize the store
const appStore = useAppStore();

// --- Theme Detection ---
const isDarkMode = ref(false);
const updateTheme = () => {
  isDarkMode.value = document.documentElement.classList.contains("dark");
};

onMounted(() => {
  updateTheme(); // Set initial theme state
  const observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  onUnmounted(() => observer.disconnect());
  window.scrollTo(0, 0);
  appStore.ensureJobsListenerActive();
});

// Helper function to get theme-dependent colors
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

// --- NEW: Ref for the chart instance ---
const chartRef = ref<any>(null); // Use 'any' if ApexCharts types are not fully integrated

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

// --- Immediately set theme colors before first render ---
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
      style: { ...chartOptions.value.tooltip.style, color: textColor },
      marker: {
        ...chartOptions.value.tooltip.marker,
        colors: [accentColor],
        strokeColor: accentColor,
      },
    },
    stroke: {
      ...chartOptions.value.stroke,
      colors: [accentColor],
    },
    markers: {
      ...chartOptions.value.markers,
      colors: [accentColor],
      strokeColors: [accentColor],
    },
    xaxis: {
      ...chartOptions.value.xaxis,
      labels: {
        ...chartOptions.value.xaxis.labels,
        style: {
          ...chartOptions.value.xaxis.labels.style,
          colors: [
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
          ],
        },
      },
      axisBorder: { ...chartOptions.value.xaxis.axisBorder, color: gridColor },
      axisTicks: { ...chartOptions.value.xaxis.axisTicks, color: gridColor },
    },
    yaxis: {
      // Remove the title property to hide the y axis label
      labels: {
        ...chartOptions.value.yaxis.labels,
        style: {
          ...chartOptions.value.yaxis.labels.style,
          colors: [
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
            textColor,
          ],
        },
      },
      min: 0,
    },
    grid: {
      ...chartOptions.value.grid,
      row: {
        ...chartOptions.value.grid.row,
        colors: [gridColor, "transparent"],
      },
      borderColor: gridColor,
    },
  };
};

// --- Call this before renderChart is set to true ---
onMounted(() => {
  updateTheme();
  const observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  onUnmounted(() => observer.disconnect());
  window.scrollTo(0, 0);
  appStore.ensureJobsListenerActive();
  setInitialChartTheme(); // <--- Add this line
});

// --- MODIFIED: Ensure chart theme is applied *after* the chart is rendered ---
watch(
  () => appStore.isCurrentlyFetching,
  async (newVal) => {
    if (!newVal) {
      renderChart.value = false; // Hide chart, show skeleton for at least one tick
      await nextTick();
      setInitialChartTheme();
      renderChart.value = true;
      await nextTick();
      // Only call applyChartTheme if chartRef and its $el exist in DOM
      if (
        chartRef.value &&
        chartRef.value.$el &&
        typeof chartRef.value.updateOptions === "function"
      ) {
        applyChartTheme(isDarkMode.value);
      }
    } else {
      renderChart.value = false;
    }
  },
  { immediate: true }
);

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

// --- REVISED: Chart Options are now a static ref, with *neutral* initial colors ---
// Theme-dependent properties are omitted or set to a neutral value here.
// They will be dynamically set by `applyChartTheme` once the chart is mounted.
const chartOptions = ref({
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
      datetimeFormatter: { year: "yyyy", month: "MMM 'yy", day: "dd MMM" },
      style: { fontSize: "12px", fontWeight: 400, colors: ["#6B7280"] },
    },
    tooltip: { enabled: true },
    axisBorder: { show: true, color: "#E0E0E0" },
    axisTicks: { show: true, color: "#E0E0E0" },
  },
  yaxis: {
    // Remove the title property to hide the y axis label
    labels: {
      formatter: (val: number) => Math.round(val).toString(),
      style: { fontSize: "12px", fontWeight: 400, colors: ["#6B7280"] },
    },
    min: 0,
  },
  tooltip: {
    enabled: true,
    x: { format: "dd MMM" },
    theme: "light", // Will be overridden
    style: { fontSize: "12px", fontFamily: "inherit", color: "#000" }, // Neutral default
    marker: {
      show: true,
      strokeWidth: 0,
      radius: 2,
      colors: ["#000"],
      strokeColor: "#000",
    }, // Neutral default
    y: { formatter: (val: number) => `${Math.round(val)} Applications` },
    fillSeriesColor: false,
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 1.5,
    colors: ["#22C55E"], // Neutral default (e.g., a green)
  },
  markers: {
    size: 0,
    strokeWidth: 0,
    shape: "circle",
    radius: 2,
    hover: { size: 4, sizeOffset: 3 },
    colors: ["#22C55E"], // Neutral default
    strokeColors: ["#22C55E"], // Neutral default
  },
  grid: {
    row: { opacity: 0.1, colors: ["#E0E0E0", "transparent"] }, // Neutral default
    borderColor: "#E0E0E0", // Neutral default
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

// --- NEW: Centralized function to apply theme options ---
const applyChartTheme = (isDark: boolean) => {
  if (
    !chartRef.value ||
    !chartRef.value.$el ||
    typeof chartRef.value.updateOptions !== "function"
  ) {
    return;
  }

  const { textColor, gridColor, accentColor } = getThemeColors();

  chartRef.value.updateOptions(
    {
      chart: {
        background: isDark
          ? "var(--background-color-dark)"
          : "var(--background-color-light)",
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        style: { color: textColor, fontFamily: "inherit" },
        marker: {
          show: true,
          strokeWidth: 0,
          radius: 2,
          colors: [accentColor],
          strokeColor: accentColor,
        },
      },
      stroke: {
        colors: [accentColor],
      },
      markers: {
        colors: [accentColor],
        strokeColors: [accentColor],
      },
      xaxis: {
        labels: {
          style: {
            colors: [
              textColor,
              textColor,
              textColor,
              textColor,
              textColor,
              textColor,
              textColor,
            ],
          },
        },
        axisBorder: { color: gridColor },
        axisTicks: { color: gridColor },
      },
      yaxis: {
        // Remove the title property to hide the y axis label
        labels: {
          style: {
            colors: [
              textColor,
              textColor,
              textColor,
              textColor,
              textColor,
              textColor,
              textColor,
            ],
          },
        },
      },
      grid: {
        row: { colors: [gridColor, "transparent"] },
        borderColor: gridColor,
      },
    },
    false,
    true
  ); // The third argument 'true' forces a re-render. Important for some style changes.
};

// --- MODIFIED: Watcher to trigger theme application on theme change ---
watch(isDarkMode, async (isDark) => {
  await nextTick();
  if (
    renderChart.value &&
    chartRef.value &&
    chartRef.value.$el &&
    typeof chartRef.value.updateOptions === "function"
  ) {
    applyChartTheme(isDark);
  }
});

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
      <template v-if="appStore.isCurrentlyFetching && !renderChart">
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
