import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    title: "Geo-Fenced Attendance System",
    category: "Backend Development",
    tools: "Python • FastAPI • MySQL • REST APIs",
    image: "/images/attendance.png",
  },
  {
    title: "Expense Tracking API Platform",
    category: "Backend Engineering",
    tools: "Python • FastAPI • JWT • MySQL",
    image: "/images/expense.png",
  },
  {
    title: "NLP-Powered Chatbot",
    category: "AI & Backend",
    tools: "Python • Flask • NLP • REST APIs",
    image: "/images/chatbot.png",
  },
  {
    title: "Portfolio Website",
    category: "Full Stack Development",
    tools: "React • TypeScript • Three.js • GSAP",
    image: "/images/portfolio.png",
  },
];

const Work = () => {
  useGSAP(() => {
  const workFlex = document.querySelector(
    ".work-flex"
  ) as HTMLElement;

  if (!workFlex) return;

  const scrollDistance =
    workFlex.scrollWidth - window.innerWidth;

  const tween = gsap.to(workFlex, {
    x: -scrollDistance,
    ease: "none",
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: `+=${scrollDistance + 1000}`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
    },
  });

  ScrollTrigger.refresh();

  return () => {
    tween.kill();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}, []);


  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Featured <span>Projects</span>
        </h2>

        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{String(index + 1).padStart(2, "0")}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>

                <h4>Tools & Technologies</h4>
                <p>{project.tools}</p>
              </div>

              <WorkImage
                image={project.image}
                alt={project.title}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;