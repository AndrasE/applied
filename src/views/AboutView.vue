<script setup lang="ts">
// --- UI and utility imports ---
import Container from "@/components/ui/Container.vue";
import { onMounted } from "vue";
import { Icon } from "@iconify/vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import Divider from "@/components/ui/Divider.vue";

// --- Scroll to top on mount for better UX ---
onMounted(() => {
  window.scrollTo(0, 0); // Scroll to the top overwriting any previous scroll
});
</script>

<template>
  <Container>
    <PageHeader label="About" />
    <Divider label="hi there" labelPosition="top" />
    <div class="flex flex-col items-center justify-between margin950and640">
      <!-- <h2 class="mb-1 text-2xl">Hi there!</h2> -->
      <div
        aria-label="about card"
        class="w-full p-4 text-justify break-words border rounded border-color">
        <!-- About text content -->
        <p class="text-tiny-tracking-wider">prerequisites</p>
        <p class="mb-3 text-sm">
          After applying to over 100 jobs, I realised that keeping track of
          applications was a hassle. I wanted a simple way to manage my job
          search and monitor everything in one place. So, I built this app to
          track and visualise my progress. The timing felt perfect—I had just
          completed a TypeScript course on Udemy and a crash course on Vue 3 via
          YouTube. For the styling, I also wanted to try out Tailwind CSS, which
          I`d been hearing a lot about. And with that, the idea was born.
        </p>

        <p class="text-tiny-tracking-wider">design</p>
        <p class="mb-3 text-sm">
          For the design, I aimed to keep things simple and functional, drawing
          inspiration from three main sources. The
          <a
            aria-label="Visit vuejs.org"
            class="link-underline"
            target="_blank"
            href="https://vuejs.org/"
            >Vue.js</a
          >
          website provided the colour palette and typography I had been
          searching for. The
          <a
            aria-label="Visit tailwindcss.com"
            class="link-underline"
            target="_blank"
            href="https://tailwindcss.com/"
            >Tailwind CSS</a
          >
          landing page inspired design elements like subtle lines, small fonts,
          and repeating linear gradient patterns. I especially liked how
          responsive the layout was across different screen sizes, so I
          recreated a similar approach by building a container component that
          adapts to various viewports and wraps the main content. Finally,
          <a
            aria-label="Visit metal-map.com"
            class="link-underline"
            target="_blank"
            href="https://metal-map.com/"
            >metal-map.com</a
          >
          inspired the icon choices and the layout of the navigation
          bar—vertical on larger screens and horizontal on smaller ones.
        </p>

        <p class="text-tiny-tracking-wider">vue3 vs react</p>
        <p class="mb-3 text-sm">
          This was my first time using Vue, so it took a little while to get
          familiar with the framework. That said, it felt relatively
          straightforward compared to React. While I still prefer React overall,
          I think Vue is a great framework—particularly well-suited for smaller
          projects. I also appreciate its more opinionated structure, which
          makes it easier to follow best practices out of the box. The
          Composition API is a strong addition, offering better code
          organisation and reusability. Concepts like <code>ref</code> and
          <code>reactive</code> mirror React`s <code>useState</code>, while
          <code>onMounted</code> and <code>onUnmounted</code> align with
          lifecycle methods. Similarly, <code>computed</code> resembles
          <code>useMemo</code>, and <code>watch</code> plays a similar role to
          <code>useEffect</code>. Pinia is also a solid state management tool,
          making it easy to handle complex state in a Vue application. I think
          this stack was a great choice for a simple and straightforward project
          like this one.
        </p>

        <p class="text-tiny-tracking-wider">tailwind v4</p>
        <p class="mb-3 text-sm">
          Tailwind CSS has proven to be an incredibly useful tool for styling
          applications. It`s well-documented and fairly easy to learn, which
          makes getting started smooth and intuitive. In my previous project, I
          used Styled Components—a great library for styling React apps—but I
          found Tailwind to be more straightforward. The predefined utility
          classes significantly sped up the design process and reduced the need
          to write custom CSS. Overall, I think Tailwind CSS is a solid choice
          for styling, and I plan to continue using it in future projects.
        </p>

        <p class="text-tiny-tracking-wider">ai</p>
        <p class="mb-3 text-sm">
          We've come a long way in the world of AI. Where I once spent hours
          digging through Stack Overflow for answers, now a simple prompt can
          explain a concept or solve a problem in seconds. I`ve tried many of
          the free models—Gemini, GPT, Claude, Windsurfer, and others—and I have
          to say, I`ve been genuinely impressed by the quality of responses.
          It's become an invaluable tool, especially when you're stuck or in
          need of fresh ideas. That said, it`s important to approach
          AI-generated answers with a critical eye, as they can sometimes be
          misleading or flat-out incorrect. Overall, I believe AI is here to
          stay and will fundamentally change the way we write code. We're
          gradually shifting from being hands-on coders to orchestrators—
          guiding the process rather than manually handling every detail.
        </p>

        <p class="text-tiny-tracking-wider">apexcharts</p>
        <p class="mb-3 text-sm">
          I chose
          <a
            aria-label="Visit apexcharts.com"
            class="link-underline"
            target="_blank"
            href="https://apexcharts.com/"
            >ApexCharts</a
          >
          for data visualisation in this app because it offers a wide variety of
          chart types and integrates well with Vue. Although it took some time
          to customise and override the default settings, the effort paid
          off—the chart is responsive and looks great across different screen
          sizes. Much of the data aggregation and filtering logic was assisted
          by AI, and honestly, it would`ve taken me a lot longer to figure it
          all out on my own. I think this highlights how AI can significantly
          speed up development and help us write more efficient code.
        </p>
        <p class="text-tiny-tracking-wider">auth</p>
        <p class="mb-3 text-sm">
          The authentication system is built using Firebase. Currently, only
          admin access is available — I am the sole user who can log in to the
          application and make changes to the data. However, I may open it up to
          other users soon, as quite a few friends of mine would be interested
          in using this app to support their job-seeking journey.
        </p>
        <p class="text-tiny-tracking-wider">toast & skeleton</p>
        <p class="mb-3 text-sm">
          I used the
          <a
            aria-label="Visit vue-toastification.com"
            class="link-underline"
            target="_blank"
            href="https://vue-toastification.com/"
            >Vue Toastification</a
          >
          library for toast notifications, which provides a great way to give
          feedback to users without interrupting their workflow. For loading
          states, I implemented skeleton components using Tailwind CSS to
          enhance the user experience while data is being fetched. Once the
          first fetch occurs, we subscribe to changes and the app updates in
          real time.
        </p>
        <p class="text-tiny-tracking-wider">pwa</p>
        <p class="mb-3 text-sm">
          The app can be installed as a Progressive Web App (PWA) on your
          device. This allows it to be used offline, with many features
          continuing to work thanks to caching, which also helps reduce load
          times and internet traffic.
        </p>
        <p class="text-tiny-tracking-wider">post</p>
        <p class="mb-3 text-sm">
          I hope you found this project both interesting and informative. If you
          have any questions or feedback, feel free to get in touch. You can
          also explore the source code on
          <a
            aria-label="Visit GitHub repository"
            class="link-underline"
            target="_blank"
            href="https://github.com/AndrasE/applied"
            >GitHub</a
          >. I`ve included plenty of helpful comments and
          <code>console.log</code> statements throughout the codebase to make it
          easier to understand how everything works. I go now and hunt for new
          job opportunities, and I know this app will help me keep track of
          them.
        </p>

        <p class="text-sm text-center">thank you for reading!</p>
        <p class="text-sm text-center">
          <a
            aria-label="Visit my portfolio"
            class="link-underline"
            target="_blank"
            href="https://andrasegyed.netlify.app/"
            >Andras</a
          >
        </p>
      </div>
    </div>

    <Divider label="thanks for reading" labelPosition="bottom" />
  </Container>
</template>
