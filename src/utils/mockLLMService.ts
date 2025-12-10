// utils/mockLLMService.ts

export const MOCK_RAG_RESULT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'CH4. 光合作用：能量的轉換' }]
    },

    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '🤖 AI 導讀：', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' 本章節是生物能量學的核心。請特別注意「光反應」與「固碳反應」的場所差異，這是歷年大考的高頻考點。' }
          ]
        }
      ]
    },

    // 3. 結構化內容
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '1. 反應場所與條件' }]
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '光合作用發生在葉綠體中，依照是否直接需要光能，分為兩階段：' }]
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
                { type: 'text', text: '光反應 (Light Reaction)', marks: [{ type: 'bold' }] },
                { type: 'text', text: '：發生在' },
                { type: 'text', text: '類囊體 (Thylakoid)', marks: [{ type: 'code' }] }, // 用 Code 樣式來做螢光筆效果
                { type: 'text', text: '。需要光與水。' }
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
                { type: 'text', text: '固碳反應 (Calvin Cycle)', marks: [{ type: 'bold' }] },
                { type: 'text', text: '：發生在' },
                { type: 'text', text: '基質 (Stroma)', marks: [{ type: 'code' }] },
                { type: 'text', text: '。需要 ATP 與 NADPH。' }
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
          content: [{ type: 'text', text: '許多學生誤以為固碳反應只能在晚上進行。事實上，固碳反應通常在白天進行，因為它需要光反應產生的能量貨幣 (ATP)。' }]
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