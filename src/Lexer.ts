import {
  rtrim,
  splitCells,
  findClosingBracket,
} from './helpers';
import { type Rules, block, inline, other } from './rules';
import type { Links, Tokens, Token, TokensList } from './Tokens';



type ExtensionIndexer = (this: { lexer: Lexer }, src: string) => number
type ExtensionTokenizer = (this: { lexer: Lexer }, src: string, tokens: Token[]) => Token


interface LexerOptions {
  extensions?: {
    startBlock?: ExtensionIndexer[]

    inline?: ExtensionTokenizer[]
    startInline?: ExtensionIndexer[]
  };
  gfm?: boolean
  gfmLineBreaks?: boolean
}

/** 
 * Fully compatible `Lexer` forked from [Marked](https://github.com/markedjs/marked).
 * 
 * The only change made is removing code that is not a part of `Lexer` to reduce the size.
 */
export class Lexer {
  private _rules: Rules;
  private tokens: TokensList;
  private _state = {
    inLink: false,
    inRawBlock: false,
    top: true,
  }


  constructor(private _options: LexerOptions = {}) {
    // TokenList cannot be created in one go
    this.tokens = [] as never;
    this.tokens.links = {}

    this._rules = {
      other: other,
      block: block.normal,
      inline: inline.normal,
    }

    if (this._options.gfm) {
      this._rules.block = block.gfm;
      this._rules.inline = inline.gfm;

      if (this._options.gfmLineBreaks) {
        this._rules.inline = inline.breaks;
      }
    }
  }


  private _inlineQueue: { src: string, tokens: Token[] }[] = []

  lex(src: string) {
    src = src.replace(other.carriageReturn, '\n');

    this._blockTokens(src, this.tokens);

    for (let i = 0; i < this._inlineQueue.length; i++) {
      const next = this._inlineQueue[i];
      this.inlineTokens(next.src, next.tokens);
    }
    this._inlineQueue = [];

    return this.tokens;
  }


  /**
   * Lexing
   */
  private _blockTokens(src: string, tokens?: Token[], lastParagraphClipped?: boolean): Token[];
  private _blockTokens(src: string, tokens?: TokensList, lastParagraphClipped?: boolean): TokensList;
  private _blockTokens(src: string, tokens: Token[] = [], lastParagraphClipped = false) {
    while (src) {
      let token: Tokens.Generic | undefined;

      // newline
      if (token = this._space(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.raw.length === 1 && lastToken !== undefined) {
          // if there's a single \n as a spacer, it's terminating the last line,
          // so move it there so that we don't get unnecessary paragraph tags
          lastToken.raw += '\n';
        } else {
          tokens.push(token);
        }
        continue;
      }

      // code
      if (token = this._code(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        // An indented code block cannot interrupt a paragraph.
        if (lastToken?.type === 'paragraph' || lastToken?.type === 'text') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this._inlineQueue.at(-1)!.src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // fences
      if (token = this._fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // heading
      if (token = this._heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // hr
      if (token = this._hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // blockquote
      if (token = this._blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // list
      if (token = this._list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // html
      if (token = this._html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // def
      if (token = this._def(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === 'paragraph' || lastToken?.type === 'text') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.raw;
          this._inlineQueue.at(-1)!.src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title,
          };
        }
        continue;
      }

      // table (gfm)
      if (token = this._table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // lheading
      if (token = this._lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // top-level paragraph
      // prevent paragraph consuming extensions by clipping 'src' to extension start
      let cutSrc = src;
      if (this._options.extensions?.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this._options.extensions.startBlock.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this._state.top && (token = this._paragraph(cutSrc))) {
        const lastToken = tokens.at(-1);
        if (lastParagraphClipped && lastToken?.type === 'paragraph') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this._inlineQueue.pop();
          this._inlineQueue.at(-1)!.src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }

      // text
      if (token = this._text(src)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (lastToken?.type === 'text') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this._inlineQueue.pop();
          this._inlineQueue.at(-1)!.src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    this._state.top = true;
    return tokens;
  }

  private _inline(src: string, tokens: Token[] = []) {
    this._inlineQueue.push({ src, tokens });
    return tokens;
  }

  /**
   * Lexing/Compiling
   */
  private inlineTokens(src: string, tokens: Token[] = []): Token[] {
    // String with links masked to avoid interference with em and strong
    let maskedSrc = src;
    let match: RegExpExecArray | null = null;

    // Mask out reflinks
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this._rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index)
              + '[' + 'a'.repeat(match[0].length - 2) + ']'
              + maskedSrc.slice(this._rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    // Mask out other blocks
    while ((match = this._rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + '[' + 'a'.repeat(match[0].length - 2) + ']' + maskedSrc.slice(this._rules.inline.blockSkip.lastIndex);
    }

    // Mask out escaped characters
    while ((match = this._rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this._rules.inline.anyPunctuation.lastIndex);
    }

    let keepPrevChar = false;
    let prevChar = '';
    while (src) {
      if (!keepPrevChar) {
        prevChar = '';
      }
      keepPrevChar = false;

      let token: Tokens.Generic | undefined;

      // extensions
      if (this._options.extensions?.inline?.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }

      // escape
      if (token = this._escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // tag
      if (token = this._tag(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // link
      if (token = this._link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // reflink, nolink
      if (token = this._reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        const lastToken = tokens.at(-1);
        if (token.type === 'text' && lastToken?.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // em & strong
      if (token = this._emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // code
      if (token = this._codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // br
      if (token = this._br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // del (gfm)
      if (token = this._del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // autolink
      if (token = this._autolink(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // url (gfm)
      if (!this._state.inLink && (token = this._url(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // text
      // prevent inlineText consuming extensions by clipping 'src' to extension start
      let cutSrc = src;
      if (this._options.extensions?.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this._options.extensions.startInline.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this._inlineText(cutSrc)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        const lastToken = tokens.at(-1);
        if (lastToken?.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return tokens;
  }



  // ----

  private _outputLink(cap: string[], link: Pick<Tokens.Link, 'href' | 'title'>, raw: string): Tokens.Link | Tokens.Image {
    const href = link.href;
    const title = link.title || null;
    const text = cap[1].replace(this._rules.other.outputLinkReplace, '$1');

    if (cap[0].charAt(0) !== '!') {
      this._state.inLink = true;
      const token: Tokens.Link = {
        type: 'link',
        raw,
        href,
        title,
        text,
        tokens: this.inlineTokens(text),
      };
      this._state.inLink = false;
      return token;
    }
    return {
      type: 'image',
      raw,
      href,
      title,
      text,
    };
  }

  private _indentCodeCompensation(raw: string, text: string) {
    const matchIndentToCode = raw.match(other.indentCodeCompensation);
    if (matchIndentToCode == null) return text;

    const indentToCode = matchIndentToCode[1];

    return text
      .split('\n')
      .map(node => {
        const matchIndentInNode = node.match(other.beginningSpace);
        if (matchIndentInNode === null) {
          return node;
        }

        const [indentInNode] = matchIndentInNode;

        if (indentInNode.length >= indentToCode.length) {
          return node.slice(indentToCode.length);
        }

        return node;
      })
      .join('\n');
  }

  // --- Lexicon --- //

  private _space(src: string): Tokens.Space | undefined {
    const cap = this._rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: 'space',
        raw: cap[0],
      };
    }
  }

  private _code(src: string): Tokens.Code | undefined {
    const cap = this._rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(this._rules.other.codeRemoveIndent, '');
      return {
        type: 'code',
        raw: cap[0],
        codeBlockStyle: 'indented',
        text: rtrim(text, '\n')
      };
    }
  }

  private _fences(src: string): Tokens.Code | undefined {
    const cap = this._rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = this._indentCodeCompensation(raw, cap[3] || '');

      return {
        type: 'code',
        raw,
        lang: cap[2] ? cap[2].trim().replace(this._rules.inline.anyPunctuation, '$1') : cap[2],
        text,
      };
    }
  }

  private _heading(src: string): Tokens.Heading | undefined {
    const cap = this._rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();

      // remove trailing #s
      if (this._rules.other.endingHash.test(text)) {
        const trimmed = rtrim(text, '#');
        if (!trimmed || this._rules.other.endingSpaceChar.test(trimmed)) {
          // CommonMark requires space before trailing #s
          text = trimmed.trim();
        }
      }

      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this._inline(text),
      };
    }
  }

  private _hr(src: string): Tokens.Hr | undefined {
    const cap = this._rules.block.hr.exec(src);
    if (cap) {
      return {
        type: 'hr',
        raw: rtrim(cap[0], '\n'),
      };
    }
  }

  private _blockquote(src: string): Tokens.Blockquote | undefined {
    const cap = this._rules.block.blockquote.exec(src);
    if (cap) {
      let lines = rtrim(cap[0], '\n').split('\n');
      let raw = '';
      let text = '';
      const tokens: Token[] = [];

      while (lines.length > 0) {
        let inBlockquote = false;
        const currentLines = [];

        let i;
        for (i = 0; i < lines.length; i++) {
          // get lines up to a continuation
          if (this._rules.other.blockquoteStart.test(lines[i])) {
            currentLines.push(lines[i]);
            inBlockquote = true;
          } else if (!inBlockquote) {
            currentLines.push(lines[i]);
          } else {
            break;
          }
        }
        lines = lines.slice(i);

        const currentRaw = currentLines.join('\n');
        const currentText = currentRaw
          // precede setext continuation with 4 spaces so it isn't a setext
          .replace(this._rules.other.blockquoteSetextReplace, '\n    $1')
          .replace(this._rules.other.blockquoteSetextReplace2, '');
        raw = raw ? `${raw}\n${currentRaw}` : currentRaw;
        text = text ? `${text}\n${currentText}` : currentText;

        // parse blockquote lines as top level tokens
        // merge paragraphs if this is a continuation
        const top = this._state.top;
        this._state.top = true;
        this._blockTokens(currentText, tokens, true);
        this._state.top = top;

        // if there is no continuation then we are done
        if (lines.length === 0) {
          break;
        }

        const lastToken = tokens.at(-1);

        if (lastToken?.type === 'code') {
          // blockquote continuation cannot be preceded by a code block
          break;
        } else if (lastToken?.type === 'blockquote') {
          // include continuation in nested blockquote
          const oldToken = lastToken as Tokens.Blockquote;
          const newText = oldToken.raw + '\n' + lines.join('\n');
          const newToken = this._blockquote(newText)!;
          tokens[tokens.length - 1] = newToken;

          raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
          text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
          break;
        } else if (lastToken?.type === 'list') {
          // include continuation in nested list
          const oldToken = lastToken as Tokens.List;
          const newText = oldToken.raw + '\n' + lines.join('\n');
          const newToken = this._list(newText)!;
          tokens[tokens.length - 1] = newToken;

          raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
          text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
          lines = newText.substring(tokens.at(-1)!.raw.length).split('\n');
          continue;
        }
      }

      return {
        type: 'blockquote',
        raw,
        tokens,
        text,
      };
    }
  }

  private _list(src: string): Tokens.List | undefined {
    let cap = this._rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim();
      const isordered = bull.length > 1;

      const list: Tokens.List = {
        type: 'list',
        raw: '',
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : '',
        loose: false,
        items: [],
      };

      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

      // Get next list item
      const itemRegex = this._rules.other.listItemRegex(bull);
      let endsWithBlankLine = false;
      // Check if current bullet point can start a new List Item
      while (src) {
        let endEarly = false;
        let raw = '';
        let itemContents = '';
        if (!(cap = itemRegex.exec(src))) {
          break;
        }

        if (this._rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
          break;
        }

        raw = cap[0];
        src = src.substring(raw.length);

        let line = cap[2].split('\n', 1)[0].replace(this._rules.other.listReplaceTabs, (t: string) => ' '.repeat(3 * t.length));
        let nextLine = src.split('\n', 1)[0];
        let blankLine = !line.trim();

        let indent = 0;
        if (blankLine) {
          indent = cap[1].length + 1;
        } else {
          indent = cap[2].search(this._rules.other.nonSpaceChar); // Find first non-space char
          indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }

        if (blankLine && this._rules.other.blankLine.test(nextLine)) { // Items begin with at most one blank line
          raw += nextLine + '\n';
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }

        if (!endEarly) {
          const nextBulletRegex = this._rules.other.nextBulletRegex(indent);
          const hrRegex = this._rules.other.hrRegex(indent);
          const fencesBeginRegex = this._rules.other.fencesBeginRegex(indent);
          const headingBeginRegex = this._rules.other.headingBeginRegex(indent);
          const htmlBeginRegex = this._rules.other.htmlBeginRegex(indent);

          // Check if following lines should be included in List Item
          while (src) {
            const rawLine = src.split('\n', 1)[0];
            let nextLineWithoutTabs;
            nextLine = rawLine;

            // Re-align to follow commonmark nesting rules
            nextLineWithoutTabs = nextLine.replace(this._rules.other.tabCharGlobal, '    ');

            // End list item if found code fences
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new heading
            if (headingBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of html block
            if (htmlBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new bullet
            if (nextBulletRegex.test(nextLine)) {
              break;
            }

            // Horizontal rule found
            if (hrRegex.test(nextLine)) {
              break;
            }

            if (nextLineWithoutTabs.search(this._rules.other.nonSpaceChar) >= indent || !nextLine.trim()) { // Dedent if possible
              itemContents += '\n' + nextLineWithoutTabs.slice(indent);
            } else {
              // not enough indentation
              if (blankLine) {
                break;
              }

              // paragraph continuation unless last line was a different block level element
              if (line.replace(this._rules.other.tabCharGlobal, '    ').search(this._rules.other.nonSpaceChar) >= 4) { // indented code block
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }

              itemContents += '\n' + nextLine;
            }

            if (!blankLine && !nextLine.trim()) { // Check if current line is blank
              blankLine = true;
            }

            raw += rawLine + '\n';
            src = src.substring(rawLine.length + 1);
            line = nextLineWithoutTabs.slice(indent);
          }
        }

        if (!list.loose) {
          // If the previous item ended with a blank line, the list is loose
          if (endsWithBlankLine) {
            list.loose = true;
          } else if (this._rules.other.doubleBlankLine.test(raw)) {
            endsWithBlankLine = true;
          }
        }

        let istask: RegExpExecArray | null = null;
        let ischecked: boolean | undefined;
        // Check for task list items
        if (this._options.gfm) {
          istask = this._rules.other.listIsTask.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== '[ ] ';
            itemContents = itemContents.replace(this._rules.other.listReplaceTask, '');
          }
        }

        list.items.push({
          type: 'list_item',
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents,
          tokens: [],
        });

        list.raw += raw;
      }

      // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
      const lastItem = list.items.at(-1);
      if (lastItem) {
        lastItem.raw = lastItem.raw.trimEnd();
        lastItem.text = lastItem.text.trimEnd();
      } else {
        // not a list since there were no items
        return;
      }
      list.raw = list.raw.trimEnd();

      // Item child tokens handled here at end because we needed to have the final item to trim it first
      for (let i = 0; i < list.items.length; i++) {
        this._state.top = false;
        list.items[i].tokens = this._blockTokens(list.items[i].text, []);

        if (!list.loose) {
          // Check if list should be loose
          const spacers = list.items[i].tokens.filter(t => t.type === 'space');
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some(t => this._rules.other.anyLine.test(t.raw));

          list.loose = hasMultipleLineBreaks;
        }
      }

      // Set all items to loose if list is loose
      if (list.loose) {
        for (let i = 0; i < list.items.length; i++) {
          list.items[i].loose = true;
        }
      }

      return list;
    }
  }

  private _html(src: string): Tokens.HTML | undefined {
    const cap = this._rules.block.html.exec(src);
    if (cap) {
      const token: Tokens.HTML = {
        type: 'html',
        block: true,
        raw: cap[0],
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0],
      };
      return token;
    }
  }

  private _def(src: string): Tokens.Def | undefined {
    const cap = this._rules.block.def.exec(src);
    if (cap) {
      const tag = cap[1].toLowerCase().replace(this._rules.other.multipleSpaceGlobal, ' ');
      const href = cap[2] ? cap[2].replace(this._rules.other.hrefBrackets, '$1').replace(this._rules.inline.anyPunctuation, '$1') : '';
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this._rules.inline.anyPunctuation, '$1') : cap[3];
      return {
        type: 'def',
        tag,
        raw: cap[0],
        href,
        title,
      };
    }
  }

  private _table(src: string): Tokens.Table | undefined {
    const cap = this._rules.block.table.exec(src);
    if (!cap) {
      return;
    }

    if (!this._rules.other.tableDelimiter.test(cap[2])) {
      // delimiter row must have a pipe (|) or colon (:) otherwise it is a setext heading
      return;
    }

    const headers = splitCells(cap[1]);
    const aligns = cap[2].replace(this._rules.other.tableAlignChars, '').split('|');
    const rows = cap[3]?.trim() ? cap[3].replace(this._rules.other.tableRowBlankLine, '').split('\n') : [];

    const item: Tokens.Table = {
      type: 'table',
      raw: cap[0],
      header: [],
      align: [],
      rows: [],
    };

    if (headers.length !== aligns.length) {
      // header and align columns must be equal, rows can be different.
      return;
    }

    for (const align of aligns) {
      if (this._rules.other.tableAlignRight.test(align)) {
        item.align.push('right');
      } else if (this._rules.other.tableAlignCenter.test(align)) {
        item.align.push('center');
      } else if (this._rules.other.tableAlignLeft.test(align)) {
        item.align.push('left');
      } else {
        item.align.push(null);
      }
    }

    for (let i = 0; i < headers.length; i++) {
      item.header.push({
        text: headers[i],
        tokens: this._inline(headers[i]),
        header: true,
        align: item.align[i],
      });
    }

    for (const row of rows) {
      item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
        return {
          text: cell,
          tokens: this._inline(cell),
          header: false,
          align: item.align[i],
        };
      }));
    }

    return item;
  }

  private _lheading(src: string): Tokens.Heading | undefined {
    const cap = this._rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[2].charAt(0) === '=' ? 1 : 2,
        text: cap[1],
        tokens: this._inline(cap[1]),
      };
    }
  }

  private _paragraph(src: string): Tokens.Paragraph | undefined {
    const cap = this._rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === '\n'
        ? cap[1].slice(0, -1)
        : cap[1];
      return {
        type: 'paragraph',
        raw: cap[0],
        text,
        tokens: this._inline(text),
      };
    }
  }

  private _text(src: string): Tokens.Text | undefined {
    const cap = this._rules.block.text.exec(src);
    if (cap) {
      return {
        type: 'text',
        raw: cap[0],
        text: cap[0],
        tokens: this._inline(cap[0]),
      };
    }
  }

  private _escape(src: string): Tokens.Escape | undefined {
    const cap = this._rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: 'escape',
        raw: cap[0],
        text: cap[1],
      };
    }
  }

  private _tag(src: string): Tokens.Tag | undefined {
    const cap = this._rules.inline.tag.exec(src);
    if (cap) {
      if (!this._state.inLink && this._rules.other.startATag.test(cap[0])) {
        this._state.inLink = true;
      } else if (this._state.inLink && this._rules.other.endATag.test(cap[0])) {
        this._state.inLink = false;
      }

      return {
        type: 'html',
        raw: cap[0],
        inLink: this._state.inLink,
        inRawBlock: this._state.inRawBlock,
        block: false,
        text: cap[0],
      };
    }
  }

  private _link(src: string): Tokens.Link | Tokens.Image | undefined {
    const cap = this._rules.inline.link.exec(src);
    if (cap == null) return

    const trimmedUrl = cap[2].trim();
    if (this._rules.other.startAngleBracket.test(trimmedUrl)) {
      // commonmark requires matching angle brackets
      if (!(this._rules.other.endAngleBracket.test(trimmedUrl))) {
        return;
      }

      // ending angle bracket cannot be escaped
      const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
      if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
        return;
      }
    } else {
      // find closing parenthesis
      const lastParenIndex = findClosingBracket(cap[2], '()');
      if (lastParenIndex > -1) {
        const start = cap[0].indexOf('!') === 0 ? 5 : 4;
        const linkLen = start + cap[1].length + lastParenIndex;
        cap[2] = cap[2].substring(0, lastParenIndex);
        cap[0] = cap[0].substring(0, linkLen).trim();
        cap[3] = '';
      }
    }

    let href = cap[2];
    let title = '';
    title = cap[3] ? cap[3].slice(1, -1) : '';


    href = href.trim();
    if (this._rules.other.startAngleBracket.test(href)) {
      href = href.slice(1, -1);
    }
    return this._outputLink(cap, {
      href: href ? href.replace(this._rules.inline.anyPunctuation, '$1') : href,
      title: title ? title.replace(this._rules.inline.anyPunctuation, '$1') : title,
    }, cap[0]);
  }

  private _reflink(src: string, links: Links): Tokens.Link | Tokens.Image | Tokens.Text | undefined {
    let cap;
    if ((cap = this._rules.inline.reflink.exec(src))
      || (cap = this._rules.inline.nolink.exec(src))) {
      const linkString = (cap[2] || cap[1]).replace(this._rules.other.multipleSpaceGlobal, ' ');
      const link = links[linkString.toLowerCase()];
      if (!link) {
        const text = cap[0].charAt(0);
        return {
          type: 'text',
          raw: text,
          text,
        };
      }
      return this._outputLink(cap, link, cap[0]);
    }
  }

  private _emStrong(src: string, maskedSrc: string, prevChar = ''): Tokens.Em | Tokens.Strong | undefined {
    let match = this._rules.inline.emStrongLDelim.exec(src);
    if (!match) return;

    // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
    if (match[3] && prevChar.match(this._rules.other.unicodeAlphaNumeric)) return;

    const nextChar = match[1] || match[2] || '';

    if (!nextChar || !prevChar || this._rules.inline.punctuation.exec(prevChar)) {
      // unicode Regex counts emoji as 1 char; spread into array for proper count (used multiple times below)
      const lLength = [...match[0]].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

      const endReg = match[0][0] === '*' ? this._rules.inline.emStrongRDelimAst : this._rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0;

      // Clip maskedSrc to same section of string as src (move to lexer?)
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

        if (!rDelim) continue; // skip single * in __abc*abc__

        rLength = [...rDelim].length;

        if (match[3] || match[4]) { // found another Left Delim
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) { // either Left or Right Delim
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue; // CommonMark Emphasis Rules 9-10
          }
        }

        delimTotal -= rLength;

        if (delimTotal > 0) continue; // Haven't found enough closing delimiters

        // Remove extra characters. *a*** -> *a*
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        // char length can be >1 for unicode characters;
        const lastCharLength = [...match[0]][0].length;
        const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);

        // Create `em` if smallest delimiter has odd char count. *a***
        if (Math.min(lLength, rLength) % 2) {
          const text = raw.slice(1, -1);
          return {
            type: 'em',
            raw,
            text,
            tokens: this.inlineTokens(text),
          };
        }

        // Create 'strong' if smallest delimiter has even char count. **a***
        const text = raw.slice(2, -2);
        return {
          type: 'strong',
          raw,
          text,
          tokens: this.inlineTokens(text),
        };
      }
    }
  }

  private _codespan(src: string): Tokens.Codespan | undefined {
    const cap = this._rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(this._rules.other.newLineCharGlobal, ' ');
      const hasNonSpaceChars = this._rules.other.nonSpaceChar.test(text);
      const hasSpaceCharsOnBothEnds = this._rules.other.startingSpaceChar.test(text) && this._rules.other.endingSpaceChar.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      return {
        type: 'codespan',
        raw: cap[0],
        text,
      };
    }
  }

  private _br(src: string): Tokens.Br | undefined {
    const cap = this._rules.inline.br.exec(src);
    if (cap) {
      return {
        type: 'br',
        raw: cap[0],
      };
    }
  }

  private _del(src: string): Tokens.Del | undefined {
    const cap = this._rules.inline.del.exec(src);
    if (cap) {
      return {
        type: 'del',
        raw: cap[0],
        text: cap[2],
        tokens: this.inlineTokens(cap[2]),
      };
    }
  }

  private _autolink(src: string): Tokens.Link | undefined {
    const cap = this._rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === '@') {
        text = cap[1];
        href = 'mailto:' + text;
      } else {
        text = cap[1];
        href = text;
      }

      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: 'text',
            raw: text,
            text,
          },
        ],
      };
    }
  }

  private _url(src: string): Tokens.Link | undefined {
    let cap;
    if (cap = this._rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === '@') {
        text = cap[0];
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this._rules.inline._backpedal.exec(cap[0])?.[0] ?? '';
        } while (prevCapZero !== cap[0]);
        text = cap[0];
        if (cap[1] === 'www.') {
          href = 'http://' + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [],
      };
    }
  }

  private _inlineText(src: string): Tokens.Text | undefined {
    const cap = this._rules.inline.text.exec(src);
    if (cap) {
      const escaped = this._state.inRawBlock;
      return {
        type: 'text',
        raw: cap[0],
        text: cap[0],
        escaped,
      };
    }
  }
}
