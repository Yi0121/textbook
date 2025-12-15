// utils/epubParser.ts
import ePub from 'epubjs';
import type { Book } from 'epubjs';
import type { TextbookContent } from '../context/ContentContext';

export interface EPUBChapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface EPUBMetadata {
  title: string;
  author: string;
  publisher?: string;
  description?: string;
  cover?: string;
}

/**
 * 解析 EPUB 檔案並提取章節內容
 */
export async function parseEPUB(file: File | string): Promise<{
  metadata: EPUBMetadata;
  chapters: EPUBChapter[];
}> {
  try {
    // 創建 EPUB 實例
    let book: Book;
    if (typeof file === 'string') {
      book = ePub(file);
    } else {
      // 將 File 轉換為 ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      book = ePub(arrayBuffer);
    }

    // 載入 EPUB
    await book.ready;

    // 提取元資料
    const metadata: EPUBMetadata = {
      title: book.packaging.metadata.title || '未命名書籍',
      author: book.packaging.metadata.creator || '未知作者',
      publisher: book.packaging.metadata.publisher,
      description: book.packaging.metadata.description,
    };

    // 嘗試獲取封面
    try {
      const coverUrl = await book.coverUrl();
      if (coverUrl) {
        metadata.cover = coverUrl;
      }
    } catch (e) {
      console.warn('無法載入封面圖片:', e);
    }

    // 提取所有章節
    const chapters: EPUBChapter[] = [];
    const spine = book.spine;

    // 使用 spine.each 來遍歷所有章節
    let chapterIndex = 0;
    await spine.each(async (spineItem: any) => {
      const i = chapterIndex++;
      if (!spineItem) return;

      try {
        // 載入章節內容
        await spineItem.load(book.load.bind(book));
        const doc = spineItem.document;

        if (!doc) return;

        // 提取文字內容
        const body = doc.body || doc.documentElement;
        const textContent = body.textContent || '';

        // 從文檔中提取 HTML 內容（保留基本格式）
        const htmlContent = body.innerHTML || textContent;

        // 嘗試從 TOC 獲取章節標題
        let chapterTitle = `第 ${i + 1} 章`;

        // 嘗試從內容中提取標題
        const h1 = doc.querySelector('h1, h2, h3');
        if (h1) {
          chapterTitle = h1.textContent?.trim() || chapterTitle;
        }

        chapters.push({
          id: spineItem.idref || `chapter-${i}`,
          title: chapterTitle,
          content: htmlContent,
          order: i,
        });

        // 卸載以釋放記憶體
        spineItem.unload();
      } catch (error) {
        console.error(`載入章節 ${i} 時發生錯誤:`, error);
      }
    });

    return { metadata, chapters };
  } catch (error) {
    console.error('EPUB 解析失敗:', error);
    throw new Error('無法解析 EPUB 檔案，請確認檔案格式正確');
  }
}

/**
 * 將 EPUB 章節轉換為 TextbookContent 格式
 */
export function convertEPUBToTextbookContent(
  metadata: EPUBMetadata,
  chapters: EPUBChapter[]
): TextbookContent {
  const pages = chapters.map((chapter, index) => ({
    id: `epub-page-${chapter.id}`,
    x: (index % 3) * 1000, // 每行 3 個頁面
    y: Math.floor(index / 3) * 1400, // 自動換行
    width: 900,
    height: 1200,
    title: chapter.title,
    content: cleanHTML(chapter.content),
    chapter: Math.floor(index / 3) + 1, // 自動分章
    imageUrl: index === 0 ? metadata.cover : undefined,
  }));

  return {
    title: metadata.title,
    author: metadata.author,
    pages,
  };
}

/**
 * 清理 HTML 內容，移除不必要的標籤和樣式
 */
function cleanHTML(html: string): string {
  // 創建臨時 DOM 解析器
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 移除 script 和 style 標籤
  doc.querySelectorAll('script, style').forEach(el => el.remove());

  // 移除內聯樣式（可選）
  doc.querySelectorAll('[style]').forEach(el => {
    el.removeAttribute('style');
  });

  // 取得清理後的 HTML
  let cleaned = doc.body.innerHTML;

  // 移除多餘的空白
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * 從 URL 載入 EPUB（用於後端 API）
 */
export async function loadEPUBFromURL(url: string): Promise<{
  metadata: EPUBMetadata;
  chapters: EPUBChapter[];
}> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const file = new File([blob], 'book.epub', { type: 'application/epub+zip' });

    return await parseEPUB(file);
  } catch (error) {
    console.error('從 URL 載入 EPUB 失敗:', error);
    throw new Error('無法從伺服器載入 EPUB 檔案');
  }
}

/**
 * 模擬從後端 API 獲取 EPUB
 */
export async function fetchEPUBFromAPI(): Promise<TextbookContent> {
  // TODO: 替換為實際的 API 端點
  // 這裡暫時使用模擬數據

  await new Promise(resolve => setTimeout(resolve, 1500)); // 模擬網路延遲

  // 模擬 EPUB 轉換結果
  return {
    title: '生物學教科書 (EPUB)',
    author: '教育出版社',
    pages: [
      {
        id: 'epub-page-1',
        x: 0,
        y: 0,
        width: 900,
        height: 1200,
        title: '第一章：細胞的基本結構',
        content: `
          <h1>細胞的基本結構</h1>
          <h2>1.1 細胞膜</h2>
          <p>細胞膜是由<strong>磷脂雙層</strong>構成，具有選擇性通透的特性。</p>
          <ul>
            <li>調節物質進出細胞</li>
            <li>維持細胞內環境穩定</li>
            <li>進行細胞識別與通訊</li>
          </ul>

          <h2>1.2 細胞核</h2>
          <p>細胞核包含遺傳物質 DNA，是細胞的控制中心。</p>
          <blockquote>
            "細胞核就像細胞的大腦，掌管所有生命活動的指令。"
          </blockquote>
        `,
        chapter: 1,
      },
      {
        id: 'epub-page-2',
        x: 1000,
        y: 0,
        width: 900,
        height: 1200,
        title: '第二章：細胞器的功能',
        content: `
          <h1>細胞器的功能</h1>
          <h2>2.1 粒線體</h2>
          <p>粒線體是細胞的<em>能量工廠</em>，負責產生 ATP。</p>
          <table border="1">
            <tr>
              <th>細胞器</th>
              <th>主要功能</th>
            </tr>
            <tr>
              <td>粒線體</td>
              <td>有氧呼吸，產生 ATP</td>
            </tr>
            <tr>
              <td>葉綠體</td>
              <td>光合作用</td>
            </tr>
            <tr>
              <td>核糖體</td>
              <td>蛋白質合成</td>
            </tr>
          </table>
        `,
        chapter: 2,
      },
      {
        id: 'epub-page-3',
        x: 2000,
        y: 0,
        width: 900,
        height: 1200,
        title: '第三章：細胞分裂',
        content: `
          <h1>細胞分裂</h1>
          <h2>3.1 有絲分裂</h2>
          <p>有絲分裂是體細胞進行分裂的過程，分為以下階段：</p>
          <ol>
            <li><strong>前期</strong>：染色體濃縮</li>
            <li><strong>中期</strong>：染色體排列在赤道板</li>
            <li><strong>後期</strong>：染色體分離</li>
            <li><strong>末期</strong>：細胞質分裂</li>
          </ol>

          <h2>3.2 減數分裂</h2>
          <p>減數分裂產生<code>配子</code>（生殖細胞），染色體數目減半。</p>
        `,
        chapter: 3,
      },
    ],
  };
}
