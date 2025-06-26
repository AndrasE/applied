<script setup lang="ts">
import Container from "@/components/ui/Container.vue";
import { ref, computed, onMounted } from "vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";

onMounted(() => {
  window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
  // Simulate fetching data from your database when the component mounts
  dbCreationDates.value = generateMockDbDates(365 * 2); // Generate mock data for the last 2 years
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
const chartOptions = computed(() => ({
  chart: {
    type: "line",
    height: 350,
    zoom: {
      enabled: true,
    },
    toolbar: {
      show: false,
      tools: {
        download: false,
        selection: true,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: true,
      },
      autoSelected: "zoom",
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      datetimeFormatter: {
        year: "yyyy",
        month: "MMM 'yy",
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  yaxis: {
    title: {
      text: "Applications",
      style: {
        fontSize: "14px",
        fontWeight: 400,
        color: "#333",
      },
    },
    labels: {
      formatter: function (val: number) {
        return Math.round(val).toString();
      },
      style: {
        fontSize: "10px",
        fontWeight: 400,
        color: "#333",
      },
    },
    min: 0,
  },
  tooltip: {
    x: {
      format: "dd MMM",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  grid: {
    row: {
      colors: ["#f3f7f9", "transparent"],
      opacity: 0.5,
    },
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
}));

// Method to switch the timeframe
const setTimeframe = (frame: "daily" | "3months" | "yearly") => {
  currentView.value = frame;
};

// --- Data Aggregation Logic ---
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

// Mock data fetching function (replace with your actual API call)
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
      <div class="w-full max-w-4xl my-5 p-1 rounded border border-color">
        <div class="mb-2 text-center">
          <button
            @click="setTimeframe('daily')"
            :class="[
              'p-2 mx-1 border border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)] rounded  cursor-pointer text-sm transition-all duration-200 ease-in-out',
              {
                'bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--text-color-dark)] dark:text-[var(--text-color-light)]':
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
              'p-2 mx-1 border border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)] rounded  cursor-pointer text-sm transition-all duration-200 ease-in-out',
              {
                'bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--text-color-dark)] dark:text-[var(--text-color-light)]':
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
              'p-2 mx-1 border border-[var(--green-accent-light)] dark:border-[var(--green-accent-dark)] rounded  cursor-pointer text-sm transition-all duration-200 ease-in-out',
              {
                'bg-[var(--green-accent-light)] dark:bg-[var(--green-accent-dark)] text-[var(--text-color-dark)] dark:text-[var(--text-color-light)]':
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
