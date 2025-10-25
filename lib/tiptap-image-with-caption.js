import Image from '@tiptap/extension-image';

export const ImageWithCaption = Image.extend({
  name: 'imageWithCaption',

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: element => element.getAttribute('data-caption'),
        renderHTML: attributes => {
          if (!attributes.caption) {
            return {};
          }
          return {
            'data-caption': attributes.caption,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;
    
    if (caption) {
      return [
        'figure',
        { class: 'image-with-caption' },
        ['img', imgAttrs],
        ['figcaption', { class: 'image-caption' }, `Photo Source: ${caption}`],
      ];
    }
    
    return ['img', imgAttrs];
  },

  parseHTML() {
    return [
      {
        tag: 'figure.image-with-caption',
        getAttrs: (element) => {
          const img = element.querySelector('img');
          const figcaption = element.querySelector('figcaption');
          
          if (!img) return false;
          
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            caption: figcaption?.textContent?.replace('Photo Source: ', '') || null,
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (element) => ({
          src: element.getAttribute('src'),
          alt: element.getAttribute('alt'),
          title: element.getAttribute('title'),
          caption: element.getAttribute('data-caption') || null,
        }),
      },
    ];
  },
});
