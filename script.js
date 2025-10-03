document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('portfolio-form');
  const livePreview = document.getElementById('live-preview');
  const addSkillBtn = document.getElementById('add-skill-btn');
  const skillInput = document.getElementById('skill-input');
  const skillsList = document.getElementById('skills-list');

  const addProjectBtn = document.getElementById('add-project-btn');
  const projectsContainer = document.getElementById('projects-container');
  const projectTemplate = document.getElementById('project-template');

  const downloadPDFBtn = document.getElementById('download-pdf');
  const copyHTMLBtn = document.getElementById('copy-html');

  let skills = [];

  // Add Skill
  addSkillBtn.addEventListener('click', () => {
    const val = skillInput.value.trim();
    if(!val) return;
    skills.push(val);
    renderSkills();
    skillInput.value='';
    updatePreview();
  });

  function renderSkills(){
    skillsList.innerHTML='';
    skills.forEach((s,i)=>{
      const tag=document.createElement('div');
      tag.className='skill-tag';
      tag.innerHTML=`${s} <button data-index="${i}">&times;</button>`;
      skillsList.appendChild(tag);
    });
  }

  skillsList.addEventListener('click', e=>{
    if(e.target.tagName==='BUTTON'){
      skills.splice(e.target.dataset.index,1);
      renderSkills(); updatePreview();
    }
  });

  // Add Project
  addProjectBtn.addEventListener('click', ()=>{
    const clone=projectTemplate.content.cloneNode(true);
    projectsContainer.appendChild(clone);
    updatePreview();
  });

  projectsContainer.addEventListener('input', updatePreview);
  projectsContainer.addEventListener('click', e=>{
    if(e.target.classList.contains('remove-project-btn')){
      e.target.closest('.project-form').remove();
      updatePreview();
    }
  });

  form.addEventListener('input', updatePreview);

  function getData(){
    const projectForms = projectsContainer.querySelectorAll('.project-form');
    const projects = [];
    projectForms.forEach(p=>{
      projects.push({
        name:p.querySelector('.project-name').value,
        desc:p.querySelector('.project-desc').value,
        image:p.querySelector('.project-image').value,
        url:p.querySelector('.project-url').value
      });
    });
    return {
      personal:{
        name:document.getElementById('full-name').value,
        title:document.getElementById('job-title').value,
        about:document.getElementById('about-me').value,
        image:document.getElementById('profile-image').value||'https://via.placeholder.com/150'
      },
      skills:skills,
      projects:projects,
      education:{   // New Education section
        degree:document.getElementById('edu-degree').value,
        institution:document.getElementById('edu-institution').value,
        year:document.getElementById('edu-year').value,
        cgpa:document.getElementById('edu-cgpa').value
      },
      contact:{
        email:document.getElementById('email').value,
        linkedin:document.getElementById('linkedin').value,
        github:document.getElementById('github').value,
        phone:document.getElementById('phone').value
      }
    };
  }

  function updatePreview(){
    const data=getData();
    livePreview.innerHTML=`
      <div class="portfolio">
        <header>
          <img src="${data.personal.image}" class="profile-img"/>
          <h1>${data.personal.name}</h1>
          <h3>${data.personal.title}</h3>
          <p>${data.personal.about}</p>
        </header>
        <section class="skills-section">
          <h2>Skills</h2>
          <div class="skills-grid">
            ${data.skills.map(s=>`<div><p>${s}</p><div class="skill-bar"><div class="skill-level" style="width:${50+Math.random()*50}%"></div></div></div>`).join('')}
          </div>
        </section>
        <section class="projects-section">
          <h2>Projects</h2>
          <div class="projects-grid">
            ${data.projects.map(p=>`
              <div class="project-card">
                ${p.image?`<img src="${p.image}"/>`:''}
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                ${p.url?`<a href="${p.url}" target="_blank">View</a>`:''}
              </div>`).join('')}
          </div>
        </section>
        <section class="education-section">
          <h2>Education</h2>
          <div class="education-card">
            <h3>${data.education.degree || ''}</h3>
            <p><strong>${data.education.institution || ''}</strong></p>
            <p>${data.education.year || ''}</p>
            <p>${data.education.cgpa?`CGPA: ${data.education.cgpa}`:''}</p>
          </div>
        </section>
        <section class="contact-section">
          <h2>Contact</h2>
          <div class="contact-grid">
            ${data.contact.email?`<div class="contact-card">Email: <a href="mailto:${data.contact.email}">${data.contact.email}</a></div>`:''}
            ${data.contact.linkedin?`<div class="contact-card">LinkedIn: <a href="${data.contact.linkedin}" target="_blank">${data.contact.linkedin}</a></div>`:''}
            ${data.contact.github?`<div class="contact-card">GitHub: <a href="${data.contact.github}" target="_blank">${data.contact.github}</a></div>`:''}
            ${data.contact.phone?`<div class="contact-card">Phone: ${data.contact.phone}</div>`:''}
          </div>
        </section>
      </div>
    `;
  }

  downloadPDFBtn.addEventListener('click', ()=>{
    html2canvas(livePreview).then(canvas=>{
      const imgData=canvas.toDataURL('image/png');
      const pdf=new jspdf.jsPDF('p','mm','a4');
      const imgProps=pdf.getImageProperties(imgData);
      const pdfWidth=pdf.internal.pageSize.getWidth();
      const pdfHeight=(imgProps.height*pdfWidth)/imgProps.width;
      pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
      pdf.save('portfolio.pdf');
    });
  });

  copyHTMLBtn.addEventListener('click', ()=>{
    navigator.clipboard.writeText(livePreview.innerHTML);
    alert('HTML copied!');
  });

  form.addEventListener('submit', e=>{e.preventDefault(); alert('Portfolio generated! Use download PDF button.');});

  updatePreview();
});
