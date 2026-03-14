try {
  // 1. 确保 body 存在且不是空的
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Empty request body" });
  }

  const { max_tokens, tools, ...rest } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    // 强制限制 max_tokens，并确保 rest 里的内容是合法的
    body: JSON.stringify({ 
      ...rest, 
      max_tokens: 800 
    }),
  });

  // 2. 先检查响应状态码
  if (!response.ok) {
    const errorText = await response.text();
    return res.status(response.status).json({ error: `Anthropic API error: ${errorText}` });
  }

  const data = await response.json();
  res.status(200).json(data);

} catch (e) {
  // 3. 这里的报错会捕捉到所有的解析错误
  res.status(500).json({ error: "Internal Server Error", details: e.message });
}
