// utils/epubParser.ts
import ePub from 'epubjs';
import type { Book } from 'epubjs';
import type { TextbookContent } from '../context/ContentContext';
import type { EPUBMetadata, EPUBChapter, FabricPage, EPUBSource } from '../types';

// 重新匯出類型供外部使用
export type { EPUBMetadata, EPUBChapter };

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

    // 提取所有章節 - 使用正確的非同步方式
    const chapters: EPUBChapter[] = [];
    const spine = book.spine;

    // 取得 spine items 陣列
    const spineItems: any[] = [];
    spine.each((item: any) => {
      spineItems.push(item);
    });

    // 依序處理每個章節（使用 for...of 確保非同步正確執行）
    for (let i = 0; i < spineItems.length; i++) {
      const spineItem = spineItems[i];
      if (!spineItem) continue;

      try {
        // 載入章節內容
        await spineItem.load(book.load.bind(book));
        const doc = spineItem.document;

        if (!doc) {
          console.warn(`章節 ${i} 無法取得 document`);
          continue;
        }

        // 提取文字內容
        const body = doc.body || doc.documentElement;

        // 處理圖片：目前先保留原始路徑
        // TODO: 後續可以改用 book.archive.request 來載入圖片並轉為 Data URI
        const images = body.querySelectorAll('img');
        for (const img of images) {
          try {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:') && !src.startsWith('http')) {
              // 暫時移除無法載入的相對路徑圖片
              console.warn(`圖片路徑尚未處理: ${src}`);
            }
          } catch (imgError) {
            console.warn('處理圖片時發生錯誤:', imgError);
          }
        }

        // 從文檔中提取 HTML 內容（保留基本格式）
        const htmlContent = body.innerHTML || body.textContent || '';

        // 嘗試從 TOC 獲取章節標題，或從內容中提取
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

        console.log(`✓ 成功載入章節 ${i + 1}: ${chapterTitle}`);
      } catch (error) {
        console.error(`載入章節 ${i} 時發生錯誤:`, error);
      }
    }

    console.log(`📚 EPUB 解析完成：${metadata.title}，共 ${chapters.length} 個章節`);
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
    // 處理 content 可能是字串或 TiptapContent 的情況
    content: typeof chapter.content === 'string'
      ? cleanHTML(chapter.content)
      : JSON.stringify(chapter.content),
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
    title: '數學教科書 (EPUB)',
    author: '教育出版社',
    pages: [
      {
        id: 'epub-page-1',
        x: 0,
        y: 0,
        width: 900,
        height: 1200,
        title: '第一章：一元二次方程式',
        content: `
          <h1>一元二次方程式</h1>
          <h2>1.1 方程式的定義</h2>
          <p>一元二次方程式的<strong>標準式</strong>為 ax² + bx + c = 0，其中 a ≠ 0。</p>
          <ul>
            <li>a 稱為二次項係數</li>
            <li>b 稱為一次項係數</li>
            <li>c 稱為常數項</li>
          </ul>

          <h2>1.2 公式解</h2>
          <p>利用公式 x = (-b ± √(b²-4ac)) / 2a 可求得方程式的解。</p>
          <blockquote>
            "判別式 D = b² - 4ac 決定解的性質：D > 0 有兩相異實根，D = 0 有重根，D < 0 無實根。"
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
        title: '第二章：二次函數',
        content: `
          <h1>二次函數</h1>
          <h2>2.1 函數圖形</h2>
          <p>二次函數 y = ax² + bx + c 的圖形為<em>拋物線</em>。</p>
          <table border="1">
            <tr>
              <th>係數 a</th>
              <th>圖形開口方向</th>
            </tr>
            <tr>
              <td>a > 0</td>
              <td>開口向上，有最小值</td>
            </tr>
            <tr>
              <td>a < 0</td>
              <td>開口向下，有最大值</td>
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
        title: '第三章：圓的方程式',
        content: `
          <h1>圓的方程式</h1>
          <h2>3.1 圓的標準式</h2>
          <p>圓心在 (h, k)、半徑為 r 的圓方程式為：</p>
          <ol>
            <li><strong>標準式</strong>：(x-h)² + (y-k)² = r²</li>
            <li><strong>一般式</strong>：x² + y² + Dx + Ey + F = 0</li>
          </ol>

          <h2>3.2 圓與直線的關係</h2>
          <p>利用<code>圓心到直線的距離</code>與半徑的比較，可判斷圓與直線的位置關係。</p>
        `,
        chapter: 3,
      },
    ],
  };
}

// ==================== Fabric.js 頁面轉換工具 ====================

/**
 * 頁面尺寸常數
 */
const PAGE_WIDTH = 900;
const PAGE_HEIGHT = 1200;
const PAGE_GAP_X = 100;  // 頁面水平間距
const PAGE_GAP_Y = 100;  // 頁面垂直間距
const PAGES_PER_ROW = 3; // 每行頁面數

/**
 * 計算新 EPUB 的放置位置 (放在現有內容的右側)
 */
export function calculateNextEPUBPosition(existingPages: FabricPage[]): { x: number; y: number } {
  if (existingPages.length === 0) {
    return { x: 100, y: 100 };
  }

  // 找到最右側的頁面
  const maxX = Math.max(...existingPages.map(p => p.x + p.width));

  // 新 EPUB 放在右側，留出間距
  return {
    x: maxX + PAGE_GAP_X * 3,
    y: 100,
  };
}

/**
 * 將 HTML 內容轉換為 Fabric.js JSON 格式
 * 這個函式會解析 HTML 並生成 Fabric.js 物件 (IText, Image 等)
 */
export function convertHTMLToFabricJSON(html: string, pageWidth: number = PAGE_WIDTH): string {
  // 建立基本的 Fabric.js canvas JSON 結構
  const fabricObjects: any[] = [];
  let currentY = 40; // 從頂部開始，留出邊距
  const leftMargin = 40;
  const contentWidth = pageWidth - leftMargin * 2;

  // 解析 HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  // 遍歷所有子節點
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        fabricObjects.push(createTextObject(text, leftMargin, currentY, contentWidth, 18, '#1e293b'));
        currentY += 30;
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    const textContent = element.textContent?.trim() || '';

    switch (tagName) {
      case 'h1':
        fabricObjects.push(createTextObject(textContent, leftMargin, currentY, contentWidth, 32, '#0f172a', true));
        currentY += 50;
        break;

      case 'h2':
        fabricObjects.push(createTextObject(textContent, leftMargin, currentY, contentWidth, 24, '#1e293b', true));
        currentY += 40;
        break;

      case 'h3':
        fabricObjects.push(createTextObject(textContent, leftMargin, currentY, contentWidth, 20, '#334155', true));
        currentY += 35;
        break;

      case 'p':
        fabricObjects.push(createTextObject(textContent, leftMargin, currentY, contentWidth, 16, '#475569'));
        currentY += Math.max(30, Math.ceil(textContent.length / 50) * 22);
        break;

      case 'ul':
      case 'ol':
        Array.from(element.children).forEach((li, index) => {
          const bullet = tagName === 'ul' ? '•' : `${index + 1}.`;
          const liText = `${bullet} ${li.textContent?.trim() || ''}`;
          fabricObjects.push(createTextObject(liText, leftMargin + 20, currentY, contentWidth - 20, 16, '#475569'));
          currentY += 28;
        });
        currentY += 10;
        break;

      case 'blockquote':
        fabricObjects.push(createTextObject(`"${textContent}"`, leftMargin + 30, currentY, contentWidth - 60, 16, '#64748b', false, true));
        currentY += Math.max(40, Math.ceil(textContent.length / 40) * 22);
        break;

      case 'img':
        const src = element.getAttribute('src');
        if (src) {
          // 圖片物件 (暫時用佔位符表示)
          fabricObjects.push({
            type: 'rect',
            left: leftMargin,
            top: currentY,
            width: contentWidth,
            height: 200,
            fill: '#f1f5f9',
            stroke: '#cbd5e1',
            strokeWidth: 1,
            rx: 8,
            ry: 8,
          });
          fabricObjects.push(createTextObject(`[圖片: ${src}]`, leftMargin + 10, currentY + 90, contentWidth - 20, 14, '#94a3b8'));
          currentY += 220;
        }
        break;

      case 'table':
        // 簡化處理：將表格轉為文字
        const rows = Array.from(element.querySelectorAll('tr'));
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          const rowText = cells.map(cell => cell.textContent?.trim()).join(' | ');
          fabricObjects.push(createTextObject(rowText, leftMargin, currentY, contentWidth, 14, '#475569'));
          currentY += 24;
        });
        currentY += 15;
        break;

      case 'code':
        fabricObjects.push({
          type: 'rect',
          left: leftMargin,
          top: currentY,
          width: contentWidth,
          height: 30,
          fill: '#f8fafc',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          rx: 4,
          ry: 4,
        });
        fabricObjects.push(createTextObject(textContent, leftMargin + 10, currentY + 8, contentWidth - 20, 14, '#334155'));
        currentY += 45;
        break;

      case 'div':
      case 'section':
      case 'article':
        // 遞迴處理容器元素
        Array.from(element.childNodes).forEach(processNode);
        break;

      default:
        // 其他元素當作普通文字處理
        if (textContent) {
          fabricObjects.push(createTextObject(textContent, leftMargin, currentY, contentWidth, 16, '#475569'));
          currentY += Math.max(25, Math.ceil(textContent.length / 50) * 22);
        }
    }
  };

  Array.from(body.childNodes).forEach(processNode);

  // 返回 Fabric.js JSON 格式
  return JSON.stringify({
    version: '6.0.0',
    objects: fabricObjects,
    background: '#ffffff',
  });
}

/**
 * 建立 Fabric.js IText 物件
 */
function createTextObject(
  text: string,
  left: number,
  top: number,
  maxWidth: number,
  fontSize: number,
  fill: string,
  fontWeight: boolean = false,
  italic: boolean = false
): any {
  return {
    type: 'i-text',
    left,
    top,
    text,
    fontSize,
    fontFamily: 'Noto Sans TC, system-ui, sans-serif',
    fill,
    fontWeight: fontWeight ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textAlign: 'left',
    width: maxWidth,
  };
}

/**
 * 將 TextbookContent 轉換為 Fabric.js 頁面和 EPUB 來源記錄
 */
export function convertToFabricPages(
  content: TextbookContent,
  existingPages: FabricPage[]
): { source: EPUBSource; pages: FabricPage[] } {
  const epubId = `epub-${Date.now()}`;
  const basePosition = calculateNextEPUBPosition(existingPages);

  // 將每個章節轉換為 FabricPage
  const pages: FabricPage[] = content.pages.map((page, index) => {
    const col = index % PAGES_PER_ROW;
    const row = Math.floor(index / PAGES_PER_ROW);

    return {
      id: `page-${epubId}-${index}`,
      x: basePosition.x + col * (PAGE_WIDTH + PAGE_GAP_X),
      y: basePosition.y + row * (PAGE_HEIGHT + PAGE_GAP_Y),
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      sourceId: epubId,
      title: page.title,
      canvasJSON: convertHTMLToFabricJSON(page.content),
      order: index,
    };
  });

  // 建立 EPUB 來源記錄
  const source: EPUBSource = {
    id: epubId,
    metadata: {
      title: content.title,
      author: content.author,
    },
    importedAt: Date.now(),
    pageIds: pages.map(p => p.id),
    basePosition,
  };

  return { source, pages };
}
