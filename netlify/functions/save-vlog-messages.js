const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Token do GitHub não configurado.' })
    };
  }

  let messages;
  try {
    messages = JSON.parse(event.body);
    if (!Array.isArray(messages)) {
      throw new Error('Formato de mensagens inválido.');
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Formato de mensagens inválido.' })
    };
  }

  // Configuração do repositório
  const username = 'petersonwebb';
  const repository = 'para-ela';
  const branch = 'main';
  const filePath = 'vlog-messages.json';
  const apiUrl = `https://api.github.com/repos/${username}/${repository}/contents/${filePath}`;

  try {
    // Buscar SHA atual do arquivo
    const fileRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const fileData = await fileRes.json();
    const sha = fileData.sha;

    // Atualizar arquivo no GitHub
    const updateRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Atualizando mensagens do vlog via Netlify Function',
        content: Buffer.from(JSON.stringify(messages, null, 2)).toString('base64'),
        sha: sha
      })
    });
    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar no GitHub', details: errorText })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao salvar mensagens', details: String(error) })
    };
  }
};
