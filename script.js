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

    // Gerar 24 meses (2 anos) ao redor da data inicial
    const monthsToGenerate = 24;
    const firstMonth = startDate.getMonth();
    const firstYear = startDate.getFullYear();

    for (let i = 0; i < monthsToGenerate; i++) {
        const currentMonth = (firstMonth + i) % 12;
        const currentYear = firstYear + Math.floor((firstMonth + i) / 12);

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
        calendarCarousel.appendChild(monthSection);
    }

    initializeCarousel(firstMonth, firstYear);
}

// Função para inicializar o carrossel e mostrar o mês correto
function initializeCarousel(startMonth, startYear) {
    const carousel = document.getElementById('calendar-carousel');
    const months = document.querySelectorAll('.month-section');
    let currentIndex = 0;

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Localiza o índice do mês inicial correto
    for (let i = 0; i < months.length; i++) {
        const [monthName, year] = months[i].querySelector('h3').textContent.split(' ');
        if (monthName === monthNames[startMonth] && parseInt(year) === startYear) {
            currentIndex = i;
            break;
        }
    }

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
