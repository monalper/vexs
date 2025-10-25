import { Node, mergeAttributes } from '@tiptap/core';

export const Twitter = Node.create({
  name: 'twitter',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-twitter-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src;
    return [
      'div',
      { 'data-twitter-embed': '', class: 'twitter-embed' },
      [
        'blockquote',
        { class: 'twitter-tweet' },
        [
          'a',
          { href: src, target: '_blank', rel: 'noopener noreferrer' },
          'View tweet',
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setTwitterEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
