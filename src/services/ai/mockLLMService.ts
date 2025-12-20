// utils/mockLLMService.ts

export const MOCK_RAG_RESULT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'CH4. 二次函數與圖形' }]
    },

    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '🤖 AI 導讀：', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' 本章節是代數學的核心。請特別注意「頂點式」與「標準式」的轉換方法，這是歷年大考的高頻考點。' }
          ]
        }
      ]
    },

    // 3. 結構化內容
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '1. 二次函數的表示法' }]
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '二次函數可以用不同形式表示，依照解題需求選擇適合的形式：' }]
    },

    // 4. 重點條列 (Bullet List)
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '標準式', marks: [{ type: 'bold' }] },
                { type: 'text', text: '：' },
                { type: 'text', text: 'y = ax² + bx + c', marks: [{ type: 'code' }] },
                { type: 'text', text: '。適合求 y 截距。' }
              ]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '頂點式', marks: [{ type: 'bold' }] },
                { type: 'text', text: '：' },
                { type: 'text', text: 'y = a(x-h)² + k', marks: [{ type: 'code' }] },
                { type: 'text', text: '。頂點座標為 (h, k)。' }
              ]
            }
          ]
        }
      ]
    },

    // 5. 另一個 Callout (迷思概念)
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '⚠️ 常見迷思' }]
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '許多學生誤以為 a > 0 時圖形開口向下。事實上，當 a > 0 時圖形開口向上，頂點為最低點。' }]
        }
      ]
    }
  ]
};

export const fetchAIImportedContent = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RAG_RESULT);
    }, 800);
  });
};