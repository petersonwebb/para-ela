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
    console.log('Recriando arquivo no GitHub com mensagens:', messages);
    
    // Criar arquivo no GitHub (sem verificar SHA existente)
    const createRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Recriando arquivo vlog-messages.json (arquivo corrompido)',
        content: Buffer.from(JSON.stringify(messages, null, 2), 'utf8').toString('base64')
      })
    });
    
    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error('Erro ao recriar arquivo:', errorText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao recriar arquivo no GitHub', details: errorText })
      };
    }
    
    console.log('Arquivo recriado com sucesso!');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Arquivo recriado com sucesso' })
    };
  } catch (error) {
    console.error('Erro ao recriar arquivo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao recriar arquivo', details: String(error) })
    };
  }
};
