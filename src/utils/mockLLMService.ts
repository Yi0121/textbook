// utils/mockLLMService.ts

// 模擬：這是 LLM 讀完《高中生物-光合作用.pdf》後產出的結構化資料
export const MOCK_RAG_RESULT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'CH4. 植物的能量轉換：光合作用' }]
    },
    {
      type: 'paragraph',
      attrs: { class: 'lead text-xl text-slate-600 mb-4' },
      content: [{ type: 'text', text: '地球上大多數生命的能量最終來源都是太陽。本章將探討植物如何透過光合作用捕捉光能，並轉化為化學能。' }]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '4.1 光反應與固碳反應' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '光合作用 (Photosynthesis) 可分為兩個主要階段：在類囊體膜上進行的' },
        { type: 'text', marks: [{ type: 'bold' }, { type: 'highlight' }], text: '光反應' },
        { type: 'text', text: '，以及在葉綠體基質中進行的' },
        { type: 'text', marks: [{ type: 'bold' }], text: '固碳反應 (卡爾文循環)' },
        { type: 'text', text: '。' }
      ]
    },
    {
      type: 'blockquote',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: '💡 核心思考：為什麼植物在晚上無法進行光反應，但細胞呼吸作用卻持續進行？這對植物的生長有什麼影響？' }] }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '葉綠體的構造解析' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '類囊體 (Thylakoid)：含有葉綠素，是光能轉換的場所。' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '基質 (Stroma)：含有豐富的酵素，負責將 CO2 固定為醣類。' }] }]
        }
      ]
    },
    {
      type: 'paragraph',
      attrs: { class: 'text-sm text-gray-400 mt-8 italic' },
      content: [{ type: 'text', text: '--- 本教材由 AI 系統自動從《高中生物全集.pdf》擷取並重組 ---' }]
    }
  ]
};

// 模擬 API 呼叫 (假裝跑了 2 秒鐘)
export const fetchAIImportedContent = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RAG_RESULT);
    }, 2000); 
  });
};