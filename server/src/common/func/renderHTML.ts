import { marked } from 'marked';
import { parse } from 'node-html-parser';

type AllowedTag =
  | string
  | {
      tagName: string;
      attributes: string[];
    };

const allowedTags: AllowedTag[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'ol',
  'ul',
  'li',
  'blockquote',
  'pre',
  'code',
  'em',
  'strong',
  'table',
  'tr',
  'th',
  'thead',
  'tbody',
  {
    tagName: 'td',
    attributes: ['align'],
  },
  {
    tagName: 'a',
    attributes: ['href'],
  },
];

export async function renderHTML(md: string, url: URL) {
  try {
    if (allowedTags.length !== 0) {
      const html = await marked.parse(md);
      const dom = parse(html);

      const query = `:not(${allowedTags
        .map((e) => {
          if (typeof e === 'string') {
            return e;
          } else {
            return e.tagName;
          }
        })
        .join(', ')})`;

      // erase not allowed tags
      dom.querySelectorAll(query).forEach((e) => e.remove());

      // erase not allowed attributes;
      allowedTags.forEach((e) => {
        if (typeof e === 'string') {
          const elements = dom.querySelectorAll(e);
          elements.forEach((elem) => {
            Object.keys(elem.attributes).forEach((attr) => {
              elem.removeAttribute(attr);
            });
          });
        } else {
          const elements = dom.querySelectorAll(e.tagName);
          elements.forEach((elem) => {
            Object.keys(elem.attributes).forEach((attr) => {
              if (!e.attributes.includes(attr)) {
                elem.removeAttribute(attr);
              }
            });
          });
        }
      });

      // a tag defense `javascript:`
      dom.querySelectorAll('a').forEach((e) => {
        const href = e.getAttribute('href');
        if (!href) return;
        try {
          const url_ = new URL(href);
          if (url_.protocol === 'javascript:') {
            e.removeAttribute('href');
            return;
          }
          e.setAttribute('href', url_.href);
          if (url_.origin !== url.origin) {
            e.setAttribute('target', '_blank');
            e.setAttribute('rel', 'noreferrer');
          }
        } catch {
          const url_ = new URL(url);
          url_.pathname = href;
          e.setAttribute('href', url_.href);
        }
      });

      return dom.innerHTML;
    } else {
      return '';
    }
  } catch {
    return '';
  }
}
