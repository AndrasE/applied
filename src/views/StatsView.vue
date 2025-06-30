<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
import { useAppStore } from "@/stores/jobs";
import { Icon } from "@iconify/vue";

// Store initialization
const appStore = useAppStore();

// --- Theme detection and update ---
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
  window.scrollTo(0, 0);
  appStore.ensureJobsListenerActive();
});

// Get theme-dependent colors
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

// Chart instance reference
const chartRef = ref<any>(null);

// Controls chart rendering (for skeleton display)
const renderChart = ref(false);

// Timeframe state and job creation dates
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

// Set initial chart theme colors
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

// Set theme before rendering chart
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
  setInitialChartTheme();
});

// Watch for data fetching to toggle skeleton/chart and update theme
watch(
  () => appStore.isCurrentlyFetching,
  async (newVal) => {
    if (!newVal) {
      renderChart.value = false;
      await nextTick();
      setInitialChartTheme();
      renderChart.value = true;
      await nextTick();
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

// Aggregated data for each timeframe
const threeWeeksData = computed(() =>
  aggregateData(jobCreationDatesFromStore.value, "day", "3weeks")
);
const threeMonthData = computed(() =>
  aggregateData(jobCreationDatesFromStore.value, "month", "3months")
);
const yearlyData = computed(() =>
  aggregateData(jobCreationDatesFromStore.value, "month", "yearly")
);

// Chart series data
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

// Chart options (neutral defaults, themed at runtime)
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
      datetimeFormatter: {
        year: "yyyy",
        month: "MMM 'yy",
        day: "dd MMM",
      },
      formatter: function (val: string, timestamp?: number) {
        if (timestamp) {
          const date = new Date(timestamp);
          if (
            currentView.value === "yearly" ||
            currentView.value === "3months"
          ) {
            // Show "MMM 'YY" for yearly and 3months
            return date
              .toLocaleString("en-US", { month: "short", year: "2-digit" })
              .replace(".", "");
          } else if (currentView.value === "3weeks") {
            // Show "dd MMM" for 3weeks
            return date.toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
            });
          }
        }
        return val;
      },
      style: { fontSize: "12px", fontWeight: 400, colors: ["#6B7280"] },
    },
    tooltip: { enabled: true },
    axisBorder: { show: true, color: "#E0E0E0" },
    axisTicks: { show: true, color: "#E0E0E0" },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => Math.round(val).toString(),
      style: { fontSize: "12px", fontWeight: 400, colors: ["#6B7280"] },
    },
    min: 0,
  },
  tooltip: {
    enabled: true,
    x: { format: "dd MMM" },
    theme: "light",
    style: { fontSize: "12px", fontFamily: "inherit", color: "#000" },
    marker: {
      show: true,
      strokeWidth: 0,
      radius: 2,
      colors: ["#000"],
      strokeColor: "#000",
    },
    y: { formatter: (val: number) => `${Math.round(val)} Applications` },
    fillSeriesColor: false,
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 1.5,
    colors: ["#22C55E"],
  },
  markers: {
    size: 0,
    strokeWidth: 0,
    shape: "circle",
    radius: 2,
    hover: { size: 4, sizeOffset: 3 },
    colors: ["#22C55E"],
    strokeColors: ["#22C55E"],
  },
  grid: {
    row: { opacity: 0.1, colors: ["#E0E0E0", "transparent"] },
    borderColor: "#E0E0E0",
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

// Apply theme to chart after mount or theme change
const applyChartTheme = (isDark: boolean) => {
  if (
    !chartRef.value ||
    !chartRef.value.$el ||
    typeof chartRef.value.updateOptions !== "function"
  ) {
    return;
  }
  try {
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
            colors: [
              accentColor,
              accentColor,
              accentColor,
              accentColor,
              accentColor,
              accentColor,
              accentColor,
            ],
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
    );
  } catch (e) {
    // Ignore errors if chart is unmounted
  }
};

// Watch for theme changes and update chart
watch(isDarkMode, async (isDark) => {
  await nextTick();
  if (
    renderChart.value &&
    chartRef.value &&
    chartRef.value.$el &&
    typeof chartRef.value.updateOptions === "function"
  ) {
    try {
      applyChartTheme(isDark);
    } catch (e) {
      // Ignore errors if chart is unmounted
    }
  }
});

// Change the chart timeframe
const setTimeframe = (frame: "3weeks" | "3months" | "yearly") => {
  currentView.value = frame;
};

// Aggregate job creation data by day or month for the selected view
function aggregateData(
  dates: string[],
  groupBy: "day" | "month",
  viewType: "3weeks" | "3months" | "yearly"
) {
  const counts: { [key: string]: number } = {};

  // Count jobs per day or month
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

  // Calculate date range for the view
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

  // Fill result array with counts for each day or month
  let currentDateIterUTC = new Date(startDateUTC);

  while (currentDateIterUTC <= endDateUTC) {
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
      result.push({
        date: chartDateForApex.toISOString(),
        count: counts[key] || 0,
      });
      currentDateIterUTC.setUTCDate(currentDateIterUTC.getUTCDate() + 1);
    } else {
      const monthKey = `${currentDateIterUTC.getUTCFullYear()}-${String(
        currentDateIterUTC.getUTCMonth() + 1
      ).padStart(2, "0")}`;

      chartDateForApex = new Date(
        Date.UTC(
          currentDateIterUTC.getUTCFullYear(),
          currentDateIterUTC.getUTCMonth(),
          1
        )
      );
      result.push({
        date: chartDateForApex.toISOString(),
        count: counts[monthKey] || 0,
      });
      currentDateIterUTC.setUTCMonth(currentDateIterUTC.getUTCMonth() + 1);
      currentDateIterUTC.setUTCDate(1);
    }
  }

  // Ensure last month is included for month grouping
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
      const chartDateForApex = new Date(
        Date.UTC(endDateUTC.getUTCFullYear(), endDateUTC.getUTCMonth(), 1)
      );
      result.push({
        date: chartDateForApex.toISOString(),
        count: counts[monthKey] || 0,
      });
    }
  }

  return result;
}

// Chrome warning about non-passive event listeners from ApexCharts is safe to ignore.
</script>

<template>
  <Container>
    <PageHeader label="Stats" />
    <Divider label="your progress" labelPosition="top" />

    <div
      class="flex padding950and640 flex-col items-center justify-between w-full">
      <template v-if="appStore.isCurrentlyFetching && renderChart">
        <div class="border rounded border-color animate-pulse w-full">
          <div
            class="mt-4 sm:mt-8 mb-6 h-11 w-60 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded mx-auto"></div>
          <div
            aria-hidden="true"
            class="flex mx-6 mb-6 h-54 sm:h-87 flex-col items-center justify-center rounded bg-[var(--skeleton-light)] text-tiny text-gray-500 subtle-pulse tracking-widest dark:bg-[var(--skeleton-dark)] dark:text-gray-400">
            <p class="mt-2">loading</p>
            <Icon class="ml-1 text-2xl" icon="svg-spinners:3-dots-fade" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="w-full">
          <div>
            <p class="text-tiny text-center">metrics</p>
            <div class="border rounded border-color">
              <div class="flex flex-row justify-between py-4 sm:px-6 px-2">
                <div class="flex flex-col items-center">
                  <p class="text-md font-semibold">
                    {{ appStore.jobs.length }}
                  </p>
                  <p class="text-xs">active</p>
                </div>
                <div class="flex flex-col items-center mt-4 sm:mt-0">
                  <p class="text-md font-semibold">
                    {{ appStore.jobs.length }}
                  </p>
                  <p class="text-xs">job offer</p>
                </div>
                <div class="flex flex-col items-center mt-4 sm:mt-0">
                  <p class="text-md font-semibold">
                    {{ appStore.jobs.length }}
                  </p>
                  <p class="text-xs">rejected</p>
                </div>
                <div class="flex flex-col items-center mt-4 sm:mt-0">
                  <p class="text-md font-semibold">
                    {{ appStore.jobs.length }}
                  </p>
                  <p class="text-xs">no response</p>
                </div>
                <div class="flex flex-col items-center mt-4 sm:mt-0">
                  <p class="text-md font-semibold">
                    {{ appStore.jobs.length }}
                  </p>
                  <p class="text-xs">total</p>
                </div>
              </div>
            </div>
          </div>
          <p class="text-tiny mt-10 text-center">applications / timeframe</p>
          <div class="border rounded border-color">
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
              class="border rounded border-color animate-pulse w-full">
              <div
                class="mt-4 sm:mt-8 mb-6 h-11 w-60 bg-[var(--skeleton-light)] dark:bg-[var(--skeleton-dark)] rounded mx-auto"></div>
              <div
                aria-hidden="true"
                class="flex mx-6 mb-6 h-50 sm:h-87 flex-col items-center justify-center rounded bg-[var(--skeleton-light)] text-tiny text-gray-500 subtle-pulse tracking-widest dark:bg-[var(--skeleton-dark)] dark:text-gray-400">
                <p class="mt-2">loading</p>
                <Icon class="ml-1 text-2xl" icon="svg-spinners:3-dots-fade" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <Divider label="good luck" labelPosition="bottom" />
  </Container>
</template>
