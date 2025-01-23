'use client'

import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content: '<p>Hello World! 🌎️</p>',
  // })

  // return <EditorContent editor={editor} />

  setTimeout(() => {
    new Editor({
      element: document.querySelector('.element')!,
      extensions: [StarterKit],
      content: '<p>Hello World2!</p>',
    })
  }, 1)

  return <div>
    <div className="element"></div>
  </div>
}

export default Tiptap
