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
    calendarCarousel.innerHTML = ''; // Limpa o conteúdo atual do carrossel

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    for (let month = 0; month < 12; month++) {
        const monthSection = document.createElement('div');
        monthSection.classList.add('month-section');

        const monthTitle = document.createElement('h3');
        monthTitle.textContent = monthNames[month];
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
        const currentDate = new Date(startDate.getFullYear(), month, 1);
        const firstDay = currentDate.getDay(); // Dia da semana do primeiro dia do mês (0 = Domingo)
        const offset = (firstDay === 0 ? 6 : firstDay - 1); // Ajuste para começar em "Segunda"

        // Espaços vazios para alinhamento do calendário
        for (let i = 0; i < offset; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-day');
            monthCalendar.appendChild(emptyDiv);
        }

        while (currentDate.getMonth() === month) {
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
        calendarCarousel.appendChild(monthSection);
    }

    initializeCarousel();
}

function initializeCarousel() {
    const carousel = document.getElementById('calendar-carousel');
    const months = document.querySelectorAll('.month-section');
    let currentIndex = 0;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateCarousel() {
        const offset = -currentIndex * carousel.offsetWidth; // Cada mês ocupa 100% da largura do container
        carousel.style.transform = `translateX(${offset}px)`;
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < months.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    updateCarousel(); // Inicializa a posição
}
