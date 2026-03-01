export const steps: any = [
  // Example steps
  {
    icon: <>👋</>,
    title: "Welcome to Kolly!",
    content: (
      <>
        Start off by clicking the <b>Generate Draft</b> button.
      </>
    ),
    selector: "#onborda-step1",
    side: "top",
    pointerPadding: 10,
    pointerRadius: 4,
  },
  {
    icon: <>📝</>,
    title: "Input draft details",
    content: (
      <>
        Add the instructions and content and click <b>Generate</b> to get
        started.
      </>
    ),
    selector: "#onborda-step2",
    side: "right",
    pointerPadding: 25,
    pointerRadius: 16,
  },
  {
    icon: <>📝</>,
    title: "Insert generated text",
    content: (
      <>
        View the response and click <b>Insert</b> to continue.
      </>
    ),
    selector: "#onborda-step3",
    side: "top",
    pointerPadding: 25,
    pointerRadius: 16,
  },
  {
    icon: <>👉</>,
    title: "View content",
    content: (
      <>
        Kolly generates a full college essay draft for you for you to get
        started.
      </>
    ),
    selector: "#onborda-step4",
    side: "right",
    showControls: true,
    pointerPadding: 25,
    pointerRadius: 16,
  },
  {
    icon: <>📂</>,
    title: "Click background",
    content: (
      <>
        Click <b>Background</b> to continue.
      </>
    ),
    selector: "#onborda-step5",
    side: "right",
    pointerPadding: 25,
    pointerRadius: 16,
    nextRoute: "/dashboard/background",
  },
  {
    icon: <>📂</>,
    title: "View background",
    content: (
      <>
        Your background is where Kolly gets to know you. Upload your resume and
        answer the questions to customize Kolly's respones to be{" "}
        <b>personalized</b> to you.
      </>
    ),
    selector: "#onborda-step6",
    side: "bottom",
    showControls: true,
    pointerPadding: 25,
    pointerRadius: 16,
    prevRoute: "/",
  },
  {
    icon: <>⚽️</>,
    title: "Click extracurriculars",
    content: (
      <>
        Click <b>Extracurriculars</b> to continue.
      </>
    ),
    selector: "#onborda-step7",
    side: "right",
    pointerPadding: 25,
    pointerRadius: 16,
    prevRoute: "/dashboard/background",
    nextRoute: "/dashboard/extracurriculars",
  },
  {
    icon: <>⚽️</>,
    title: "View extracurriculars",
    content: (
      <>
        You can also input extracurriculars that Kolly will refer to in context,
        similar to the background.
      </>
    ),
    selector: "#onborda-step8",
    side: "bottom",
    showControls: true,
    pointerPadding: 25,
    pointerRadius: 16,
    prevRoute: "/dashboard/background",
    nextRoute: "/dashboard/extracurriculars",
  },
  {
    icon: <>💡</>,
    title: "Click ideation",
    content: (
      <>
        Click <b>Ideation</b> to continue.
      </>
    ),
    selector: "#onborda-step9",
    side: "right",
    pointerPadding: 25,
    pointerRadius: 16,
    prevRoute: "/dashboard/extracurriculars",
    nextRoute: "/dashboard/ideation",
  },
  {
    icon: <>💡</>,
    title: "View ideation",
    content: (
      <>
        Ideation is where you can add <b>memories</b> to Kolly. These memories
        are
        <b> important objects, values, or experiences</b>. Kolly will then quiz
        you and learn more about each memory to then tell you exactly how you
        should
        <b> write an essay</b>.
      </>
    ),
    selector: "#onborda-step10",
    side: "bottom",
    showControls: true,
    pointerPadding: 25,
    pointerRadius: 16,
  },
  {
    icon: <>📝</>,
    title: "Go back to essay",
    content: (
      <>
        Click <b>New Essay</b> to continue.
      </>
    ),
    selector: "#onborda-step11",
    side: "right",
    pointerPadding: 25,
    pointerRadius: 16,
    nextRoute: "/",
  },
  {
    icon: <>🤖</>,
    title: "Input question into chatbot",
    content: (
      <>
        Ask Kolly a question like "What are the rhetorical devices in my
        writing?" and click the <b>chat icon</b> to continue.
      </>
    ),
    selector: "#onborda-step12",
    side: "left",
    pointerPadding: 25,
    pointerRadius: 16,
    prevRoute: "/dashboard/ideation",
    nextRoute: "/",
  },
  {
    icon: <>🤖</>,
    title: "View response",
    content: (
      <>
        Kolly will respond to whatever question you have with your
        <b> document information</b>, <b>background</b>, and{" "}
        <b>extracurriculars</b>!
      </>
    ),
    selector: "#onborda-step13",
    side: "left",
    pointerPadding: 25,
    pointerRadius: 16,
    showControls: true,
  },
  {
    icon: <>📝</>,
    title: "What to write about next",
    content: (
      <>
        As you write, Kolly will generate <b>topics</b> that you can write about
        next. You can generate more or regenerate topics.
      </>
    ),
    selector: "#onborda-step14",
    side: "left",
    pointerPadding: 25,
    pointerRadius: 16,
    showControls: true,
  },
  {
    icon: <>📝</>,
    title: "Edit text by highlighting",
    content: (
      <>
        You can edit your draft by highlighting any text and selecting{" "}
        <b>Ask AI</b>, which will open up a bunch of commands to help you
        perfect your essay.
      </>
    ),
    selector: "#onborda-step15",
    side: "right",
    pointerPadding: 25,
    pointerRadius: 16,
    showControls: true,
  },
];
