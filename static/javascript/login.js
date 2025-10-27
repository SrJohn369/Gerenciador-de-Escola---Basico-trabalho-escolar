document.getElementById('senha').addEventListener('focus', () => {
    document.getElementById('span-incorrect').style.display = 'none';
});
//função para pegar cookie do csrf_token
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// aciona o evento de login
document.getElementById('submit-button').addEventListener('click', async (event) =>{
    event.preventDefault()
    
    let csrf_token = getCookie('csrftoken');
    let usuario = document.getElementById('usuario').value;
    let senha = document.getElementById('senha').value;
    const url = `/login/`;

    let dados = {
        method: 'POST',
        headers: {'X-CSRFToken': csrf_token},
        body: JSON.stringify({
            'usuario': usuario,
            'senha': senha
        })
    }

    document.getElementById('carregamento').style.display = 'flex';

    await fetch(url, dados)
            .then((response) => {
                if (response.status === 200) {
                    console.log('LOGOU');
                    document.getElementById('carregamento').style.display = 'none';
                    window.location.href = '/';
                } else if (response.status === 404){
                    document.getElementById('carregamento').style.display = 'none';
                    document.getElementById('span-incorrect').style.display = 'block';
                }
            });
});

