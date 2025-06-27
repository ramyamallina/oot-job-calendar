document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const jobForm = document.getElementById('jobForm');
  const modal = document.getElementById('editModal');
  const editName = document.getElementById('editName');
  const editDate = document.getElementById('editDate');
  const editStatus = document.getElementById('editStatus');
  const editNote = document.getElementById('editNote');
  const switchEl = document.getElementById('darkModeSwitch');
  let currentEditId = null;

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    switchEl.checked = true;
  }

  switchEl.addEventListener('change', () => {
    const isDark = switchEl.checked;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
  });

  async function fetchJobs() {
    const res = await fetch('/api/jobs');
    return await res.json();
  }

  async function addJobToDB(job) {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    return await res.json();
  }

  async function updateJobInDB(id, updatedJob) {
    await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedJob)
    });
  }

  async function deleteJobInDB(id) {
    await fetch(`/api/jobs/${id}`, {
      method: 'DELETE'
    });
  }

  let jobs = await fetchJobs();

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: jobs.map(job => ({
      id: job.id,
      title: job.title,
      start: job.start,
      allDay: true,
      extendedProps: {
        status: job.status,
        note: job.note || ''
      }
    })),
    eventClick: function (info) {
      const job = jobs.find(j => j.id === info.event.id);
      if (!job) return;

      currentEditId = job.id;
      editName.value = job.title;
      editDate.value = job.start;
      editStatus.value = job.status;
      editNote.value = job.note || '';

      modal.style.display = 'flex';
    },
    eventContent: function (arg) {
      let titleEl = document.createElement('div');
      titleEl.classList.add('fc-event-title');
      titleEl.innerText = arg.event.title;

      let noteEl = null;
      if (arg.event.extendedProps.note) {
        noteEl = document.createElement('div');
        noteEl.classList.add('fc-event-note');
        noteEl.innerText = arg.event.extendedProps.note;
      }

      return { domNodes: [titleEl, noteEl].filter(Boolean) };
    },
    eventClassNames: function (arg) {
      return arg.event.extendedProps.status;
    }
  });

  calendar.render();

  jobForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('jobName').value;
    const date = document.getElementById('jobDate').value;
    const status = document.getElementById('jobStatus').value;
    const note = document.getElementById('jobNote').value;

    const newJob = {
      id: Date.now().toString(), // Generates a unique ID
      title: name,
      start: date,
      status,
      note
    };

    await addJobToDB(newJob);
    jobs.push(newJob);

    calendar.addEvent({
      id: newJob.id,
      title: newJob.title,
      start: newJob.start,
      allDay: true,
      extendedProps: { status: newJob.status, note: newJob.note }
    });

    jobForm.reset();
  });

  document.getElementById('cancelEdit').onclick = () => {
    modal.style.display = 'none';
    currentEditId = null;
  };

  document.getElementById('deleteJob').onclick = async () => {
    if (!currentEditId) return;
    await deleteJobInDB(currentEditId);
    jobs = jobs.filter(j => j.id !== currentEditId);
    calendar.getEventById(currentEditId)?.remove();
    modal.style.display = 'none';
    currentEditId = null;
  };

  document.getElementById('saveEdit').onclick = async () => {
    const job = jobs.find(j => j.id === currentEditId);
    if (!job) return;

    job.title = editName.value;
    job.start = editDate.value;
    job.status = editStatus.value;
    job.note = editNote.value;

    await updateJobInDB(job.id, job);

    const event = calendar.getEventById(job.id);
    if (event) {
      event.setProp('title', job.title);
      event.setStart(job.start);
      event.setExtendedProp('status', job.status);
      event.setExtendedProp('note', job.note);
    }

    modal.style.display = 'none';
    currentEditId = null;
  };
});
