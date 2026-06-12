import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Developer</h4>
                <h5>Technodyne Informatics Pvt. Ltd.</h5>
              </div>
              <h5>2025–Present</h5>
            </div>
            <p>
              Developing and maintaining web applications using Python, JavaScript, HTML, and CSS. Building automation solutions, reusable components, and scalable software systems while collaborating with cross-functional teams.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech CSE</h4>
                <h5>Andhra University</h5>
              </div>
              <h5>2021–2025</h5>
            </div>
            <p>
              Built a strong foundation in software engineering, data structures, databases, object-oriented programming, and modern application development while maintaining consistent academic performance.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Technical Projects</h4>
                <h5>Backend Development & APIs</h5>
              </div>
              <h5>2024–Present</h5>
            </div>
            <p>
              Developed production-style projects including a Geo-Fenced Attendance System, Expense Tracking API Platform, and NLP-Powered Chatbot, focusing on scalable backend architecture, REST APIs, authentication, and database optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
