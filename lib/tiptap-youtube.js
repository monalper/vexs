import { Node, mergeAttributes } from '@tiptap/core';

export const YouTube = Node.create({
  name: 'youtube',

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
        tag: 'div[data-youtube-video]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src;
    return [
      'div',
      { 'data-youtube-video': '', class: 'youtube-embed' },
      [
        'iframe',
        mergeAttributes(HTMLAttributes, {
          src,
          width: '100%',
          height: '400',
          frameborder: '0',
          allowfullscreen: 'true',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setYouTubeVideo:
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
