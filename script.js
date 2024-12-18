document.getElementById('generateBtn').addEventListener('click', generateScale);

function generateScale() {
    const startDate = new Date(document.getElementById('startDate').value);
    const scale = document.getElementById('scale').value;

    if (!startDate || !scale) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const [workDays, offDays] = scale.split('x').map(Number);
    const calendarCarousel = document.getElementById('calendar-carousel');
    calendarCarousel.innerHTML = ''; // Limpa os meses anteriores

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    // Gerar 12 meses antes e 12 meses depois do mês inicial
    const monthsToGenerate = 12; // Número de meses antes e depois
    const firstMonth = startDate.getMonth();
    const firstYear = startDate.getFullYear();

    // Gerar meses anteriores (correto com transição de ano)
    for (let i = monthsToGenerate; i > 0; i--) {
        const currentMonth = (firstMonth - i + 12) % 12;
        const currentYear = firstYear - Math.ceil((i - firstMonth - 1) / 12);

        generateMonth(currentYear, currentMonth, calendarCarousel, startDate, workDays, offDays, monthNames, weekDays);
    }

    // Gerar meses a partir do mês inicial
    for (let i = 0; i <= monthsToGenerate; i++) {
        const currentMonth = (firstMonth + i) % 12;
        const currentYear = firstYear + Math.floor((firstMonth + i) / 12);

        generateMonth(currentYear, currentMonth, calendarCarousel, startDate, workDays, offDays, monthNames, weekDays);
    }

    initializeCarousel(monthsToGenerate); // Ajusta o índice inicial
}

// Função para gerar um mês do calendário
function generateMonth(currentYear, currentMonth, container, startDate, workDays, offDays, monthNames, weekDays) {
    const monthSection = document.createElement('div');
    monthSection.classList.add('month-section');

    const monthTitle = document.createElement('h3');
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    monthSection.appendChild(monthTitle);

    const monthCalendar = document.createElement('div');
    monthCalendar.classList.add('month-calendar');

    // Adiciona os dias da semana
    weekDays.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('week-day');
        dayDiv.textContent = day;
        monthCalendar.appendChild(dayDiv);
    });

    // Adiciona os dias do mês
    const currentDate = new Date(currentYear, currentMonth, 1);
    const firstDay = currentDate.getDay(); // Dia da semana do primeiro dia do mês
    const offset = (firstDay === 0 ? 6 : firstDay - 1); // Ajusta para começar em "Segunda"

    // Espaços vazios para alinhamento do calendário
    for (let j = 0; j < offset; j++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty-day');
        monthCalendar.appendChild(emptyDiv);
    }

    // Preenche os dias do mês com base na escala
    while (currentDate.getMonth() === currentMonth) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = currentDate.getDate();

        const daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        const cycleDay = (daysSinceStart % (workDays + offDays) + (workDays + offDays)) % (workDays + offDays);

        if (cycleDay < workDays) {
            dayDiv.classList.add('work-day');
        } else {
            dayDiv.classList.add('off-day');
        }

        monthCalendar.appendChild(dayDiv);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    monthSection.appendChild(monthCalendar);
    container.appendChild(monthSection);
}

// Função para inicializar o carrossel e mostrar o mês correto
function initializeCarousel(initialIndex) {
    const carousel = document.getElementById('calendar-carousel');
    const months = document.querySelectorAll('.month-section');
    let currentIndex = initialIndex;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateCarousel() {
        const offset = -currentIndex * 100; // Cada mês ocupa 100% da largura
        carousel.style.transform = `translateX(${offset}%)`;
    }

    prevBtn.onclick = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    };

    nextBtn.onclick = () => {
        if (currentIndex < months.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    };

    updateCarousel(); // Inicializa no mês pesquisado
}
