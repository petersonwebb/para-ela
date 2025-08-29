import type { NextApiRequest, NextApiResponse } from 'next';
import { GITHUB_CONFIG } from '../../lib/github-config';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// URL para o arquivo de dados do casal
const getCoupleDataApiUrl = () => {
  return `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/contents/couple-data.json`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'Token do GitHub não configurado no servidor.' });
  }

  const coupleData = req.body;
  if (!coupleData || typeof coupleData !== 'object') {
    return res.status(400).json({ error: 'Dados do casal inválidos.' });
  }

  try {
    console.log('Salvando dados do casal no GitHub...');
    
    // Buscar SHA atual do arquivo (se existir)
    let sha = null;
    const fileRes = await fetch(getCoupleDataApiUrl(), {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
      console.log('SHA do arquivo encontrado:', sha);
    } else if (fileRes.status !== 404) {
      const errorText = await fileRes.text();
      console.error('Erro ao buscar arquivo:', errorText);
      return res.status(500).json({ error: 'Erro ao buscar arquivo no GitHub', details: errorText });
    }

    // Atualizar ou criar arquivo no GitHub
    const updateRes = await fetch(getCoupleDataApiUrl(), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Atualizando dados do casal via integração automática',
        content: Buffer.from(JSON.stringify(coupleData, null, 2), 'utf8').toString('base64'),
        ...(sha && { sha })
      })
    });
    
    console.log('Resposta da atualização:', updateRes.status, updateRes.statusText);
    
    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error('Erro ao salvar no GitHub:', errorText);
      return res.status(500).json({ error: 'Erro ao salvar no GitHub', details: errorText });
    }
    
    const result = await updateRes.json();
    console.log('Dados do casal salvos com sucesso:', result);
    return res.status(200).json({ success: true, details: result });
  } catch (error) {
    console.error('Erro ao salvar dados do casal:', error);
    return res.status(500).json({ error: 'Erro ao salvar dados do casal', details: String(error) });
  }
}
