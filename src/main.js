import './style.css';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import Checklist from '@editorjs/checklist';
import InlineCode from '@editorjs/inline-code';
// 不再需要 TextColorPlugin
// import DragDrop from 'editorjs-drag-drop';
import ToggleBlock from 'editorjs-toggle-block';
import { marked } from 'marked';

// 定义内联工具
const Bold = {
  class: class {
    static get isInline() {
      return true;
    }

    get state() {
      return this._state;
    }

    set state(state) {
      this._state = state;
    }

    constructor({api}) {
      this.api = api;
      this._state = false;
      this.button = null;
      this.tag = 'B';
    }

    render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = '<b>B</b>';
      this.button.classList.add('ce-inline-tool');

      return this.button;
    }

    surround(range) {
      if (this.state) {
        // 如果已经是粗体，则移除粗体标签
        this.unwrap(range);
        return;
      }

      // 添加粗体标签
      const selectedText = range.extractContents();
      const mark = document.createElement(this.tag);

      mark.appendChild(selectedText);
      range.insertNode(mark);

      // 恢复选区
      this.api.selection.expandToTag(mark);
    }

    unwrap(range) {
      // 获取最近的粗体标签
      const mark = this.api.selection.findParentTag(this.tag);
      const text = mark.textContent;

      // 创建文本节点
      const textNode = document.createTextNode(text);

      // 替换粗体标签为文本
      mark.parentNode.replaceChild(textNode, mark);

      // 恢复选区
      const newRange = document.createRange();
      newRange.setStart(textNode, 0);
      newRange.setEnd(textNode, text.length);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    checkState() {
      const mark = this.api.selection.findParentTag(this.tag);
      this._state = !!mark;

      if (this._state) {
        this.button.classList.add('ce-inline-tool--active');
      } else {
        this.button.classList.remove('ce-inline-tool--active');
      }
    }
  },
  shortcut: 'CMD+B'
};

const Italic = {
  class: class {
    static get isInline() {
      return true;
    }

    get state() {
      return this._state;
    }

    set state(state) {
      this._state = state;
    }

    constructor({api}) {
      this.api = api;
      this._state = false;
      this.button = null;
      this.tag = 'I';
    }

    render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = '<i>I</i>';
      this.button.classList.add('ce-inline-tool');

      return this.button;
    }

    surround(range) {
      if (this.state) {
        // 如果已经是斜体，则移除斜体标签
        this.unwrap(range);
        return;
      }

      // 添加斜体标签
      const selectedText = range.extractContents();
      const mark = document.createElement(this.tag);

      mark.appendChild(selectedText);
      range.insertNode(mark);

      // 恢复选区
      this.api.selection.expandToTag(mark);
    }

    unwrap(range) {
      // 获取最近的斜体标签
      const mark = this.api.selection.findParentTag(this.tag);
      const text = mark.textContent;

      // 创建文本节点
      const textNode = document.createTextNode(text);

      // 替换斜体标签为文本
      mark.parentNode.replaceChild(textNode, mark);

      // 恢复选区
      const newRange = document.createRange();
      newRange.setStart(textNode, 0);
      newRange.setEnd(textNode, text.length);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    checkState() {
      const mark = this.api.selection.findParentTag(this.tag);
      this._state = !!mark;

      if (this._state) {
        this.button.classList.add('ce-inline-tool--active');
      } else {
        this.button.classList.remove('ce-inline-tool--active');
      }
    }
  },
  shortcut: 'CMD+I'
};

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 用于存储当前文件名
  let currentFileName = 'document.md';
  // 初始化 Editor.js
  const editor = new EditorJS({
    holder: 'editorjs',
    autofocus: true,
    placeholder: '开始写作...',
    // 配置内联工具 - 使用默认配置
    inlineToolbar: true,
    // 注册所有工具
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
        config: {
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 2
        }
      },
      list: {
        class: List,
        inlineToolbar: true
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true
      },
      quote: {
        class: Quote,
        inlineToolbar: true
      },
      code: {
        class: CodeTool,
        inlineToolbar: false // 代码块通常不需要内联格式
      },
      bold: Bold,
      italic: Italic,
      // 添加表格工具
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 2
        }
      },
      // 添加分隔符工具
      delimiter: Delimiter,
      // 添加可勾选列表
      checklist: {
        class: Checklist,
        inlineToolbar: true
      },
      // 添加行内代码
      inlineCode: InlineCode,
      // 添加可折叠块
      toggle: {
        class: ToggleBlock,
        inlineToolbar: true
      }
    },
    // 添加onChange回调，用于调试
    onChange: () => {
      console.log('Content changed');
    }
  });

  // 使用编辑器的原生功能，不进行DOM操作

  // 导出按钮事件处理
  const exportButton = document.getElementById('export-md');
  exportButton.addEventListener('click', async () => {
    try {
      // 获取编辑器数据
      const outputData = await editor.save();

      // 转换为 Markdown
      let markdown = '';

      // 处理HTML标签转换为Markdown
      function htmlToMarkdown(html) {
        // 创建临时元素解析HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // 递归处理节点
        function processNode(node) {
          // 处理文本节点
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
          }

          // 处理元素节点
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            let content = '';

            // 处理子节点
            for (const child of node.childNodes) {
              content += processNode(child);
            }

            // 根据标签类型添加Markdown语法
            switch (tagName) {
              case 'b':
              case 'strong':
                return `**${content}**`;
              case 'i':
              case 'em':
                return `*${content}*`;
              case 'mark':
                return `==${content}==`;
              case 'a':
                return `[${content}](${node.getAttribute('href') || ''})`;
              case 'code':
                return `\`${content}\``;
              case 'span':
                // 处理带有样式的span元素
                if (node.style.color) {
                  return `<span style="color: ${node.style.color}">${content}</span>`;
                }
                if (node.style.backgroundColor) {
                  return `<span style="background-color: ${node.style.backgroundColor}">${content}</span>`;
                }
                return content;
              default:
                return content;
            }
          }

          return '';
        }

        return processNode(temp);
      }

      // 处理每个块
      outputData.blocks.forEach(block => {
        switch (block.type) {
          case 'header':
            const headerLevel = block.data.level;
            const headerMarker = '#'.repeat(headerLevel);
            // 处理标题中可能的HTML标签
            const headerText = htmlToMarkdown(block.data.text);
            markdown += `${headerMarker} ${headerText}\n\n`;
            break;

          case 'paragraph':
            // 处理段落中的HTML标签
            const paragraphText = htmlToMarkdown(block.data.text);
            markdown += `${paragraphText}\n\n`;
            break;

          case 'list':
            const listItems = block.data.items;
            listItems.forEach(item => {
              const marker = block.data.style === 'ordered' ? '1. ' : '- ';
              // 处理列表项中的HTML标签
              const itemText = htmlToMarkdown(item);
              markdown += `${marker}${itemText}\n`;
            });
            markdown += '\n';
            break;

          case 'quote':
            // 处理引用中的HTML标签
            const quoteContent = htmlToMarkdown(block.data.text);
            // 分行并添加引用标记
            const quoteText = quoteContent.split('\n')
              .map(line => `> ${line}`)
              .join('\n');
            markdown += `${quoteText}\n\n`;
            break;

          case 'code':
            markdown += '```\n' + block.data.code + '\n```\n\n';
            break;

          case 'table':
            // 处理表格
            const tableData = block.data.content;
            // 添加表头
            if (tableData && tableData.length > 0) {
              // 第一行作为表头
              const headerRow = tableData[0];
              markdown += '| ' + headerRow.join(' | ') + ' |\n';
              // 添加分隔行
              markdown += '| ' + headerRow.map(() => '---').join(' | ') + ' |\n';
              // 添加数据行
              for (let i = 1; i < tableData.length; i++) {
                markdown += '| ' + tableData[i].join(' | ') + ' |\n';
              }
              markdown += '\n';
            }
            break;

          case 'delimiter':
            // 添加分隔符
            markdown += '---\n\n';
            break;

          case 'checklist':
            // 处理可勾选列表
            const items = block.data.items;
            items.forEach(item => {
              const checkbox = item.checked ? '[x]' : '[ ]';
              markdown += `${checkbox} ${htmlToMarkdown(item.text)}\n`;
            });
            markdown += '\n';
            break;

          case 'toggle':
            // 处理可折叠块
            const summary = htmlToMarkdown(block.data.title);
            const details = htmlToMarkdown(block.data.content);
            markdown += `<details>\n<summary>${summary}</summary>\n\n${details}\n</details>\n\n`;
            break;

          default:
            // 对于不支持的块，尝试提取文本
            if (block.data && block.data.text) {
              const text = htmlToMarkdown(block.data.text);
              markdown += `${text}\n\n`;
            }
        }
      });

      // 创建下载链接
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      // 使用保存的文件名，如果没有导入过文件，则使用默认名称
      link.download = currentFileName || 'document.md';
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Markdown:', error);
      alert('导出 Markdown 失败，请重试。');
    }
  });

  // 导入按钮事件处理
  const importButton = document.getElementById('import-md');
  const fileInput = document.getElementById('file-input');

  importButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 保存文件名，用于导出时使用
    // 确保文件扩展名为.md
    currentFileName = file.name.endsWith('.md')
      ? file.name
      : file.name.replace(/\.[^/.]+$/, '') + '.md';

    const reader = new FileReader();
    reader.onload = async (e) => {
      const markdownContent = e.target.result;

      try {
        // 解析 markdown 为 HTML
        const html = marked.parse(markdownContent);

        // 转换 HTML 为 Editor.js 块
        const blocks = [];

        // 创建临时 DOM 元素解析 HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 处理每个子节点
        Array.from(tempDiv.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // 纯文本变为段落
            blocks.push({
              type: 'paragraph',
              data: {
                text: node.textContent.trim()
              }
            });
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 根据标签名处理
            switch (node.tagName.toLowerCase()) {
              case 'h1':
              case 'h2':
              case 'h3':
              case 'h4':
              case 'h5':
              case 'h6':
                blocks.push({
                  type: 'header',
                  data: {
                    text: node.textContent.trim(),
                    level: parseInt(node.tagName.charAt(1))
                  }
                });
                break;

              case 'p':
                blocks.push({
                  type: 'paragraph',
                  data: {
                    text: node.innerHTML
                  }
                });
                break;

              case 'blockquote':
                blocks.push({
                  type: 'quote',
                  data: {
                    text: node.innerHTML,
                    caption: ''
                  }
                });
                break;

              case 'pre':
                const code = node.querySelector('code');
                if (code) {
                  blocks.push({
                    type: 'code',
                    data: {
                      code: code.textContent
                    }
                  });
                }
                break;

              case 'ul':
              case 'ol':
                const items = Array.from(node.querySelectorAll('li')).map(li => li.innerHTML);
                blocks.push({
                  type: 'list',
                  data: {
                    style: node.tagName.toLowerCase() === 'ul' ? 'unordered' : 'ordered',
                    items: items
                  }
                });
                break;

              case 'table':
                // 处理表格
                const rows = Array.from(node.querySelectorAll('tr'));
                const tableContent = rows.map(row =>
                  Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim())
                );

                if (tableContent.length > 0) {
                  blocks.push({
                    type: 'table',
                    data: {
                      content: tableContent
                    }
                  });
                }
                break;

              case 'hr':
                // 处理分隔符
                blocks.push({
                  type: 'delimiter',
                  data: {}
                });
                break;

              case 'details':
                // 处理可折叠块
                const summary = node.querySelector('summary');
                const title = summary ? summary.innerHTML : '';
                // 移除summary元素后的内容作为详情内容
                let content = node.innerHTML;
                if (summary) {
                  content = content.replace(summary.outerHTML, '').trim();
                }

                blocks.push({
                  type: 'toggle',
                  data: {
                    title: title,
                    content: content
                  }
                });
                break;

              default:
                // 检查是否为任务列表
                if (node.tagName.toLowerCase() === 'ul' && node.querySelector('input[type="checkbox"]')) {
                  const checklistItems = Array.from(node.querySelectorAll('li')).map(li => {
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    const checked = checkbox && checkbox.checked;
                    // 移除checkbox后的文本作为项目内容
                    let text = li.innerHTML;
                    if (checkbox) {
                      text = text.replace(checkbox.outerHTML, '').trim();
                    }
                    return {
                      text: text,
                      checked: !!checked
                    };
                  });

                  blocks.push({
                    type: 'checklist',
                    data: {
                      items: checklistItems
                    }
                  });
                }
                // 对于其他元素，转换为段落
                else if (node.textContent.trim()) {
                  blocks.push({
                    type: 'paragraph',
                    data: {
                      text: node.innerHTML
                    }
                  });
                }
            }
          }
        });

        // 清除编辑器并渲染块
        editor.render({
          blocks: blocks
        });

      } catch (error) {
        console.error('Error importing Markdown:', error);
        alert('导入 Markdown 文件失败，请检查文件格式。');
      }
    };

    reader.readAsText(file);
    fileInput.value = ''; // 重置文件输入
  });
});
