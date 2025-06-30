const candidateDetails = document.querySelector('.candiate-details-container');
const candiateMarks = document.querySelector('.candiate-marks-container');
const candiateEachSubjectsMarks = document.querySelector('.candiate-mark-each-subjects-container');
const candiateOverallMarks = document.querySelector('.candiate-overall-marks-container');
const selectElement = document.getElementById("filters");
const selectedValue = selectElement.value;
const studentPerformanceHeader = document.querySelector('.student-performance-header');
const showErrorMessage = document.querySelector('.error-message');
screenWidth = window.innerWidth;
let globalSubjectMarks = {};
let globaloverallMarks = {};

const fetchResultData = () => {
    const url = document.getElementById('fetch-url-input').value;
    if (!url) {
        alert('Enter a URL to fetch');
        candidateDetails.classList.add('d-none');
        candiateMarks.classList.add('d-none');
        showErrorMessage.classList.add('d-none');
        return;
    }

    candiateEachSubjectsMarks.innerHTML = '';
    candiateOverallMarks.innerHTML = '';
    candidateDetails.innerHTML = '';
    showErrorMessage.innerText = '';
    fetchParseData(url);
};

const sortObject = (subjectMarks, criteria) => {
    return new Map(
        Object.entries(subjectMarks).sort((a, b) => b[1][criteria] - a[1][criteria])
    );
};

const fetchParseData = async (url) => {
    const hideLoader = showTopLoader();
    try {
        const fetchData = await fetch('/fetchCandiateDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        if (fetchData.status === 200) {
            const data = await fetchData.json();
            if (data) {
                data.forEach(([label, value]) => {
                    const row = document.createElement('div');
                    row.className = 'row';
                    row.innerHTML = `
                        <div class="col-lg-6 col-md-6 col-sm-6 col-12 fw-bold p-3">${label}</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-12 p-3">${value}</div>
                    `;
                    candidateDetails.appendChild(row);
                    candiateMarks.classList.remove('d-none');
                    candidateDetails.classList.remove('d-none');
                });

                const fetchCandiateMarks = await fetch('/fetchCandiateMarks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });

                if (fetchCandiateMarks.status === 200) {
                    const data = await fetchCandiateMarks.json();
                    if (data && data.subjects) {
                        globalSubjectMarks = data.subjects;
                        const selectedValue = selectElement.value;
                        renderSubjectMarks(globalSubjectMarks, selectedValue, screenWidth);
                        if (data.overall) {
                            globaloverallMarks = data.overall
                            renderOverallMarks(data.overall, screenWidth);
                        }
                    }
                }
            }
        } else if (fetchData.status === 500) {
            showErrorMessage.classList.remove('d-none');
            showErrorMessage.innerText = 'Unable to fetch. Please check the URL or try again later.';
            candiateMarks.classList.add('d-none');
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    } finally {
        hideLoader();
    }
};

const renderSubjectMarks = (subjectMarks, criteria, screenWidth) => {
    candiateEachSubjectsMarks.innerHTML = '';
    const sortedMap = sortObject(subjectMarks, criteria);
    if (screenWidth > 768) {
        sortedMap.forEach((value) => {
            const row = document.createElement('div');
            row.className = 'row subject-performance-row';
            row.innerHTML = `
                <div class="col-12">
                    <div class="row">
                        <div class="col-5 subject-name d-flex align-items-center border-end-light p-3">
                            ${value.subjectName}
                        </div>
                        <div class="col-7 performance-metrics">
                            <div class="row metrics-values">
                                <div class="col-3 metric attempt-value p-3">${value.attempt}</div>
                                <div class="col-3 metric not-attempt-value p-3">${value.unattempt}</div>
                                <div class="col-2 metric right-value p-3">${value.rightAnswer}</div>
                                <div class="col-2 metric wrong-value p-3">${value.wrongAnswer}</div>
                                <div class="col-2 metric marks-value p-3">${value.marks}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            candiateEachSubjectsMarks.appendChild(row);
        });
    } else {
        studentPerformanceHeader.innerHTML = '';
        sortedMap.forEach((value) => {
            const safeId = value.subjectName.trim().replace(/\s+/g, '-').toLowerCase();
            const row = document.createElement('div');
            row.className = 'card-shadow mb-3';
            row.innerHTML = `
                <div class="d-flex justify-content-between align-items-center bg-orange text-light px-4 py-3">
                    <h5 class="mb-0 fw-bold">${value.subjectName}</h5>
                    <button class="btn btn-light btn-sm toggle-btn" data-bs-toggle="collapse"
                        data-bs-target="#${safeId}" aria-expanded="true">
                        <i class="fas fa-chevron-up text-dark"></i>
                    </button>
                </div>

                <div class="collapse" id="${safeId}">
                    <div class="marks-data bg-light">
                        <div class="row g-0 border-bottom">
                            <div class="col-6 text-center py-3 fw-bold">Attempt</div>
                            <div class="col-6 text-center py-3">${value.attempt}</div>
                        </div>
                        <div class="row g-0 bg-white border-bottom">
                            <div class="col-6 text-center py-3 fw-bold">Not Attempt</div>
                            <div class="col-6 text-center py-3">${value.unattempt}</div>
                        </div>
                        <div class="row g-0 border-bottom">
                            <div class="col-6 text-center py-3 fw-bold">Right</div>
                            <div class="col-6 text-center py-3">${value.rightAnswer}</div>
                        </div>
                        <div class="row g-0 bg-white border-bottom">
                            <div class="col-6 text-center py-3 fw-bold">Wrong</div>
                            <div class="col-6 text-center py-3">${value.wrongAnswer}</div>
                        </div>
                        <div class="row g-0">
                            <div class="col-6 text-center py-3 fw-bold">Marks</div>
                            <div class="col-6 text-center py-3">${value.marks}</div>
                        </div>
                    </div>
                </div>
            `;
            candiateEachSubjectsMarks.appendChild(row);
        });

        setTimeout(() => {
            document.querySelectorAll('.toggle-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const icon = button.querySelector('i');
                    icon.classList.toggle('fa-chevron-up');
                    icon.classList.toggle('fa-chevron-down');
                });
            });
        }, 100);
    }
};

const renderOverallMarks = (overallMarks, screenWidth) => {
    candiateOverallMarks.innerHTML = '';
    const row = document.createElement('div');

    if (screenWidth > 768) {
        row.className = 'row overall-marks';
        row.innerHTML = `
            <div class="col-12">
                <div class="row">
                    <div class="col-5 subject-name d-flex align-items-center border-end-light p-3 fw-bold">Overall</div>
                    <div class="col-7 performance-metrics">
                        <div class="row metrics-values">
                            <div class="col-3 metric attempt-value p-3">${overallMarks.totalAttempt}</div>
                            <div class="col-3 metric not-attempt-value p-3">${overallMarks.totalNotAttempt}</div>
                            <div class="col-2 metric right-value p-3">${overallMarks.totalRight}</div>
                            <div class="col-2 metric wrong-value p-3">${overallMarks.totalWrong}</div>
                            <div class="col-2 metric marks-value p-3">${overallMarks.totalMarks}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        row.className = 'card-shadow';
        row.innerHTML = `
            <div class="d-flex justify-content-between align-items-center bg-orange text-light px-4 py-3">
                <h5 class="mb-0 fw-bold">Overall</h5>
                <button class="btn btn-light btn-sm toggle-btn" data-bs-toggle="collapse"
                    data-bs-target="#overall-collapse" aria-expanded="true">
                    <i class="fas fa-chevron-up text-dark"></i>
                </button>
            </div>

            <div class="collapse" id="overall-collapse">
                <div class="marks-data bg-light">
                    <div class="row g-0 border-bottom">
                        <div class="col-6 text-center py-3 fw-bold">Total Attempt</div>
                        <div class="col-6 text-center py-3">${overallMarks.totalAttempt}</div>
                    </div>
                    <div class="row g-0 bg-white border-bottom">
                        <div class="col-6 text-center py-3 fw-bold">Total Not Attempt</div>
                        <div class="col-6 text-center py-3">${overallMarks.totalNotAttempt}</div>
                    </div>
                    <div class="row g-0 border-bottom">
                        <div class="col-6 text-center py-3 fw-bold">Total Right</div>
                        <div class="col-6 text-center py-3">${overallMarks.totalRight}</div>
                    </div>
                    <div class="row g-0 bg-white border-bottom">
                        <div class="col-6 text-center py-3 fw-bold">Total Wrong</div>
                        <div class="col-6 text-center py-3">${overallMarks.totalWrong}</div>
                    </div>
                    <div class="row g-0">
                        <div class="col-6 text-center py-3 fw-bold">Total Marks</div>
                        <div class="col-6 text-center py-3">${overallMarks.totalMarks}</div>
                    </div>
                </div>
            </div>
        `;
    }

    candiateOverallMarks.appendChild(row);
};

selectElement.addEventListener("change", () => {
    const selectedValue = selectElement.value;
    renderSubjectMarks(globalSubjectMarks, selectedValue, screenWidth);
});

const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Subject,Attempt,Unattempt,Right,Wrong,Marks\n";
    for (let subjectmark in globalSubjectMarks) {
        const row = [
            globalSubjectMarks[subjectmark].subjectName,
            globalSubjectMarks[subjectmark].attempt,
            globalSubjectMarks[subjectmark].unattempt,
            globalSubjectMarks[subjectmark].rightAnswer,
            globalSubjectMarks[subjectmark].wrongAnswer,
            globalSubjectMarks[subjectmark].marks
        ].join(",");
        csvContent += row + "\n";
    }

    const overall = document.querySelector('.overall-marks');
    if (overall) {
        const overallRow = [
            "Overall",
            overall.querySelector('.attempt-value')?.textContent || '',
            overall.querySelector('.not-attempt-value')?.textContent || '',
            overall.querySelector('.right-value')?.textContent || '',
            overall.querySelector('.wrong-value')?.textContent || '',
            overall.querySelector('.marks-value')?.textContent || ''
        ].join(",");
        csvContent += overallRow + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "candidate_marks.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

const showTopLoader = () => {
    const loader = document.getElementById('data-loading-bar');
    loader.style.width = '0%';
    loader.style.display = 'block';
    let progress = 0;

    const interval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 10;
            loader.style.width = progress + '%';
        } else {
            clearInterval(interval);
        }
    }, 200);

    return () => {
        clearInterval(interval);
        loader.style.width = '100%';
        setTimeout(() => {
            loader.style.display = 'none';
            loader.style.width = '0%';
        }, 300);
    };
};

function handleResize() {
    if (globalSubjectMarks && globaloverallMarks) {
        renderSubjectMarks(globalSubjectMarks, selectedValue,window.innerWidth );
        renderOverallMarks(globaloverallMarks,window.innerWidth )
    }
}
handleResize();
window.addEventListener('resize', () => {
    handleResize();
});


window.onload = function () {
    handleResize();
};