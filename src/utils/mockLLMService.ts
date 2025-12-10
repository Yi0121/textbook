// utils/mockLLMService.ts

export const MOCK_RAG_RESULT = {
  type: 'doc',
  content: [
    // 1. 標題與來源標示 (模擬 RAG 標註來源的 UI)
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'CH4. 光合作用的能量轉換' }]
    },
    {
      type: 'paragraph',
      attrs: { class: 'text-sm text-slate-500 mb-6' }, // 透過 Tailwind class 做弱化視覺
      content: [
        { type: 'text', text: '資料來源：高中生物全集 (p.142 - p.145) • 98% 相關度' }
      ]
    },

    // 2. 導言：帶有「引用標記」的文本 (增加可信度感)
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '光合作用是植物將光能轉化為化學能的過程。這主要發生在葉綠體中，可分為兩大階段：' },
        { type: 'text', marks: [{ type: 'bold' }], text: '光反應' },
        { type: 'text', text: ' 與 ' },
        { type: 'text', marks: [{ type: 'bold' }], text: '固碳反應 (卡爾文循環)' },
        { type: 'text', text: '。值得注意的是，固碳反應雖然不需要直接光照，但通常仍在白天進行 ' },
        { 
          type: 'text', 
          marks: [{ type: 'link', attrs: { href: '#ref-1', class: 'text-blue-600 text-xs align-top' } }], 
          text: '[1]' // 模擬引用上標
        },
        { type: 'text', text: '。' }
      ]
    },

    // 3. 重點整理區塊 (模擬老師畫重點)
    // 直接用 blockquote，但在 UI 上可以給它特殊的左邊框顏色
    {
      type: 'blockquote',
      attrs: { class: 'border-l-4 border-blue-500 pl-4 py-1 my-4 bg-blue-50 italic' }, 
      content: [
        { 
          type: 'paragraph', 
          content: [
            { type: 'text', text: '💡 核心觀念：能量流動的方向是「光能 → ATP/NADPH → 葡萄糖化學能」。' }
          ] 
        }
      ]
    },

    // 4. 比較表格 (這是教學內容最有感的 UI 呈現)
    // Tiptap 的 Table 結構，這會讓畫面看起來非常豐富
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '比較：光反應 vs. 固碳反應' }]
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '比較項目' }] }] },
            { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '光反應' }] }] },
            { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '固碳反應' }] }] }
          ]
        },
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', marks:[{type:'bold'}], text: '發生場所' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '類囊體 (Thylakoid)' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '基質 (Stroma)' }] }] }
          ]
        },
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', marks:[{type:'bold'}], text: '主要產物' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'O₂, ATP, NADPH' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '葡萄糖 (醣類), ADP, NADP+' }] }] }
          ]
        }
      ]
    },

    // 5. 延伸引導 (模擬 AI 的對話延續性)
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '✨ 你接下來可能想問...' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'C3、C4 和 CAM 植物的光合作用有什麼不同？' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '為什麼葉綠素呈現綠色？' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '影響光合作用速率的因素有哪些？' }] }]
        }
      ]
    }
  ]
};

export const fetchAIImportedContent = (): Promise<any> => {
  return new Promise((resolve) => {
    // 模擬稍微快一點的回應速度，讓 UI 測試更順暢
    setTimeout(() => {
      resolve(MOCK_RAG_RESULT);
    }, 1000); 
  });
};