// Configurações globais que podem ser acessadas por qualquer unidade
const VELOCIDADE_PX_SEG = 110;

function iniciarSistemaGlobal(sheetID, slideURL) {
    // 1. Carregar Slides
    document.getElementById('slide-frame').src = slideURL;

    // 2. Lógica do Relógio
    setInterval(() => {
        const now = new Date();
        const locale = 'pt-BR';
        const tz = 'America/Sao_Paulo';
        document.getElementById('day-line').textContent = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: tz }).format(now);
        document.getElementById('date-line').textContent = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: tz }).format(now);
        document.getElementById('time-container').textContent = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: tz });
    }, 1000);

    // 3. Lógica do Clima (Rio de Janeiro padrão)
    async function fetchWeather() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Rio de Janeiro&appid=ff0a9d4e6f632ea18d6ce175c676d736&units=metric&lang=pt_br`);
            const data = await response.json();
            document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('weather-icon-img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        } catch (e) { console.error("Erro Clima"); }
    }
    fetchWeather(); setInterval(fetchWeather, 600000);

    // 4. Lógica das Notícias (Dinâmica)
    let lastSign = "";
    async function fetchNews() {
        try {
            const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&t=${Date.now()}`);
            const text = await response.text();
            const lines = text.split('\n').slice(1);
            let items = lines.map(l => l.trim().replace(/^"|"$/g, '').replace(/""/g, '"')).filter(l => l.length > 0);
            const html = items.join('<span class="separator">|</span>');

            if (html !== lastSign) {
                lastSign = html;
                const el = document.getElementById('marquee-text');
                el.innerHTML = html;
                setTimeout(() => {
                    const duracao = (el.offsetWidth + window.innerWidth) / VELOCIDADE_PX_SEG;
                    el.style.animation = 'none';
                    el.offsetHeight;
                    el.style.animation = `scrollLeft ${duracao}s linear infinite`;
                }, 200);
            }
        } catch (e) { console.error("Erro News"); }
    }
    fetchNews(); setInterval(fetchNews, 60000);
}