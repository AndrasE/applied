<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";
//VueApexCharts is  registered  globally already in main.ts

// --- Theme Detection (Choose one method) ---

// 'dark' class on <html> (common with Tailwind)
const isDarkMode = ref(false);
const updateTheme = () => {
  isDarkMode.value = document.documentElement.classList.contains("dark");
};

// Listen for changes (e.g., if a theme toggle exists)
onMounted(() => {
  updateTheme();
  const observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  //  disconnect the observer on unmount
  onUnmounted(() => observer.disconnect());
});

onMounted(() => {
  window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
  dbCreationDates.value = generateMockDbDates(365 * 2); // Generate mock data
});

// Reactive state for chart data and view selection
const dbCreationDates = ref<string[]>([]);
const currentView = ref<"daily" | "3months" | "yearly">("daily");

// Computed properties to prepare data for different timeframes
const dailyData = computed(() =>
  aggregateData(dbCreationDates.value, "day", "daily")
);
const threeMonthData = computed(() =>
  aggregateData(dbCreationDates.value, "month", "3months")
);
const yearlyData = computed(() =>
  aggregateData(dbCreationDates.value, "year", "yearly")
);

// Computed property for the series data passed to ApexCharts
const chartSeries = computed(() => {
  let dataToUse: { date: string; count: number }[];
  switch (currentView.value) {
    case "daily":
      dataToUse = dailyData.value;
      break;
    case "3months":
      dataToUse = threeMonthData.value;
      break;
    case "yearly":
      dataToUse = yearlyData.value;
      break;
    default:
      dataToUse = dailyData.value;
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

// Chart options for ApexCharts
const chartOptions = computed(() => {
  // Determine colors based on theme
  const textColor = isDarkMode.value
    ? "var(--text-color-dark)"
    : "var(--text-color-light)";
  const gridColor = isDarkMode.value
    ? "rgba(255,255,255,0.05)"
    : "rgba(0,0,0,0.05)";
  const accentColor = isDarkMode.value
    ? "var(--green-accent-dark)" // Your dark accent green
    : "var(--green-accent-light)"; // Your light accent green

  return {
    chart: {
      type: "line",
      width: "100%",
      height: "350",
      background: isDarkMode.value
        ? "var(--background-color-dark)"
        : "var(--background-color-light)",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
        autoSelected: "zoom",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
        },
        style: {
          colors: textColor,
          fontSize: "12px",
          fontWeight: 400,
        },
      },
      tooltip: {
        enabled: true, // This enables the X-axis tooltip for the series
      },
      axisBorder: {
        show: true,
        color: gridColor,
      },
      axisTicks: {
        show: true,
        color: gridColor,
      },
    },
    yaxis: {
      title: {
        text: "Applications",
        style: {
          fontSize: "14px",
          fontWeight: 400,
          color: textColor,
        },
      },
      labels: {
        formatter: function (val: number) {
          return Math.round(val).toString();
        },
        style: {
          fontSize: "12px",
          fontWeight: 400,
          colors: textColor,
        },
      },
      min: 0,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM",
      },
      theme: isDarkMode.value ? "dark" : "light",
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
        color: textColor,
        // Ensure the tooltip background is also theme-aware
        background: isDarkMode.value
          ? "var(--background-color-dark)"
          : "var(--background-color-light)",
      },
      // --- UPDATED TOOLTIP MARKER SECTION ---
      marker: {
        show: true,
        colors: [accentColor], // <--- SET THE FILL COLOR HERE
        strokeWidth: 0, // <--- REMOVE BORDER FOR TOOLTIP MARKER
        strokeColor: accentColor, // Set to accent for consistency (won't be visible with strokeWidth: 0)
        radius: 2, // Applies if shape is not circle or if you use rect/square
        // You can remove cssClass: "apexcharts-tooltip-marker-custom" if you're controlling everything via options
      },
      // --- END TOOLTIP MARKER SECTION ---
      y: {
        formatter: function (val: number) {
          return `${Math.round(val)} Applications`;
        },
      },
      fillSeriesColor: false, // Important to allow custom tooltip background
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1.5,
      colors: [accentColor], // This controls the main line color
    },
    // --- ADDED CHART SERIES MARKERS ---
    markers: {
      size: 0, // Size of the marker on the line itself
      colors: [accentColor], // Fill color of the marker on the line
      strokeColors: [accentColor], // Border color of the marker (set to accent even if width is 0)
      strokeWidth: 0, // <--- REMOVE BORDER FOR SERIES MARKERS ON THE LINE
      strokeOpacity: 0.7, // Opacity of the stroke
      fillOpacity: 0.7,
      shape: "circle",
      radius: 2,
      hover: {
        size: 4, // Size on hover
        sizeOffset: 3, // How much bigger it gets on hover
      },
    },
    // --- END CHART SERIES MARKERS ---
    grid: {
      row: {
        colors: [gridColor, "transparent"],
        opacity: 0.1,
      },
      borderColor: gridColor,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 250,
          },
          xaxis: {
            labels: {
              rotate: -45,
            },
          },
        },
      },
    ],
  };
});
// Method to switch the timeframe
const setTimeframe = (frame: "daily" | "3months" | "yearly") => {
  currentView.value = frame;
};

// --- Data Aggregation Logic (Unchanged) ---
function aggregateData(
  dates: string[],
  groupBy: "day" | "month" | "year",
  viewType: "daily" | "3months" | "yearly"
) {
  const counts: { [key: string]: number } = {};

  dates.forEach((dateStr) => {
    const date = new Date(dateStr);
    let key: string;

    if (groupBy === "day") {
      key = date.toISOString().split("T")[0];
    } else if (groupBy === "month") {
      key = date.toISOString().substring(0, 7);
    } else if (groupBy === "year") {
      key = date.getFullYear().toString();
    } else {
      key = "";
    }
    counts[key] = (counts[key] || 0) + 1;
  });

  const result: { date: string; count: number }[] = [];
  let startDate: Date;
  let endDate: Date = new Date();
  endDate.setHours(0, 0, 0, 0); // Normalize to start of day

  if (viewType === "daily") {
    startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 29); // Last 30 days
  } else if (viewType === "3months") {
    startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 2);
    startDate.setDate(1);
  } else if (viewType === "yearly") {
    startDate = new Date(endDate);
    startDate.setFullYear(endDate.getFullYear() - 1);
    startDate.setMonth(0);
    startDate.setDate(1);
  } else {
    startDate = new Date();
  }

  let currentDateIter = new Date(startDate);
  currentDateIter.setHours(0, 0, 0, 0);

  while (currentDateIter <= endDate) {
    let key: string;
    if (groupBy === "day") {
      key = currentDateIter.toISOString().split("T")[0];
    } else if (groupBy === "month") {
      key = currentDateIter.toISOString().substring(0, 7);
    } else if (groupBy === "year") {
      key = currentDateIter.getFullYear().toString();
    } else {
      key = "";
    }

    result.push({
      date: key,
      count: counts[key] || 0,
    });

    if (groupBy === "day") {
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    } else if (groupBy === "month") {
      currentDateIter.setMonth(currentDateIter.getMonth() + 1);
      if (currentDateIter.getDate() !== 1) {
        currentDateIter.setDate(1);
        currentDateIter.setMonth(currentDateIter.getMonth() + 1);
      }
    } else if (groupBy === "year") {
      currentDateIter.setFullYear(currentDateIter.getFullYear() + 1);
    }
  }

  const finalResult = result.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  return finalResult;
}

// Mock data fetching function (Unchanged)
function generateMockDbDates(numDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const creationsToday = Math.floor(Math.random() * 5);
    for (let j = 0; j < creationsToday; j++) {
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));
      date.setSeconds(Math.floor(Math.random() * 60));
      dates.push(date.toISOString());
    }
  }
  return dates;
}
</script>

<template>
  <Container>
    <PageHeader label="Stats" />
    <Divider label="applied metrics" labelPosition="top" />
    <div class="flex flex-col items-center justify-between margin950and640">
      <div class="w-full max-w-4xl p-1 my-5 border rounded border-color">
        <div class="mb-2 text-center">
          <button
            @click="setTimeframe('daily')"
            :class="[
              'p-2 mx-1 mt-3 border rounded cursor-pointer text-sm transition-all duration-200 ease-in-out',
              'border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)]', // Border color
              {
                'bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--bg-light)] dark:text-[var(--bg-dark)]':
                  currentView === 'daily',
              },
              {
                'text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]':
                  currentView !== 'daily',
              },
            ]">
            Daily
          </button>
          <button
            @click="setTimeframe('3months')"
            :class="[
              'p-2 mx-1 border rounded cursor-pointer text-sm transition-all duration-200 ease-in-out',
              'border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)]', // Border color
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
          type="line"
          height="350"
          :options="chartOptions"
          :series="chartSeries"></apexchart>
      </div>
    </div>
    <Divider label="good luck" labelPosition="bottom" />
  </Container>
</template>

<!-- 
<div
    class="apexcharts-tooltip apexcharts-theme-light apexcharts-active"
    style="left: 98.6875px; top: 219.15px">
    <div
      class="apexcharts-tooltip-title"
      style="font-family: Helvetica, Arial, sans-serif; font-size: 12px">
      18 Jun
    </div>
    <div
      class="apexcharts-tooltip-series-group apexcharts-tooltip-series-group-0 apexcharts-active"
      style="order: 1; display: flex">
      <span
        class="apexcharts-tooltip-marker"
        shape="circle"
        style="color: rgb(0, 143, 251)"></span>
      <div
        class="apexcharts-tooltip-text"
        style="font-family: Helvetica, Arial, sans-serif; font-size: 12px">
        <div class="apexcharts-tooltip-y-group">
          <span class="apexcharts-tooltip-text-y-label">Applications: </span
          ><span class="apexcharts-tooltip-text-y-value">1</span>
        </div>
        <div class="apexcharts-tooltip-goals-group">
          <span class="apexcharts-tooltip-text-goals-label"></span
          ><span class="apexcharts-tooltip-text-goals-value"></span>
        </div>
        <div class="apexcharts-tooltip-z-group">
          <span class="apexcharts-tooltip-text-z-label"></span
          ><span class="apexcharts-tooltip-text-z-value"></span>
        </div>
      </div>
    </div>
  </div>
-->
