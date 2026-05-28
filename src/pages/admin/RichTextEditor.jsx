import { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
  Strikethrough,
} from 'lucide-react'

import { api, apiBase, getToken } from '../../lib/api'

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your post…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate({ editor: ed }) {
      onChange?.(ed.getHTML())
    },
  })

  // Sync external value -> editor (e.g. when post loads after mount)
  if (editor && value && editor.getHTML() === '' && value !== '') {
    editor.commands.setContent(value, false)
  }

  const handleImageUpload = useCallback(async () => {
    if (!editor) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/webp,image/gif'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const formData = new FormData()
      formData.append('image', file)
      try {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${apiBase}/api/blog/admin/cover`)
        const token = getToken()
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const payload = JSON.parse(xhr.responseText)
            const absUrl = payload.coverUrl.startsWith('http') ? payload.coverUrl : `${apiBase}${payload.coverUrl}`
            editor.chain().focus().setImage({ src: absUrl }).run()
          } else {
            // eslint-disable-next-line no-alert
            alert(`Image upload failed (${xhr.status})`)
          }
        }
        xhr.send(formData)
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err.message || 'Image upload failed')
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const previous = editor.getAttributes('link').href || ''
    // eslint-disable-next-line no-alert
    const url = window.prompt('URL (leave empty to remove)', previous)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  const Btn = ({ onClick, active, label, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rte-btn${active ? ' is-active' : ''}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <Btn label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold size={15} />
        </Btn>
        <Btn label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic size={15} />
        </Btn>
        <Btn label="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
          <Strikethrough size={15} />
        </Btn>
        <Btn label="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')}>
          <Code size={15} />
        </Btn>
        <span className="rte-sep" />
        <Btn
          label="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={15} />
        </Btn>
        <Btn
          label="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={15} />
        </Btn>
        <span className="rte-sep" />
        <Btn label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List size={15} />
        </Btn>
        <Btn label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered size={15} />
        </Btn>
        <Btn label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <Quote size={15} />
        </Btn>
        <Btn label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={15} />
        </Btn>
        <span className="rte-sep" />
        <Btn label="Link" onClick={setLink} active={editor.isActive('link')}>
          <LinkIcon size={15} />
        </Btn>
        <Btn label="Image" onClick={handleImageUpload}>
          <ImageIcon size={15} />
        </Btn>
        <span className="rte-sep" />
        <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={15} />
        </Btn>
        <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={15} />
        </Btn>
      </div>
      <EditorContent editor={editor} className="rte-content" />
    </div>
  )
}
