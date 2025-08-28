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
    // Buscar SHA atual do arquivo
    const fileRes = await fetch(getApiUrl(), {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const fileData = await fileRes.json();
    const sha = fileData.sha;

    // Atualizar arquivo no GitHub
    const updateRes = await fetch(getApiUrl(), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Atualizando mensagens do vlog via integração automática',
        content: Buffer.from(JSON.stringify(messages, null, 2)).toString('base64'),
        sha: sha
      })
    });
    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      return res.status(500).json({ error: 'Erro ao salvar no GitHub', details: errorText });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao salvar mensagens', details: String(error) });
  }
}
