import type { NextApiRequest, NextApiResponse } from 'next';
import { GITHUB_CONFIG, getApiUrl } from '../../lib/github-config';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'Token do GitHub não configurado no servidor.' });
  }

  const messages = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato de mensagens inválido.' });
  }

  try {
    console.log('Recriando arquivo no GitHub com mensagens:', messages);
    
    // Criar arquivo no GitHub (sem verificar SHA existente)
    const createRes = await fetch(getApiUrl(), {
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
      return res.status(500).json({ error: 'Erro ao recriar arquivo no GitHub', details: errorText });
    }
    
    console.log('Arquivo recriado com sucesso!');
    return res.status(200).json({ success: true, message: 'Arquivo recriado com sucesso' });
  } catch (error) {
    console.error('Erro ao recriar arquivo:', error);
    return res.status(500).json({ error: 'Erro ao recriar arquivo', details: String(error) });
  }
}
