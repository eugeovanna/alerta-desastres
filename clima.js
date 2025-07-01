async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return alert("Digite uma cidade!");
  
    try {
      // 1. Buscar latitude e longitude da cidade via Nominatim
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const geoData = await geoRes.json();
  
      if (!geoData.length) throw new Error("Cidade não encontrada");
  
      const { lat, lon, display_name } = geoData[0];
  
      // 2. Buscar clima atual usando Open-Meteo
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherRes.json();
  
      const weather = weatherData.current_weather;
  
      // 3. Atualizar a interface
      document.getElementById('cityName').textContent = display_name;
      document.getElementById('temperature').textContent = weather.temperature;
      document.getElementById('wind').textContent = weather.windspeed;
      document.getElementById('weatherResult').classList.remove('hidden');
    } catch (err) {
      alert("Erro ao buscar clima: " + err.message);
    }
  }
  
const form = document.getElementById('formPostagem');
    const container = document.getElementById('postagens');
    const notification = document.getElementById('notification');

    function showNotification(msg) {
      notification.textContent = msg;
      notification.classList.add('show');
      setTimeout(() => notification.classList.remove('show'), 2000);
    }

    function savePosts() {
      localStorage.setItem('posts', container.innerHTML);
    }

    function loadPosts() {
      const saved = localStorage.getItem('posts');
      if (saved) {
        container.innerHTML = saved;

        const posts = container.querySelectorAll('.post');
        posts.forEach(post => {
          const commentBtn = post.querySelector('.comment-section button');
          if (commentBtn) {
            commentBtn.onclick = () => openCommentModal(post);
          }
        });
      }
    }

    function toggleTheme() {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    }

    function loadTheme() {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') document.body.classList.add('dark');
    }

    function excluirPost(btn) {
      const post = btn.closest('.post');
      post.remove();
      savePosts();
      showNotification("Alerta excluído!");
    }

    function limparLocalStorage() {
      if (confirm("Tem certeza que deseja apagar todos os alertas e configurações?")) {
        localStorage.clear();
        container.innerHTML = '';
        showNotification("LocalStorage limpo com sucesso!");
      }
    }

    let currentPost = null;

    function openCommentModal(postElement) {
      currentPost = postElement;
      document.getElementById('commentModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('commentModal').style.display = 'none';
    }

    function submitComment() {
      const name = document.getElementById('commenterName').value.trim();
      const text = document.getElementById('commentText').value.trim();

      if (!name || !text || !currentPost) return;

      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');
      commentDiv.innerHTML = `<strong>${name}:</strong> ${text}`;

      const commentsList = currentPost.querySelector('.comments-list');
      commentsList.appendChild(commentDiv);

      document.getElementById('commenterName').value = '';
      document.getElementById('commentText').value = '';
      closeModal();
      savePosts();
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const localizacao = document.getElementById('localizacao').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();
      const imagem = document.getElementById('imagem').files[0];
      const data = new Date().toLocaleString('pt-BR');

      if (!nome || !localizacao || !mensagem) return;

      const novaPostagem = document.createElement('div');
      novaPostagem.classList.add('post');

      function renderPost(imgSrc = '') {
        novaPostagem.innerHTML = `
          <button class="delete-btn" onclick="excluirPost(this)">Excluir</button>
          <h2>${nome} - ${localizacao}</h2>
          <div class="post-content-scroll">
            <div class="mensagem">${mensagem}</div>
            ${imgSrc ? `<img src="${imgSrc}" class="imagem-postada">` : ''}
            <p class="date">${data}</p>
          </div>
          <div class="comment-section">
            <button onclick="openCommentModal(this.closest('.post'))">Adicionar Comentário</button>
            <div class="comments-list"></div>
          </div>
        `;
        container.prepend(novaPostagem);
        form.reset();
        savePosts();
        showNotification("Alerta publicado com sucesso!");
      }

      if (imagem) {
        const reader = new FileReader();
        reader.onload = () => renderPost(reader.result);
        reader.readAsDataURL(imagem);
      } else {
        renderPost();
      }
    });

    window.addEventListener('load', () => {
      loadTheme();
      loadPosts();

      window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('commentModal')) {
          closeModal();
        }
      });
    });


  